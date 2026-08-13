"use client";

import { useState } from "react";
import Image from "next/image";
import { Product, RatingBreakdown, Review } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RatingStars } from "@/components/product/rating-stars";
import { ReviewForm } from "@/components/product/review-form";

const PAGE_SIZE = 5;

function ReviewImages({ images }: { images: NonNullable<Review["images"]> }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const active = lightboxIndex !== null ? images[lightboxIndex] : null;

  return (
    <>
      <div className="mt-2 flex flex-wrap gap-2.5">
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setLightboxIndex(index)}
            className="relative size-24 shrink-0 overflow-hidden rounded-lg border border-border sm:size-28"
          >
            <Image src={image.url} alt={image.altText} fill sizes="112px" className="object-cover" />
          </button>
        ))}
      </div>

      <Dialog open={active !== null} onOpenChange={(open) => !open && setLightboxIndex(null)}>
        <DialogContent
          className="flex h-screen max-h-screen w-screen max-w-none cursor-zoom-out items-center justify-center rounded-none bg-background/95 p-0 sm:max-w-none"
          onClick={() => setLightboxIndex(null)}
        >
          <DialogTitle className="sr-only">{active?.altText || "Review photo"}</DialogTitle>
          {active && (
            <Image
              src={active.url}
              alt={active.altText}
              width={1200}
              height={1200}
              sizes="90vw"
              className="max-h-[90vh] max-w-[90vw] cursor-default object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export function Reviews({
  product,
  reviews,
  breakdown,
}: {
  product: Product;
  reviews: Review[];
  breakdown: RatingBreakdown;
}) {
  const [formOpen, setFormOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visibleReviews = reviews.slice(0, visibleCount);

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
                  <div className="h-full bg-primary" style={{ width: `${percent}%` }} />
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
        {visibleReviews.map((review) => (
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
            <RatingStars rating={review.rating} size="sm" />
            <p className="text-sm font-medium">{review.title}</p>
            <p className="text-muted-foreground text-sm">{review.body}</p>
            {review.images && review.images.length > 0 && <ReviewImages images={review.images} />}
          </div>
        ))}
      </div>

      {visibleCount < reviews.length && (
        <Button
          variant="outline"
          className="self-center"
          onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
        >
          <span>Show more reviews</span>
        </Button>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className={cn("sm:max-w-md")}>
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
          </DialogHeader>
          <ReviewForm productHandle={product.handle} onSubmitted={() => setFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </section>
  );
}
