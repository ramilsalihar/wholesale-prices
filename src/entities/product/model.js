/**
 * @typedef {'jar'|'bottle'|'tube'|'flask'|'lipstick'|'palette'|'pencil'|'stick'|'spray'|'bar'} ProductShape
 * @typedef {'face'|'hair'|'body'|'makeup'|'parfum'|'mens'|'kids'|'home'|'gifts'} CategoryId
 *
 * @typedef {Object} Product
 * @property {string} id           - Unique identifier (p01–p20)
 * @property {CategoryId} cat      - Category id
 * @property {string} brand        - Brand name
 * @property {string} name         - Product display name
 * @property {string} vol          - Volume / weight display string
 * @property {number} price        - Current price in сом
 * @property {number} old          - Original price (always set — all products are on sale)
 * @property {number} rating       - Rating 4.6–5.0
 * @property {number} reviews      - Review count
 * @property {boolean} [hit]       - Bestseller flag
 * @property {[number, number, number]} hue   - [h, s, l] for generated product image
 * @property {ProductShape} shape  - Product shape for SVG illustration
 */

/** @type {Product[]} */
export const PRODUCTS = [
  { id: 'p01', cat: 'face',   brand: 'Чистая Линия',   name: 'Крем для лица «Питательный»',             vol: '50 мл',    price: 129,  old: 199,  rating: 4.7, reviews: 312,  hit: true,  hue: [340, 70, 88], shape: 'jar' },
  { id: 'p02', cat: 'hair',   brand: 'Pantene',         name: 'Шампунь Pro-V «Густые и крепкие»',        vol: '400 мл',   price: 249,  old: 379,  rating: 4.8, reviews: 1890, hit: true,  hue: [25, 80, 70],  shape: 'bottle' },
  { id: 'p03', cat: 'makeup', brand: 'Maybelline',      name: 'Тушь Lash Sensational',                    vol: '9.5 мл',   price: 459,  old: 619,  rating: 4.9, reviews: 2103, hit: true,  hue: [330, 80, 50], shape: 'tube' },
  { id: 'p04', cat: 'body',   brand: 'Nivea',           name: 'Молочко для тела «Мягкость кашемира»',    vol: '400 мл',   price: 219,  old: 299,  rating: 4.6, reviews: 567,               hue: [200, 60, 75], shape: 'bottle' },
  { id: 'p05', cat: 'parfum', brand: 'Bvlgari',         name: 'Туалетная вода Omnia Crystalline',        vol: '40 мл',    price: 2890, old: 3990, rating: 4.9, reviews: 89,   hit: true,  hue: [55, 70, 88],  shape: 'flask' },
  { id: 'p06', cat: 'face',   brand: 'Garnier',         name: 'Мицеллярная вода для всех типов кожи',    vol: '400 мл',   price: 189,  old: 269,  rating: 4.7, reviews: 1102,              hue: [180, 60, 88], shape: 'bottle' },
  { id: 'p07', cat: 'makeup', brand: 'Loreal',          name: 'Помада Color Riche №643',                 vol: '4 г',      price: 389,  old: 519,  rating: 4.8, reviews: 432,               hue: [355, 75, 55], shape: 'lipstick' },
  { id: 'p08', cat: 'hair',   brand: 'Schwarzkopf',     name: 'Маска для волос Gliss Kur «Жидкий шёлк»', vol: '300 мл',  price: 329,  old: 449,  rating: 4.7, reviews: 678,               hue: [45, 70, 80],  shape: 'tube' },
  { id: 'p09', cat: 'body',   brand: 'Dove',            name: 'Гель для душа «Прикосновение свежести»',  vol: '500 мл',   price: 199,  old: 269,  rating: 4.8, reviews: 1455,              hue: [195, 80, 70], shape: 'bottle' },
  { id: 'p10', cat: 'mens',   brand: 'Old Spice',       name: 'Дезодорант-стик Wolfthorn',               vol: '50 мл',    price: 269,  old: 349,  rating: 4.7, reviews: 890,  hit: true,  hue: [220, 70, 50], shape: 'stick' },
  { id: 'p11', cat: 'parfum', brand: 'Lancome',         name: 'Парфюмерная вода La Vie Est Belle',       vol: '50 мл',    price: 5490, old: 7290, rating: 5.0, reviews: 234,               hue: [330, 60, 75], shape: 'flask' },
  { id: 'p12', cat: 'makeup', brand: 'Essence',         name: 'Палетка теней «Электрический бархат»',   vol: '12 г',     price: 449,  old: 599,  rating: 4.6, reviews: 156,               hue: [285, 70, 50], shape: 'palette' },
  { id: 'p13', cat: 'face',   brand: 'Vichy',           name: 'Сыворотка Mineral 89',                    vol: '30 мл',    price: 1490, old: 1990, rating: 4.9, reviews: 412,  hit: true,  hue: [200, 80, 60], shape: 'flask' },
  { id: 'p14', cat: 'kids',   brand: 'Ушастый Нянь',   name: 'Шампунь детский «Без слёз»',              vol: '500 мл',   price: 159,  old: 219,  rating: 4.8, reviews: 678,               hue: [50, 90, 75],  shape: 'bottle' },
  { id: 'p15', cat: 'body',   brand: 'Camay',           name: 'Мыло «Романтик»',                         vol: '85 г × 5', price: 189,  old: 249,  rating: 4.7, reviews: 234,               hue: [340, 75, 80], shape: 'bar' },
  { id: 'p16', cat: 'hair',   brand: 'Syoss',           name: 'Лак для волос «Объём»',                   vol: '400 мл',   price: 269,  old: 359,  rating: 4.6, reviews: 312,               hue: [270, 70, 60], shape: 'spray' },
  { id: 'p17', cat: 'makeup', brand: 'Eveline',         name: 'Карандаш для бровей «Микроточка»',        vol: '0.09 г',   price: 199,  old: 279,  rating: 4.8, reviews: 567,               hue: [30, 60, 30],  shape: 'pencil' },
  { id: 'p18', cat: 'face',   brand: 'Bioderma',        name: 'Sebium лосьон',                           vol: '200 мл',   price: 1190, old: 1490, rating: 4.9, reviews: 198,               hue: [195, 70, 65], shape: 'bottle' },
  { id: 'p19', cat: 'parfum', brand: 'Davidoff',        name: 'Cool Water туалетная вода',               vol: '125 мл',   price: 3290, old: 4290, rating: 4.8, reviews: 312,               hue: [210, 90, 50], shape: 'flask' },
  { id: 'p20', cat: 'mens',   brand: 'Gillette',        name: 'Гель для бритья Series Sensitive',        vol: '200 мл',   price: 339,  old: 449,  rating: 4.7, reviews: 234,               hue: [205, 80, 55], shape: 'bottle' },
  { id: 'p21', cat: 'gifts', brand: 'Dove',            name: 'Подарочный набор «Забота и нежность»',    vol: '3 предмета', price: 649, old: 990,  rating: 4.9, reviews: 187, hit: true,  hue: [340, 60, 80], shape: 'jar' },
  { id: 'p22', cat: 'gifts', brand: 'Nivea',           name: 'Подарочный набор «Зимний уход»',          vol: '4 предмета', price: 890, old: 1290, rating: 4.8, reviews: 143,               hue: [210, 70, 75], shape: 'jar' },
  { id: 'p23', cat: 'gifts', brand: 'Schwarzkopf',     name: 'Подарочный набор «Блеск волос»',          vol: '2 предмета', price: 990, old: 1490, rating: 4.7, reviews: 98,                hue: [45, 65, 78],  shape: 'bottle' },
];

/** Format number as сом currency string */
export const fmtRub = (n) => n.toLocaleString('ru-RU').replace(/,/g, ' ') + ' с';

/** Calculate percent discount */
export const pctOff = (price, old) => Math.round((1 - price / old) * 100);
