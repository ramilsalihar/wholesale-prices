-- Fix vendor bouquet creation: the form stores product descriptions.
-- Safe to run more than once.
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS images text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS sku text,
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS vendor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS active boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS hit boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS cat text,
  ADD COLUMN IF NOT EXISTS vol text,
  ADD COLUMN IF NOT EXISTS old integer;

-- Refresh PostgREST's schema cache so the new column is available immediately.
NOTIFY pgrst, 'reload schema';
