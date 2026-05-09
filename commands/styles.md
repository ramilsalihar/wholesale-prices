# Design System & Styles

## Brand Colors

| Token   | Value     | Role                        |
|---------|-----------|-----------------------------|
| Magenta | `#E6097A` | Primary CTA, dominant brand |
| Black   | `#0A0A0A` | Dark surfaces (noir theme)  |
| Yellow  | `#F4D423` | Accent, price tags          |
| Orange  | `#F89020` | Secondary accent, discounts |
| White   | `#FFFFFF` | Light surfaces              |

## Theme Token Shape

Access via `const t = useTheme()` in any component:

```js
t.bg           // page background
t.surface      // card/panel background
t.surfaceAlt   // secondary surface
t.pageBg       // outermost canvas bg
t.primary      // main brand color (#E6097A in all themes)
t.primaryDark  // darker primary (#B8005F)
t.accent       // yellow accent (#F4D423)
t.accent2      // orange accent (#F89020)
t.ink          // body text
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

## 3 Active Theme Variants (SWATCHES)

Theme switcher lives in the sidebar settings panel. 3 swatches shown (carnival removed).

### magnit (А · Магнит)
White bg, magenta header, yellow price tags.
- `bg`: `#FFFFFF`, `headerBg`: `#E6097A`, `priceTagBg`: `#F4D423`

### noir (B · Чёрный)
Dark bg with neon cards.
- `bg`: `#0A0A0A`, `surface`: `#161116`, `ink`: `#FFFFFF`

### boutique (C · Светлый)
Warm white, dark price tags.
- `bg`: `#FAF7F4`, `headerBg`: `#FFFFFF`, `priceTagBg`: `#1A0A14`, `priceTagInk`: `#F4D423`

All 4 theme objects still exist in `THEMES` in `src/shared/theme.jsx` — carnival is just removed from SWATCHES display.

## Typography

Font: **Manrope** (Google Fonts, loaded in `index.html`)
- No CSS classes — all `style={}` inline
- Weights: 500, 600, 700, 800, 900
- Headings: `letterSpacing: '-0.02em'`
- Labels/badges: `letterSpacing: '0.02em'`

## Spacing Conventions

| Context | Padding | Gap |
|---------|---------|-----|
| Mobile  | `0 16px` | `10–12px` |
| Desktop | `0 40px` | `16–24px` |

## Rules

- **Never hardcode colors** — always `t.*` tokens
- **All styles are inline JS objects** — no CSS files, no Tailwind, no class names
- Every component must render correctly across all 4 themes
- Use `t.primary` for interactive/brand elements, `t.muted` for secondary text, `t.border` for dividers
