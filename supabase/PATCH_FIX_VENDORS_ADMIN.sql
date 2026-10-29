-- ============================================================
-- Flowo — PATCH: Fix Vendors Admin Panel + Admin Role
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

-- 1. Create profiles table if not exists
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

-- Ensure all necessary columns exist (safe if already present)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city text DEFAULT 'Бишкек';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- 2. Create vendors table if not exists
CREATE TABLE IF NOT EXISTS public.vendors (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name text NOT NULL DEFAULT 'Цветочный салон',
  description text,
  phone text,
  email text,
  address text,
  city text DEFAULT 'Бишкек',
  hours text DEFAULT '09:00 – 21:00',
  logo_url text,
  banner_url text,
  rating float4 DEFAULT 5.0,
  reviews_count int4 DEFAULT 0,
  status text NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected', 'blocked')),
  tier text NOT NULL DEFAULT 'small' CHECK (tier IN ('small', 'medium', 'flagship')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ensure all necessary columns exist (safe if already present)
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

-- 3. Add vendor_id to products table if it exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'products') THEN
    BEGIN
      ALTER TABLE public.products ADD COLUMN IF NOT EXISTS vendor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
    EXCEPTION WHEN others THEN
      -- ignore if foreign key already exists
    END;
  END IF;
END $$;

-- 4. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors  ENABLE ROW LEVEL SECURITY;

-- 5. Create is_admin() helper function
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

-- 6. Profiles RLS policies
DROP POLICY IF EXISTS "own profile read"    ON public.profiles;
DROP POLICY IF EXISTS "admin read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "own profile update"  ON public.profiles;
DROP POLICY IF EXISTS "profile insert"      ON public.profiles;

CREATE POLICY "own profile read" ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "admin read all profiles" ON public.profiles FOR SELECT
  USING (public.is_admin());

CREATE POLICY "own profile update" ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "profile insert" ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id OR public.is_admin());

-- 7. Vendors RLS policies
DROP POLICY IF EXISTS "public read approved vendors" ON public.vendors;
DROP POLICY IF EXISTS "vendors read own store"       ON public.vendors;
DROP POLICY IF EXISTS "admin read all vendors"       ON public.vendors;
DROP POLICY IF EXISTS "vendors insert own store"     ON public.vendors;
DROP POLICY IF EXISTS "vendors update own store"     ON public.vendors;
DROP POLICY IF EXISTS "admin delete vendors"         ON public.vendors;

CREATE POLICY "public read approved vendors" ON public.vendors FOR SELECT
  USING (status = 'approved');

CREATE POLICY "vendors read own store" ON public.vendors FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "admin read all vendors" ON public.vendors FOR SELECT
  USING (public.is_admin());

CREATE POLICY "vendors insert own store" ON public.vendors FOR INSERT
  WITH CHECK (auth.uid() = id OR public.is_admin());

CREATE POLICY "vendors update own store" ON public.vendors FOR UPDATE
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "admin delete vendors" ON public.vendors FOR DELETE
  USING (public.is_admin());

-- 8. Set admin@gmail.com as admin in profiles
INSERT INTO public.profiles (id, email, full_name, role)
SELECT id, email, 'Главный Администратор', 'admin'
FROM auth.users
WHERE email = 'admin@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin', updated_at = now();

-- 9. Sync all existing vendor profiles into vendors table
INSERT INTO public.vendors (id, name, phone, email, city, address, status, tier)
SELECT
  p.id,
  COALESCE(NULLIF(p.full_name, ''), SPLIT_PART(p.email, '@', 1), 'Цветочный салон') AS name,
  COALESCE(p.phone, '') AS phone,
  COALESCE(p.email, '') AS email,
  COALESCE(p.city, 'Бишкек') AS city,
  COALESCE(p.address, '') AS address,
  'approved' AS status,
  'small' AS tier
FROM public.profiles p
WHERE p.role = 'vendor'
ON CONFLICT (id) DO UPDATE SET
  name = CASE WHEN public.vendors.name IS NULL OR public.vendors.name = '' THEN EXCLUDED.name ELSE public.vendors.name END,
  email = COALESCE(EXCLUDED.email, public.vendors.email),
  updated_at = now();

-- 10. Trigger for auto-creating profile + vendor on signup
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

  INSERT INTO public.profiles (id, email, full_name, phone, role, address, city)
  VALUES (
    new.id, new.email,
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

  IF user_role = 'vendor' THEN
    INSERT INTO public.vendors (id, name, phone, email, address, city, description, status, tier)
    VALUES (
      new.id, user_shop_name,
      COALESCE(new.raw_user_meta_data->>'phone', ''),
      new.email,
      COALESCE(new.raw_user_meta_data->>'address', ''),
      COALESCE(new.raw_user_meta_data->>'city', 'Бишкек'),
      COALESCE(new.raw_user_meta_data->>'description', ''),
      'approved', 'small'
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

-- Done! Show results:
SELECT 'admin profiles'  AS result, COUNT(*)::text AS count FROM public.profiles WHERE role = 'admin'
UNION ALL
SELECT 'vendor profiles' AS result, COUNT(*)::text AS count FROM public.profiles WHERE role = 'vendor'
UNION ALL
SELECT 'vendors in table', COUNT(*)::text FROM public.vendors;
