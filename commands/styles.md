# Design System & Styles

## Brand Colors (source palette)

| Token   | Value     | Role                        |
|---------|-----------|-----------------------------|
| Magenta | `#E6097A` | Primary CTA, dominant brand |
| Black   | `#0A0A0A` | Dark surfaces (noir theme)  |
| Yellow  | `#F4D423` | Accent, price tags          |
| Orange  | `#F89020` | Secondary accent, discounts |
| White   | `#FFFFFF` | Light surfaces              |

## Theme Token Shape

Every theme object exposes these tokens. Access via `useTheme()`:

```js
t.bg           // page background
t.surface      // card/panel background
t.surfaceAlt   // secondary surface (e.g. hover states)
t.pageBg       // outermost canvas bg
t.primary      // main brand color (#E6097A in all themes)
t.primaryDark  // darker primary for hover (#B8005F)
t.accent       // yellow accent (#F4D423)
t.accent2      // orange accent (#F89020)
t.ink          // body text color
t.muted        // secondary/disabled text
t.border       // subtle borders (rgba)
t.headerBg     // top navigation background
t.headerInk    // top navigation text
t.cardBg       // product card background
t.priceTagBg   // price tag background
t.priceTagInk  // price tag text
t.btnBg        // primary button background
t.btnInk       // primary button text
t.discountBg   // discount badge background
t.discountInk  // discount badge text
```

## 4 Theme Variants

### magnit (А · Магнит)
White bg, magenta header, yellow price tags — market energy feel.
- `bg`: `#FFFFFF`, `headerBg`: `#E6097A`, `priceTagBg`: `#F4D423`

### noir (B · Чёрный)
Dark bg with neon cards.
- `bg`: `#0A0A0A`, `surface`: `#161116`, `headerBg`: `#0A0A0A`, `ink`: `#FFFFFF`

### boutique (C · Светлый)
Warm white, dark price tags for contrast.
- `bg`: `#FAF7F4`, `headerBg`: `#FFFFFF`, `priceTagBg`: `#1A0A14`, `priceTagInk`: `#F4D423`

### carnival (D · Карнавал)
Yellow dominant background, maximum playfulness.
- `bg`: `#F4D423`, `headerBg`: `#1A0A14`, `headerInk`: `#F4D423`, `btnBg`: `#1A0A14`

## Typography

Font: **Manrope** (loaded via Google Fonts in `index.html`)
- No Tailwind, no CSS classes — all `style={}` inline objects
- Font weights in use: 500, 600, 700, 800, 900
- Letter spacing: `-0.02em` for headings, `0.02em` for labels/badges

## Spacing Conventions

Mobile: `padding: '0 16px'`, gaps of `10–12px`
Desktop: `padding: '0 40px'`, gaps of `16–24px`
Section margin-top: mobile `20px`, desktop `36px`

## Component Style Pattern

All components use inline styles via `useTheme()`:
```jsx
const t = useTheme();
<div style={{ background: t.cardBg, color: t.ink, borderRadius: 16, padding: 12 }}>
```
No CSS files. No class names. No CSS modules.
