"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Product } from "@/types";
import { useWishlist } from "@/hooks/use-wishlist";
import { useMounted } from "@/hooks/use-mounted";
import { ProductGrid } from "@/components/product/product-grid";
import { EmptyState } from "@/components/shared/empty-state";
import { getProductsByHandles } from "@/mock/products";
import { routes } from "@/constants/routes";

export default function WishlistPage() {
  const { items } = useWishlist();
  const mounted = useMounted();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!mounted) return;
    getProductsByHandles(items.map((i) => i.handle)).then(setProducts);
  }, [items, mounted]);

  if (!mounted) return null;

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 md:py-16">
      <h1 className="mb-8 text-2xl font-medium md:text-3xl">
        Wishlist {products.length > 0 && `(${products.length})`}
      </h1>

      {items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Save items you love for later"
          description="Tap the heart on any product to add it to your wishlist."
          action={{ label: "Explore Best Sellers", href: routes.collection("best-sellers") }}
        />
      ) : (
        <ProductGrid products={products} />
      )}
    </main>
  );
}
