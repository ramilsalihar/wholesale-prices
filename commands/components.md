# Component Inventory

## Shared UI — `src/shared/ui/`

### `Icon` (`Icon.jsx`)
Object of SVG render functions. Call as JSX function:
```jsx
{Icon.search()}
{Icon.cart({ width: 18, height: 18 })}
```
Available: `search`, `cart`, `user`, `heart`, `back`, `menu`, `star(filled?)`, `truck`, `shield`, `plus`, `minus`, `trash`, `check`, `filter`, `flame`, `close`

### `Logo` (`Logo.jsx`)
```jsx
<Logo size={32} />   // circular logo image from /assets/logo.png
```

### `Button` (`Button.jsx`)
```jsx
<Button onClick={fn} variant="primary" size="md">Добавить</Button>
<Button block size="lg">Оформить заказ</Button>
// variant: 'primary' (default) | 'outline' | 'ghost'
// size: 'sm' | 'md' (default) | 'lg'
// block: full width
```

### `StarRating` (`StarRating.jsx`)
```jsx
<StarRating rating={4.7} reviews={312} />
```

### `SearchField` (`SearchField.jsx`)
```jsx
<SearchField value={q} onChange={setQ} onFocus={fn} placeholder="Поиск..." />
```

### `Section` + `Carousel` (`Section.jsx`)
```jsx
<Section title="Хиты продаж" sub="Топ товаров" device="mobile" onSeeAll={fn}>
  <Carousel device="mobile">
    <ProductCard ... />
  </Carousel>
</Section>
```

## Entities

### `ProductCard` (`src/entities/product/ProductCard.jsx`)
```jsx
<ProductCard p={p} onClick={fn} />
// Includes: ProductImage, PriceTag, DiscountBadge, HitBadge
// Calls useCart, useFavorites, useNotification internally
```

### `ProductImage` (`src/entities/product/ProductImage.jsx`)
```jsx
<ProductImage p={p} padding={40} />
// Generates SVG illustration from p.shape + p.hue
```

### `PriceTag` (`src/entities/product/PriceTag.jsx`)
```jsx
<PriceTag price={459} old={619} size="sm" />
// size: 'sm' | 'md' (default)
```

### `DiscountBadge` (`src/entities/product/DiscountBadge.jsx`)
```jsx
<DiscountBadge pct={26} />   // "−26%"
```

### `HitBadge` (`src/entities/product/HitBadge.jsx`)
```jsx
<HitBadge />   // "Хит" magenta pill
```

### `PromoBanner` (`src/entities/banner/PromoBanner.jsx`)
```jsx
<PromoBanner b={banner} height={280} onClick={fn} />
// b: { id, kicker, title, sub, cta, accent }
```

## Widgets

### `NavSidebar` (`src/widgets/NavSidebar.jsx`)
```jsx
<NavSidebar open={bool} setOpen={fn} themeKey={key} setThemeKey={fn} />
```
- Collapsible: 220px expanded / 72px collapsed
- Main nav items: home, catalog, gifts, shops, cart, favorites
- Settings panel: theme switcher, login button, language toggle (RU/KG/EN)
- Settings animate in/out with 110ms/90ms stagger
- Clicking settings while collapsed auto-expands sidebar
- Closing sidebar closes settings (animated)

### `TopBar` (`src/widgets/TopBar.jsx`)
```jsx
<TopBar />
```
- Sticky top bar on desktop
- Shows search bar (navigates to catalog with `search: true`) — hidden when already on catalog
- Back button shown on detail screens (pdp, checkout, about)
- Cart button with item count

### `MobileHeader` (`src/widgets/MobileHeader.jsx`)
```jsx
<MobileHeader title="Каталог" showBack={true} />
```

### `MobileTabBar` (`src/widgets/MobileTabBar.jsx`)
5-tab bottom bar: home, catalog, gifts, favorites, cart. Hidden on checkout + order_done.

### `ThemeSwitcher` (`src/widgets/ThemeSwitcher.jsx`)
```jsx
<ThemeSwitcher themeKey={key} setThemeKey={fn} />
// SWATCHES — 3 entries: magnit, noir, boutique
```

### `ToastContainer` (`src/widgets/ToastContainer.jsx`)
Fixed bottom-right stack. Uses `useNotification()`.

### `DesktopFooter` (`src/widgets/DesktopFooter.jsx`)
4-column footer. "О нас" → `about` screen, "Магазины" → `shops` screen. Instagram link to `@optovye_ceny01_`.

### `RightPanel` (`src/widgets/RightPanel.jsx`)
New arrivals + featured product. Shown on home + catalog when viewport ≥ 1280px.

## Pages — `src/pages/`

All accept `device: 'mobile' | 'desktop'`.

| File         | Export           | Key notes                                       |
|--------------|------------------|-------------------------------------------------|
| home.jsx     | HomeScreen       | Banners, hits carousel, sale, brands            |
| catalog.jsx  | CatalogScreen    | Live search (auto-focus if `route.search`), filters, sort, empty state |
| pdp.jsx      | PDPScreen        | Qty picker, add to cart + favorites heart toggle |
| cart.jsx     | CartScreen       | Mobile: sticky summary footer; Desktop: sticky side panel |
| checkout.jsx | CheckoutScreen   | Delivery + payment stepper                      |
| order-done.jsx | OrderDoneScreen | Success, generated order number                |
| favorites.jsx | FavoritesScreen | Saved products grid                            |
| gifts.jsx    | GiftsScreen      | Hero, hot sales carousel, gift sets grid        |
| shops.jsx    | ShopsScreen      | 4 store cards with 2GIS links                  |
| about.jsx    | AboutScreen      | Hero stats, story, values, contact (Instagram)  |

## App Shell — `src/app/WebApp.jsx`

```jsx
// ScreenContent — resolves screen name to component
function ScreenContent({ screen, device })

// DesktopShell — NavSidebar + TopBar + content + optional RightPanel
// MobileShell — MobileHeader + theme strip (home only) + content + MobileTabBar
// AppShell — picks mobile or desktop based on viewport width
export default function WebApp()  // top-level with all providers
```
