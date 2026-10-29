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
  tier text NOT NULL DEFAULT 'small' CHECK (tier IN ('small', 'medium', 'flagship')),  -- Масштаб магазина
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
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS tier text NOT NULL DEFAULT 'small';
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
