"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Product } from "@/types";
import { formatMoney } from "@/lib/format";
import { useCart } from "@/hooks/use-cart";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/shared/price-display";
import { routes } from "@/constants/routes";
import { trackAddToCart } from "@/lib/meta-pixel";

export function Bundle({
  product,
  relatedProducts,
}: {
  product: Product;
  relatedProducts: Product[];
}) {
  const { addItem } = useCart();
  const items = useMemo(() => [product, ...relatedProducts.slice(0, 2)], [product, relatedProducts]);

  const [checked, setChecked] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(items.map((item) => [item.id, true])),
  );

  const total = items.reduce(
    (sum, item) => sum + (checked[item.id] ? item.priceRange.min.amount : 0),
    0,
  );

  if (relatedProducts.length === 0) return null;

  function handleAddSelected() {
    const selected = items.filter((item) => checked[item.id]);
    for (const item of selected) {
      const variant = item.variants.find((v) => v.availableForSale) ?? item.variants[0];
      if (!variant) continue;
      addItem({
        productId: item.id,
        productHandle: item.handle,
        variantId: variant.id,
        title: item.title,
        variantTitle: variant.title,
        image: item.images[0],
        price: variant.price,
        quantity: 1,
        maxQuantity: variant.inventoryQuantity,
      });
      trackAddToCart({
        contentId: variant.id,
        contentName: item.title,
        value: variant.price.amount,
        currency: variant.price.currencyCode,
        quantity: 1,
      });
    }
    toast.success("Added to cart");
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-medium">Frequently Bought Together</h2>

      <div className="flex items-start gap-3 overflow-x-auto pb-1">
        {items.map((item, index) => (
          <div key={item.id} className="flex shrink-0 items-start gap-3">
            {index > 0 && <Plus className="text-muted-foreground mt-8 size-4 shrink-0" />}
            <div className="flex w-auto shrink-0 flex-col items-center gap-2">
              <Link
                href={routes.product(item.handle)}
                className="relative size-20 shrink-0 overflow-hidden rounded-md bg-muted"
              >
                <Image
                  src={item.images[0]?.url}
                  alt={item.images[0]?.altText ?? item.title}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </Link>
              <div className="flex items-start gap-1.5">
                <Checkbox
                  className="mt-0.5 shrink-0"
                  checked={checked[item.id]}
                  onCheckedChange={(value) =>
                    setChecked((prev) => ({ ...prev, [item.id]: value === true }))
                  }
                />
                <Link
                  href={routes.product(item.handle)}
                  className="line-clamp-2 text-center text-xs leading-tight hover:underline"
                >
                  {item.title}
                </Link>
              </div>
              <PriceDisplay
                price={item.priceRange.min}
                compareAtPrice={item.compareAtPriceRange?.min}
                size="sm"
                className="justify-center"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
        <div>
          <p className="text-muted-foreground text-xs">Total price</p>
          <p className="text-lg font-medium tabular-nums">{formatMoney({ amount: total, currencyCode: "INR" })}</p>
        </div>
        <Button onClick={handleAddSelected}>
          <span>Add selected to cart</span>
        </Button>
      </div>
    </section>
  );
}
