import { supabase } from './supabase.js';

export async function fetchFeatures() {
  const { data, error } = await supabase
    .from('features')
    .select('*')
    .eq('active', true)
    .order('sort', { ascending: true });
  if (error) throw error;
  return data;
}

export async function fetchAllFeatures() {
  const { data, error } = await supabase
    .from('features')
    .select('*')
    .order('sort', { ascending: true });
  if (error) throw error;
  return data;
}

export async function upsertFeature(feature) {
  const { data, error } = await supabase
    .from('features')
    .upsert(feature)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function toggleFeatureActive(id, active) {
  const { error } = await supabase.from('features').update({ active }).eq('id', id);
  if (error) throw error;
}

export async function deleteFeature(id) {
  const { error } = await supabase.from('features').delete().eq('id', id);
  if (error) throw error;
}
