/* ═══════════════════════════════════════════════════════════════════════════
   JADEER — CENTRALIZED SUPABASE BROWSER CLIENT
   ─────────────────────────────────────────────────────────────────────────
   Official Supabase client for browser-side PostgREST, Auth, and RPC operations.
   - Uses VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY only.
   - Never exposes service-role keys or database credentials in client code.
   - Operates under PostgreSQL Row Level Security (RLS) policies.
   ═══════════════════════════════════════════════════════════════════════════ */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL?.trim()) ||
  (typeof process !== 'undefined' && process.env.VITE_SUPABASE_URL?.trim()) ||
  '';
const supabaseAnonKey =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY?.trim()) ||
  (typeof process !== 'undefined' && process.env.VITE_SUPABASE_ANON_KEY?.trim()) ||
  '';

/**
 * Checks whether legitimate hosted Supabase credentials are configured.
 */
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  supabaseAnonKey !== 'your-supabase-anon-key'
);

/**
 * Factory to get an authenticated Supabase client.
 * If a custom user JWT (e.g. from Clerk or custom session) is provided,
 * it attaches the Bearer token to authorize RLS policies.
 */
export function getSupabaseClient(jwt?: string | null): SupabaseClient {
  const url = supabaseUrl || 'https://placeholder.supabase.co';
  const key = supabaseAnonKey || 'placeholder-anon-key';

  const headers: Record<string, string> = {};
  if (jwt) {
    headers['Authorization'] = `Bearer ${jwt}`;
  }

  return createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      headers,
    },
  });
}

/**
 * Singleton Supabase browser client initialized with public anon key.
 */
export const supabase: SupabaseClient = getSupabaseClient();

export default supabase;
