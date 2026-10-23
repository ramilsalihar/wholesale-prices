import { clientSupabase } from './clientSupabase.js';
import { upsertVendor } from './vendors.js';

export async function signInWithEmail(email, password) {
  const { data, error } = await clientSupabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error) throw error;
  return data;
}

export async function signUpWithRole({ email, password, fullName = '', phone = '', role = 'user', shopName = '' }) {
  const { data, error } = await clientSupabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        role,
        full_name: fullName.trim(),
        phone: phone.trim(),
        shop_name: role === 'vendor' ? (shopName.trim() || fullName.trim() || 'Цветочный салон') : null,
      },
    },
  });
  if (error) throw error;

  const user = data?.user;
  if (user) {
    try {
      // Sync profiles row
      await clientSupabase.from('profiles').upsert({
        id: user.id,
        email: user.email,
        full_name: fullName.trim(),
        phone: phone.trim(),
        role,
        updated_at: new Date().toISOString(),
      });

      // If registered as vendor, also initialize vendors record
      if (role === 'vendor') {
        await upsertVendor({
          id: user.id,
          name: shopName.trim() || fullName.trim() || 'Цветочный салон',
          phone: phone.trim(),
          email: user.email,
          status: 'approved',
        });
      }
    } catch (e) {
      console.warn('Sync profile error:', e);
    }
  }

  return data;
}

export async function signInWithPhone(phone) {
  const { data, error } = await clientSupabase.auth.signInWithOtp({ phone });
  if (error) throw error;
  return data;
}

export async function verifyOtp(phone, token) {
  const { data, error } = await clientSupabase.auth.verifyOtp({ phone, token, type: 'sms' });
  if (error) throw error;
  return data;
}

export async function signInWithGoogle(idToken) {
  const { data, error } = await clientSupabase.auth.signInWithIdToken({
    provider: 'google',
    token: idToken,
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await clientSupabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data: { session } } = await clientSupabase.auth.getSession();
  return session;
}

export function onAuthStateChange(callback) {
  return clientSupabase.auth.onAuthStateChange((_event, session) => callback(session));
}
