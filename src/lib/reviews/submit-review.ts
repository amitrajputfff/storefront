"use server";

import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin-client";

const BUCKET = "site-media";
const REVIEWS_FOLDER = "reviews";
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;
const MAX_IMAGES_PER_REVIEW = 4;

export type SubmitResult<T = undefined> = { ok: true; data: T } | { ok: false; error: string };

/** Public — no admin session required. A customer's browser uploads their
 * review photo straight to Storage via this signed URL, same mechanism the
 * admin media uploader uses, just without requireAdminSession() gating it. */
export async function createReviewImageUploadUrl(input: {
  fileName: string;
  contentType: string;
}): Promise<SubmitResult<{ path: string; token: string }>> {
  if (!isSupabaseAdminConfigured()) {
    return { ok: false, error: "Reviews are not configured yet — try again later." };
  }
  if (!ALLOWED_MIME_TYPES.has(input.contentType)) {
    return { ok: false, error: "Unsupported file type — use JPEG, PNG, WebP, or AVIF." };
  }

  const ext = input.fileName.split(".").pop() || "bin";
  const path = `${REVIEWS_FOLDER}/${crypto.randomUUID()}.${ext}`;

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUploadUrl(path);
  if (error || !data) return { ok: false, error: error?.message ?? "Could not create upload URL." };

  return { ok: true, data: { path, token: data.token } };
}

export interface SubmitReviewInput {
  productHandle: string;
  authorName: string;
  authorLocation?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
  images?: { path: string; altText: string; sizeBytes?: number }[];
}

/** Public — no admin session required. Still server-only: the service-role
 * client never reaches the browser, this Server Action is the only door. */
export async function submitReview(input: SubmitReviewInput): Promise<SubmitResult> {
  if (!isSupabaseAdminConfigured()) {
    return { ok: false, error: "Reviews are not configured yet — try again later." };
  }

  const authorName = input.authorName.trim();
  const title = input.title.trim();
  const body = input.body.trim();
  if (!authorName || !title || body.length < 10) {
    return { ok: false, error: "Please fill in your name, a title, and a review of at least 10 characters." };
  }
  const images = (input.images ?? []).slice(0, MAX_IMAGES_PER_REVIEW);
  for (const image of images) {
    if (image.sizeBytes && image.sizeBytes > MAX_FILE_SIZE_BYTES) {
      return { ok: false, error: "One of your photos is too large (max 8MB)." };
    }
  }

  const supabase = getSupabaseAdminClient();

  const { data: review, error } = await supabase
    .from("reviews")
    .insert({
      product_handle: input.productHandle,
      author_name: authorName,
      author_location: input.authorLocation?.trim() || null,
      rating: input.rating,
      title,
      body,
      status: "pending",
      source: "customer",
    })
    .select("id")
    .single();

  if (error || !review) return { ok: false, error: error?.message ?? "Could not submit your review." };

  if (images.length > 0) {
    const rows = images.map((image, index) => {
      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET).getPublicUrl(image.path);
      return {
        review_id: review.id,
        url: publicUrl,
        alt_text: image.altText,
        sort_order: index,
      };
    });
    const { error: imagesError } = await supabase.from("review_images").insert(rows);
    if (imagesError) return { ok: false, error: imagesError.message };
  }

  return { ok: true, data: undefined };
}
