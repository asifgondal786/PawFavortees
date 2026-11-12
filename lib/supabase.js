// SERVER + CLIENT Supabase clients.
// Keys .env mein: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
// SUPABASE_SERVICE_ROLE_KEY (SERVER ONLY — kabhi client bundle mein na jaye).
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Browser/public data (products read) ke liye
export function getSupabase() {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey);
}

// Server-only (API routes: orders create, admin ops) — RLS bypass
export function getSupabaseAdmin() {
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

export const supabaseConfigured = Boolean(url && anonKey);
