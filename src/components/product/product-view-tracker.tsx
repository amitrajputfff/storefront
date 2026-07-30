"use client";

import { useEffect } from "react";
import { Product } from "@/types";
import { trackViewContent } from "@/lib/meta-pixel";

export function ProductViewTracker({ product }: { product: Product }) {
  useEffect(() => {
    trackViewContent({
      contentId: product.id,
      contentName: product.title,
      value: product.priceRange.min.amount,
      currency: product.priceRange.min.currencyCode,
    });
  }, [product.id, product.title, product.priceRange.min.amount, product.priceRange.min.currencyCode]);

  return null;
}
