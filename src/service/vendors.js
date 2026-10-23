import { supabase } from './supabase.js';

/**
 * Public: Fetch all approved/active vendors for buyers & storefront
 */
export async function fetchVendors() {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

/**
 * Admin: Fetch all vendors with optional search & status filter
 */
export async function fetchAllVendors() {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

/**
 * Get vendor profile by ID
 */
export async function fetchVendorById(id) {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('id', id)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data ?? null;
}

/**
 * Vendor: Fetch current authenticated vendor's store profile
 */
export async function fetchCurrentVendor(userId) {
  if (!userId) return null;
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('id', userId)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data ?? null;
}

/**
 * Vendor / Admin: Upsert vendor store profile
 */
export async function upsertVendor(vendorData) {
  const { data, error } = await supabase
    .from('vendors')
    .upsert({
      ...vendorData,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * Admin: Update vendor status ('approved' | 'pending' | 'rejected' | 'blocked')
 */
export async function updateVendorStatus(vendorId, status) {
  const { data, error } = await supabase
    .from('vendors')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', vendorId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * Admin: Delete vendor record
 */
export async function deleteVendor(vendorId) {
  const { error } = await supabase
    .from('vendors')
    .delete()
    .eq('id', vendorId);
  if (error) throw error;
}

/**
 * Fetch role of a specific user from profiles
 */
export async function fetchUserRole(userId) {
  if (!userId) return 'guest';
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();
  if (error && error.code !== 'PGRST116') return 'user';
  return data?.role ?? 'user';
}
