import { supabase } from './supabase.js';

export async function fetchBrands() {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('active', true)
    .order('sort');
  if (error) throw error;
  return data;
}

export async function fetchAllBrands() {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .order('sort');
  if (error) throw error;
  return data;
}

export async function upsertBrand(brand) {
  const { data, error } = await supabase
    .from('brands')
    .upsert(brand)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteBrand(id) {
  const { error } = await supabase.from('brands').delete().eq('id', id);
  if (error) throw error;
}

export async function toggleBrandActive(id, active) {
  const { error } = await supabase.from('brands').update({ active }).eq('id', id);
  if (error) throw error;
}
