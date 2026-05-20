import { clientSupabase } from './clientSupabase.js';

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
