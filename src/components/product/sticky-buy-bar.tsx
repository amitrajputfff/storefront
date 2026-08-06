"use client";

import { Check, Loader2 } from "lucide-react";
import { Product, Variant } from "@/types";
import { PriceDisplay } from "@/components/shared/price-display";
import { Button } from "@/components/ui/button";
import { useBuyNow } from "@/hooks/use-buy-now";
import { useAddToCart } from "@/hooks/use-add-to-cart";
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
  const { buyNow, buying } = useBuyNow(product, variant, quantity);
  const { status: addStatus, handleAddToCart } = useAddToCart(product, variant, quantity);
  const price = variant?.price ?? product.priceRange.min;
  const compareAtPrice = variant?.compareAtPrice;
  const outOfStock = !variant || !variant.availableForSale;
  const buyDisabled = outOfStock || buying;
  const addDisabled = outOfStock || addStatus === "loading" || buying;

  const buyLabel = !variant
    ? "Select options"
    : !variant.availableForSale
      ? "Out of Stock"
      : buying
        ? "Processing…"
        : "Buy Now";

  return (
    <div className="bg-background/95 fixed inset-x-0 bottom-0 z-40 border-t p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.12)] backdrop-blur-sm md:hidden">
      <div className="flex flex-col gap-2">
        <PriceDisplay price={price} compareAtPrice={compareAtPrice} size="md" />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="lg"
            className={cn(
              "h-12 flex-1 text-sm font-semibold",
              addStatus === "success" && "border-foreground bg-foreground text-background",
            )}
            disabled={addDisabled}
            onClick={handleAddToCart}
          >
            {addStatus === "loading" && <Loader2 className="size-4 animate-spin" />}
            {addStatus === "success" && <Check className="size-4" />}
            <span>
              {addStatus === "loading" ? "Adding…" : addStatus === "success" ? "Added" : "Add to Cart"}
            </span>
          </Button>
          <Button
            size="lg"
            className={cn("h-12 flex-1 text-sm font-bold shadow-md", !buyDisabled && "animate-pulse-glow")}
            disabled={buyDisabled}
            onClick={buyNow}
          >
            {buying && <Loader2 className="size-4 animate-spin" />}
            <span>{buyLabel}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
