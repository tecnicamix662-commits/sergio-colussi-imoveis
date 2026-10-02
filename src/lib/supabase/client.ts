import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL } from '../supabase';

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrbGp0dWF4YXhmb3Z5ZmhrZnV3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTc3OTA2NCwiZXhwIjoyMTAxMzU1MDY0fQ.150eAWjmO1Q9-Dh4bZUsicowCSezJWphc4J7k7Zsr2E';

export function createClient() {
  return createSupabaseClient(SUPABASE_URL, supabaseAnonKey);
}
