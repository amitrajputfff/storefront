"use client";

import { useState } from "react";
import { Product } from "@/types";
import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 12;

export function CollectionResults({ products }: { products: Product[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visible = products.slice(0, visibleCount);

  return (
    <div className="flex flex-col gap-8">
      <ProductGrid products={visible} />
      {visibleCount < products.length && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-muted-foreground text-xs">
            Showing {visible.length} of {products.length}
          </p>
          <Button variant="outline" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
            <span>Load More</span>
          </Button>
        </div>
      )}
    </div>
  );
}
