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

create table if not exists stores (
  id       text primary key,
  name     text not null,
  address  text,
  district text,
  city     text,
  hours    text,
  rating   float4 default 4.5,
  reviews  int4   default 0,
  map_url  text,
  badge    text,
  active   boolean default true,
  sort     int4    default 0
);

create table if not exists orders (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references auth.users(id),
  user_name        text,
  email            text,
  phone            text,
  address          text,
  city             text,
  notes            text,
  items            jsonb    not null default '[]',
  subtotal         int4     not null default 0,
  delivery         int4     not null default 0,
  total            int4     not null default 0,
  pay_method       text,
  delivery_method  text,
  status           text     not null default 'new',
  created_at       timestamptz default now()
);

create table if not exists features (
  id       text    primary key,
  icon     text    not null default 'check',
  title    text    not null,
  subtitle text,
  sort     int4    not null default 0,
  active   boolean not null default true
);

create table if not exists settings (
  id                       text primary key default 'main',
  store_name               text,
  instagram                text,
  phone                    text,
  free_delivery_threshold  int4 default 1500,
  delivery_bishkek         int4 default 199,
  delivery_osh             int4 default 199,
  delivery_regions         int4 default 299,
  default_theme            text default 'magnit'
);

-- ── RLS ─────────────────────────────────────────────────────

alter table categories enable row level security;
alter table products    enable row level security;
alter table banners     enable row level security;
alter table stores      enable row level security;
alter table orders      enable row level security;
alter table settings    enable row level security;
alter table features    enable row level security;

-- Public read
drop policy if exists "public read categories" on categories;
create policy "public read categories"
  on categories for select using (true);

drop policy if exists "public read active products" on products;
create policy "public read active products"
  on products for select using (active = true);

drop policy if exists "public read active banners" on banners;
create policy "public read active banners"
  on banners for select using (active = true);

-- Authenticated (admin) full access
drop policy if exists "auth full access categories" on categories;
create policy "auth full access categories"
  on categories for all using (auth.role() = 'authenticated');

drop policy if exists "auth full access products" on products;
create policy "auth full access products"
  on products for all using (auth.role() = 'authenticated');

drop policy if exists "auth full access banners" on banners;
create policy "auth full access banners"
  on banners for all using (auth.role() = 'authenticated');

drop policy if exists "public read active stores" on stores;
create policy "public read active stores"
  on stores for select using (active = true);

drop policy if exists "auth full access stores" on stores;
create policy "auth full access stores"
  on stores for all using (auth.role() = 'authenticated');

-- Orders: anyone can insert (checkout), admin can read/update
drop policy if exists "public insert orders" on orders;
create policy "public insert orders"
  on orders for insert with check (true);

drop policy if exists "auth full access orders" on orders;
create policy "auth full access orders"
  on orders for all using (auth.role() = 'authenticated');

-- Settings: public read, auth full access
drop policy if exists "public read settings" on settings;
create policy "public read settings"
  on settings for select using (true);

drop policy if exists "auth full access settings" on settings;
create policy "auth full access settings"
  on settings for all using (auth.role() = 'authenticated');

-- Features: public read active, auth full access
drop policy if exists "public read active features" on features;
create policy "public read active features"
  on features for select using (active = true);

drop policy if exists "auth full access features" on features;
create policy "auth full access features"
  on features for all using (auth.role() = 'authenticated');

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

-- ── SEED: STORES ────────────────────────────────────────────

insert into stores (id, name, address, district, city, hours, rating, reviews, map_url, badge, sort) values
  ('s1', 'Оптовые цены 01 · Киевская',   'ул. Киевская, 69, 1 этаж',          'Первомайский район',  'Бишкек, 720040', '09:00 – 21:00', 4.0, 1489, 'https://2gis.kg/bishkek/branches/70000001036586855/firm/70000001036586856/74.605312%2C42.874828', 'Главный', 0),
  ('s2', 'Оптовые цены 01 · Гражданская','ул. Гражданская, 2',                 'Свердловский район',  'Бишкек, 720065', '09:00 – 21:00', 4.5,  732, 'https://2gis.kg/bishkek/branches/70000001036586855/firm/70000001077243451/74.636694%2C42.875686', null,      1),
  ('s3', 'Оптовые цены 01 · Дуйшеева',  'ул. Арстанбека Дуйшеева, 6/5',      'Октябрьский район',   'Бишкек, 720060', '09:00 – 21:00', 4.0,  193, 'https://2gis.kg/bishkek/firm/70000001102767646',                                                   null,      2),
  ('s4', 'Оптовые цены 01 · Ахунбаева', 'ул. Исы Ахунбаева, 101',             'Первомайский район',  'Бишкек, 720055', '09:00 – 21:00', 4.2,   34, 'https://2gis.kg/bishkek/branches/70000001036586855/geo/15763234351138719/74.60829%2C42.843155',    null,      3)
on conflict (id) do update set
  name = excluded.name, address = excluded.address, district = excluded.district,
  city = excluded.city, hours = excluded.hours, rating = excluded.rating,
  reviews = excluded.reviews, map_url = excluded.map_url, badge = excluded.badge, sort = excluded.sort;

-- ── SEED: FEATURES ──────────────────────────────────────────

insert into features (id, icon, title, subtitle, sort, active) values
  ('f1', 'truck',  'Доставка завтра',    'по Бишкеку',              0, true),
  ('f2', 'shield', 'Гарантия оригинала', 'возврат 14 дней',          1, true),
  ('f3', 'flame',  'Цена дня',           'до −60% ежедневно',        2, true),
  ('f4', 'heart',  '12 000+ отзывов',    'настоящие покупатели',     3, true)
on conflict (id) do update set
  icon = excluded.icon, title = excluded.title, subtitle = excluded.subtitle,
  sort = excluded.sort, active = excluded.active;

-- ── SEED: SETTINGS ──────────────────────────────────────────

insert into settings (id, store_name, instagram, phone, free_delivery_threshold, delivery_bishkek, delivery_osh, delivery_regions, default_theme) values
  ('main', 'САМЫЙ БОЛЬШОЙ МАГАЗИН КОСМЕТИКИ В КЫРГЫЗСТАНЕ', 'optovye_ceny01_', '8 (312) 123-45-67', 1500, 199, 199, 299, 'magnit')
on conflict (id) do update set
  store_name = excluded.store_name, instagram = excluded.instagram, phone = excluded.phone,
  free_delivery_threshold = excluded.free_delivery_threshold,
  delivery_bishkek = excluded.delivery_bishkek, delivery_osh = excluded.delivery_osh,
  delivery_regions = excluded.delivery_regions, default_theme = excluded.default_theme;
-- Run in Supabase SQL Editor AFTER seed.sql has been applied
-- Step 1: Extended product fields
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS ingredients  text,
  ADD COLUMN IF NOT EXISTS image_url    text,
  ADD COLUMN IF NOT EXISTS stock        int4    DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sku          text,
  ADD COLUMN IF NOT EXISTS tags         text[];

-- Step 2: Brands table
CREATE TABLE IF NOT EXISTS brands (
  id       text primary key,
  name     text not null,
  logo_url text,
  active   boolean default true,
  sort     int4    default 0
);

ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read active brands" ON brands;
CREATE POLICY "public read active brands"
  ON brands FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "auth full access brands" ON brands;
CREATE POLICY "auth full access brands"
  ON brands FOR ALL USING (auth.role() = 'authenticated');

-- Step 3: brand_id FK on products
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS brand_id text references brands(id);

-- Step 4: Seed brands from existing product data
INSERT INTO brands (id, name, sort) VALUES
  ('chistaya-liniya', 'Чистая Линия', 1),
  ('pantene',         'Pantene',       2),
  ('maybelline',      'Maybelline',    3),
  ('nivea',           'Nivea',         4),
  ('bvlgari',         'Bvlgari',       5),
  ('garnier',         'Garnier',       6),
  ('loreal',          'Loreal',        7),
  ('schwarzkopf',     'Schwarzkopf',   8),
  ('dove',            'Dove',          9),
  ('old-spice',       'Old Spice',    10),
  ('lancome',         'Lancome',      11),
  ('essence',         'Essence',      12),
  ('vichy',           'Vichy',        13),
  ('ushastiy-nyan',   'Ушастый Нянь', 14),
  ('camay',           'Camay',        15),
  ('syoss',           'Syoss',        16),
  ('eveline',         'Eveline',      17),
  ('bioderma',        'Bioderma',     18),
  ('davidoff',        'Davidoff',     19),
  ('gillette',        'Gillette',     20)
ON CONFLICT (id) DO UPDATE SET name = excluded.name, sort = excluded.sort;

-- Step 5: Link existing products to brand records
UPDATE products SET brand_id = 'chistaya-liniya' WHERE brand = 'Чистая Линия';
UPDATE products SET brand_id = 'pantene'         WHERE brand = 'Pantene';
UPDATE products SET brand_id = 'maybelline'      WHERE brand = 'Maybelline';
UPDATE products SET brand_id = 'nivea'           WHERE brand = 'Nivea';
UPDATE products SET brand_id = 'bvlgari'         WHERE brand = 'Bvlgari';
UPDATE products SET brand_id = 'garnier'         WHERE brand = 'Garnier';
UPDATE products SET brand_id = 'loreal'          WHERE brand = 'Loreal';
UPDATE products SET brand_id = 'schwarzkopf'     WHERE brand = 'Schwarzkopf';
UPDATE products SET brand_id = 'dove'            WHERE brand = 'Dove';
UPDATE products SET brand_id = 'old-spice'       WHERE brand = 'Old Spice';
UPDATE products SET brand_id = 'lancome'         WHERE brand = 'Lancome';
UPDATE products SET brand_id = 'essence'         WHERE brand = 'Essence';
UPDATE products SET brand_id = 'vichy'           WHERE brand = 'Vichy';
UPDATE products SET brand_id = 'ushastiy-nyan'   WHERE brand = 'Ушастый Нянь';
UPDATE products SET brand_id = 'camay'           WHERE brand = 'Camay';
UPDATE products SET brand_id = 'syoss'           WHERE brand = 'Syoss';
UPDATE products SET brand_id = 'eveline'         WHERE brand = 'Eveline';
UPDATE products SET brand_id = 'bioderma'        WHERE brand = 'Bioderma';
UPDATE products SET brand_id = 'davidoff'        WHERE brand = 'Davidoff';
UPDATE products SET brand_id = 'gillette'        WHERE brand = 'Gillette';

-- Step 6: Extended order fields
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS user_id   uuid references auth.users(id),
  ADD COLUMN IF NOT EXISTS user_name text,
  ADD COLUMN IF NOT EXISTS email     text,
  ADD COLUMN IF NOT EXISTS city      text,
  ADD COLUMN IF NOT EXISTS notes     text;

-- Allow authenticated clients to read their own orders
DROP POLICY IF EXISTS "users read own orders" ON orders;
CREATE POLICY "users read own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id OR auth.role() = 'authenticated');

-- Step 7: Features table
CREATE TABLE IF NOT EXISTS features (
  id       text    PRIMARY KEY,
  icon     text    NOT NULL DEFAULT 'check',
  title    text    NOT NULL,
  subtitle text,
  sort     int4    NOT NULL DEFAULT 0,
  active   boolean NOT NULL DEFAULT true
);

ALTER TABLE features ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read active features" ON features;
CREATE POLICY "public read active features"
  ON features FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "auth full access features" ON features;
CREATE POLICY "auth full access features"
  ON features FOR ALL USING (auth.role() = 'authenticated');

INSERT INTO features (id, icon, title, subtitle, sort, active) VALUES
  ('f1', 'truck',  'Доставка завтра',    'по Бишкеку',           0, true),
  ('f2', 'shield', 'Гарантия оригинала', 'возврат 14 дней',       1, true),
  ('f3', 'flame',  'Цена дня',           'до −60% ежедневно',     2, true),
  ('f4', 'heart',  '12 000+ отзывов',    'настоящие покупатели',  3, true)
ON CONFLICT (id) DO UPDATE SET
  icon = excluded.icon, title = excluded.title, subtitle = excluded.subtitle,
  sort = excluded.sort, active = excluded.active;
-- ============================================================
-- Flowo — Migration: RBAC & Vendor Self-Registration
-- Run this in Supabase SQL Editor:
-- Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

-- 1. Create or extend profiles table for Role-Based Access Control
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text,
  full_name text,
  phone text,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'vendor', 'admin')),
  address text,
  city text DEFAULT 'Бишкек',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ensure all necessary columns exist if profiles was previously created
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'user';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city text DEFAULT 'Бишкек';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- 2. Create vendors table for Flower Shops / Sellers
CREATE TABLE IF NOT EXISTS public.vendors (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name text NOT NULL,                    -- Название магазина цветов / флористического салона
  description text,                      -- Описание магазина, концепция, условия доставки
  phone text,                            -- Контактный номер / WhatsApp
  email text,                            -- Рабочий email магазина
  address text,                          -- Фактический адрес цветочной точки
  city text DEFAULT 'Бишкек',
  hours text DEFAULT '09:00 – 21:00',    -- Режим работы
  logo_url text,                         -- Логотип магазина
  banner_url text,                       -- Обложка витрины
  rating float4 DEFAULT 5.0,             -- Рейтинг
  reviews_count int4 DEFAULT 0,          -- Количество отзывов
  status text NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected', 'blocked')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ensure all necessary columns exist if vendors table was previously created
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS city text DEFAULT 'Бишкек';
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS hours text DEFAULT '09:00 – 21:00';
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS logo_url text;
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS banner_url text;
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS rating float4 DEFAULT 5.0;
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS reviews_count int4 DEFAULT 0;
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'approved';
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- 3. Link products to vendors: vendor_id
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS vendor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_products_vendor_id ON public.products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(active);
CREATE INDEX IF NOT EXISTS idx_vendors_status ON public.vendors(status);

-- 4. Helper Security Definer functions (bypasses RLS to prevent recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
  OR (
    -- Built-in safe check for primary admin or service_role
    auth.jwt()->>'email' = 'admin@gmail.com'
    OR auth.jwt()->>'role' = 'service_role'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_vendor()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'vendor'
  );
$$;

CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT role FROM public.profiles WHERE id = auth.uid()),
    CASE
      WHEN auth.jwt()->>'email' = 'admin@gmail.com' THEN 'admin'
      WHEN auth.role() = 'authenticated' THEN 'user'
      ELSE 'guest'
    END
  );
$$;

-- 5. Trigger for automatic profile & vendor record creation on Supabase Sign Up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role text;
  user_shop_name text;
BEGIN
  user_role := COALESCE(new.raw_user_meta_data->>'role', 'user');
  user_shop_name := COALESCE(
    new.raw_user_meta_data->>'shop_name',
    new.raw_user_meta_data->>'full_name',
    'Цветочный салон'
  );

  -- Upsert into profiles
  INSERT INTO public.profiles (id, email, full_name, phone, role, address, city)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    user_role,
    COALESCE(new.raw_user_meta_data->>'address', ''),
    COALESCE(new.raw_user_meta_data->>'city', 'Бишкек')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = CASE WHEN EXCLUDED.full_name <> '' THEN EXCLUDED.full_name ELSE public.profiles.full_name END,
    role = COALESCE(public.profiles.role, EXCLUDED.role),
    updated_at = now();

  -- If registered as vendor, automatically initialize vendor profile
  IF user_role = 'vendor' THEN
    INSERT INTO public.vendors (id, name, phone, email, address, city, description, status)
    VALUES (
      new.id,
      user_shop_name,
      COALESCE(new.raw_user_meta_data->>'phone', ''),
      new.email,
      COALESCE(new.raw_user_meta_data->>'address', ''),
      COALESCE(new.raw_user_meta_data->>'city', 'Бишкек'),
      COALESCE(new.raw_user_meta_data->>'description', ''),
      'approved'
    )
    ON CONFLICT (id) DO UPDATE SET
      name = COALESCE(public.vendors.name, EXCLUDED.name),
      email = EXCLUDED.email,
      updated_at = now();
  END IF;

  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed existing trial admin account into profiles if exists
INSERT INTO public.profiles (id, email, full_name, role)
SELECT id, email, 'Главный Администратор', 'admin'
FROM auth.users
WHERE email = 'admin@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- ── PROFILES POLICIES ───────────────────────────────────────
DROP POLICY IF EXISTS "own profile read" ON public.profiles;
CREATE POLICY "own profile read"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "own profile update" ON public.profiles;
CREATE POLICY "own profile update"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (
    -- Non-admins cannot elevate their own role to admin
    (auth.uid() = id AND role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid()))
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "profile insert" ON public.profiles;
CREATE POLICY "profile insert"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id OR public.is_admin());

-- ── VENDORS POLICIES ────────────────────────────────────────
-- Guests & buyers can view active/approved vendors
DROP POLICY IF EXISTS "public read approved vendors" ON public.vendors;
CREATE POLICY "public read approved vendors"
  ON public.vendors FOR SELECT
  USING (status = 'approved');

-- Vendor can view their own store record regardless of status (even if pending/blocked)
DROP POLICY IF EXISTS "vendors read own store" ON public.vendors;
CREATE POLICY "vendors read own store"
  ON public.vendors FOR SELECT
  USING (auth.uid() = id);

-- Admin can view all vendors
DROP POLICY IF EXISTS "admin read all vendors" ON public.vendors;
CREATE POLICY "admin read all vendors"
  ON public.vendors FOR SELECT
  USING (public.is_admin());

-- Vendor can self-register their vendor profile
DROP POLICY IF EXISTS "vendors insert own store" ON public.vendors;
CREATE POLICY "vendors insert own store"
  ON public.vendors FOR INSERT
  WITH CHECK (auth.uid() = id OR public.is_admin());

-- Vendor can update their own shop profile (cannot change status unless admin)
DROP POLICY IF EXISTS "vendors update own store" ON public.vendors;
CREATE POLICY "vendors update own store"
  ON public.vendors FOR UPDATE
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (
    (auth.uid() = id AND status = (SELECT v.status FROM public.vendors v WHERE v.id = auth.uid()))
    OR public.is_admin()
  );

-- Only admin can delete vendor stores
DROP POLICY IF EXISTS "admin delete vendors" ON public.vendors;
CREATE POLICY "admin delete vendors"
  ON public.vendors FOR DELETE
  USING (public.is_admin());

-- ── PRODUCTS POLICIES (ISOLATION & SECURITY) ────────────────
-- 1. Public & Buyers: SELECT active products from approved vendors (or platform products)
DROP POLICY IF EXISTS "public read active products" ON public.products;
CREATE POLICY "public read active products"
  ON public.products FOR SELECT
  USING (
    active = true
    AND (
      vendor_id IS NULL
      OR EXISTS (
        SELECT 1 FROM public.vendors v
        WHERE v.id = products.vendor_id AND v.status = 'approved'
      )
    )
  );

-- 2. Vendor Isolation: Vendor can view ALL their own products (including drafts & inactive)
DROP POLICY IF EXISTS "vendor read own products" ON public.products;
CREATE POLICY "vendor read own products"
  ON public.products FOR SELECT
  USING (auth.uid() = vendor_id);

-- 3. Vendor Insert: Vendor can only create products for their own store, if not blocked
DROP POLICY IF EXISTS "vendor insert own products" ON public.products;
CREATE POLICY "vendor insert own products"
  ON public.products FOR INSERT
  WITH CHECK (
    auth.uid() = vendor_id
    AND EXISTS (
      SELECT 1 FROM public.vendors v
      WHERE v.id = auth.uid() AND v.status <> 'blocked'
    )
  );

-- 4. Vendor Update: Vendor can only update their own products
DROP POLICY IF EXISTS "vendor update own products" ON public.products;
CREATE POLICY "vendor update own products"
  ON public.products FOR UPDATE
  USING (auth.uid() = vendor_id)
  WITH CHECK (auth.uid() = vendor_id);

-- 5. Vendor Delete: Vendor can only delete their own products
DROP POLICY IF EXISTS "vendor delete own products" ON public.products;
CREATE POLICY "vendor delete own products"
  ON public.products FOR DELETE
  USING (auth.uid() = vendor_id);

-- 6. Admin Full Access: Admin can view, create, edit, delete ANY product
DROP POLICY IF EXISTS "auth full access products" ON public.products;
DROP POLICY IF EXISTS "admin select all products" ON public.products;
CREATE POLICY "admin select all products"
  ON public.products FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "admin insert products" ON public.products;
CREATE POLICY "admin insert products"
  ON public.products FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin update products" ON public.products;
CREATE POLICY "admin update products"
  ON public.products FOR UPDATE
  USING (public.is_admin());

DROP POLICY IF EXISTS "admin delete products" ON public.products;
CREATE POLICY "admin delete products"
  ON public.products FOR DELETE
  USING (public.is_admin());

-- ── SYSTEM SETTINGS & CONTENT PROTECTION ────────────────────
-- Protect settings, banners, and features so only Admin can modify them
DROP POLICY IF EXISTS "auth full access settings" ON public.settings;
DROP POLICY IF EXISTS "admin full access settings" ON public.settings;
CREATE POLICY "admin full access settings"
  ON public.settings FOR ALL
  USING (public.is_admin());

DROP POLICY IF EXISTS "auth full access banners" ON public.banners;
DROP POLICY IF EXISTS "admin full access banners" ON public.banners;
CREATE POLICY "admin full access banners"
  ON public.banners FOR ALL
  USING (public.is_admin());

DROP POLICY IF EXISTS "auth full access features" ON public.features;
DROP POLICY IF EXISTS "admin full access features" ON public.features;
CREATE POLICY "admin full access features"
  ON public.features FOR ALL
  USING (public.is_admin());

-- ============================================================
-- СОЗДАНИЕ АДМИНИСТРАТОРА
-- Выполнить ПОСЛЕ создания пользователя admin@gmail.com
-- через Authentication → Users в Supabase Dashboard
-- ============================================================
INSERT INTO public.profiles (id, email, full_name, role)
SELECT id, email, 'Главный Администратор', 'admin'
FROM auth.users
WHERE email = 'admin@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  role      = 'admin',
  full_name = 'Главный Администратор',
  updated_at = now();
