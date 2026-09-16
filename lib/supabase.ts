import { createClient } from '@supabase/supabase-js';

export function dbAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase is not configured.');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

// Backward compatibility for V1 files that may still exist in upload-based deployments.
// V2 uses dbAdmin(); older routes imported and called `admin()`.
export function admin() {
  return dbAdmin();
}
