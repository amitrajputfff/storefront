"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "motion/react";
import { useCart } from "@/hooks/use-cart";
import { useBuyNowStore } from "@/stores/buy-now-store";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { EmptyCart } from "@/components/cart/empty-cart";
import { FreeShippingProgress } from "@/components/cart/free-shipping-progress";
import { ReservationBanner } from "@/components/cart/reservation-banner";
import { PromoCodeInput } from "@/components/cart/promo-code-input";
import { Button } from "@/components/ui/button";
import { routes } from "@/constants/routes";
import { Money } from "@/types";

export default function CartPage() {
  const router = useRouter();
  const { items, subtotal } = useCart();
  const clearBuyNow = useBuyNowStore((s) => s.clear);
  const [discount, setDiscount] = useState<Money | null>(null);

  const total = Math.max(subtotal.amount - (discount?.amount ?? 0), 0);

  function goToCheckout() {
    clearBuyNow();
    router.push(routes.checkout());
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 md:py-16">
      <h1 className="mb-8 text-2xl font-medium md:text-3xl">
        Your Cart {items.length > 0 && `(${items.length})`}
      </h1>

      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="space-y-8">
          <ReservationBanner items={items} />
          <FreeShippingProgress />

          <div className="divide-y border-y">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <CartLineItem key={item.id} item={item} />
              ))}
            </AnimatePresence>
          </div>

          <PromoCodeInput subtotal={subtotal} onApply={setDiscount} />
          <CartSummary subtotal={subtotal} discount={discount ?? undefined} />

          <Button size="lg" className="w-full" onClick={goToCheckout}>
            <span>
              {`Checkout — ${new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(total)}`}
            </span>
          </Button>
        </div>
      )}
    </main>
  );
}
