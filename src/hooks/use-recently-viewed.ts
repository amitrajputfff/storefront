"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types";
import { useRecentlyViewedStore } from "@/stores/recently-viewed-store";

/** Fetches full Product objects for the recently-viewed handles, excluding one handle if given. */
export function useRecentlyViewed(excludeHandle?: string): Product[] {
  const handles = useRecentlyViewedStore((s) => s.handles);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let cancelled = false;
    const filtered = handles.filter((h) => h !== excludeHandle);
    if (filtered.length === 0) {
      setProducts([]);
      return;
    }
    import("@/mock/products").then(async ({ getProductsByHandles }) => {
      const found = await getProductsByHandles(filtered);
      if (!cancelled) {
        setProducts(
          filtered
            .map((h) => found.find((p) => p.handle === h))
            .filter((p): p is Product => Boolean(p)),
        );
      }
    });
    return () => {
      cancelled = true;
    };
  }, [handles, excludeHandle]);

  return products;
}
