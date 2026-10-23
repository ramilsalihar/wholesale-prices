import { supabase } from './supabase.js';

/**
 * Fetch products belonging strictly to this vendor
 */
export async function fetchVendorProducts(vendorId) {
  if (!vendorId) return [];
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('vendor_id', vendorId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

/**
 * Create or update a product for this vendor, ensuring vendor_id = auth.uid()
 */
export async function upsertVendorProduct(product, vendorId) {
  if (!vendorId) throw new Error('vendor_id is required');

  const id = product.id || `flw_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
  
  const payload = {
    ...product,
    id,
    vendor_id: vendorId,
    // Normalize images: store both image_url and images array for cross-compatibility
    image_url: product.image_url || (Array.isArray(product.images) ? product.images[0] : null) || '',
    images: Array.isArray(product.images) && product.images.length > 0 
      ? product.images 
      : (product.image_url ? [product.image_url] : []),
  };

  const { data, error } = await supabase
    .from('products')
    .upsert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete a product belonging to this vendor
 */
export async function deleteVendorProduct(productId, vendorId) {
  if (!productId) throw new Error('productId is required');
  let query = supabase.from('products').delete().eq('id', productId);
  if (vendorId) {
    query = query.eq('vendor_id', vendorId);
  }
  const { error } = await query;
  if (error) throw error;
}

/**
 * Toggle product publication status (active = true / false)
 */
export async function toggleVendorProductActive(productId, active, vendorId) {
  let query = supabase.from('products').update({ active }).eq('id', productId);
  if (vendorId) {
    query = query.eq('vendor_id', vendorId);
  }
  const { error } = await query;
  if (error) throw error;
}
