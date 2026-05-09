import { supabase } from './supabase.js';

export async function fetchBanners() {
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .eq('active', true);
  if (error) throw error;
  return data;
}

export async function fetchAllBanners() {
  const { data, error } = await supabase.from('banners').select('*');
  if (error) throw error;
  return data;
}

export async function upsertBanner(banner) {
  const { data, error } = await supabase
    .from('banners')
    .upsert(banner)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function toggleBannerActive(id, active) {
  const { error } = await supabase.from('banners').update({ active }).eq('id', id);
  if (error) throw error;
}
