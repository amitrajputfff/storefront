"use server";

import { updateTag, revalidatePath } from "next/cache";
import { getSupabaseAdminClient } from "@/lib/supabase/admin-client";
import { PAGES_REGISTRY, PAGES_TAG, type PageSlug } from "@/lib/content/pages-registry";
import { requireAdminSession } from "./require-session";
import { sanitizeRichText } from "./sanitize-rich-text";
import type { ActionResult } from "./content-actions";

interface PageDraftInput {
  title: string;
  bodyHtml: string;
  bodyJson?: unknown;
  meta: Record<string, unknown>;
}

async function logRevision(
  entityKey: string,
  action: "save" | "publish" | "revert",
  snapshot: unknown,
  createdBy: string,
): Promise<void> {
  await getSupabaseAdminClient().from("content_revisions").insert({
    entity_type: "page",
    entity_key: entityKey,
    action,
    snapshot,
    created_by: createdBy,
  });
}

export async function savePageDraft(slug: PageSlug, input: PageDraftInput): Promise<ActionResult> {
  const session = await requireAdminSession();
  const supabase = getSupabaseAdminClient();
  const bodyHtml = sanitizeRichText(input.bodyHtml);

  const { error } = await supabase
    .from("pages")
    .update({
      title: input.title,
      draft_body_html: bodyHtml,
      draft_body_json: input.bodyJson ?? { type: "doc", content: [] },
      draft_meta: input.meta,
    })
    .eq("slug", slug);
  if (error) return { ok: false, error: error.message };

  await logRevision(slug, "save", { ...input, bodyHtml }, session.sub);
  return { ok: true };
}

export async function publishPage(slug: PageSlug): Promise<ActionResult> {
  const session = await requireAdminSession();
  const entry = PAGES_REGISTRY[slug];
  const supabase = getSupabaseAdminClient();

  const { data, error: readError } = await supabase
    .from("pages")
    .select("title, draft_body_html, draft_body_json, draft_meta")
    .eq("slug", slug)
    .maybeSingle();
  if (readError) return { ok: false, error: readError.message };
  if (!data) return { ok: false, error: "Page not found." };

  const candidate = { ...(data.draft_meta as Record<string, unknown>), title: data.title, bodyHtml: data.draft_body_html };
  const parsed = entry.schema.safeParse(candidate);
  if (!parsed.success) {
    return { ok: false, error: "Fix the highlighted fields before publishing." };
  }

  const { error } = await supabase
    .from("pages")
    .update({
      published_body_html: data.draft_body_html,
      published_body_json: data.draft_body_json,
      published_meta: data.draft_meta,
      published_at: new Date().toISOString(),
    })
    .eq("slug", slug);
  if (error) return { ok: false, error: error.message };

  await logRevision(slug, "publish", parsed.data, session.sub);
  updateTag(PAGES_TAG);
  revalidatePath(entry.previewPath);
  return { ok: true };
}

export async function revertPageDraft(slug: PageSlug): Promise<ActionResult> {
  const session = await requireAdminSession();
  const supabase = getSupabaseAdminClient();

  const { data, error: readError } = await supabase
    .from("pages")
    .select("title, published_body_html, published_body_json, published_meta")
    .eq("slug", slug)
    .maybeSingle();
  if (readError) return { ok: false, error: readError.message };

  const { error } = await supabase
    .from("pages")
    .update({
      draft_body_html: data?.published_body_html ?? "",
      draft_body_json: data?.published_body_json ?? { type: "doc", content: [] },
      draft_meta: data?.published_meta ?? {},
    })
    .eq("slug", slug);
  if (error) return { ok: false, error: error.message };

  await logRevision(slug, "revert", data, session.sub);
  return { ok: true };
}
