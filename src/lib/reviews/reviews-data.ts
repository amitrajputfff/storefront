import "server-only";
import { Product, RatingBreakdown, Review } from "@/types";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin-client";
import { getRatingBreakdown as getMockRatingBreakdown, getReviewsForProduct as getMockReviews } from "@/mock/reviews";

interface ReviewRow {
  id: string;
  author_name: string;
  author_location: string | null;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  created_at: string;
  review_images: { id: string; url: string; alt_text: string }[] | null;
}

/** Real, admin-approved reviews for a product — empty (never throws) when
 * Supabase isn't configured or the query fails, so the PDP always renders. */
export async function getApprovedReviewsForProduct(product: Product): Promise<Review[]> {
  if (!isSupabaseAdminConfigured()) return [];

  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("reviews")
      .select(
        "id, author_name, author_location, rating, title, body, verified, created_at, review_images(id, url, alt_text)",
      )
      .eq("product_handle", product.handle)
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return (data as ReviewRow[]).map((row) => ({
      id: row.id,
      productId: product.id,
      author: row.author_name,
      location: row.author_location ?? undefined,
      rating: Math.min(5, Math.max(1, row.rating)) as 1 | 2 | 3 | 4 | 5,
      title: row.title,
      body: row.body,
      createdAt: row.created_at,
      verified: row.verified,
      helpfulCount: 0,
      images: (row.review_images ?? []).map((img) => ({
        id: img.id,
        url: img.url,
        altText: img.alt_text,
      })),
      source: "customer" as const,
    }));
  } catch {
    return [];
  }
}

/** Real reviews always sort first, synthetic ones fill in underneath so the
 * page never looks sparse while real review volume builds up. The displayed
 * average blends both, weighted by count, so it moves as real reviews land. */
export async function getBlendedReviewsAndBreakdown(
  product: Product,
): Promise<{ reviews: Review[]; breakdown: RatingBreakdown }> {
  const realReviews = await getApprovedReviewsForProduct(product);
  const mockReviews = getMockReviews(product).map((r) => ({ ...r, source: "mock" as const }));
  const mockBreakdown = getMockRatingBreakdown(product);

  const reviews = [...realReviews, ...mockReviews];

  if (realReviews.length === 0) {
    return { reviews, breakdown: mockBreakdown };
  }

  const counts: RatingBreakdown["counts"] = { ...mockBreakdown.counts };
  for (const review of realReviews) {
    counts[review.rating] += 1;
  }
  const total = mockBreakdown.total + realReviews.length;
  const sum =
    counts[1] * 1 + counts[2] * 2 + counts[3] * 3 + counts[4] * 4 + counts[5] * 5;

  return {
    reviews,
    breakdown: {
      average: total > 0 ? sum / total : mockBreakdown.average,
      total,
      counts,
    },
  };
}
