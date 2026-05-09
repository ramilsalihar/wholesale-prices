# Data Model

Static data lives in `src/entities/*/model.js`. Supabase service layer in `src/service/` mirrors this shape.

## Product Shape

```js
{
  id: 'p01',          // 'p01'–'p23'
  cat: 'face',        // category id
  brand: 'Чистая Линия',
  name: 'Крем для лица «Питательный»',
  vol: '50 мл',
  price: 129,         // current price in сом (с)
  old: 199,           // original price (all products on sale)
  rating: 4.7,        // 4.6–5.0
  reviews: 312,
  hit: true,          // optional — bestseller badge
  hue: [340, 70, 88], // [h, s, l] for generated product image
  shape: 'jar',       // see shapes below
}
```

Shapes: `'jar'|'bottle'|'tube'|'flask'|'lipstick'|'palette'|'pencil'|'stick'|'spray'|'bar'`

## Categories (9 total)

| id     | Label (ru)      | Emoji |
|--------|-----------------|-------|
| face   | Уход за лицом   | 🌸    |
| hair   | Волосы          | 💇    |
| body   | Тело            | 🧴    |
| makeup | Макияж          | 💄    |
| parfum | Парфюмерия      | 🌷    |
| mens   | Мужское         | 🪒    |
| kids   | Детское         | 🧸    |
| home   | Дом             | 🏠    |
| gifts  | Подарки         | 🎁    |

## Products (23 total)

| id  | Category | Brand          | Price (с) | Hit |
|-----|----------|----------------|-----------|-----|
| p01 | face     | Чистая Линия   | 129       | ✓   |
| p02 | hair     | Pantene        | 249       | ✓   |
| p03 | makeup   | Maybelline     | 459       | ✓   |
| p04 | body     | Nivea          | 219       |     |
| p05 | parfum   | Bvlgari        | 2890      | ✓   |
| p06 | face     | Garnier        | 189       |     |
| p07 | makeup   | Loreal         | 389       |     |
| p08 | hair     | Schwarzkopf    | 329       |     |
| p09 | body     | Dove           | 199       |     |
| p10 | mens     | Old Spice      | 269       | ✓   |
| p11 | parfum   | Lancome        | 5490      |     |
| p12 | makeup   | Essence        | 449       |     |
| p13 | face     | Vichy          | 1490      | ✓   |
| p14 | kids     | Ушастый Нянь   | 159       |     |
| p15 | body     | Camay          | 189       |     |
| p16 | hair     | Syoss          | 269       |     |
| p17 | makeup   | Eveline        | 199       |     |
| p18 | face     | Bioderma       | 1190      |     |
| p19 | parfum   | Davidoff       | 3290      |     |
| p20 | mens     | Gillette       | 339       |     |
| p21 | gifts    | Dove           | 649       | ✓   |
| p22 | gifts    | Nivea          | 890       |     |
| p23 | gifts    | Schwarzkopf    | 990       |     |

## Banners (3 total)

| id | Kicker             | Title                    |
|----|--------------------|--------------------------|
| b1 | Скидка дня         | −40% на всю декоративку  |
| b2 | Привет, новенький  | 300 с на первый заказ    |
| b3 | Новинки            | Корейский уход уже у нас |

## Helpers

```js
import { fmtRub, pctOff } from '../entities/product/model.js';
fmtRub(1490)         // "1 490 с"
pctOff(459, 619)     // 26  (percent off, rounded)
```

## Context State Shapes

### useCart()
```js
{
  items: { 'p03': 2, 'p01': 1 },  // id → qty map
  list: [{ ...product, qty }],
  add(id, qty?),
  remove(id),
  setQty(id, qty),        // setQty(id, 0) removes item
  clear(),
  count,      // total item count
  subtotal,   // total at current prices
  saved,      // savings vs old prices
}
```

### useFavorites()
```js
{
  toggle(id),
  has(id),     // boolean
  list,        // Product[]
  count,
}
```

### useNotification()
```js
{
  show(message),   // shows toast, auto-dismisses at 2400ms
  toasts,          // array of active toasts
}
```

## Supabase Service Layer

```js
// src/service/products.js
fetchProducts()
fetchProductById(id)
fetchProductsByCategory(cat)

// src/service/orders.js
createOrder({ items, subtotal, delivery, total, phone, address, payMethod, deliveryMethod })
fetchOrders()

// src/service/auth.js
signInWithPhone(phone)
verifyOtp(phone, token)
signOut()
getSession()
onAuthStateChange(callback)
```

These are ready but not yet wired to UI — app currently uses static local data.
