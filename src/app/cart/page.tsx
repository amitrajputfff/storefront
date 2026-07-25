"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { useCart } from "@/hooks/use-cart";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { EmptyCart } from "@/components/cart/empty-cart";
import { FreeShippingProgress } from "@/components/cart/free-shipping-progress";
import { PromoCodeInput } from "@/components/cart/promo-code-input";
import { Button } from "@/components/ui/button";
import { Money } from "@/types";

export default function CartPage() {
  const { items, subtotal } = useCart();
  const [discount, setDiscount] = useState<Money | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const total = Math.max(subtotal.amount - (discount?.amount ?? 0), 0);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 md:py-16">
      <h1 className="mb-8 text-2xl font-medium md:text-3xl">
        Your Cart {items.length > 0 && `(${items.length})`}
      </h1>

      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="space-y-8">
          <FreeShippingProgress subtotal={subtotal} />

          <div className="divide-y border-y">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <CartLineItem key={item.id} item={item} />
              ))}
            </AnimatePresence>
          </div>

          <PromoCodeInput subtotal={subtotal} onApply={setDiscount} />
          <CartSummary subtotal={subtotal} discount={discount ?? undefined} />

          {confirmed ? (
            <div className="rounded-xl border p-6 text-center">
              <p className="font-medium">Order confirmed</p>
              <p className="text-muted-foreground mt-1 text-sm">
                This is a demo storefront — checkout will connect to Shopify at launch.
              </p>
            </div>
          ) : (
            <Button size="lg" className="w-full" onClick={() => setConfirmed(true)}>
              <span>
                Checkout — {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(total)}
              </span>
            </Button>
          )}
        </div>
      )}
    </main>
  );
}
