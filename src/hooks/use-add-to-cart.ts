"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Product, Variant } from "@/types";
import { useCart } from "@/hooks/use-cart";
import { trackAddToCart } from "@/lib/meta-pixel";

type Status = "idle" | "loading" | "success";

export function useAddToCart(product: Product, variant: Variant | undefined, quantity: number) {
  const { addItem } = useCart();
  const [status, setStatus] = useState<Status>("idle");
  // Synchronous guard — `status === "loading"` can't block a second click fired
  // in the same tick, before React re-renders the disabled button.
  const inFlightRef = useRef(false);

  function handleAddToCart() {
    if (!variant || !variant.availableForSale) return;
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setStatus("loading");
    setTimeout(() => {
      addItem({
        productId: product.id,
        productHandle: product.handle,
        variantId: variant.id,
        title: product.title,
        variantTitle: variant.title,
        image: variant.image ?? product.images[0],
        price: variant.price,
        quantity,
        maxQuantity: variant.inventoryQuantity,
      });
      trackAddToCart({
        contentId: variant.id,
        contentName: product.title,
        value: variant.price.amount * quantity,
        currency: variant.price.currencyCode,
        quantity,
      });
      toast.success("Added to cart");
      setStatus("success");
      inFlightRef.current = false;
      setTimeout(() => setStatus("idle"), 1500);
    }, 500);
  }

  return { status, handleAddToCart };
}
