"use server";

import { updateTag, revalidatePath } from "next/cache";
import { getSupabaseAdminClient } from "@/lib/supabase/admin-client";
import { CONTENT_REGISTRY, CONTENT_TAG, type ContentKey } from "@/lib/content/registry";
import { requireAdminSession } from "./require-session";

export type ActionResult = { ok: true } | { ok: false; error: string };

async function logRevision(
  entityKey: string,
  action: "save" | "publish" | "revert",
  snapshot: unknown,
  createdBy: string,
): Promise<void> {
  await getSupabaseAdminClient().from("content_revisions").insert({
    entity_type: "site_content",
    entity_key: entityKey,
    action,
    snapshot,
    created_by: createdBy,
  });
}

/** Save Draft deliberately skips schema validation — you can leave a
 * half-finished testimonial overnight. Publish enforces the full schema. */
export async function saveContentDraft(key: ContentKey, value: unknown): Promise<ActionResult> {
  const session = await requireAdminSession();
  const supabase = getSupabaseAdminClient();

  const { error } = await supabase.from("site_content").update({ draft_value: value }).eq("key", key);
  if (error) return { ok: false, error: error.message };

  await logRevision(key, "save", value, session.sub);
  return { ok: true };
}

export async function publishContent(key: ContentKey): Promise<ActionResult> {
  const session = await requireAdminSession();
  const entry = CONTENT_REGISTRY[key];
  const supabase = getSupabaseAdminClient();

  const { data, error: readError } = await supabase
    .from("site_content")
    .select("draft_value")
    .eq("key", key)
    .maybeSingle();
  if (readError) return { ok: false, error: readError.message };

  const parsed = entry.schema.safeParse(data?.draft_value);
  if (!parsed.success) {
    return { ok: false, error: "Fix the highlighted fields before publishing." };
  }

  const { error } = await supabase
    .from("site_content")
    .update({ published_value: parsed.data, published_at: new Date().toISOString() })
    .eq("key", key);
  if (error) return { ok: false, error: error.message };

  await logRevision(key, "publish", parsed.data, session.sub);
  updateTag(CONTENT_TAG);
  revalidatePath(entry.previewPath);
  return { ok: true };
}

/** Discards the draft, resetting it back to the last published value. */
export async function revertContentDraft(key: ContentKey): Promise<ActionResult> {
  const session = await requireAdminSession();
  const supabase = getSupabaseAdminClient();

  const { data, error: readError } = await supabase
    .from("site_content")
    .select("published_value")
    .eq("key", key)
    .maybeSingle();
  if (readError) return { ok: false, error: readError.message };

  const { error } = await supabase
    .from("site_content")
    .update({ draft_value: data?.published_value ?? {} })
    .eq("key", key);
  if (error) return { ok: false, error: error.message };

  await logRevision(key, "revert", data?.published_value ?? {}, session.sub);
  return { ok: true };
}
