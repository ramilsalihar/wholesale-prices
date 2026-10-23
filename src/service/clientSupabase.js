import { supabase } from './supabase.js';

// Export shared supabase client to guarantee unified session across storefront and vendor portal
export const clientSupabase = supabase;
