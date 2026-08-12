"use client";

import { useState, useTransition } from "react";
import { Star, Trash2, Check, X as XIcon, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AddReviewDialog } from "@/components/admin/reviews/add-review-dialog";
import {
  approveReview,
  rejectReview,
  deleteReview,
  listReviews,
  type AdminReview,
  type ReviewStatus,
} from "@/lib/admin/review-actions";

const TABS: { value: ReviewStatus | "all"; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "all", label: "All" },
];

function statusVariant(status: ReviewStatus): "default" | "outline" | "destructive" {
  if (status === "approved") return "default";
  if (status === "rejected") return "destructive";
  return "outline";
}

export function ReviewsClient({ initialItems }: { initialItems: AdminReview[] }) {
  const [tab, setTab] = useState<ReviewStatus | "all">("pending");
  const [items, setItems] = useState(initialItems);
  const [loading, startTransition] = useTransition();

  function loadTab(next: ReviewStatus | "all") {
    setTab(next);
    startTransition(async () => {
      const result = await listReviews(next === "all" ? {} : { status: next });
      if (result.ok) setItems(result.data);
      else toast.error(result.error);
    });
  }

  async function handleApprove(id: string) {
    const result = await approveReview(id);
    if (result.ok) {
      toast.success("Review approved");
      setItems((prev) => prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r)));
    } else {
      toast.error(result.error);
    }
  }

  async function handleReject(id: string) {
    const result = await rejectReview(id);
    if (result.ok) {
      toast.success("Review rejected");
      setItems((prev) => prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r)));
    } else {
      toast.error(result.error);
    }
  }

  async function handleDelete(id: string) {
    const result = await deleteReview(id);
    if (result.ok) {
      toast.success("Review deleted");
      setItems((prev) => prev.filter((r) => r.id !== id));
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <Tabs value={tab} onValueChange={(v) => loadTab(v as ReviewStatus | "all")}>
          <TabsList>
            {TABS.map((t) => (
              <TabsTrigger key={t.value} value={t.value}>
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <AddReviewDialog onCreated={(review) => setItems((prev) => [review, ...prev])} />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Review</TableHead>
              <TableHead>Photos</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-muted-foreground py-8 text-center">
                  {loading ? "Loading…" : "No reviews here yet."}
                </TableCell>
              </TableRow>
            )}
            {items.map((review) => (
              <TableRow key={review.id}>
                <TableCell className="font-mono text-xs">{review.productHandle}</TableCell>
                <TableCell>
                  <span className="flex items-center gap-0.5">
                    {review.rating}
                    <Star className="fill-gold text-gold size-3.5" />
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{review.authorName}</span>
                    {review.authorLocation && (
                      <span className="text-muted-foreground text-xs">{review.authorLocation}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="max-w-xs whitespace-normal">
                  <p className="font-medium">{review.title}</p>
                  <p className="text-muted-foreground line-clamp-1 text-xs">{review.body}</p>
                </TableCell>
                <TableCell>
                  {review.images.length > 0 ? (
                    <span className="text-muted-foreground flex items-center gap-1 text-xs">
                      <ImageIcon className="size-3.5" />
                      {review.images.length}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant(review.status)} className="capitalize">
                    {review.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    {review.status !== "approved" && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Approve"
                        onClick={() => handleApprove(review.id)}
                      >
                        <Check className="size-4" />
                      </Button>
                    )}
                    {review.status !== "rejected" && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Reject"
                        onClick={() => handleReject(review.id)}
                      >
                        <XIcon className="size-4" />
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger
                        render={
                          <Button variant="ghost" size="icon-sm" aria-label="Delete">
                            <Trash2 className="size-4" />
                          </Button>
                        }
                      />
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this review?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This can&apos;t be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(review.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
