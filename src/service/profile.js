// Run this SQL in Supabase SQL editor once:
//
// create table if not exists profiles (
//   id uuid references auth.users(id) on delete cascade primary key,
//   full_name text,
//   phone text,
//   address text,
//   city text,
//   updated_at timestamptz default now()
// );
// alter table profiles enable row level security;
// create policy "own profile" on profiles for all
//   using (auth.uid() = id) with check (auth.uid() = id);

import { clientSupabase } from './clientSupabase.js';

export async function fetchProfile(userId) {
  const { data, error } = await clientSupabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data ?? null;
}

export async function upsertProfile(userId, fields) {
  const { data, error } = await clientSupabase
    .from('profiles')
    .upsert({ id: userId, ...fields, updated_at: new Date().toISOString() })
    .select()
    .single();
  if (error) throw error;
  return data;
}
