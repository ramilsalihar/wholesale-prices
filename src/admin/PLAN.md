# Admin Panel — Implementation Plan

## Overview

Separate admin interface for managing the Оптовые Цены store. Accessible at `/admin` route. Protected by Supabase auth — only authenticated admins can access. Built with the same React + inline styles stack, no new UI libraries.

---

## Tech Decisions

| Question | Decision |
|----------|----------|
| Routing | Extend existing custom router OR separate `AdminApp` mounted at `/admin` in `index.html` |
| Auth | Supabase Auth — email/password for admin login |
| Data | All reads/writes via `src/service/` Supabase layer |
| Styles | Same inline JS + `useTheme()` pattern — admin uses a neutral theme |
| Entry point | New `src/admin/AdminApp.jsx` mounted separately from `WebApp.jsx` |

**Recommended approach**: Mount `AdminApp` conditionally in `main.jsx` based on `window.location.pathname.startsWith('/admin')`. Keeps admin fully isolated from storefront.

---

## Supabase Tables Needed

### `products`
| Column      | Type      | Notes                          |
|-------------|-----------|--------------------------------|
| id          | text PK   | 'p01'–'p23', or uuid           |
| cat         | text      | category id                    |
| brand       | text      |                                |
| name        | text      |                                |
| vol         | text      |                                |
| price       | int4      | сом                            |
| old         | int4      | original price                 |
| rating      | float4    |                                |
| reviews     | int4      |                                |
| hit         | bool      |                                |
| hue         | int4[]    | [h, s, l]                      |
| shape       | text      |                                |
| active      | bool      | soft delete / hide from store  |
| created_at  | timestamptz |                              |

### `orders`
| Column          | Type        | Notes                            |
|-----------------|-------------|----------------------------------|
| id              | uuid PK     | auto-generated                   |
| items           | jsonb       | [{ id, qty, price, name }]       |
| subtotal        | int4        |                                  |
| delivery        | int4        |                                  |
| total           | int4        |                                  |
| phone           | text        |                                  |
| address         | text        |                                  |
| pay_method      | text        | sbp / card / installments / cod  |
| delivery_method | text        | courier / pickup / post          |
| status          | text        | new / confirmed / shipped / done / cancelled |
| created_at      | timestamptz |                                  |

### `categories`
| Column | Type    |
|--------|---------|
| id     | text PK |
| ru     | text    |
| emoji  | text    |
| sort   | int4    |

### `banners`
| Column | Type    |
|--------|---------|
| id     | text PK |
| kicker | text    |
| title  | text    |
| sub    | text    |
| cta    | text    |
| accent | text    |
| active | bool    |

### `admin_users`
Handled by Supabase Auth. Add role check via RLS or a separate `profiles` table with `role: 'admin'`.

---

## Screens / Modules

### 1. Login (`/admin/login`)
- Email + password form
- Supabase `signInWithPassword()`
- Redirect to dashboard on success
- Show error on wrong credentials

### 2. Dashboard (`/admin`)
- Summary cards: total orders today, revenue today, new orders pending, total products
- Recent orders table (last 10)
- Quick links to each module

### 3. Orders (`/admin/orders`)
- Table: order id, date, customer phone, total, status, delivery method
- Filter by status, date range
- Click row → order detail: items list, address, change status (new → confirmed → shipped → done)
- Status badge color per state

### 4. Products (`/admin/products`)
- Grid/table of all products with image, name, price, category, hit toggle, active toggle
- Add product form: all fields including hue picker + shape selector
- Edit product inline or modal
- Soft delete (set `active: false` — hides from storefront)
- Bulk actions: mark as hit, change category

### 5. Categories (`/admin/categories`)
- List with emoji, name, sort order
- Add / rename / reorder (drag or up/down arrows)
- Cannot delete if products exist in category

### 6. Banners (`/admin/banners`)
- List of 3 promo banners with live preview
- Edit kicker, title, sub, cta, accent color
- Toggle active/inactive

### 7. Stores (`/admin/stores`)
- List of 4 store locations
- Edit address, hours, 2GIS link, district
- Add/remove stores

### 8. Settings (`/admin/settings`)
- Store name, Instagram handle
- Delivery thresholds (free delivery above X сом)
- Theme default for storefront

---

## File Structure

```
src/admin/
  PLAN.md                  ← this file
  AdminApp.jsx             ← root, auth guard, admin router
  AdminLogin.jsx           ← login screen
  layout/
    AdminShell.jsx         ← sidebar + topbar wrapper
    AdminSidebar.jsx       ← nav links
    AdminTopBar.jsx        ← page title + logout
  pages/
    Dashboard.jsx
    Orders.jsx
    OrderDetail.jsx
    Products.jsx
    ProductForm.jsx        ← add/edit product
    Categories.jsx
    Banners.jsx
    Stores.jsx
    Settings.jsx
  components/
    StatusBadge.jsx        ← order status pill
    DataTable.jsx          ← reusable table with sort/filter
    StatCard.jsx           ← dashboard metric card
    ConfirmDialog.jsx      ← delete confirmations
  hooks/
    useAdminAuth.js        ← session check, redirect if not admin
    useOrders.js           ← fetch + realtime subscription
    useProducts.js         ← fetch + CRUD
```

---

## Build Phases

### Phase 1 — Foundation
- [ ] `AdminApp.jsx` with basic router (login → dashboard)
- [ ] `AdminLogin.jsx` with Supabase auth
- [ ] `AdminShell.jsx` layout wrapper
- [ ] Auth guard hook `useAdminAuth.js`
- [ ] Mount at `/admin` in `main.jsx`

### Phase 2 — Orders
- [ ] Create `orders` table in Supabase with RLS
- [ ] `Orders.jsx` — list with status filter
- [ ] `OrderDetail.jsx` — view items, change status
- [ ] Realtime subscription for new orders (Supabase `on('INSERT')`)

### Phase 3 — Products
- [ ] Create `products` table in Supabase, seed from `model.js`
- [ ] `Products.jsx` — grid with toggles
- [ ] `ProductForm.jsx` — full add/edit form
- [ ] Wire `src/service/products.js` to storefront (replace static `PRODUCTS`)

### Phase 4 — Content
- [ ] Categories management
- [ ] Banners management
- [ ] Stores management

### Phase 5 — Dashboard + Polish
- [ ] Stats cards (Supabase `count` queries)
- [ ] Recent orders widget
- [ ] Settings page

---

## Supabase RLS Policies (outline)

```sql
-- Products: public read, admin write
create policy "public can read active products"
  on products for select using (active = true);

create policy "admin can do anything on products"
  on products using (auth.jwt() ->> 'role' = 'admin');

-- Orders: admin only
create policy "admin only"
  on orders using (auth.jwt() ->> 'role' = 'admin');
```

---

## Notes

- Admin panel uses its own isolated `AdminApp` — does NOT share cart/favorites/router with storefront
- Keep same inline style pattern; use a neutral palette (white bg, dark ink, `#E6097A` as accent for buttons)
- Supabase Realtime for orders list — badge shows count of unread `new` orders in sidebar
- Do not expose admin at a guessable path in production — consider `/admin-optcen` or similar
