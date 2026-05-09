# Оптовые Цены — Project Overview

## What It Is

B2C e-commerce web app for cosmetics and perfumery, sold at wholesale prices. Target market: Kyrgyzstan (Bishkek). Currency: сом (с). Language: Russian. Built as a fully interactive React prototype — not a mock, every button works.

## Core Functionality

### Customer-Facing Flow
1. **Browse** → Home page with hero banners, bestsellers carousel, category grid, sale section
2. **Discover** → Catalog page with category filter, sort (price / rating / discount), live product grid
3. **Evaluate** → Product Detail Page (PDP): image gallery, price block, qty picker, tabs (description / ingredients / reviews / delivery)
4. **Purchase** → Cart: line items with qty stepper, promo code input, order summary, savings display
5. **Checkout** → Delivery method (courier / pickup / Kyrgyz Post), payment method (SBP / card / installments / COD), form validation
6. **Confirm** → Order success screen with generated order number

### Content & Data
- **20 products** across 8 categories: face, hair, body, makeup, parfum, mens, kids, home
- **All products on sale** — every item has a `price` (current) and `old` (original) value
- **6 bestsellers** (p01, p02, p03, p05, p10, p13) marked with hit badge
- **3 promo banners**: daily deal, new user offer, new arrivals
- **8 top brands**: Nivea, Pantene, Loreal, Garnier, Dove, Maybelline, Schwarzkopf, Vichy

### Navigation
- Custom router (no library) — screen stack with `go()` / `back()`
- Screens: `home` | `catalog` | `pdp` | `cart` | `checkout` | `order_done` | `favorites`
- Desktop: left sidebar nav (collapsible 220px / 72px) + sticky TopBar + optional right panel
- Mobile: sticky header + bottom tab bar (pinned via `height: 100dvh` + inner scroll)

### Personalization Features
- **Favorites** — toggle ♥ on any product card; persists in session; dedicated Favorites screen
- **Cart** — add/remove/qty; subtotal, savings, delivery threshold (free above 1 500 с)
- **Toast notifications** — on add-to-cart and add-to-favorites actions

## Key Features to Highlight

### 🚚 Delivery
- Bishkek: next-day, free above 1 500 с
- Osh / Jalal-Abad: 2 days, 199 с
- Kyrgyz regions: 3–7 days via Kyrgyz Post
- Pickup: free from 12 locations in Bishkek, same day after 18:00

### 💳 Payment Options
- SBP (bank app transfer, no fee)
- Card online (Visa, Mastercard, МИР)
- Installments (4 payments, 0% APR, 1-minute approval)
- Cash on delivery (cash or card to courier)

### 🎨 4 Visual Themes
- **Магнит** — magenta dominant, yellow price tags (market energy)
- **Чёрный рынок** — dark bg, neon cards
- **Светлый** — warm white, dark price tags
- **Карнавал** — yellow dominant, maximum playfulness
- Theme switcher always visible on desktop TopBar and home screen mobile strip

### 🔒 Trust & Quality
- Guaranteed original products
- 14-day returns, no questions asked
- 12 000+ verified reviews across catalog
- Direct supplier sourcing

### 🤖 AI Chatbot / Suggestion Feature (Planned / Highlight for AI Agents)
> Not yet implemented. This is a high-priority future feature.
- A floating assistant button should appear on catalog and PDP pages
- It should accept natural language queries: "something for oily skin under 500 с", "gift for man, cologne"
- It should filter/suggest products from the existing PRODUCTS array
- Integration point: a `ChatWidget` component added to `app/WebApp.jsx`, calling an LLM API with the product catalog as context
- The product model is already structured for easy embedding (id, cat, brand, name, vol, price, rating, hit)

## Tech Stack

- **React 18 + Vite 6** — no framework, no router library, no CSS framework
- **Inline JS styles only** — all styling via `useTheme()` context hook, no CSS files
- **Font**: Manrope (Google Fonts)
- **No external dependencies** beyond React + Vite

## File Structure (Feature Sliced Design)

```
src/
  app/          ← root providers + shell selector (WebApp.jsx)
  pages/        ← one file per screen (home, catalog, pdp, cart, checkout, order-done, favorites)
  widgets/      ← composite UI blocks (NavSidebar, TopBar, RightPanel, MobileHeader, MobileTabBar, DesktopFooter, ToastContainer, ThemeSwitcher)
  entities/
    product/    ← model.js (data + JSDoc) + ProductCard, ProductImage, PriceTag, DiscountBadge, HitBadge
    category/   ← model.js
    banner/     ← model.js + PromoBanner
  features/     ← cart.jsx, favorites.jsx, notification.jsx (React Context providers)
  shared/
    theme.jsx   ← THEMES object + ThemeContext + useTheme
    router.jsx  ← RouterContext + RouterProvider + useRouter
    ui/         ← Icon, Logo, Button, StarRating, SearchField, Section, Carousel
```

## Data Shapes (Quick Reference)

```js
// Product
{ id, cat, brand, name, vol, price, old, rating, reviews, hit?, hue, shape }

// Category
{ id, ru, emoji }

// Banner
{ id, kicker, title, sub, cta, accent }

// Cart state (from useCart())
{ items, list, add, remove, setQty, clear, count, subtotal, saved }

// Favorites state (from useFavorites())
{ toggle, has, list, count }
```

## Adding Features — Quick Recipes

**New screen**: add component to `src/pages/`, register in `ScreenContent` in `src/app/WebApp.jsx`, add to `shells.jsx` if design canvas also needed

**New product**: add entry to `src/entities/product/model.js` PRODUCTS array

**New theme**: add object to `THEMES` in `src/shared/theme.jsx`, add swatch to `SWATCHES` in `src/widgets/ThemeSwitcher.jsx`

**New category**: add entry to `src/entities/category/model.js` CATEGORIES array
