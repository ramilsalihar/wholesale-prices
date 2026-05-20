import { supabase } from './supabase.js';

export const ORDER_STATUSES = [
  { key: 'new',       label: 'Новый',       color: '#FF8B00', bg: 'rgba(255,139,0,0.1)'  },
  { key: 'confirmed', label: 'Подтверждён', color: '#0052CC', bg: 'rgba(0,82,204,0.1)'   },
  { key: 'shipped',   label: 'Отправлен',   color: '#6554C0', bg: 'rgba(101,84,192,0.1)' },
  { key: 'delivered', label: 'Доставлен',   color: '#00875A', bg: 'rgba(0,135,90,0.1)'   },
  { key: 'cancelled', label: 'Отменён',     color: '#DE350B', bg: 'rgba(222,53,11,0.1)'  },
];

export function statusInfo(key) {
  return ORDER_STATUSES.find(s => s.key === key) ?? ORDER_STATUSES[0];
}

export async function createOrder({
  items, subtotal, delivery, total,
  phone, address, city,
  payMethod, deliveryMethod,
  userName, email, userId, notes,
}) {
  const { data, error } = await supabase
    .from('orders')
    .insert([{
      user_id:         userId   ?? null,
      user_name:       userName ?? null,
      email:           email    ?? null,
      phone,
      address:         address  ?? null,
      city:            city     ?? null,
      notes:           notes    ?? null,
      items,
      subtotal,
      delivery,
      total,
      pay_method:      payMethod,
      delivery_method: deliveryMethod,
      status:          'new',
    }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchOrderById(id) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function updateOrderStatus(id, status) {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
}
