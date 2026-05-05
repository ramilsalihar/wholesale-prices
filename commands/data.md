# Data Model

All data lives in `src/store.jsx`. No API calls — everything static.

## Product Shape

```js
{
  id: 'p01',          // 'p01'–'p20'
  cat: 'face',        // category id (see below)
  brand: 'Чистая Линия',
  name: 'Крем для лица «Питательный»',
  vol: '50 мл',       // volume/weight display string
  price: 129,         // current price in RUB
  old: 199,           // original price (always present — all products are on sale)
  rating: 4.7,        // 4.6–5.0
  reviews: 312,       // review count
  hit: true,          // optional — marks bestseller badge
  hue: [340, 70, 88], // [h, s, l] — used for generated product image color
  shape: 'jar',       // 'jar'|'bottle'|'tube'|'flask'|'lipstick'|'palette'|'pencil'|'stick'|'spray'|'bar'
}
```

## Categories (8 total)

| id      | Label (ru)       |
|---------|-----------------|
| face    | Уход за лицом   |
| hair    | Волосы          |
| body    | Тело            |
| makeup  | Макияж          |
| parfum  | Парфюмерия      |
| mens    | Мужское         |
| kids    | Детское         |
| home    | Дом             |

## Products (20 total)

| id  | Category | Brand          | Price  |
|-----|----------|----------------|--------|
| p01 | face     | Чистая Линия   | 129₽   |
| p02 | hair     | Pantene        | 249₽   |
| p03 | makeup   | Maybelline     | 459₽   |
| p04 | body     | Nivea          | 219₽   |
| p05 | parfum   | Bvlgari        | 2890₽  |
| p06 | face     | Garnier        | 189₽   |
| p07 | makeup   | Loreal         | 389₽   |
| p08 | hair     | Schwarzkopf    | 329₽   |
| p09 | body     | Dove           | 199₽   |
| p10 | mens     | Old Spice      | 269₽   |
| p11 | parfum   | Lancome        | 5490₽  |
| p12 | makeup   | Essence        | 449₽   |
| p13 | face     | Vichy          | 1490₽  |
| p14 | kids     | Ушастый Нянь   | 159₽   |
| p15 | body     | Camay          | 189₽   |
| p16 | hair     | Syoss          | 269₽   |
| p17 | makeup   | Eveline        | 199₽   |
| p18 | face     | Bioderma       | 1190₽  |
| p19 | parfum   | Davidoff       | 3290₽  |
| p20 | mens     | Gillette       | 339₽   |

Hits (p.hit === true): p01, p02, p03, p05, p10, p13

## Banners (3 total)

| id | Kicker               | Title                       |
|----|---------------------|-----------------------------|
| b1 | Скидка дня          | −40% на всю декоративку     |
| b2 | Привет, новенький   | 300 ₽ на первый заказ       |
| b3 | Новинки             | Корейский уход уже у нас    |

## Helpers

```js
import { fmtRub, pctOff } from './store.jsx';
fmtRub(1490)           // "1 490 ₽"
pctOff(459, 619)       // 26  (percent off, rounded)
```

## Cart State Shape

`useCart()` returns:
```js
{
  items: { 'p03': 2, 'p01': 1 },  // id → qty map
  list: [{ ...product, qty }],     // enriched list
  add(id, qty?),
  remove(id),
  setQty(id, qty),
  clear(),
  count,      // total item count
  subtotal,   // total at current prices
  saved,      // savings vs old prices
}
```
