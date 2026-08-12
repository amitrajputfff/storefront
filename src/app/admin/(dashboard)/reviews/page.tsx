import { listReviews } from "@/lib/admin/review-actions";
import { ReviewsClient } from "./reviews-client";

export default async function AdminReviewsPage() {
  const result = await listReviews({ status: "pending", limit: 100 });
  const items = result.ok ? result.data : [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Reviews</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Moderate customer-submitted reviews, or add one yourself.
        </p>
      </div>
      <ReviewsClient initialItems={items} />
    </div>
  );
}
