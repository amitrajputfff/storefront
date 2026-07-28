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
  const starSize = size === "sm" ? "size-3" : "size-4";

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const fill = Math.min(Math.max(rating - i, 0), 1);
          return (
            <span key={i} className="relative inline-flex">
              <Star className={cn(starSize, "fill-transparent text-muted-foreground/40")} />
              {fill > 0 && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${fill * 100}%` }}
                >
                  <Star className={cn(starSize, "fill-gold text-gold")} />
                </span>
              )}
            </span>
          );
        })}
      </div>
      {typeof reviewCount === "number" && (
        <span className="text-muted-foreground text-xs">({reviewCount})</span>
      )}
    </div>
  );
}
