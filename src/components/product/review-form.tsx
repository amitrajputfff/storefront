"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  title: z.string().trim().min(1, "Title is required"),
  body: z.string().trim().min(10, "Review must be at least 10 characters"),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

export function ReviewForm({
  productId,
  onSubmitted,
}: {
  productId: string;
  onSubmitted: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, title: "", body: "" },
  });

  function onSubmit() {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Thanks — your review has been submitted for approval");
      onSubmitted();
    }, 600);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
      data-product-id={productId}
    >
      <div className="flex flex-col gap-1.5">
        <Label>Rating</Label>
        <Controller
          control={control}
          name="rating"
          render={({ field }) => (
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-label={`${value} star`}
                  onClick={() => field.onChange(value)}
                >
                  <Star
                    className={cn(
                      "size-5",
                      value <= field.value
                        ? "fill-foreground text-foreground"
                        : "fill-transparent text-muted-foreground/40",
                    )}
                  />
                </button>
              ))}
            </div>
          )}
        />
        {errors.rating && <p className="text-destructive text-xs">{errors.rating.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="review-title">Title</Label>
        <Input id="review-title" placeholder="Sum up your experience" {...register("title")} />
        {errors.title && <p className="text-destructive text-xs">{errors.title.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="review-body">Review</Label>
        <Textarea
          id="review-body"
          placeholder="Tell us what you liked or didn't like"
          rows={4}
          {...register("body")}
        />
        {errors.body && <p className="text-destructive text-xs">{errors.body.message}</p>}
      </div>

      <Button type="submit" disabled={submitting}>
        <span>{submitting ? "Submitting…" : "Submit Review"}</span>
      </Button>
    </form>
  );
}
