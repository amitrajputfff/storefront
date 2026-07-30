"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Variant } from "@/types";
import { createBuyNowCheckoutUrl } from "@/lib/shopify/cart";
import { trackInitiateCheckout } from "@/lib/meta-pixel";

export function useBuyNow(variant: Variant | undefined, quantity: number) {
  const [buying, setBuying] = useState(false);

  async function buyNow() {
    if (!variant || !variant.availableForSale) return;
    setBuying(true);
    try {
      const checkoutUrl = await createBuyNowCheckoutUrl(variant.id, quantity);
      trackInitiateCheckout({
        contentIds: [variant.id],
        value: variant.price.amount * quantity,
        currency: variant.price.currencyCode,
        numItems: quantity,
      });
      window.location.href = checkoutUrl;
    } catch {
      toast.error("Couldn't start checkout — please try again.");
      setBuying(false);
    }
  }

  return { buyNow, buying };
}
