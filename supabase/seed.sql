-- ============================================================
-- Оптовые Цены — Supabase seed
-- Run this in: Supabase → SQL Editor → New query → Run
-- ============================================================

-- ── TABLES ──────────────────────────────────────────────────

create table if not exists categories (
  id   text primary key,
  ru   text not null,
  emoji text,
  sort int4 default 0
);

create table if not exists products (
  id          text primary key,
  cat         text references categories(id),
  brand       text,
  name        text,
  vol         text,
  price       int4,
  old         int4,
  rating      float4,
  reviews     int4,
  hit         boolean default false,
  hue         int4[],
  shape       text,
  active      boolean default true,
  created_at  timestamptz default now()
);

create table if not exists banners (
  id     text primary key,
  kicker text,
  title  text,
  sub    text,
  cta    text,
  accent text,
  active boolean default true
);

-- ── RLS ─────────────────────────────────────────────────────

alter table categories enable row level security;
alter table products    enable row level security;
alter table banners     enable row level security;

-- Public read
create policy "public read categories"
  on categories for select using (true);

create policy "public read active products"
  on products for select using (active = true);

create policy "public read active banners"
  on banners for select using (active = true);

-- Authenticated (admin) full access
create policy "auth full access categories"
  on categories for all using (auth.role() = 'authenticated');

create policy "auth full access products"
  on products for all using (auth.role() = 'authenticated');

create policy "auth full access banners"
  on banners for all using (auth.role() = 'authenticated');

-- ── SEED: CATEGORIES ────────────────────────────────────────

insert into categories (id, ru, emoji, sort) values
  ('face',   'Уход за лицом', '🌸', 1),
  ('hair',   'Волосы',         '💇', 2),
  ('body',   'Тело',           '🧴', 3),
  ('makeup', 'Макияж',         '💄', 4),
  ('parfum', 'Парфюмерия',     '🌷', 5),
  ('mens',   'Мужское',        '🪒', 6),
  ('kids',   'Детское',        '🧸', 7),
  ('home',   'Дом',            '🏠', 8),
  ('gifts',  'Подарки',        '🎁', 9)
on conflict (id) do update set ru = excluded.ru, emoji = excluded.emoji, sort = excluded.sort;

-- ── SEED: PRODUCTS ──────────────────────────────────────────

insert into products (id, cat, brand, name, vol, price, old, rating, reviews, hit, hue, shape) values
  ('p01','face',   'Чистая Линия',  'Крем для лица «Питательный»',              '50 мл',      129,  199,  4.7, 312,  true,  '{340,70,88}',  'jar'),
  ('p02','hair',   'Pantene',        'Шампунь Pro-V «Густые и крепкие»',          '400 мл',     249,  379,  4.8, 1890, true,  '{25,80,70}',   'bottle'),
  ('p03','makeup', 'Maybelline',     'Тушь Lash Sensational',                     '9.5 мл',     459,  619,  4.9, 2103, true,  '{330,80,50}',  'tube'),
  ('p04','body',   'Nivea',          'Молочко для тела «Мягкость кашемира»',      '400 мл',     219,  299,  4.6, 567,  false, '{200,60,75}',  'bottle'),
  ('p05','parfum', 'Bvlgari',        'Туалетная вода Omnia Crystalline',          '40 мл',      2890, 3990, 4.9, 89,   true,  '{55,70,88}',   'flask'),
  ('p06','face',   'Garnier',        'Мицеллярная вода для всех типов кожи',      '400 мл',     189,  269,  4.7, 1102, false, '{180,60,88}',  'bottle'),
  ('p07','makeup', 'Loreal',         'Помада Color Riche №643',                   '4 г',        389,  519,  4.8, 432,  false, '{355,75,55}',  'lipstick'),
  ('p08','hair',   'Schwarzkopf',    'Маска для волос Gliss Kur «Жидкий шёлк»',  '300 мл',     329,  449,  4.7, 678,  false, '{45,70,80}',   'tube'),
  ('p09','body',   'Dove',           'Гель для душа «Прикосновение свежести»',    '500 мл',     199,  269,  4.8, 1455, false, '{195,80,70}',  'bottle'),
  ('p10','mens',   'Old Spice',      'Дезодорант-стик Wolfthorn',                 '50 мл',      269,  349,  4.7, 890,  true,  '{220,70,50}',  'stick'),
  ('p11','parfum', 'Lancome',        'Парфюмерная вода La Vie Est Belle',         '50 мл',      5490, 7290, 5.0, 234,  false, '{330,60,75}',  'flask'),
  ('p12','makeup', 'Essence',        'Палетка теней «Электрический бархат»',      '12 г',       449,  599,  4.6, 156,  false, '{285,70,50}',  'palette'),
  ('p13','face',   'Vichy',          'Сыворотка Mineral 89',                      '30 мл',      1490, 1990, 4.9, 412,  true,  '{200,80,60}',  'flask'),
  ('p14','kids',   'Ушастый Нянь',  'Шампунь детский «Без слёз»',               '500 мл',     159,  219,  4.8, 678,  false, '{50,90,75}',   'bottle'),
  ('p15','body',   'Camay',          'Мыло «Романтик»',                           '85 г × 5',   189,  249,  4.7, 234,  false, '{340,75,80}',  'bar'),
  ('p16','hair',   'Syoss',          'Лак для волос «Объём»',                     '400 мл',     269,  359,  4.6, 312,  false, '{270,70,60}',  'spray'),
  ('p17','makeup', 'Eveline',        'Карандаш для бровей «Микроточка»',          '0.09 г',     199,  279,  4.8, 567,  false, '{30,60,30}',   'pencil'),
  ('p18','face',   'Bioderma',       'Sebium лосьон',                             '200 мл',     1190, 1490, 4.9, 198,  false, '{195,70,65}',  'bottle'),
  ('p19','parfum', 'Davidoff',       'Cool Water туалетная вода',                 '125 мл',     3290, 4290, 4.8, 312,  false, '{210,90,50}',  'flask'),
  ('p20','mens',   'Gillette',       'Гель для бритья Series Sensitive',          '200 мл',     339,  449,  4.7, 234,  false, '{205,80,55}',  'bottle'),
  ('p21','gifts',  'Dove',           'Подарочный набор «Забота и нежность»',      '3 предмета', 649,  990,  4.9, 187,  true,  '{340,60,80}',  'jar'),
  ('p22','gifts',  'Nivea',          'Подарочный набор «Зимний уход»',            '4 предмета', 890,  1290, 4.8, 143,  false, '{210,70,75}',  'jar'),
  ('p23','gifts',  'Schwarzkopf',    'Подарочный набор «Блеск волос»',            '2 предмета', 990,  1490, 4.7, 98,   false, '{45,65,78}',   'bottle')
on conflict (id) do update set
  cat = excluded.cat, brand = excluded.brand, name = excluded.name,
  vol = excluded.vol, price = excluded.price, old = excluded.old,
  rating = excluded.rating, reviews = excluded.reviews, hit = excluded.hit,
  hue = excluded.hue, shape = excluded.shape;

-- ── SEED: BANNERS ───────────────────────────────────────────

insert into banners (id, kicker, title, sub, cta, accent) values
  ('b1', 'Скидка дня',        '−40% на всю декоративку', 'Maybelline · Loreal · Essence', 'Забрать',   'primary'),
  ('b2', 'Привет, новенький', '300 с на первый заказ',   'Промокод: ПЕРВЫЙ',              'Применить', 'accent'),
  ('b3', 'Новинки',           'Корейский уход уже у нас', 'COSRX · Mizon · The Saem',     'Смотреть',  'orange')
on conflict (id) do update set
  kicker = excluded.kicker, title = excluded.title, sub = excluded.sub,
  cta = excluded.cta, accent = excluded.accent;
