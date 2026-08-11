"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { AnimatePresence } from "motion/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useUiStore } from "@/stores/ui-store";
import { useCart } from "@/hooks/use-cart";
import { useBuyNowStore } from "@/stores/buy-now-store";
import { getAllProducts, getProductsByCategory } from "@/mock/products";
import { trackAddToCart } from "@/lib/meta-pixel";
import { Money, Product } from "@/types";
import { routes } from "@/constants/routes";
import { formatMoney } from "@/lib/format";
import { FreeShippingProgress } from "./free-shipping-progress";
import { EmptyCart } from "./empty-cart";
import { CartLineItem } from "./cart-line-item";
import { PromoCodeInput } from "./promo-code-input";
import { CartSummary } from "./cart-summary";

export function CartDrawer() {
  const router = useRouter();
  const { isCartOpen, closeCart } = useUiStore();
  const { items, subtotal, totalQuantity, addItem } = useCart();
  const clearBuyNow = useBuyNowStore((s) => s.clear);
  const [discount, setDiscount] = useState<Money | null>(null);
  const [recommended, setRecommended] = useState<Product[]>([]);
  const addGuardRef = useRef<Set<string>>(new Set());

  function handleCheckout() {
    clearBuyNow();
    closeCart();
    router.push(routes.checkout());
  }

  useEffect(() => {
    let active = true;

    async function loadRecommended() {
      const allProducts = await getAllProducts();
      const firstItem = items[0];
      const category = firstItem
        ? allProducts.find((p) => p.id === firstItem.productId)?.categories[0]
        : undefined;
      const pool = category ? await getProductsByCategory(category) : allProducts;
      if (!active) return;
      setRecommended(
        pool.filter((p) => !items.some((i) => i.productId === p.id)).slice(0, 3),
      );
    }

    loadRecommended();
    return () => {
      active = false;
    };
  }, [items]);

  const total: Money = {
    amount: Math.max(subtotal.amount - (discount?.amount ?? 0), 0),
    currencyCode: subtotal.currencyCode,
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent side="right" className="gap-0">
        <SheetHeader className="border-b border-border">
          <SheetTitle>Your Cart ({totalQuantity})</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          <FreeShippingProgress />
          <Separator />

          {items.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="divide-y divide-border px-6">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <CartLineItem key={item.id} item={item} />
                ))}
              </AnimatePresence>
            </div>
          )}

          {recommended.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3 px-6 py-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  You might also like
                </p>
                <div className="space-y-3">
                  {recommended.map((product) => (
                    <div key={product.id} className="flex items-center gap-3">
                      <Link
                        href={routes.product(product.handle)}
                        className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted"
                      >
                        <Image
                          src={product.images[0].url}
                          alt={product.images[0].altText}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <Link
                          href={routes.product(product.handle)}
                          className="block truncate text-sm font-medium hover:underline"
                        >
                          {product.title}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {formatMoney(product.priceRange.min)}
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label={`Add ${product.title} to cart`}
                        onClick={() => {
                          // Guards against a fast double-click firing addItem + trackAddToCart twice.
                          if (addGuardRef.current.has(product.id)) return;
                          addGuardRef.current.add(product.id);
                          setTimeout(() => addGuardRef.current.delete(product.id), 800);

                          const variant = product.variants[0];
                          addItem({
                            productId: product.id,
                            productHandle: product.handle,
                            variantId: variant.id,
                            title: product.title,
                            variantTitle: variant.title,
                            image: product.images[0],
                            price: variant.price,
                            quantity: 1,
                            maxQuantity: variant.inventoryQuantity,
                          });
                          trackAddToCart({
                            contentId: variant.id,
                            contentName: product.title,
                            value: variant.price.amount,
                            currency: variant.price.currencyCode,
                            quantity: 1,
                          });
                        }}
                        className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border hover:bg-muted"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {items.length > 0 && (
            <>
              <Separator />
              <PromoCodeInput subtotal={subtotal} onApply={setDiscount} />
            </>
          )}
        </div>

        {items.length > 0 && (
          <div className="mt-auto border-t border-border">
            <CartSummary subtotal={subtotal} discount={discount ?? undefined} />
            <div className="px-6 pb-6">
              <button
                type="button"
                onClick={handleCheckout}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-70"
              >
                <span>{`Checkout — ${formatMoney(total)}`}</span>
              </button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
