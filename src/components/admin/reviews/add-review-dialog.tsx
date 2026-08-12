"use client";

import { useState } from "react";
import { Star, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MediaUploader } from "@/components/admin/media/media-uploader";
import { createReview, type AdminReview } from "@/lib/admin/review-actions";
import type { MediaItem } from "@/lib/admin/media-actions";

export function AddReviewDialog({ onCreated }: { onCreated: (review: AdminReview) => void }) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [productHandle, setProductHandle] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorLocation, setAuthorLocation] = useState("");
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [images, setImages] = useState<MediaItem[]>([]);
  const [showUploader, setShowUploader] = useState(false);

  function reset() {
    setProductHandle("");
    setAuthorName("");
    setAuthorLocation("");
    setRating(5);
    setTitle("");
    setBody("");
    setImages([]);
    setShowUploader(false);
  }

  async function handleSubmit() {
    if (!productHandle.trim() || !authorName.trim() || !title.trim() || body.trim().length < 10) {
      toast.error("Fill in the product handle, author name, title, and a review of at least 10 characters.");
      return;
    }
    setSubmitting(true);
    const result = await createReview({
      productHandle: productHandle.trim(),
      authorName,
      authorLocation,
      rating: rating as 1 | 2 | 3 | 4 | 5,
      title,
      body,
      verified: true,
      images: images.map((img) => ({ url: img.url, altText: img.altText })),
    });
    setSubmitting(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    toast.success("Review added");
    onCreated({
      id: result.data.id,
      productHandle: productHandle.trim(),
      authorName,
      authorLocation: authorLocation || null,
      rating,
      title,
      body,
      status: "approved",
      verified: true,
      source: "admin",
      createdAt: new Date().toISOString(),
      images: images.map((img) => ({ id: img.id, url: img.url, altText: img.altText })),
    });
    reset();
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger render={<Button size="sm">Add Review</Button>} />
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add a review</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="review-product-handle">Product handle</Label>
            <Input
              id="review-product-handle"
              placeholder="e.g. nimbus-true-wireless-earbuds"
              value={productHandle}
              onChange={(e) => setProductHandle(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Rating</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button key={value} type="button" aria-label={`${value} star`} onClick={() => setRating(value)}>
                  <Star
                    className={cn(
                      "size-5",
                      value <= rating ? "fill-gold text-gold" : "fill-transparent text-muted-foreground/40",
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="review-admin-author">Author name</Label>
              <Input id="review-admin-author" value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="review-admin-location">City (optional)</Label>
              <Input
                id="review-admin-location"
                value={authorLocation}
                onChange={(e) => setAuthorLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="review-admin-title">Title</Label>
            <Input id="review-admin-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="review-admin-body">Review</Label>
            <Textarea id="review-admin-body" rows={4} value={body} onChange={(e) => setBody(e.target.value)} />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label>Photos (optional)</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => setShowUploader((v) => !v)}>
                {showUploader ? "Hide uploader" : "Add photos"}
              </Button>
            </div>
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {images.map((img) => (
                  <div key={img.id} className="relative size-16 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element -- already-hosted Supabase Storage URL */}
                    <img src={img.url} alt="" className="size-16 rounded-lg border border-border object-cover" />
                    <button
                      type="button"
                      onClick={() => setImages((prev) => prev.filter((i) => i.id !== img.id))}
                      aria-label="Remove photo"
                      className="bg-foreground text-background absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {showUploader && (
              <MediaUploader
                folder="reviews"
                onUploaded={(item) => {
                  setImages((prev) => [...prev, item]);
                  setShowUploader(false);
                }}
              />
            )}
          </div>

          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Adding…" : "Add review"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
