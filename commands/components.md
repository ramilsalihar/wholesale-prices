# Component Inventory

All shared primitives in `src/components.jsx`. All consume `useTheme()` for colors.

## Primitives

### `Icon`
Object of SVG render functions. Call as JSX function:
```jsx
{Icon.search()}
{Icon.cart({ width: 18, height: 18 })}
```
Available: `search`, `cart`, `user`, `heart`, `back`, `menu`, `star(filled?)`, `truck`, `shield`, `plus`, `minus`, `close`, `check`, `filter`, `chevronRight`, `chevronDown`

### `Logo`
```jsx
<Logo size={32} />  // circular logo image from /assets/logo.png
```

### `ProductImage`
Generates a colored SVG illustration based on product shape + hue.
```jsx
<ProductImage product={p} size={120} />
// p.shape: 'jar'|'bottle'|'tube'|'flask'|'lipstick'|'palette'|'pencil'|'stick'|'spray'|'bar'
// p.hue: [h, s, l]
```

### `PriceTag`
```jsx
<PriceTag price={459} old={619} />
// Renders current price + strikethrough old price
// Uses t.priceTagBg / t.priceTagInk
```

### `DiscountBadge`
```jsx
<DiscountBadge price={459} old={619} />
// "−26%" pill
// Uses t.discountBg / t.discountInk
```

### `HitBadge`
```jsx
<HitBadge />
// "Хит" pill, always magenta
```

### `StarRating`
```jsx
<StarRating rating={4.7} reviews={312} />
// Star icons + "4.7 (312)"
```

### `Button`
```jsx
<Button onClick={fn} variant="primary" size="md">Добавить</Button>
// variant: 'primary' (default) | 'outline' | 'ghost'
// size: 'sm' | 'md' (default) | 'lg'
```

### `SearchField`
```jsx
<SearchField value={q} onChange={setQ} onFocus={fn} placeholder="Поиск..." />
```

### `ProductCard`
Full product card for grids and carousels.
```jsx
<ProductCard product={p} device="mobile" onTap={fn} />
// device: 'mobile' | 'desktop'
// onTap: navigate to PDP
```

### `PromoBanner`
```jsx
<PromoBanner banner={b} device="mobile" />
// Renders kicker + title + subtitle + CTA button
// b: { id, kicker, title, sub, cta, accent }
// accent: 'primary' | 'accent' | 'orange'
```

## Screen Components (in screens.jsx)

### Layout helpers
```jsx
<Section title="Хиты продаж" sub="Топ товаров" device="mobile" onSeeAll={fn}>
  ...
</Section>

<Carousel device="mobile">
  <ProductCard ... />
</Carousel>
```

### Screens
```jsx
<HomeScreen device="mobile" />
<CatalogScreen device="desktop" />
<PDPScreen device="mobile" />
<CartScreen device="mobile" />
<CheckoutScreen device="mobile" />
<ConfirmScreen device="mobile" />
```
All accept `device: 'mobile' | 'desktop'` — adjusts padding, font sizes, layout.

## Device Shells (in shells.jsx)

```jsx
// Constants
DEVICE_W = 390   // iPhone 15 Pro width
DEVICE_H = 844   // iPhone 15 Pro height
DESKTOP_W = 1280
DESKTOP_H = 900

// Mobile shell — wraps all contexts + iOS frame
<MobileApp initial={{ screen: 'home' }} />
<MobileAppWithSeed initial={{ screen: 'cart' }} seed={['p01', 'p03']} />

// Desktop shell — wraps all contexts + browser window
<DesktopApp initial={{ screen: 'home' }} />
<DesktopAppWithSeed initial={{ screen: 'cart' }} seed={['p01', 'p03', 'p08']} />
```

## DesignCanvas (in DesignCanvas.jsx)

```jsx
<DesignCanvas>
  <DCSection id="mobile-home" title="Мобильный · Главная" subtitle="...">
    <DCArtboard id="m-home-magnit" label="А · Магнит" width={414} height={868}>
      {/* content */}
    </DCArtboard>
  </DCSection>
</DesignCanvas>
```
Canvas is a horizontally/vertically scrollable artboard gallery — used only in `App.jsx` for the design review view.
