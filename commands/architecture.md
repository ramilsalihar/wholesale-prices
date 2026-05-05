# Architecture

## Stack
- React 18 + Vite 6
- No CSS framework — all styles inline via JS objects
- No router library — custom `RouterContext` in `store.jsx`
- No state library — React Context only

## File Map

```
src/
  main.jsx          # Vite entry, mounts <App />
  App.jsx           # Root: DesignCanvas with sections + artboards, theme wiring
  store.jsx         # All data + all contexts (Theme, Cart, Router)
  screens.jsx       # Screen components (HomeScreen, CatalogScreen, PDPScreen, CartScreen, CheckoutScreen)
  components.jsx    # Shared primitives (Icon, Logo, ProductCard, Button, etc.)
  shells.jsx        # Device wrappers: MobileApp, DesktopApp (handle nav + context providers)
  DesignCanvas.jsx  # Canvas layout: DCSection, DCArtboard
  BrowserWindow.jsx # Desktop chrome wrapper
  IOSFrame.jsx      # Mobile device frame wrapper
```

## Rendering Model

`App.jsx` renders a `DesignCanvas` — a scrollable artboard gallery.
Each artboard wraps a `<Themed>` provider (sets which theme) and either `<MobileApp>` or `<DesktopApp>`.

`MobileApp` / `DesktopApp` in `shells.jsx`:
- Wrap `RouterProvider` + `CartProvider` + device frame
- Pass `initial` route and optional `seed` (pre-filled cart items)
- Render the correct screen via `route.screen`

## Routing

Custom router in `store.jsx`. No URL changes.
```js
const { route, go, back } = useRouter();
go({ screen: 'pdp', id: 'p03' })  // navigate to PDP
go({ screen: 'cart' })
go({ screen: 'catalog', cat: 'makeup' })
back()  // pop history
```

Screens: `home` | `catalog` | `pdp` | `cart` | `checkout` | `confirm`

## Screens (in screens.jsx)

| Component        | Route                         | Notes                          |
|-----------------|-------------------------------|--------------------------------|
| `HomeScreen`     | `{ screen: 'home' }`          | Banners, hits, new arrivals, sale |
| `CatalogScreen`  | `{ screen: 'catalog', cat? }` | Category filter, product grid  |
| `PDPScreen`      | `{ screen: 'pdp', id }`       | Product detail, add to cart    |
| `CartScreen`     | `{ screen: 'cart' }`          | Cart items, totals             |
| `CheckoutScreen` | `{ screen: 'checkout' }`      | Delivery form                  |
| `ConfirmScreen`  | `{ screen: 'confirm' }`       | Order success                  |

## Theme System

4 visual variants, each an object with ~18 color tokens (see `styles.md`).
Access in any component: `const t = useTheme()` → `t.primary`, `t.ink`, etc.
Theme is set at artboard level in `App.jsx` — each artboard has its own isolated theme + cart + router.
