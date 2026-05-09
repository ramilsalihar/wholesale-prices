import { supabase } from './supabase.js';

export async function fetchProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('id');
  if (error) throw error;
  return data;
}

export async function fetchAllProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id');
  if (error) throw error;
  return data;
}

export async function fetchProductById(id) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function fetchProductsByCategory(cat) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('cat', cat)
    .eq('active', true);
  if (error) throw error;
  return data;
}

export async function upsertProduct(product) {
  const { data, error } = await supabase
    .from('products')
    .upsert(product)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProduct(id, updates) {
  const { error } = await supabase.from('products').update(updates).eq('id', id);
  if (error) throw error;
}

export async function toggleProductActive(id, active) {
  const { error } = await supabase.from('products').update({ active }).eq('id', id);
  if (error) throw error;
}
