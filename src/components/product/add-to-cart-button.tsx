"use client";

import { Check, Loader2 } from "lucide-react";
import { Product, Variant } from "@/types";
import { useAddToCart } from "@/hooks/use-add-to-cart";
import { useBuyNow } from "@/hooks/use-buy-now";
import { Button } from "@/components/ui/button";
import { PaymentIconGroup } from "@/components/product/payment-icon-badge";
import { cn } from "@/lib/utils";

const upiPaymentMethods = [
  { src: "/payments/gpay.png", alt: "Google Pay" },
  { src: "/payments/phonepe.png", alt: "PhonePe" },
  { src: "/payments/paytm.png", alt: "Paytm" },
  { src: "/payments/cod.svg", alt: "Cash on Delivery" }
] as const;

export function AddToCartButton({
  product,
  variant,
  quantity,
  showBuyNow = false,
}: {
  product: Product;
  variant: Variant | undefined;
  quantity: number;
  showBuyNow?: boolean;
}) {
  const { status, handleAddToCart } = useAddToCart(product, variant, quantity);
  const { buyNow, buying } = useBuyNow(product, variant, quantity);

  const disabled = !variant || !variant.availableForSale || status === "loading" || buying;

  const label = !variant
    ? "Select options"
    : !variant.availableForSale
      ? "Out of Stock"
      : "Add to Cart";

  return (
    <div className="flex flex-col gap-3">
      {showBuyNow && (
        <Button
          size="lg"
          className={cn(
            "h-auto w-full px-4 py-3 shadow-sm",
            !disabled && "animate-pulse-glow",
          )}
          disabled={disabled}
          onClick={buyNow}
        >
          <div className="flex w-full items-center justify-between gap-3">
            <div className="min-w-0 flex-1 text-left">
              <span className="inline-flex flex-wrap items-center gap-2 text-sm font-bold whitespace-normal">
                {buying && <Loader2 className="size-4 animate-spin" />}
                {buying ? "Processing…" : "Buy Now - Cash on Delivery"}
              </span>
              {!buying && (
                <span className="mt-0.5 block text-[11px] font-normal whitespace-normal opacity-80">
                  Pay via UPI, cards & wallets
                </span>
              )}
            </div>
            {!buying && (
              <div className="shrink-0">
                <PaymentIconGroup icons={upiPaymentMethods} size={28} overlap={9} />
              </div>
            )}
          </div>
        </Button>
      )}

      <Button
        variant="outline"
        size="lg"
        className={cn("h-11 w-full", status === "success" && "border-foreground bg-foreground text-background")}
        disabled={disabled}
        onClick={handleAddToCart}
      >
        {status === "loading" && <Loader2 className="size-4 animate-spin" />}
        {status === "success" && <Check className="size-4" />}
        <span>{status === "loading" ? "Adding…" : status === "success" ? "Added" : label}</span>
      </Button>
    </div>
  );
}
