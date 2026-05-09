# Architecture

## Stack
- React 18 + Vite 6
- `@supabase/supabase-js` — backend/DB (only external dependency)
- No CSS framework — all styles inline via JS objects
- No router library — custom `RouterContext` in `src/shared/router.jsx`
- No state library — React Context only

## Feature Sliced Design (FSD)

```
src/
  app/
    WebApp.jsx          # Root: providers + AppShell (mobile/desktop selector)
  pages/
    home.jsx            # HomeScreen
    catalog.jsx         # CatalogScreen — live search, filters, sort
    pdp.jsx             # PDPScreen — product detail, cart + favorites
    cart.jsx            # CartScreen — line items, sticky summary (mobile)
    checkout.jsx        # CheckoutScreen
    order-done.jsx      # OrderDoneScreen
    favorites.jsx       # FavoritesScreen
    gifts.jsx           # GiftsScreen — sales + gift sets
    shops.jsx           # ShopsScreen — 4 store locations
    about.jsx           # AboutScreen — company, values, contacts
  widgets/
    NavSidebar.jsx      # Collapsible sidebar (220/72px) + settings panel
    TopBar.jsx          # Sticky top bar (search, back button, cart)
    RightPanel.jsx      # Optional right panel (home + catalog on wide screens)
    MobileHeader.jsx    # Mobile sticky header + back button
    MobileTabBar.jsx    # Mobile bottom tab bar
    DesktopFooter.jsx   # Footer — О нас + Магазины navigate to screens
    ToastContainer.jsx  # Fixed toast stack
    ThemeSwitcher.jsx   # SWATCHES array + ThemeSwitcher component
  entities/
    product/
      model.js          # PRODUCTS (23 items), fmtRub, pctOff, JSDoc types
      ProductCard.jsx
      ProductImage.jsx
      PriceTag.jsx
      DiscountBadge.jsx
      HitBadge.jsx
    category/
      model.js          # CATEGORIES (9 items including gifts)
    banner/
      model.js          # BANNERS (3 items)
      PromoBanner.jsx
  features/
    cart.jsx            # CartContext, CartProvider, useCart
    favorites.jsx       # FavoritesContext, FavoritesProvider, useFavorites
    notification.jsx    # NotificationContext, NotificationProvider, useNotification
  shared/
    theme.jsx           # THEMES (4 variants), ThemeContext, useTheme
    router.jsx          # RouterContext, RouterProvider, useRouter
    ui/
      Icon.jsx          # SVG icon functions
      Logo.jsx
      Button.jsx
      StarRating.jsx
      SearchField.jsx
      Section.jsx       # Section + Carousel
  service/
    supabase.js         # Supabase client (reads from .env)
    products.js         # fetchProducts, fetchProductById, fetchProductsByCategory
    orders.js           # createOrder, fetchOrders
    auth.js             # signInWithPhone, verifyOtp, signOut, getSession, onAuthStateChange
```

Also in root `src/`:
```
  main.jsx            # Vite entry → mounts <WebApp />
  App.jsx             # Design canvas (artboard review view, not production)
  shells.jsx          # Design canvas device shells (MobileApp, DesktopApp)
  DesignCanvas.jsx    # DCSection, DCArtboard
  BrowserWindow.jsx   # Desktop chrome frame (design canvas only)
  IOSFrame.jsx        # iOS device frame (design canvas only)
```

## Two Entry Points

| Entry | File | Purpose |
|-------|------|---------|
| Production app | `src/main.jsx` → `src/app/WebApp.jsx` | Responsive real app |
| Design canvas | `src/main.jsx` was changed to WebApp; `src/App.jsx` is the old artboard gallery | Design review only |

## Routing

Custom router — no URL changes, stack-based history.

```js
const { route, go, back, history } = useRouter();

go({ screen: 'pdp', id: 'p03' })
go({ screen: 'catalog', cat: 'makeup' })
go({ screen: 'catalog', search: true })  // auto-focuses search input
back()
```

### Back Button Logic

- **No back button** on nav screens: `home`, `catalog`, `gifts`, `shops`, `cart`, `favorites`
- **Back button shown** on: `pdp`, `checkout`, `order_done`, `about`
- Desktop: TopBar reads `NAV_SCREENS` array to decide
- Mobile: `headerCfg` in `MobileShell` maps `showBack` per screen

## Provider Chain (WebApp.jsx)

```jsx
<ThemeContext.Provider value={THEMES[themeKey]}>
  <NotificationProvider>
    <FavoritesProvider>
      <CartProvider>
        <RouterProvider initial={{ screen: 'home' }}>
          <AppShell />
        </RouterProvider>
      </CartProvider>
    </FavoritesProvider>
  </NotificationProvider>
</ThemeContext.Provider>
```

Theme is controlled at app level via `themeKey` state — single theme for whole app. (Design canvas `App.jsx` sets theme per artboard for review.)

## Responsive Breakpoints

- `MOBILE_BP = 900` — below: MobileShell, above: DesktopShell
- `HIDE_RIGHT_PANEL_BP = 1280` — RightPanel only shows on very wide screens

## Supabase

Credentials in `.env` (gitignored):
```
VITE_SUPABASE_URL=https://ygkbugzxvanuujkjmpiw.supabase.co
VITE_SUPABASE_ANON_KEY=...
```

Import from `src/service/supabase.js`. Service modules are ready but not yet wired to UI — local static data still in use.
