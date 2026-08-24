/**
 * @typedef {'bouquets'|'box'|'mono'|'wedding'|'plants'|'potted'|'sympathy'|'seasonal'|'gifts'} CategoryId
 *
 * @typedef {Object} Product
 * @property {string} id           - Unique identifier (p01–p24)
 * @property {CategoryId} cat      - Category id
 * @property {string} brand        - Studio / supplier name
 * @property {string} name         - Product display name
 * @property {string} vol          - Composition / size display string (e.g. "25 роз", "горшок 15 см")
 * @property {number} price        - Current price in сом
 * @property {number} old          - Original price (always set — all products are on sale)
 * @property {number} rating       - Rating 4.6–5.0
 * @property {number} reviews      - Review count
 * @property {boolean} [hit]       - Bestseller flag
 * @property {string|null} image_url - Product photo URL, null = placeholder icon
 */

/** @type {Product[]} */
export const PRODUCTS = [
  { id: 'p01', cat: 'bouquets', brand: 'Bloom Bishkek',       name: 'Букет из 25 алых роз',                 vol: '25 роз',        price: 2490, old: 3200, rating: 4.9, reviews: 412, hit: true,  image_url: '/assets/products/p01.jpeg' },
  { id: 'p02', cat: 'bouquets', brand: 'La Fleur',            name: 'Букет «Летнее настроение» с герберами', vol: '15 стеблей',    price: 1890, old: 2390, rating: 4.7, reviews: 156,              image_url: '/assets/products/p02.jpg' },
  { id: 'p03', cat: 'mono',     brand: 'Цветочная мануфактура', name: 'Монобукет тюльпанов',                 vol: '25 тюльпанов',  price: 1590, old: 1990, rating: 4.8, reviews: 890, hit: true, image_url: '/assets/products/p03.jpeg' },
  { id: 'p04', cat: 'mono',     brand: 'Bloom Bishkek',       name: 'Монобукет пионовидных роз',            vol: '11 роз',        price: 2190, old: 2790, rating: 4.9, reviews: 234,              image_url: '/assets/products/p04.jpg' },
  { id: 'p05', cat: 'box',      brand: 'Floristic Lab',       name: 'Композиция «Нежность» с пионами в коробке', vol: 'коробка S', price: 3490, old: 4290, rating: 4.9, reviews: 178, hit: true, image_url: '/assets/products/p05.jpg' },
  { id: 'p06', cat: 'box',      brand: 'La Fleur',            name: 'Шляпная коробка с гортензией и розами', vol: 'коробка M',   price: 3990, old: 4990, rating: 4.8, reviews: 145,              image_url: '/assets/products/p06.webp' },
  { id: 'p07', cat: 'wedding',  brand: 'Floristic Lab',       name: 'Букет невесты с эустомой и розами',    vol: 'свадебный',     price: 3290, old: 4190, rating: 5.0, reviews: 67,   hit: true, image_url: '/assets/products/p07.jpg' },
  { id: 'p08', cat: 'wedding',  brand: 'Floristic Lab',       name: 'Бутоньерка для жениха',                vol: '1 шт',          price: 590,  old: 790,  rating: 4.8, reviews: 44,               image_url: '/assets/products/p08.jpg' },
  { id: 'p09', cat: 'plants',   brand: 'Green House',         name: 'Орхидея Фаленопсис в кашпо',           vol: 'горшок 12 см', price: 1990, old: 2490, rating: 4.7, reviews: 321,              image_url: '/assets/products/p09.jpg' },
  { id: 'p10', cat: 'plants',   brand: 'Green House',         name: 'Фикус Лирата',                         vol: 'горшок 17 см', price: 2790, old: 3490, rating: 4.6, reviews: 98,               image_url: '/assets/products/p10.jpg' },
  { id: 'p11', cat: 'potted',   brand: 'Green House',         name: 'Суккулент в керамическом кашпо',       vol: 'горшок 8 см',  price: 590,  old: 790,  rating: 4.8, reviews: 267,              image_url: '/assets/products/p11.jpg' },
  { id: 'p12', cat: 'potted',   brand: 'Цветочная мануфактура', name: 'Гиацинты в декоративном горшке',     vol: 'горшок 15 см', price: 990,  old: 1290, rating: 4.7, reviews: 134,              image_url: '/assets/products/p12.jpg' },
  { id: 'p13', cat: 'sympathy', brand: 'Floristic Lab',       name: 'Траурная корзина из белых хризантем',  vol: 'корзина',       price: 2990, old: 3590, rating: 4.9, reviews: 52,               image_url: '/assets/products/p13.jpg' },
  { id: 'p14', cat: 'sympathy', brand: 'Floristic Lab',       name: 'Венок ритуальный из живых цветов',     vol: 'венок',         price: 4290, old: 5190, rating: 4.9, reviews: 38,               image_url: '/assets/products/p14.jpg' },
  { id: 'p15', cat: 'seasonal', brand: 'Bloom Bishkek',       name: 'Букет к 8 Марта «Весенний»',           vol: '19 тюльпанов',  price: 1690, old: 2290, rating: 4.8, reviews: 512, hit: true,  image_url: '/assets/products/p15.jpg' },
  { id: 'p16', cat: 'seasonal', brand: 'La Fleur',            name: 'Новогодняя композиция с эвкалиптом',   vol: 'композиция',    price: 2390, old: 2990, rating: 4.7, reviews: 89,               image_url: '/assets/products/p16.jpg' },
  { id: 'p17', cat: 'gifts',    brand: 'La Fleur',            name: 'Букет + коробка конфет Raffaello',     vol: '9 роз + конфеты', price: 2190, old: 2790, rating: 4.9, reviews: 267, hit: true, image_url: '/assets/products/p17.jpg' },
  { id: 'p18', cat: 'gifts',    brand: 'Bloom Bishkek',       name: 'Букет + мягкая игрушка мишка',         vol: '11 роз + игрушка', price: 2490, old: 3190, rating: 4.8, reviews: 198,           image_url: '/assets/products/p18.jpg' },
  { id: 'p19', cat: 'bouquets', brand: 'Цветочная мануфактура', name: 'Букет «Полевое лето» с ромашками и васильками', vol: '21 стебель', price: 1490, old: 1890, rating: 4.7, reviews: 176,   image_url: '/assets/products/p19.webp' },
  { id: 'p20', cat: 'bouquets', brand: 'Floristic Lab',       name: 'Букет из белых лилий и эустомы',       vol: '9 стеблей',     price: 2290, old: 2890, rating: 4.8, reviews: 143,              image_url: '/assets/products/p20.jpg' },
  { id: 'p21', cat: 'mono',     brand: 'Bloom Bishkek',       name: 'Монобукет пионов',                     vol: '9 пионов',      price: 2890, old: 3590, rating: 4.9, reviews: 210, hit: true,  image_url: '/assets/products/p21.jpg' },
  { id: 'p22', cat: 'box',      brand: 'Floristic Lab',       name: 'Коробка с суккулентами и розами',      vol: 'коробка S',     price: 2690, old: 3290, rating: 4.7, reviews: 87,               image_url: '/assets/products/p22.jpg' },
  { id: 'p23', cat: 'plants',   brand: 'Green House',         name: 'Замиокулькас в кашпо',                 vol: 'горшок 14 см', price: 1690, old: 2090, rating: 4.6, reviews: 76,               image_url: '/assets/products/p23.jpg' },
  { id: 'p24', cat: 'seasonal', brand: 'La Fleur',            name: 'Букет ко Дню всех влюблённых «Романтика»', vol: '15 роз',    price: 2190, old: 2790, rating: 4.9, reviews: 289, hit: true,  image_url: '/assets/products/p24.jpg' },
];

/** Format number as сом currency string */
export const fmtRub = (n) => n.toLocaleString('ru-RU').replace(/,/g, ' ') + ' с';

/** Calculate percent discount */
export const pctOff = (price, old) => Math.round((1 - price / old) * 100);
