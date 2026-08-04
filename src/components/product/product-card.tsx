"use client";

import Image from "next/image";
import Link from "next/link";
import { Zap } from "lucide-react";
import { toast } from "sonner";
import { Product } from "@/types";
import { routes } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { useSocialProof } from "@/hooks/use-social-proof";
import { getReviewCount } from "@/mock/reviews";
import { useCart } from "@/hooks/use-cart";
import { useUiStore } from "@/stores/ui-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/shared/price-display";
import { RatingStars } from "@/components/product/rating-stars";
import { StockBadge } from "@/components/product/stock-badge";
import { WishlistButton } from "@/components/product/wishlist-button";
import { trackAddToCart } from "@/lib/meta-pixel";

const COLOR_SWATCH_MAP: Record<string, string> = {
  black: "#111111",
  white: "#ffffff",
  ivory: "#f4f1ea",
  cream: "#f5efdf",
  beige: "#e8dcc8",
  tan: "#d2b48c",
  brown: "#6b4a2f",
  charcoal: "#36393d",
  grey: "#9a9a9a",
  gray: "#9a9a9a",
  navy: "#1f2a44",
  blue: "#3457a6",
  teal: "#2f6f6a",
  green: "#3f6b3f",
  olive: "#6b6b3a",
  sage: "#9caf88",
  red: "#a13d3d",
  maroon: "#6f2b34",
  rust: "#a75c3a",
  pink: "#e3b6bd",
  blush: "#e9c7c4",
  mustard: "#d4a72c",
  gold: "#c9a24b",
  silver: "#c4c4c4",
  copper: "#b46a4a",
  terracotta: "#c1653d",
};

function swatchColor(value: string): string {
  const key = value.trim().toLowerCase();
  return COLOR_SWATCH_MAP[key] ?? "#bbbbbb";
}

function getBadge(product: Product): { label: string; className?: string } | null {
  if (product.totalInventory === 0) {
    return { label: "Out of Stock", className: "bg-muted text-muted-foreground" };
  }
  if (product.isLimitedTimeOffer) {
    return { label: "Limited Time Offer", className: "bg-destructive text-white" };
  }
  const hasDiscount =
    product.compareAtPriceRange &&
    product.compareAtPriceRange.min.amount > product.priceRange.min.amount;
  if (hasDiscount) return { label: "Sale" };
  if (product.isBestseller) return { label: "Best Seller" };
  if (product.isNewArrival) return { label: "New" };
  return null;
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const openQuickView = useUiStore((s) => s.openQuickView);
  const openCart = useUiStore((s) => s.openCart);

  const outOfStock = product.totalInventory === 0;
  const badge = getBadge(product);
  const secondImage = product.images[1];
  const colorOption = product.options.find((o) => o.name.toLowerCase() === "color");
  const swatchValues = colorOption?.values ?? [];
  const visibleSwatches = swatchValues.slice(0, 5);
  const overflowCount = swatchValues.length - visibleSwatches.length;
  const socialProof = useSocialProof(product.id);

  const singleVariant = product.variants.length <= 1 ? product.variants[0] : undefined;

  function addDefaultVariant(thenOpenCart: boolean) {
    if (!singleVariant) {
      openQuickView(product.handle);
      return;
    }
    addItem({
      productId: product.id,
      productHandle: product.handle,
      variantId: singleVariant.id,
      title: product.title,
      variantTitle: singleVariant.title,
      image: product.images[0],
      price: singleVariant.price,
      quantity: 1,
      maxQuantity: singleVariant.inventoryQuantity,
    });
    trackAddToCart({
      contentId: singleVariant.id,
      contentName: product.title,
      value: singleVariant.price.amount,
      currency: singleVariant.price.currencyCode,
      quantity: 1,
    });
    toast.success("Added to cart");
    if (thenOpenCart) openCart();
  }

  return (
    <div className="group relative flex h-full flex-col">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        <Link href={routes.product(product.handle)} className="absolute inset-0">
          <Image
            src={product.images[0]?.url}
            alt={product.images[0]?.altText ?? product.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className={cn(
              "object-contain transition-opacity duration-500",
              outOfStock && "grayscale",
              secondImage && "group-hover:opacity-0",
            )}
          />
          {secondImage && (
            <Image
              src={secondImage.url}
              alt={secondImage.altText ?? product.title}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className={cn(
                "object-contain opacity-0 transition-opacity duration-500 group-hover:opacity-100",
                outOfStock && "grayscale",
              )}
            />
          )}
        </Link>

        {badge && (
          <Badge
            variant={badge.className ? "secondary" : "default"}
            className={cn("absolute top-2 left-2", badge.className)}
          >
            {badge.label}
          </Badge>
        )}

        <WishlistButton product={product} className="absolute top-2 right-2" />

        <div className="pointer-events-none absolute inset-0 hidden items-center justify-center bg-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:flex">
          <Button
            size="sm"
            variant="secondary"
            className="pointer-events-auto shadow-sm"
            onClick={(e) => {
              e.preventDefault();
              openQuickView(product.handle);
            }}
          >
            <span>Quick View</span>
          </Button>
        </div>
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-1">
        <RatingStars rating={product.rating} reviewCount={getReviewCount(product)} size="sm" />
        <Link
          href={routes.product(product.handle)}
          className="truncate text-sm font-medium hover:underline"
        >
          {product.title}
        </Link>
        <p className="text-muted-foreground truncate text-xs">{product.materialsLine}</p>
        <PriceDisplay price={product.priceRange.min} compareAtPrice={product.compareAtPriceRange?.min} />

        <div className="min-h-6">
          {visibleSwatches.length > 0 && (
            <div className="flex items-center gap-1.5">
              {visibleSwatches.map((value) => (
                <div
                  key={value}
                  title={value}
                  className="size-4 rounded-full border border-border"
                  style={{ backgroundColor: swatchColor(value) }}
                />
              ))}
              {overflowCount > 0 && (
                <span className="text-muted-foreground text-[0.65rem]">+{overflowCount}</span>
              )}
            </div>
          )}
        </div>

        <StockBadge quantity={product.totalInventory} />

        {socialProof && (
          <p className="text-muted-foreground text-[0.7rem]">{socialProof.soldLabel}</p>
        )}

        <div className="mt-auto flex items-center gap-2 pt-1">
          {outOfStock ? (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => toast("We'll notify you when this is back")}
            >
              <span>Notify Me</span>
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                className="flex-1"
                onClick={() => addDefaultVariant(false)}
              >
                <span>Add to Cart</span>
              </Button>
              <Button
                size="icon-sm"
                variant="outline"
                aria-label="Quick buy"
                onClick={() => addDefaultVariant(true)}
              >
                <Zap className="size-3.5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
