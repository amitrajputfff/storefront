"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Star, UploadCloud, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { createReviewImageUploadUrl, submitReview } from "@/lib/reviews/submit-review";

const MAX_IMAGES = 4;
const MAX_SIZE_BYTES = 8 * 1024 * 1024;
const MAX_DIMENSION = 2000;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

const reviewSchema = z.object({
  authorName: z.string().trim().min(1, "Please enter your name"),
  authorLocation: z.string().trim().optional(),
  rating: z.number().min(1, "Please select a rating").max(5),
  title: z.string().trim().min(1, "Title is required"),
  body: z.string().trim().min(10, "Review must be at least 10 characters"),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface PendingImage {
  id: string;
  file: File;
  previewUrl: string;
}

async function downscaleIfNeeded(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  if (bitmap.width <= MAX_DIMENSION) {
    bitmap.close();
    return file;
  }

  const scale = MAX_DIMENSION / bitmap.width;
  const canvas = document.createElement("canvas");
  canvas.width = MAX_DIMENSION;
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, file.type, 0.9));
  return blob ? new File([blob], file.name, { type: file.type }) : file;
}

export function ReviewForm({
  productHandle,
  onSubmitted,
}: {
  productHandle: string;
  onSubmitted: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState<PendingImage[]>([]);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { authorName: "", authorLocation: "", rating: 0, title: "", body: "" },
  });

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;
    const next: PendingImage[] = [];
    for (const file of Array.from(fileList)) {
      if (images.length + next.length >= MAX_IMAGES) break;
      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast.error(`${file.name}: unsupported file type`);
        continue;
      }
      if (file.size > MAX_SIZE_BYTES) {
        toast.error(`${file.name}: file is too large (max 8MB)`);
        continue;
      }
      next.push({ id: crypto.randomUUID(), file, previewUrl: URL.createObjectURL(file) });
    }
    setImages((prev) => [...prev, ...next]);
  }

  function removeImage(id: string) {
    setImages((prev) => prev.filter((i) => i.id !== id));
  }

  async function onSubmit(values: ReviewFormValues) {
    setSubmitting(true);
    try {
      const uploadedImages: { path: string; altText: string; sizeBytes: number }[] = [];
      for (const pending of images) {
        const file = await downscaleIfNeeded(pending.file);
        const urlResult = await createReviewImageUploadUrl({
          fileName: file.name,
          contentType: file.type,
        });
        if (!urlResult.ok) throw new Error(urlResult.error);

        const supabase = getSupabaseBrowserClient();
        const { error: uploadError } = await supabase.storage
          .from("site-media")
          .uploadToSignedUrl(urlResult.data.path, urlResult.data.token, file);
        if (uploadError) throw uploadError;

        uploadedImages.push({ path: urlResult.data.path, altText: values.title, sizeBytes: file.size });
      }

      const result = await submitReview({
        productHandle,
        authorName: values.authorName,
        authorLocation: values.authorLocation,
        rating: values.rating as 1 | 2 | 3 | 4 | 5,
        title: values.title,
        body: values.body,
        images: uploadedImages,
      });
      if (!result.ok) throw new Error(result.error);

      toast.success("Thanks — your review has been submitted for approval");
      onSubmitted();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not submit your review");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
                        ? "fill-gold text-gold"
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

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="review-author">Your name</Label>
          <Input id="review-author" placeholder="Jane Doe" {...register("authorName")} />
          {errors.authorName && <p className="text-destructive text-xs">{errors.authorName.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="review-location">City (optional)</Label>
          <Input id="review-location" placeholder="Mumbai" {...register("authorLocation")} />
        </div>
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

      <div className="flex flex-col gap-1.5">
        <Label>Photos (optional)</Label>
        <div className="flex flex-wrap gap-2">
          {images.map((image) => (
            <div key={image.id} className="relative size-16 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element -- transient object-URL preview */}
              <img src={image.previewUrl} alt="" className="size-16 rounded-lg border border-border object-cover" />
              <button
                type="button"
                onClick={() => removeImage(image.id)}
                aria-label="Remove photo"
                className="bg-foreground text-background absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
          {images.length < MAX_IMAGES && (
            <label className="flex size-16 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border text-muted-foreground hover:border-foreground">
              <UploadCloud className="size-4" />
              <input
                type="file"
                accept={ACCEPTED_TYPES.join(",")}
                multiple
                className="hidden"
                onChange={(e) => addFiles(e.target.files)}
              />
            </label>
          )}
        </div>
      </div>

      <Button type="submit" disabled={submitting}>
        {submitting && <Loader2 className="size-4 animate-spin" />}
        <span>{submitting ? "Submitting…" : "Submit Review"}</span>
      </Button>
    </form>
  );
}
