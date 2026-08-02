"use client";

import { createClient } from "@supabase/supabase-js";

/** Anon-key client for the browser — used only to upload directly to a
 * signed Storage URL (Server Actions cap around 1MB; hero photography is
 * bigger). The signed URL/token themselves are minted server-side by
 * createMediaUploadUrl, so this client never needs elevated privileges. */
export function getSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured for the browser — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local",
    );
  }

  return createClient(url, anonKey, { auth: { persistSession: false } });
}
