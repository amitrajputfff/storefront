"use client";

import { useMemo, useState } from "react";
import { ShieldCheck, RotateCcw, Truck, MessageCircle, CreditCard } from "lucide-react";
import { Product } from "@/types";
import { PriceDisplay } from "@/components/shared/price-display";
import { RatingStars } from "@/components/product/rating-stars";
import { VariantSelector } from "@/components/product/variant-selector";
import { QuantityPacks } from "@/components/product/quantity-packs";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { estimatedDeliveryLabel } from "@/lib/format";
import { getSocialProofStats } from "@/lib/social-proof";

function defaultSelectedOptions(product: Product): Record<string, string> {
  const firstAvailable =
    product.variants.find((v) => v.availableForSale) ?? product.variants[0];
  const options: Record<string, string> = {};
  for (const so of firstAvailable?.selectedOptions ?? []) {
    options[so.name] = so.value;
  }
  return options;
}

export function BuyBox({ product }: { product: Product }) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() =>
    defaultSelectedOptions(product),
  );
  const [quantity, setQuantity] = useState(1);

  const activeVariant = useMemo(
    () =>
      product.variants.find((variant) =>
        variant.selectedOptions.every((so) => selectedOptions[so.name] === so.value),
      ),
    [product.variants, selectedOptions],
  );

  const price = activeVariant?.price ?? product.priceRange.min;
  const compareAtPrice = activeVariant?.compareAtPrice;
  const inventory = activeVariant?.inventoryQuantity ?? product.totalInventory;
  const maxQty = Math.max(1, Math.min(inventory, 10));
  const socialProof = getSocialProofStats(product.id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-medium tracking-tight md:text-3xl">{product.title}</h1>
        <p className="text-muted-foreground mt-2 flex flex-wrap items-center gap-x-1.5 text-xs">
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
          <span>{socialProof.soldLabel}</span>
          <span aria-hidden className="opacity-60">
            •
          </span>
          <span>{socialProof.visitorCount} Visitors</span>
        </p>
        <a href="#reviews" className="mt-2 inline-flex items-center gap-2">
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
        </a>
      </div>

      <PriceDisplay price={price} compareAtPrice={compareAtPrice} size="lg" />

      {product.options.length > 0 && (
        <VariantSelector
          product={product}
          selectedOptions={selectedOptions}
          onChange={(name, value) =>
            setSelectedOptions((prev) => ({ ...prev, [name]: value }))
          }
        />
      )}

      <QuantityPacks quantity={quantity} onChange={setQuantity} maxQuantity={maxQty} />

      <div className="flex flex-wrap gap-2">
        {[
          { icon: Truck, label: "Fast Delivery" },
          { icon: MessageCircle, label: "Quick Response" },
          { icon: RotateCcw, label: "Easy Returns" },
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

      <div className="flex items-center gap-2 text-sm">
        <Truck className="size-4 shrink-0" />
        <span>{estimatedDeliveryLabel(new Date())}</span>
      </div>

      <AddToCartButton
        product={product}
        variant={activeVariant}
        quantity={quantity}
        showBuyNow
      />
    </div>
  );
}
