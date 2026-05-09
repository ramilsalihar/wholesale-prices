# Оптовые Цены — Claude Context

B2C e-commerce for cosmetics/perfumery. Business: **САМЫЙ БОЛЬШОЙ МАГАЗИН КОСМЕТИКИ В КЫРГЫЗСТАНЕ**. Bishkek, Kyrgyzstan. Currency: сом (с). Production React app connected to Supabase.

## Quick Reference

@commands/overview.md
@commands/architecture.md
@commands/styles.md
@commands/data.md
@commands/components.md

## Key Rules

- All styles are **inline JS objects** via `useTheme()`. No CSS files, no Tailwind, no class names.
- Font is **Manrope** only. Do not introduce other fonts.
- Every component must work across all 4 themes — always use `t.*` tokens, never hardcode colors.
- UI text is in **Russian**.
- Currency is **сом (с)**, not ₽. Use `fmtRub()` from product model (it appends " с").
- `@supabase/supabase-js` is the only allowed external dependency beyond React + Vite. Ask before adding others.
- Service layer (`src/service/`) exists but is not yet wired to UI — app uses static local data. Do not silently swap to Supabase without asking.

## File Structure Summary

```
src/
  app/WebApp.jsx        ← root shell + all providers
  pages/                ← one file per screen (10 screens)
  widgets/              ← NavSidebar, TopBar, MobileHeader, MobileTabBar,
                           DesktopFooter, RightPanel, ThemeSwitcher, ToastContainer
  entities/
    product/model.js    ← PRODUCTS (23 items), fmtRub, pctOff
    category/model.js   ← CATEGORIES (9 items, includes gifts)
    banner/model.js     ← BANNERS (3 items)
  features/             ← cart.jsx, favorites.jsx, notification.jsx (Context providers)
  shared/
    theme.jsx           ← THEMES + useTheme
    router.jsx          ← RouterProvider + useRouter
    ui/                 ← Icon, Logo, Button, StarRating, SearchField, Section
  service/
    supabase.js         ← createClient (reads VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY)
    products.js         ← fetchProducts, fetchProductById, fetchProductsByCategory
    orders.js           ← createOrder, fetchOrders
    auth.js             ← signInWithPhone, verifyOtp, signOut, getSession
```

## Navigation

Nav screens (no back button): `home`, `catalog`, `gifts`, `shops`, `cart`, `favorites`
Detail screens (back button): `pdp`, `checkout`, `order_done`, `about`

Router: `go({ screen })` / `back()`. Pass `{ screen: 'catalog', search: true }` to auto-focus catalog search.

## Screens Registered in WebApp

`home` · `catalog` · `pdp` · `cart` · `checkout` · `order_done` · `favorites` · `gifts` · `shops` · `about`

To add a new screen: create `src/pages/name.jsx`, register in `ScreenContent` + `headerCfg` in `WebApp.jsx`, add to `NAV_SCREENS` in `TopBar.jsx` if it's a top-level nav page.

## Supabase

- URL: `https://ygkbugzxvanuujkjmpiw.supabase.co`
- Credentials in `.env` (gitignored via `.gitignore`)
- Tables expected: `products`, `orders`, `auth` (Supabase built-in)
- Service layer ready, not yet wired to UI components

## Dev Server

```bash
npm run dev    # http://localhost:5173
npm run build
```

## Custom Slash Commands

| Command                | What it does                        |
|-----------------------|-------------------------------------|
| `/project:context`    | Load all context docs               |
| `/project:new-screen` | Add a new screen (pass screen name) |
| `/project:new-theme`  | Add a new theme variant             |
| `/project:add-product`| Add products to catalog             |
