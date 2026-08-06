"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product, Variant } from "@/types";
import { useBuyNowStore } from "@/stores/buy-now-store";
import { routes } from "@/constants/routes";

export function useBuyNow(product: Product, variant: Variant | undefined, quantity: number) {
  const router = useRouter();
  const setBuyNowItem = useBuyNowStore((s) => s.setItem);
  const [buying, setBuying] = useState(false);

  function buyNow() {
    if (!variant || !variant.availableForSale) return;
    setBuying(true);
    setBuyNowItem({
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
    router.push(routes.checkout());
  }

  return { buyNow, buying };
}
