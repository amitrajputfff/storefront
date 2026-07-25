"use client";

import { Heart } from "lucide-react";
import { motion } from "motion/react";
import { Product } from "@/types";
import { useWishlist } from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils";

export function WishlistButton({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const { toggle, has } = useWishlist();
  const active = has(product.id);

  return (
    <button
      type="button"
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle({
          productId: product.id,
          handle: product.handle,
          title: product.title,
          image: product.images[0],
          price: product.priceRange.min,
          addedAt: new Date().toISOString(),
        });
      }}
      className={cn(
        "bg-background/80 supports-backdrop-filter:backdrop-blur-xs flex size-8 items-center justify-center rounded-full shadow-sm transition-colors hover:bg-background",
        className,
      )}
    >
      <motion.span
        key={String(active)}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex items-center justify-center"
      >
        <Heart
          className={cn(
            "size-4",
            active ? "fill-foreground text-foreground" : "text-foreground",
          )}
        />
      </motion.span>
    </button>
  );
}
