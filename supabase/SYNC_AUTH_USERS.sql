-- ============================================================
-- Flowo — SYNC: Copy existing auth.users into profiles + vendors
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
-- This has access to auth.users because it runs as postgres
-- ============================================================

-- Step 1: Insert all auth.users into profiles (those not already there)
INSERT INTO public.profiles (id, email, full_name, phone, role, city)
SELECT
  u.id,
  u.email,
  COALESCE(
    u.raw_user_meta_data->>'full_name',
    u.raw_user_meta_data->>'name',
    SPLIT_PART(u.email, '@', 1)
  ) as full_name,
  COALESCE(u.raw_user_meta_data->>'phone', '') as phone,
  COALESCE(u.raw_user_meta_data->>'role', 'user') as role,
  COALESCE(u.raw_user_meta_data->>'city', 'Бишкек') as city
FROM auth.users u
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = CASE WHEN public.profiles.full_name IS NULL OR public.profiles.full_name = '' 
                   THEN EXCLUDED.full_name ELSE public.profiles.full_name END,
  role = CASE WHEN public.profiles.role = 'user' AND EXCLUDED.role <> 'user' 
              THEN EXCLUDED.role ELSE public.profiles.role END,
  updated_at = now();

-- Step 2: Make sure admin@gmail.com has admin role
UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@gmail.com';

-- Step 3: Insert vendor users into vendors table
INSERT INTO public.vendors (id, name, phone, email, city, address, description, status, tier)
SELECT
  u.id,
  COALESCE(
    NULLIF(u.raw_user_meta_data->>'shop_name', ''),
    NULLIF(u.raw_user_meta_data->>'full_name', ''),
    SPLIT_PART(u.email, '@', 1),
    'Цветочный салон'
  ) as name,
  COALESCE(u.raw_user_meta_data->>'phone', '') as phone,
  u.email,
  COALESCE(u.raw_user_meta_data->>'city', 'Бишкек') as city,
  COALESCE(u.raw_user_meta_data->>'address', '') as address,
  COALESCE(u.raw_user_meta_data->>'description', '') as description,
  'approved' as status,
  'small' as tier
FROM auth.users u
WHERE COALESCE(u.raw_user_meta_data->>'role', 'user') = 'vendor'
ON CONFLICT (id) DO UPDATE SET
  name = CASE WHEN public.vendors.name IS NULL OR public.vendors.name = '' 
              THEN EXCLUDED.name ELSE public.vendors.name END,
  email = EXCLUDED.email,
  updated_at = now();

-- Step 4: Show results
SELECT '=== RESULTS ===' as info, '' as value
UNION ALL
SELECT 'Total users in auth', COUNT(*)::text FROM auth.users
UNION ALL
SELECT 'Users in profiles', COUNT(*)::text FROM public.profiles
UNION ALL
SELECT 'Vendors in profiles (role=vendor)', COUNT(*)::text FROM public.profiles WHERE role = 'vendor'
UNION ALL
SELECT 'Admins in profiles (role=admin)', COUNT(*)::text FROM public.profiles WHERE role = 'admin'
UNION ALL
SELECT 'Vendors in vendors table', COUNT(*)::text FROM public.vendors;
