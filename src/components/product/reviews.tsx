"use client";

import { useState } from "react";
import { Product } from "@/types";
import { getRatingBreakdown, getReviewsForProduct } from "@/mock/reviews";
import { formatFullDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RatingStars } from "@/components/product/rating-stars";
import { ReviewForm } from "@/components/product/review-form";

export function Reviews({ product }: { product: Product }) {
  const [formOpen, setFormOpen] = useState(false);
  const reviews = getReviewsForProduct(product);
  const breakdown = getRatingBreakdown(product);

  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-12">
        <div className="flex flex-col items-start gap-2">
          <span className="text-4xl font-medium tabular-nums">
            {breakdown.average.toFixed(1)}
          </span>
          <RatingStars rating={breakdown.average} />
          <p className="text-muted-foreground text-sm">{breakdown.total} reviews</p>
          <Button variant="outline" size="sm" onClick={() => setFormOpen(true)}>
            <span>Write a Review</span>
          </Button>
        </div>

        <div className="flex flex-1 flex-col gap-1.5">
          {([5, 4, 3, 2, 1] as const).map((level) => {
            const count = breakdown.counts[level];
            const percent = breakdown.total > 0 ? Math.round((count / breakdown.total) * 100) : 0;
            return (
              <div key={level} className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground w-8 shrink-0">{level} star</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-foreground" style={{ width: `${percent}%` }} />
                </div>
                <span className="text-muted-foreground w-8 shrink-0 text-right tabular-nums">
                  {percent}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-6">
        {reviews.map((review) => (
          <div key={review.id} className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{review.author}</span>
              {review.location && (
                <span className="text-muted-foreground text-xs">{review.location}</span>
              )}
              {review.verified && (
                <Badge variant="outline" className="text-muted-foreground">
                  Verified Purchase
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <RatingStars rating={review.rating} size="sm" />
              <span className="text-muted-foreground text-xs">
                {formatFullDate(review.createdAt)}
              </span>
            </div>
            <p className="text-sm font-medium">{review.title}</p>
            <p className="text-muted-foreground text-sm">{review.body}</p>
          </div>
        ))}
      </div>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className={cn("sm:max-w-md")}>
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
          </DialogHeader>
          <ReviewForm productId={product.id} onSubmitted={() => setFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </section>
  );
}
