"use server";

import { getSupabaseAdminClient } from "@/lib/supabase/admin-client";
import { requireAdminSession } from "./require-session";

const BUCKET = "site-media";
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;

export interface MediaItem {
  id: string;
  url: string;
  altText: string;
  width: number | null;
  height: number | null;
  mimeType: string | null;
  sizeBytes: number | null;
  folder: string;
  uploadedAt: string;
}

export type MediaActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string };

/** Client uploads directly to Supabase Storage via this signed URL — Server
 * Actions cap around 1MB, and hero photography is bigger. */
export async function createMediaUploadUrl(input: {
  fileName: string;
  contentType: string;
  folder?: string;
}): Promise<MediaActionResult<{ path: string; token: string }>> {
  await requireAdminSession();

  if (!ALLOWED_MIME_TYPES.has(input.contentType)) {
    return { ok: false, error: "Unsupported file type — use JPEG, PNG, WebP, or AVIF." };
  }

  const ext = input.fileName.split(".").pop() || "bin";
  const folder = input.folder && /^[a-z0-9-]+$/.test(input.folder) ? input.folder : "general";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUploadUrl(path);
  if (error || !data) return { ok: false, error: error?.message ?? "Could not create upload URL." };

  return { ok: true, data: { path, token: data.token } };
}

export async function registerMedia(input: {
  path: string;
  altText: string;
  width?: number;
  height?: number;
  mimeType?: string;
  sizeBytes?: number;
  folder?: string;
}): Promise<MediaActionResult<MediaItem>> {
  await requireAdminSession();

  if (input.sizeBytes && input.sizeBytes > MAX_FILE_SIZE_BYTES) {
    return { ok: false, error: "File is too large (max 8MB)." };
  }

  const supabase = getSupabaseAdminClient();
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(input.path);

  const { data, error } = await supabase
    .from("media")
    .insert({
      bucket: BUCKET,
      path: input.path,
      public_url: publicUrl,
      alt_text: input.altText,
      width: input.width,
      height: input.height,
      mime_type: input.mimeType,
      size_bytes: input.sizeBytes,
      folder: input.folder ?? "general",
    })
    .select("id, public_url, alt_text, width, height, mime_type, size_bytes, folder, uploaded_at")
    .single();

  if (error || !data) return { ok: false, error: error?.message ?? "Could not save upload." };

  return {
    ok: true,
    data: {
      id: data.id,
      url: data.public_url,
      altText: data.alt_text,
      width: data.width,
      height: data.height,
      mimeType: data.mime_type,
      sizeBytes: data.size_bytes,
      folder: data.folder,
      uploadedAt: data.uploaded_at,
    },
  };
}

export async function listMedia(input?: { search?: string; limit?: number }): Promise<MediaActionResult<MediaItem[]>> {
  await requireAdminSession();

  const supabase = getSupabaseAdminClient();
  let query = supabase
    .from("media")
    .select("id, public_url, alt_text, width, height, mime_type, size_bytes, folder, uploaded_at")
    .is("deleted_at", null)
    .order("uploaded_at", { ascending: false })
    .limit(input?.limit ?? 60);

  if (input?.search) {
    query = query.or(`alt_text.ilike.%${input.search}%,path.ilike.%${input.search}%`);
  }

  const { data, error } = await query;
  if (error) return { ok: false, error: error.message };

  return {
    ok: true,
    data: (data ?? []).map((r) => ({
      id: r.id,
      url: r.public_url,
      altText: r.alt_text,
      width: r.width,
      height: r.height,
      mimeType: r.mime_type,
      sizeBytes: r.size_bytes,
      folder: r.folder,
      uploadedAt: r.uploaded_at,
    })),
  };
}

export async function updateMediaAlt(id: string, altText: string): Promise<MediaActionResult> {
  await requireAdminSession();
  const { error } = await getSupabaseAdminClient().from("media").update({ alt_text: altText }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: undefined };
}

/** Soft delete only — image URLs are denormalised into content jsonb, so a
 * hard delete could silently break a page that still references it. */
export async function deleteMedia(id: string): Promise<MediaActionResult> {
  await requireAdminSession();
  const { error } = await getSupabaseAdminClient()
    .from("media")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: undefined };
}
