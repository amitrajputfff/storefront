"use client";

import { Loader2 } from "lucide-react";
import { Product, Variant } from "@/types";
import { PriceDisplay } from "@/components/shared/price-display";
import { Button } from "@/components/ui/button";
import { useBuyNow } from "@/hooks/use-buy-now";
import { cn } from "@/lib/utils";

export function StickyBuyBar({
  product,
  variant,
  quantity,
}: {
  product: Product;
  variant: Variant | undefined;
  quantity: number;
}) {
  const { buyNow, buying } = useBuyNow(variant, quantity);
  const price = variant?.price ?? product.priceRange.min;
  const compareAtPrice = variant?.compareAtPrice;
  const disabled = !variant || !variant.availableForSale || buying;

  const label = !variant
    ? "Select options"
    : !variant.availableForSale
      ? "Out of Stock"
      : buying
        ? "Processing…"
        : "Buy Now";

  return (
    <div className="bg-background/95 fixed inset-x-0 bottom-0 z-40 border-t p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.12)] backdrop-blur-sm md:hidden">
      <div className="flex items-center gap-3">
        <PriceDisplay price={price} compareAtPrice={compareAtPrice} size="md" className="min-w-0 flex-1" />
        <Button
          size="lg"
          className={cn("h-13 shrink-0 px-6 text-base font-bold shadow-md", !disabled && "animate-pulse-glow")}
          disabled={disabled}
          onClick={buyNow}
        >
          {buying && <Loader2 className="size-4 animate-spin" />}
          <span>{label}</span>
        </Button>
      </div>
    </div>
  );
}
