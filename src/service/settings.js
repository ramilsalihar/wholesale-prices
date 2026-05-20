import { supabase } from './supabase.js';

const DEFAULTS = {
  id: 'main',
  store_name: 'САМЫЙ БОЛЬШОЙ МАГАЗИН КОСМЕТИКИ В КЫРГЫЗСТАНЕ',
  instagram: 'optovye_ceny01_',
  phone: '8 (312) 123-45-67',
  free_delivery_threshold: 1500,
  delivery_bishkek: 199,
  delivery_osh: 199,
  delivery_regions: 299,
  default_theme: 'magnit',
};

export { DEFAULTS as DEFAULT_SETTINGS };

export async function fetchSettings() {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 'main')
    .single();
  if (error) return DEFAULTS;
  return { ...DEFAULTS, ...data };
}

export async function saveSettings(settings) {
  const { error } = await supabase
    .from('settings')
    .upsert({ ...settings, id: 'main' });
  if (error) throw error;
}
