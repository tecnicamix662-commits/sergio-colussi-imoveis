/**
 * Supabase Server Client (service_role)
 * Usado APENAS nas API Routes (server-side) para acessar o banco de dados.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

let _client: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!_client) {
    _client = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return _client;
}

export const SUPABASE_URL = supabaseUrl;
export const STORAGE_BUCKET = 'imoveis';
