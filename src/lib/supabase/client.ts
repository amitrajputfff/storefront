import { createClient } from "@supabase/supabase-js";

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
}

/** Server-only client — uses the anon key, relying on RLS to restrict the
 * newsletter table to insert-only for anonymous requests. */
export function getSupabaseServerClient() {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured — set SUPABASE_URL and SUPABASE_ANON_KEY in .env.local",
    );
  }

  return createClient(url, anonKey, {
    auth: { persistSession: false },
  });
}
