"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useCart } from "@/hooks/use-cart";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { EmptyCart } from "@/components/cart/empty-cart";
import { FreeShippingProgress } from "@/components/cart/free-shipping-progress";
import { PromoCodeInput } from "@/components/cart/promo-code-input";
import { Button } from "@/components/ui/button";
import { createCheckoutUrl } from "@/lib/shopify/cart";
import { Money } from "@/types";

export default function CartPage() {
  const { items, subtotal } = useCart();
  const [discount, setDiscount] = useState<Money | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);

  const total = Math.max(subtotal.amount - (discount?.amount ?? 0), 0);

  async function handleCheckout() {
    setCheckingOut(true);
    try {
      const checkoutUrl = await createCheckoutUrl(
        items.map((item) => ({ variantId: item.variantId, quantity: item.quantity })),
      );
      window.location.href = checkoutUrl;
    } catch {
      toast.error("Checkout isn't connected to Shopify yet.");
      setCheckingOut(false);
    }
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

          <Button size="lg" className="w-full" disabled={checkingOut} onClick={handleCheckout}>
            {checkingOut && <Loader2 className="size-4 animate-spin" />}
            <span>
              {checkingOut
                ? "Redirecting to checkout…"
                : `Checkout — ${new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(total)}`}
            </span>
          </Button>
        </div>
      )}
    </main>
  );
}
