"use server";

import { getSupabaseAdminClient } from "@/lib/supabase/admin-client";
import { requireAdminSession } from "./require-session";

export type ReviewStatus = "pending" | "approved" | "rejected";

export interface AdminReviewImage {
  id: string;
  url: string;
  altText: string;
}

export interface AdminReview {
  id: string;
  productHandle: string;
  authorName: string;
  authorLocation: string | null;
  rating: number;
  title: string;
  body: string;
  status: ReviewStatus;
  verified: boolean;
  source: "customer" | "admin";
  createdAt: string;
  images: AdminReviewImage[];
}

export type ReviewActionResult<T = undefined> = { ok: true; data: T } | { ok: false; error: string };

interface ReviewRow {
  id: string;
  product_handle: string;
  author_name: string;
  author_location: string | null;
  rating: number;
  title: string;
  body: string;
  status: ReviewStatus;
  verified: boolean;
  source: "customer" | "admin";
  created_at: string;
  review_images: { id: string; url: string; alt_text: string }[] | null;
}

function mapRow(row: ReviewRow): AdminReview {
  return {
    id: row.id,
    productHandle: row.product_handle,
    authorName: row.author_name,
    authorLocation: row.author_location,
    rating: row.rating,
    title: row.title,
    body: row.body,
    status: row.status,
    verified: row.verified,
    source: row.source,
    createdAt: row.created_at,
    images: (row.review_images ?? []).map((img) => ({ id: img.id, url: img.url, altText: img.alt_text })),
  };
}

export async function listReviews(input?: {
  status?: ReviewStatus;
  productHandle?: string;
  limit?: number;
}): Promise<ReviewActionResult<AdminReview[]>> {
  await requireAdminSession();

  const supabase = getSupabaseAdminClient();
  let query = supabase
    .from("reviews")
    .select(
      "id, product_handle, author_name, author_location, rating, title, body, status, verified, source, created_at, review_images(id, url, alt_text)",
    )
    .order("created_at", { ascending: false })
    .limit(input?.limit ?? 100);

  if (input?.status) query = query.eq("status", input.status);
  if (input?.productHandle) query = query.eq("product_handle", input.productHandle);

  const { data, error } = await query;
  if (error) return { ok: false, error: error.message };

  return { ok: true, data: (data as ReviewRow[]).map(mapRow) };
}

export async function setReviewStatus(id: string, status: ReviewStatus): Promise<ReviewActionResult> {
  await requireAdminSession();
  const { error } = await getSupabaseAdminClient().from("reviews").update({ status }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: undefined };
}

export async function approveReview(id: string) {
  return setReviewStatus(id, "approved");
}

export async function rejectReview(id: string) {
  return setReviewStatus(id, "rejected");
}

/** Hard delete is fine here (unlike media) — reviews aren't denormalized
 * anywhere else, `review_images` cascades via its FK. */
export async function deleteReview(id: string): Promise<ReviewActionResult> {
  await requireAdminSession();
  const { error } = await getSupabaseAdminClient().from("reviews").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: undefined };
}

export interface CreateReviewInput {
  productHandle: string;
  authorName: string;
  authorLocation?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
  verified?: boolean;
  images?: { url: string; altText: string }[];
}

/** Admin-authored review, e.g. to seed initial content — defaults to
 * approved and source "admin" since it's coming from an authenticated
 * session, unlike the public submitReview() action. */
export async function createReview(input: CreateReviewInput): Promise<ReviewActionResult<{ id: string }>> {
  await requireAdminSession();

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("reviews")
    .insert({
      product_handle: input.productHandle,
      author_name: input.authorName.trim(),
      author_location: input.authorLocation?.trim() || null,
      rating: input.rating,
      title: input.title.trim(),
      body: input.body.trim(),
      status: "approved",
      verified: input.verified ?? false,
      source: "admin",
    })
    .select("id")
    .single();

  if (error || !data) return { ok: false, error: error?.message ?? "Could not create review." };

  if (input.images && input.images.length > 0) {
    const rows = input.images.map((image, index) => ({
      review_id: data.id,
      url: image.url,
      alt_text: image.altText,
      sort_order: index,
    }));
    const { error: imagesError } = await supabase.from("review_images").insert(rows);
    if (imagesError) return { ok: false, error: imagesError.message };
  }

  return { ok: true, data: { id: data.id } };
}
