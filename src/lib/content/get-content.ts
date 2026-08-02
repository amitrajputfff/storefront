import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { cookies, draftMode } from "next/headers";
import { CONTENT_REGISTRY, CONTENT_TAG, type ContentKey, type ContentValue } from "./registry";
import { PAGES_REGISTRY, PAGES_TAG, type PageSlug, type PageValue } from "./pages-registry";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin-client";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin/session";

/** Whole table in one query, persistently cached + tag-invalidated. A
 * handful of tiny rows, so fetching all of it is cheaper than N round trips
 * for N components each calling getContent(). */
const loadPublishedContent = unstable_cache(
  async (): Promise<Record<string, unknown>> => {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.from("site_content").select("key, published_value");
    if (error) throw error;
    return Object.fromEntries((data ?? []).map((r) => [r.key, r.published_value]));
  },
  ["site-content:all"],
  { tags: [CONTENT_TAG], revalidate: 3600 },
);

const loadPublishedPages = unstable_cache(
  async (): Promise<Record<string, { title: string; bodyHtml: string; meta: unknown }>> => {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.from("pages").select("slug, title, published_body_html, published_meta");
    if (error) throw error;
    return Object.fromEntries(
      (data ?? []).map((r) => [r.slug, { title: r.title, bodyHtml: r.published_body_html, meta: r.published_meta }]),
    );
  },
  ["pages:all"],
  { tags: [PAGES_TAG], revalidate: 3600 },
);

/** True only when the current request is an authenticated admin previewing
 * drafts. draftMode().isEnabled is a hardcoded `false` at prerender time (it
 * does NOT mark the route dynamic), so this whole branch — and the cookies()
 * call inside it — is never reached during static generation. */
async function isPreviewing(): Promise<boolean> {
  if (!isSupabaseAdminConfigured()) return false;
  const { isEnabled } = await draftMode();
  if (!isEnabled) return false;
  const session = await verifyAdminSession((await cookies()).get(ADMIN_SESSION_COOKIE)?.value);
  return session !== null;
}

/** React cache() => one DB read per render pass no matter how many
 * components call getContent()/getPage(). Every failure path falls back to
 * `{}`, so callers always get schema defaults instead of a crash. */
const loadAllContent = cache(async (): Promise<Record<string, unknown>> => {
  if (!isSupabaseConfigured()) return {};
  try {
    if (await isPreviewing()) {
      const { data, error } = await getSupabaseAdminClient().from("site_content").select("key, draft_value");
      if (error) throw error;
      return Object.fromEntries((data ?? []).map((r) => [r.key, r.draft_value]));
    }
    return await loadPublishedContent();
  } catch (err) {
    console.error("[content] falling back to defaults:", err);
    return {};
  }
});

const loadAllPages = cache(async (): Promise<Record<string, { title: string; bodyHtml: string; meta: unknown }>> => {
  if (!isSupabaseConfigured()) return {};
  try {
    if (await isPreviewing()) {
      const { data, error } = await getSupabaseAdminClient()
        .from("pages")
        .select("slug, title, draft_body_html, draft_meta");
      if (error) throw error;
      return Object.fromEntries(
        (data ?? []).map((r) => [r.slug, { title: r.title, bodyHtml: r.draft_body_html, meta: r.draft_meta }]),
      );
    }
    return await loadPublishedPages();
  } catch (err) {
    console.error("[content] falling back to page defaults:", err);
    return {};
  }
});

export async function getContent<K extends ContentKey>(key: K): Promise<ContentValue<K>> {
  const entry = CONTENT_REGISTRY[key];
  const raw = (await loadAllContent())[key];
  if (raw == null) return entry.defaults as ContentValue<K>;

  const parsed = entry.schema.safeParse(raw);
  if (!parsed.success) {
    console.error(`[content] "${key}" failed validation, using defaults`, parsed.error.issues);
    return entry.defaults as ContentValue<K>;
  }
  return parsed.data as ContentValue<K>;
}

/**
 * `title` and `bodyHtml` live in their own DB columns (bodyHtml is rendered
 * once server-side at save time, so the public page never runs Tiptap at
 * runtime) while the rest of a page's fields live in a `meta` jsonb blob —
 * but the schema describes the whole logical document. Merge before
 * validating so the DB's physical split stays invisible to callers.
 */
export async function getPage<S extends PageSlug>(slug: S): Promise<PageValue<S>> {
  const entry = PAGES_REGISTRY[slug];
  const row = (await loadAllPages())[slug];
  if (!row) return entry.defaults as PageValue<S>;

  const candidate = { ...(row.meta as Record<string, unknown>), title: row.title, bodyHtml: row.bodyHtml };
  const parsed = entry.schema.safeParse(candidate);
  if (!parsed.success) {
    console.error(`[content] page "${slug}" failed validation, using defaults`, parsed.error.issues);
    return entry.defaults as PageValue<S>;
  }
  return parsed.data as PageValue<S>;
}
