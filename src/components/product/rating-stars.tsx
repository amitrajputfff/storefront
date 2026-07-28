import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({
  rating,
  reviewCount,
  size = "md",
}: {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
}) {
  const rounded = Math.round(rating);
  const starSize = size === "sm" ? "size-3" : "size-4";

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              starSize,
              i < rounded
                ? "fill-gold text-gold"
                : "fill-transparent text-muted-foreground/40",
            )}
          />
        ))}
      </div>
      {typeof reviewCount === "number" && (
        <span className="text-muted-foreground text-xs">({reviewCount})</span>
      )}
    </div>
  );
}
