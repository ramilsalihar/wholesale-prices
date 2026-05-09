import { supabase } from './supabase.js';

export async function createOrder({ items, subtotal, delivery, total, phone, address, payMethod, deliveryMethod }) {
  const { data, error } = await supabase.from('orders').insert([{
    items,
    subtotal,
    delivery,
    total,
    phone,
    address,
    pay_method: payMethod,
    delivery_method: deliveryMethod,
    status: 'new',
    created_at: new Date().toISOString(),
  }]).select().single();
  if (error) throw error;
  return data;
}

export async function fetchOrders() {
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}
