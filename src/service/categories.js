import { supabase } from './supabase.js';

export async function fetchCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort');
  if (error) throw error;
  return data;
}

export async function upsertCategory(cat) {
  const { data, error } = await supabase
    .from('categories')
    .upsert(cat)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCategory(id) {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}
