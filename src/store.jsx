import React from 'react';

// ── Theme variants — 4 visual directions ──────────────────────
export const THEMES = {
  magnit: {
    name: 'Магнит',
    desc: 'Магента доминирует, жёлтые акценты',
    bg: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceAlt: '#FFF1F7',
    pageBg: '#F5EDE9',
    primary: '#E6097A',
    primaryDark: '#B8005F',
    accent: '#F4D423',
    accent2: '#F89020',
    ink: '#1A0A14',
    muted: '#7A6A72',
    border: 'rgba(26,10,20,0.08)',
    headerBg: '#E6097A',
    headerInk: '#FFFFFF',
    cardBg: '#FFFFFF',
    priceTagBg: '#F4D423',
    priceTagInk: '#1A0A14',
    btnBg: '#E6097A',
    btnInk: '#FFFFFF',
    discountBg: '#F89020',
    discountInk: '#FFFFFF',
  },
  noir: {
    name: 'Чёрный рынок',
    desc: 'Чёрный фон, неоновые карточки',
    bg: '#0A0A0A',
    surface: '#161116',
    surfaceAlt: '#1F1820',
    pageBg: '#000000',
    primary: '#E6097A',
    primaryDark: '#B8005F',
    accent: '#F4D423',
    accent2: '#F89020',
    ink: '#FFFFFF',
    muted: '#9A8A92',
    border: 'rgba(255,255,255,0.08)',
    headerBg: '#0A0A0A',
    headerInk: '#FFFFFF',
    cardBg: '#161116',
    priceTagBg: '#F4D423',
    priceTagInk: '#1A0A14',
    btnBg: '#E6097A',
    btnInk: '#FFFFFF',
    discountBg: '#F89020',
    discountInk: '#FFFFFF',
  },
  boutique: {
    name: 'Светлый',
    desc: 'Белый ведущий, магента акцент',
    bg: '#FAF7F4',
    surface: '#FFFFFF',
    surfaceAlt: '#F5EFE9',
    pageBg: '#EFE9E2',
    primary: '#E6097A',
    primaryDark: '#B8005F',
    accent: '#F4D423',
    accent2: '#F89020',
    ink: '#1A0A14',
    muted: '#8A7A82',
    border: 'rgba(26,10,20,0.1)',
    headerBg: '#FFFFFF',
    headerInk: '#1A0A14',
    cardBg: '#FFFFFF',
    priceTagBg: '#1A0A14',
    priceTagInk: '#F4D423',
    btnBg: '#1A0A14',
    btnInk: '#FFFFFF',
    discountBg: '#E6097A',
    discountInk: '#FFFFFF',
  },
  carnival: {
    name: 'Карнавал',
    desc: 'Жёлтый ведущий, максимум игры',
    bg: '#F4D423',
    surface: '#FFFFFF',
    surfaceAlt: '#FFE860',
    pageBg: '#F4D423',
    primary: '#E6097A',
    primaryDark: '#B8005F',
    accent: '#F4D423',
    accent2: '#F89020',
    ink: '#1A0A14',
    muted: '#5A4A20',
    border: 'rgba(26,10,20,0.12)',
    headerBg: '#1A0A14',
    headerInk: '#F4D423',
    cardBg: '#FFFFFF',
    priceTagBg: '#E6097A',
    priceTagInk: '#FFFFFF',
    btnBg: '#1A0A14',
    btnInk: '#F4D423',
    discountBg: '#E6097A',
    discountInk: '#FFFFFF',
  },
};

// ── Categories ─────────────────────────────────────────────────
export const CATEGORIES = [
  { id: 'face',   ru: 'Уход за лицом',  emoji: '🌸' },
  { id: 'hair',   ru: 'Волосы',          emoji: '💇' },
  { id: 'body',   ru: 'Тело',            emoji: '🧴' },
  { id: 'makeup', ru: 'Макияж',          emoji: '💄' },
  { id: 'parfum', ru: 'Парфюмерия',      emoji: '🌷' },
  { id: 'mens',   ru: 'Мужское',         emoji: '🪒' },
  { id: 'kids',   ru: 'Детское',         emoji: '🧸' },
  { id: 'home',   ru: 'Дом',             emoji: '🏠' },
];

// ── Products — 20 items ────────────────────────────────────────
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
];

// ── Banners ────────────────────────────────────────────────────
export const BANNERS = [
  { id: 'b1', kicker: 'Скидка дня',       title: '−40% на всю декоративку',  sub: 'Maybelline · Loreal · Essence', cta: 'Забрать',   accent: 'primary' },
  { id: 'b2', kicker: 'Привет, новенький', title: '300 ₽ на первый заказ',    sub: 'Промокод: ПЕРВЫЙ',              cta: 'Применить', accent: 'accent' },
  { id: 'b3', kicker: 'Новинки',          title: 'Корейский уход уже у нас',  sub: 'COSRX · Mizon · The Saem',      cta: 'Смотреть',  accent: 'orange' },
];

// ── Helpers ────────────────────────────────────────────────────
export const fmtRub = (n) => n.toLocaleString('ru-RU').replace(/,/g, ' ') + ' ₽';
export const pctOff = (price, old) => Math.round((1 - price / old) * 100);

// ── Cart context ───────────────────────────────────────────────
export const CartContext = React.createContext(null);
export const useCart = () => React.useContext(CartContext);

export function CartProvider({ children }) {
  const [items, setItems] = React.useState({});
  const add = (id, qty = 1) => setItems((s) => ({ ...s, [id]: (s[id] || 0) + qty }));
  const remove = (id) => setItems((s) => { const next = { ...s }; delete next[id]; return next; });
  const setQty = (id, qty) => setItems((s) => {
    if (qty <= 0) { const next = { ...s }; delete next[id]; return next; }
    return { ...s, [id]: qty };
  });
  const clear = () => setItems({});
  const count = Object.values(items).reduce((a, b) => a + b, 0);
  const list = Object.entries(items).map(([id, qty]) => {
    const p = PRODUCTS.find((x) => x.id === id);
    return p ? { ...p, qty } : null;
  }).filter(Boolean);
  const subtotal = list.reduce((a, x) => a + x.price * x.qty, 0);
  const oldTotal = list.reduce((a, x) => a + (x.old || x.price) * x.qty, 0);
  const saved = oldTotal - subtotal;
  return (
    <CartContext.Provider value={{ items, list, add, remove, setQty, clear, count, subtotal, saved }}>
      {children}
    </CartContext.Provider>
  );
}

// ── Theme context ──────────────────────────────────────────────
export const ThemeContext = React.createContext(THEMES.magnit);
export const useTheme = () => React.useContext(ThemeContext);

// ── Router context ─────────────────────────────────────────────
export const RouterContext = React.createContext(null);
export const useRouter = () => React.useContext(RouterContext);

export function RouterProvider({ initial = { screen: 'home' }, children }) {
  const [route, setRoute] = React.useState(initial);
  const [history, setHistory] = React.useState([initial]);
  const go = (next) => {
    setRoute(next);
    setHistory((h) => [...h, next]);
  };
  const back = () => {
    setHistory((h) => {
      if (h.length <= 1) return h;
      const next = h.slice(0, -1);
      setRoute(next[next.length - 1]);
      return next;
    });
  };
  return (
    <RouterContext.Provider value={{ route, go, back, history }}>
      {children}
    </RouterContext.Provider>
  );
}
