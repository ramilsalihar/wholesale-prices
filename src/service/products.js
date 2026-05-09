import { supabase } from './supabase.js';

export async function fetchProducts() {
  const { data, error } = await supabase.from('products').select('*');
  if (error) throw error;
  return data;
}

export async function fetchProductById(id) {
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function fetchProductsByCategory(cat) {
  const { data, error } = await supabase.from('products').select('*').eq('cat', cat);
  if (error) throw error;
  return data;
}
