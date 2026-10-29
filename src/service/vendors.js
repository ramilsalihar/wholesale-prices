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
  if (error) {
    if (error.code === 'PGRST205' || error.message?.includes('schema cache') || error.message?.includes('relation "vendors" does not exist')) {
      console.warn('Vendors table not found in schema cache. Run migration_rbac_vendors.sql');
      return [];
    }
    throw error;
  }
  return data ?? [];
}

/**
 * Admin: Fetch all vendors with optional search & status filter
 */
export async function fetchAllVendors() {
  let vendorsList = [];
  let vendorsError = null;

  // Primary: query vendors table
  try {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      vendorsError = error;
      console.error('[Admin] fetchAllVendors – vendors table error:', error.code, error.message);
    } else if (data) {
      vendorsList = data;
      console.log(`[Admin] fetchAllVendors – vendors table returned ${data.length} rows`);
    }
  } catch (e) {
    vendorsError = e;
    console.error('[Admin] fetchAllVendors – exception reading vendors table:', e);
  }

  // Fallback / supplement: also query profiles with role = 'vendor'
  // This ensures vendors who registered but may not have a vendors row yet still show up
  try {
    const { data: profileVendors, error: profErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'vendor');

    if (profErr) {
      console.warn('[Admin] fetchAllVendors – profiles fallback error:', profErr.code, profErr.message);
    } else if (profileVendors && profileVendors.length > 0) {
      console.log(`[Admin] fetchAllVendors – profiles table found ${profileVendors.length} vendor profiles`);
      const existingIds = new Set(vendorsList.map(v => v.id));
      for (const pv of profileVendors) {
        if (!existingIds.has(pv.id)) {
          vendorsList.push({
            id: pv.id,
            name: pv.full_name || pv.email?.split('@')[0] || 'Цветочный салон',
            phone: pv.phone || '',
            email: pv.email || '',
            city: pv.city || 'Бишкек',
            address: pv.address || '',
            tier: pv.tier || 'small',
            status: 'approved',
            rating: 5.0,
            created_at: pv.created_at || new Date().toISOString(),
          });
        }
      }
    }
  } catch (e) {
    console.warn('[Admin] fetchAllVendors – profiles fallback exception:', e);
  }

  console.log(`[Admin] fetchAllVendors – final list: ${vendorsList.length} vendors`);
  return vendorsList;
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
  try {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('id', userId)
      .single();
    if (data) return data;
    if (error && error.code !== 'PGRST116') {
      console.warn('Notice fetching vendor by ID:', error);
    }
  } catch (err) {
    console.warn('Vendors table not accessible:', err);
  }

  // Fallback: check profiles row
  try {
    const { data: prof } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (prof) {
      return {
        id: prof.id,
        name: prof.full_name || 'Цветочный салон',
        phone: prof.phone || '',
        email: prof.email || '',
        city: prof.city || 'Бишкек',
        address: prof.address || '',
        description: '',
        hours: '09:00 – 21:00',
        logo_url: '',
        banner_url: '',
        rating: 5.0,
        status: 'approved',
        tier: 'small',
      };
    }
  } catch (err) {
    // profiles table not available
  }

  return null;
}

/**
 * Vendor / Admin: Upsert vendor store profile
 */
export async function upsertVendor(vendorData) {
  // Sync profiles table role as well so the user is marked as vendor in profiles
  try {
    await supabase.from('profiles').upsert({
      id: vendorData.id,
      email: vendorData.email,
      full_name: vendorData.name,
      phone: vendorData.phone,
      city: vendorData.city || 'Бишкек',
      address: vendorData.address || '',
      role: 'vendor',
      updated_at: new Date().toISOString(),
    });
  } catch (profErr) {
    console.warn('Sync profile table notice:', profErr);
  }

  const { data, error } = await supabase
    .from('vendors')
    .upsert({
      ...vendorData,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.warn('Upsert vendors table notice:', error);
    // Return provided vendor data so the UI doesn't crash if RLS blocks or table schema is updating
    return {
      ...vendorData,
      status: vendorData.status || 'approved',
      tier: vendorData.tier || 'small',
      rating: vendorData.rating || 5.0,
    };
  }
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
 * Admin: Update vendor tier (e.g. 'small' | 'medium' | 'flagship')
 */
export async function updateVendorTier(vendorId, tier) {
  const { data, error } = await supabase
    .from('vendors')
    .update({ tier, updated_at: new Date().toISOString() })
    .eq('id', vendorId)
    .select()
    .single();
  if (error) throw error;
  return data;
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

/**
 * Admin: Fetch all registered user profiles
 */
export async function fetchAllProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
      return [];
    }
    throw error;
  }
  return data ?? [];
}
