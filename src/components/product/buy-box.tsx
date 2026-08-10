"use client";

import { useState, type RefObject } from "react";
import { ShieldCheck, RotateCcw, Truck, CreditCard, Zap, BadgePercent, TriangleAlert } from "lucide-react";
import { Product, Variant } from "@/types";
import { RETURN_WINDOW_DAYS } from "@/constants/site";
import { PriceDisplay } from "@/components/shared/price-display";
import { CountdownTimer } from "@/components/shared/countdown-timer";
import { RatingStars } from "@/components/product/rating-stars";
import { VariantSelector } from "@/components/product/variant-selector";
import { QuantityPacks } from "@/components/product/quantity-packs";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { RecentPurchasesBadge } from "@/components/product/recent-purchases-badge";
import { StockProgressBar } from "@/components/product/stock-progress-bar";
import { KeyBenefits } from "@/components/product/key-benefits";
import { GuaranteeBadge } from "@/components/product/guarantee-badge";
import { PromoCodeChips } from "@/components/product/promo-code-chips";
import { estimatedDeliveryLabel } from "@/lib/format";
import { getFlashSaleEndsAt } from "@/lib/urgency";
import { getReviewCount } from "@/mock/reviews";
import { PromoCode } from "@/lib/shopify/discounts";

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
  promoCodes,
  selectedOptions,
  onSelectedOptionsChange,
  quantity,
  onQuantityChange,
  activeVariant,
  ctaRef,
  benefits,
}: {
  product: Product;
  promoCodes: PromoCode[];
  selectedOptions: Record<string, string>;
  onSelectedOptionsChange: (name: string, value: string) => void;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  activeVariant: Variant | undefined;
  ctaRef?: RefObject<HTMLDivElement | null>;
  benefits: string[];
}) {
  const price = activeVariant?.price ?? product.priceRange.min;
  const compareAtPrice = activeVariant?.compareAtPrice;
  const inventory = activeVariant?.inventoryQuantity ?? product.totalInventory;
  const maxQty = Math.max(1, Math.min(inventory, 10));
  const [flashSaleEndsAt, setFlashSaleEndsAt] = useState(() => getFlashSaleEndsAt());

  return (
    <div className="flex flex-col gap-4 max-w-sm sm:max-w-none">
      <div className="flex flex-col gap-2">
        <div>
          <h1 className="text-2xl font-medium tracking-tight md:text-3xl">{product.title}</h1>
          <a href="#reviews" className="mt-2 inline-flex items-center gap-2">
            <RatingStars rating={product.rating} reviewCount={getReviewCount(product)} />
          </a>
        </div>

        <PriceDisplay price={price} compareAtPrice={compareAtPrice} size="xl" />

        <KeyBenefits benefits={benefits} />
      </div>

      {product.isLimitedTimeOffer && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-rose-300/70 bg-gradient-to-r from-rose-600 via-rose-500 to-orange-500 px-3.5 py-2.5 text-white shadow-md">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
            <Zap className="size-3.5 shrink-0" />
            Limited Time Offer
          </span>
          <CountdownTimer
            endsAt={flashSaleEndsAt}
            size="sm"
            className="bg-white text-rose-700 shadow-sm"
            onExpire={() => setFlashSaleEndsAt(getFlashSaleEndsAt())}
          />
        </div>
      )}

      {inventory <= 5 && (
        <div className="bg-gold/10 border-gold/30 text-foreground flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium">
          <TriangleAlert className="text-gold size-3.5 shrink-0" />
          Only {inventory} left in stock — order soon
        </div>
      )}

      <div className="flex flex-wrap items-center gap-x-1.5">
        <RecentPurchasesBadge product={product} />
      </div>

      {product.options.length > 0 && (
        <VariantSelector
          product={product}
          selectedOptions={selectedOptions}
          onChange={onSelectedOptionsChange}
        />
      )}

      <QuantityPacks quantity={quantity} onChange={onQuantityChange} maxQuantity={maxQty} />

      {promoCodes.length > 0 ? (
        <PromoCodeChips codes={promoCodes} />
      ) : (
        <div className="bg-success/10 text-success flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium">
          <BadgePercent className="size-4 shrink-0" />
          Get an extra 10% off when you pay online instead of Cash on Delivery
        </div>
      )}

      <div className="flex items-center gap-2 rounded-lg border border-green-300 bg-green-50 px-3 py-2 text-sm font-semibold text-green-950 dark:border-green-700 dark:bg-green-950/40 dark:text-green-50">
        <Truck className="size-4 shrink-0" />
        {estimatedDeliveryLabel(new Date(), product.minDeliveryDays, product.maxDeliveryDays)}
      </div>

      <div className="flex flex-wrap gap-2">
        {[
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

      <GuaranteeBadge />

      <StockProgressBar productId={product.id} />
    </div>
  );
}
