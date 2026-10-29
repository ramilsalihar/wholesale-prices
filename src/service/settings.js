import { supabase } from './supabase.js';

const DEFAULTS = {
  id: 'main',
  platform_name: 'Flowo — Цветочный маркетплейс',
  tagline: 'Быстрая доставка свежих букетов от лучших флористов',
  support_phone: '+996 (555) 123-456',
  support_whatsapp: '+996555123456',
  instagram: 'flowo_kg',
  default_city: 'Бишкек',
  free_delivery_threshold: 2000,
  delivery_bishkek: 250,
  delivery_suburbs: 350,
  commission_percent: 10,
  auto_approve_vendors: true,
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
