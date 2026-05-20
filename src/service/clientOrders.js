import { clientSupabase } from './clientSupabase.js';
import { ORDER_STATUSES, statusInfo } from './orders.js';

export { ORDER_STATUSES, statusInfo };

export async function fetchMyOrders() {
  const { data: { user } } = await clientSupabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await clientSupabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}
