import { supabase } from './supabase.js';

export async function fetchStores() {
  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .eq('active', true)
    .order('sort');
  if (error) throw error;
  return data;
}

export async function fetchAllStores() {
  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .order('sort');
  if (error) throw error;
  return data;
}

export async function upsertStore(store) {
  const { data, error } = await supabase
    .from('stores')
    .upsert(store)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteStore(id) {
  const { error } = await supabase.from('stores').delete().eq('id', id);
  if (error) throw error;
}

export async function toggleStoreActive(id, active) {
  const { error } = await supabase.from('stores').update({ active }).eq('id', id);
  if (error) throw error;
}
