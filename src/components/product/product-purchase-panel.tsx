"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Product } from "@/types";
import { BuyBox, defaultSelectedOptions, getActiveVariant } from "@/components/product/buy-box";
import { StickyBuyBar } from "@/components/product/sticky-buy-bar";
import { useInViewport } from "@/hooks/use-in-viewport";
import { PromoCode } from "@/lib/shopify/discounts";
import { trackViewContent } from "@/lib/meta-pixel";

export function ProductPurchasePanel({
  product,
  promoCodes,
  benefits,
}: {
  product: Product;
  promoCodes: PromoCode[];
  benefits: string[];
}) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() =>
    defaultSelectedOptions(product),
  );
  const [quantity, setQuantity] = useState(1);
  const ctaRef = useRef<HTMLDivElement>(null);
  const ctaVisible = useInViewport(ctaRef);

  const activeVariant = useMemo(
    () => getActiveVariant(product, selectedOptions),
    [product, selectedOptions],
  );

  useEffect(() => {
    if (!activeVariant) return;
    trackViewContent({
      contentId: activeVariant.id,
      contentName: product.title,
      value: activeVariant.price.amount,
      currency: activeVariant.price.currencyCode,
    });
  }, [activeVariant, product.title]);

  return (
    <>
      <BuyBox
        product={product}
        promoCodes={promoCodes}
        benefits={benefits}
        selectedOptions={selectedOptions}
        onSelectedOptionsChange={(name, value) =>
          setSelectedOptions((prev) => ({ ...prev, [name]: value }))
        }
        quantity={quantity}
        onQuantityChange={setQuantity}
        activeVariant={activeVariant}
        ctaRef={ctaRef}
      />
      {!ctaVisible && (
        <StickyBuyBar product={product} variant={activeVariant} quantity={quantity} />
      )}
    </>
  );
}
