# Оптовые Цены — Project Overview

## What It Is

B2C e-commerce web app for cosmetics and perfumery. Business name: **САМЫЙ БОЛЬШОЙ МАГАЗИН КОСМЕТИКИ В КЫРГЫЗСТАНЕ**. Target market: Kyrgyzstan (Bishkek). Currency: сом (с). Language: Russian. Built as a fully interactive React app — not a mock, every button works.

Instagram: [@optovye_ceny01_](https://www.instagram.com/optovye_ceny01_/)

## Real Business Data

- **4 physical stores** in Bishkek (see `src/pages/shops.jsx`)
  - ул. Киевская, 69, 1 этаж — Первомайский р-н (главный, 4★, 1489 отзывов)
  - ул. Гражданская, 2 — Свердловский р-н (4.5★, 732 отзыва)
  - ул. Арстанбека Дуйшеева, 6/5 — Октябрьский р-н (4★, 193 отзыва)
  - ул. Исы Ахунбаева, 101 — Первомайский р-н

## Customer-Facing Flow

1. **Browse** → Home page: hero banners, bestsellers carousel, category grid, sale section
2. **Discover** → Catalog: live search by name/brand, category filter, sort, chip filters
3. **Evaluate** → PDP: image gallery, price block, qty picker, favorites toggle, tabs (description / ingredients / reviews / delivery)
4. **Purchase** → Cart: line items with qty stepper, promo code, order summary pinned to bottom on mobile
5. **Checkout** → Delivery method (courier / pickup / Kyrgyz Post), payment method (SBP / card / installments / COD), form validation
6. **Confirm** → Order success screen with order number

## Screens

| Screen      | Route                           | Notes                                  |
|------------|--------------------------------|----------------------------------------|
| home        | `{ screen: 'home' }`           | Hero, hits carousel, categories, sale  |
| catalog     | `{ screen: 'catalog', cat? }`  | Live search + filters + sort           |
| pdp         | `{ screen: 'pdp', id }`        | Product detail, add to cart + favorites |
| cart        | `{ screen: 'cart' }`           | Cart items, sticky summary footer      |
| checkout    | `{ screen: 'checkout' }`       | Delivery + payment form                |
| order_done  | `{ screen: 'order_done' }`     | Success screen                         |
| favorites   | `{ screen: 'favorites' }`      | Saved products                         |
| gifts       | `{ screen: 'gifts' }`          | Sales + gift sets                      |
| shops       | `{ screen: 'shops' }`          | 4 store locations with 2GIS links      |
| about       | `{ screen: 'about' }`          | Company story, values, contacts        |

## Navigation Rules

- **Nav screens** (sidebar items, no back button): `home`, `catalog`, `gifts`, `shops`, `cart`, `favorites`
- **Detail screens** (back button shown): `pdp`, `checkout`, `order_done`, `about`
- Desktop: collapsible left sidebar (220px / 72px) + sticky TopBar + optional RightPanel
- Mobile: sticky MobileHeader + bottom MobileTabBar

## Sidebar Settings Panel

Clicking "Настройки" in the sidebar:
- Expands sidebar if collapsed
- Slides in 3 panels with staggered animation (110ms each): Theme switcher → Войти → Language (RU/KG/EN)
- Closing animates out in reverse order
- Collapses automatically when sidebar is closed

## Key Features

### 🚚 Delivery
- Bishkek: next-day, free above 1 500 с
- Osh / Jalal-Abad: 2 days, 199 с
- Kyrgyz regions: 3–7 days via Kyrgyz Post
- Pickup: free from 4 stores in Bishkek

### 💳 Payment Options
- SBP (bank app transfer, no fee)
- Card online (Visa, Mastercard, МИР)
- Installments (4 payments, 0% APR)
- Cash on delivery

### 🎨 3 Active Visual Themes
- **Магнит** — magenta dominant, yellow price tags
- **Чёрный рынок** — dark bg, neon cards
- **Светлый** — warm white, dark price tags
- Theme switcher lives in sidebar settings panel
- Mobile home screen also has theme strip

### 🔒 Trust
- Guaranteed originals, 14-day returns
- 12 000+ verified reviews
- Direct supplier sourcing

### 🤖 AI Chatbot (Planned)
> High-priority future feature.
- Floating assistant on catalog + PDP
- Natural language: "что-то для жирной кожи до 500 с"
- Integration point: `ChatWidget` in `src/app/WebApp.jsx`, LLM API with PRODUCTS as context

## Adding Features — Quick Recipes

**New screen**: add file to `src/pages/`, register in `ScreenContent` in `src/app/WebApp.jsx`, add to `headerCfg` in `MobileShell`, add to `NAV_SCREENS` in `TopBar.jsx` if it's a nav-level page

**New product**: add entry to `src/entities/product/model.js` PRODUCTS array

**New theme**: add to `THEMES` in `src/shared/theme.jsx`, add swatch to `SWATCHES` in `src/widgets/ThemeSwitcher.jsx`

**New category**: add to `src/entities/category/model.js` CATEGORIES array

**New nav item**: add to `mainItems` in `src/widgets/NavSidebar.jsx`, add icon to `NI` object
