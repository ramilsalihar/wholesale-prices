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
