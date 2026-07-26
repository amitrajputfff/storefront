"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { Product } from "@/types";
import { getProductByHandle } from "@/mock/products";
import { getReviewCount } from "@/mock/reviews";
import { routes } from "@/constants/routes";
import { useUiStore } from "@/stores/ui-store";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/shared/price-display";
import { RatingStars } from "@/components/product/rating-stars";
import { VariantSelector } from "@/components/product/variant-selector";
import { AddToCartButton } from "@/components/product/add-to-cart-button";

export function QuickViewDialog() {
  const handle = useUiStore((s) => s.quickViewProductHandle);
  const closeQuickView = useUiStore((s) => s.closeQuickView);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!handle) return;
    let cancelled = false;
    setLoading(true);
    getProductByHandle(handle).then((found) => {
      if (cancelled) return;
      setProduct(found ?? null);
      setActiveImageIndex(0);
      setQuantity(1);
      if (found) {
        const defaultOptions: Record<string, string> = {};
        for (const option of found.options) {
          defaultOptions[option.name] = option.values[0];
        }
        setSelectedOptions(defaultOptions);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [handle]);

  const selectedVariant = useMemo(() => {
    if (!product) return undefined;
    return product.variants.find((variant) =>
      variant.selectedOptions.every((so) => selectedOptions[so.name] === so.value),
    );
  }, [product, selectedOptions]);

  const open = Boolean(handle);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && closeQuickView()}>
      <DialogContent className="max-h-[85vh] w-full max-w-3xl overflow-y-auto sm:max-w-3xl">
        {loading || !product ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Skeleton className="aspect-square w-full" />
            <div className="flex flex-col gap-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                <Image
                  src={product.images[activeImageIndex]?.url}
                  alt={product.images[activeImageIndex]?.altText ?? product.title}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => setActiveImageIndex(index)}
                      className="relative size-14 shrink-0 overflow-hidden rounded-md border"
                      style={{
                        borderColor:
                          index === activeImageIndex ? "var(--foreground)" : "var(--border)",
                      }}
                    >
                      <Image src={image.url} alt={image.altText} fill sizes="56px" className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <DialogTitle className="text-lg font-medium">{product.title}</DialogTitle>
              <RatingStars rating={product.rating} reviewCount={getReviewCount(product)} />
              <PriceDisplay
                price={product.priceRange.min}
                compareAtPrice={product.compareAtPriceRange?.min}
                size="lg"
              />

              <VariantSelector
                product={product}
                selectedOptions={selectedOptions}
                onChange={(name, value) =>
                  setSelectedOptions((prev) => ({ ...prev, [name]: value }))
                }
              />

              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Quantity</span>
                <div className="flex items-center rounded-md border border-border">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    <Minus className="size-3.5" />
                  </Button>
                  <span className="w-8 text-center text-sm tabular-nums">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity((q) => Math.min(q + 1, selectedVariant?.inventoryQuantity ?? q + 1))}
                  >
                    <Plus className="size-3.5" />
                  </Button>
                </div>
              </div>

              <AddToCartButton product={product} variant={selectedVariant} quantity={quantity} />

              <Link
                href={routes.product(product.handle)}
                onClick={closeQuickView}
                className="text-sm text-muted-foreground hover:text-foreground hover:underline"
              >
                View full details →
              </Link>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
