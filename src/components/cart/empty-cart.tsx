"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { routes } from "@/constants/routes";
import { formatMoney } from "@/lib/format";
import { getAllProducts } from "@/mock/products";
import { Product } from "@/types";

export function EmptyCart() {
  const [bestsellers, setBestsellers] = useState<Product[]>([]);

  useEffect(() => {
    let active = true;
    getAllProducts().then((products) => {
      if (!active) return;
      setBestsellers(products.filter((p) => p.isBestseller).slice(0, 3));
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 px-6 py-14 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        <ShoppingBag className="size-6 text-muted-foreground" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-lg font-medium">Your cart is empty</h3>
        <p className="max-w-xs text-sm text-muted-foreground">
          Looks like you haven&apos;t added anything yet. Explore the
          collection to find something you&apos;ll love.
        </p>
      </div>

      <Button render={<Link href={routes.shop()} />} nativeButton={false}>
        <span>Continue Shopping</span>
      </Button>

      {bestsellers.length > 0 && (
        <div className="mt-6 w-full space-y-3 text-left">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Best Sellers
          </p>
          <div className="space-y-3">
            {bestsellers.map((product) => (
              <Link
                key={product.id}
                href={routes.product(product.handle)}
                className="flex items-center gap-3"
              >
                <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={product.images[0].url}
                    alt={product.images[0].altText}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{product.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatMoney(product.priceRange.min)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
