"use client";

import { Loader2 } from "lucide-react";
import { Product, Variant } from "@/types";
import { PriceDisplay } from "@/components/shared/price-display";
import { Button } from "@/components/ui/button";
import { useBuyNow } from "@/hooks/use-buy-now";

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
    <div className="bg-background fixed inset-x-0 bottom-0 z-40 border-t p-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] md:hidden">
      <div className="flex items-center gap-3">
        <PriceDisplay price={price} compareAtPrice={compareAtPrice} size="sm" className="min-w-0 flex-1" />
        <Button size="lg" className="h-11 shrink-0" disabled={disabled} onClick={buyNow}>
          {buying && <Loader2 className="size-4 animate-spin" />}
          <span>{label}</span>
        </Button>
      </div>
    </div>
  );
}
