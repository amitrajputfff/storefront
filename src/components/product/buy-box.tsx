"use client";

import { useMemo, type RefObject } from "react";
import { ShieldCheck, RotateCcw, Truck, CreditCard, Zap, BadgePercent } from "lucide-react";
import { Product, Variant } from "@/types";
import { RETURN_WINDOW_DAYS } from "@/constants/site";
import { PriceDisplay } from "@/components/shared/price-display";
import { CountdownTimer } from "@/components/shared/countdown-timer";
import { RatingStars } from "@/components/product/rating-stars";
import { VariantSelector } from "@/components/product/variant-selector";
import { QuantityPacks } from "@/components/product/quantity-packs";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { RecentPurchasesBadge } from "@/components/product/recent-purchases-badge";
import { estimatedDeliveryLabel } from "@/lib/format";
import { getFlashSaleEndsAt } from "@/lib/urgency";
import { getReviewCount } from "@/mock/reviews";

export function defaultSelectedOptions(product: Product): Record<string, string> {
  const firstAvailable =
    product.variants.find((v) => v.availableForSale) ?? product.variants[0];
  const options: Record<string, string> = {};
  for (const so of firstAvailable?.selectedOptions ?? []) {
    options[so.name] = so.value;
  }
  return options;
}

export function getActiveVariant(
  product: Product,
  selectedOptions: Record<string, string>,
): Variant | undefined {
  return product.variants.find((variant) =>
    variant.selectedOptions.every((so) => selectedOptions[so.name] === so.value),
  );
}

export function BuyBox({
  product,
  selectedOptions,
  onSelectedOptionsChange,
  quantity,
  onQuantityChange,
  activeVariant,
  ctaRef,
}: {
  product: Product;
  selectedOptions: Record<string, string>;
  onSelectedOptionsChange: (name: string, value: string) => void;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  activeVariant: Variant | undefined;
  ctaRef?: RefObject<HTMLDivElement | null>;
}) {
  const price = activeVariant?.price ?? product.priceRange.min;
  const compareAtPrice = activeVariant?.compareAtPrice;
  const inventory = activeVariant?.inventoryQuantity ?? product.totalInventory;
  const maxQty = Math.max(1, Math.min(inventory, 10));
  const flashSaleEndsAt = useMemo(() => getFlashSaleEndsAt(), []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-medium tracking-tight md:text-3xl">{product.title}</h1>
        <a href="#reviews" className="mt-2 inline-flex items-center gap-2">
          <RatingStars rating={product.rating} reviewCount={getReviewCount(product)} />
        </a>
      </div>

      <PriceDisplay price={price} compareAtPrice={compareAtPrice} size="lg" />

      {product.isLimitedTimeOffer && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-destructive inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-white">
            <Zap className="size-3.5 shrink-0" />
            Limited Time Offer
          </span>
          <CountdownTimer endsAt={flashSaleEndsAt} size="sm" />
        </div>
      )}

      <p className="text-muted-foreground flex flex-wrap items-center gap-x-1.5 text-xs">
        {inventory <= 5 && (
          <>
            <span className="flex items-center gap-1.5">
              <span className="bg-muted-foreground size-1 rounded-full" />
              Only {inventory} left
            </span>
            <span aria-hidden className="opacity-60">
              •
            </span>
          </>
        )}
        <RecentPurchasesBadge product={product} />
      </p>

      {product.options.length > 0 && (
        <VariantSelector
          product={product}
          selectedOptions={selectedOptions}
          onChange={onSelectedOptionsChange}
        />
      )}

      <QuantityPacks quantity={quantity} onChange={onQuantityChange} maxQuantity={maxQty} />

      <div className="bg-success/10 text-success flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium">
        <BadgePercent className="size-4 shrink-0" />
        Get an extra 10% off when you pay online instead of Cash on Delivery
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { icon: Truck, label: estimatedDeliveryLabel(new Date(), product.minDeliveryDays, product.maxDeliveryDays) },
          { icon: RotateCcw, label: `${RETURN_WINDOW_DAYS} Day Easy Returns` },
          { icon: ShieldCheck, label: "Secure Payments" },
          { icon: CreditCard, label: "Cash on Delivery" },
        ].map(({ icon: Icon, label }) => (
          <span
            key={label}
            className="text-muted-foreground flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs"
          >
            <Icon className="size-3.5 shrink-0" />
            {label}
          </span>
        ))}
      </div>

      <div ref={ctaRef}>
        <AddToCartButton
          product={product}
          variant={activeVariant}
          quantity={quantity}
          showBuyNow
        />
      </div>
    </div>
  );
}
