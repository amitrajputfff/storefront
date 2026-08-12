"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import {
  CheckCircle2,
  Banknote,
  Truck,
  Copy,
  Check,
  MapPin,
  Phone,
  Mail,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Confetti, type ConfettiRef } from "@/components/ui/confetti";
import { routes } from "@/constants/routes";
import { formatMoney, estimatedDeliveryLabel } from "@/lib/format";
import { useLastOrderStore } from "@/stores/last-order-store";

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderFromUrl = searchParams.get("order");
  const summary = useLastOrderStore((s) => s.summary);
  const clearSummary = useLastOrderStore((s) => s.clear);
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const confettiRef = useRef<ConfettiRef>(null);

  // Only trust the stored summary if it actually matches the order in the URL —
  // guards against showing a stale summary from a previous order in this tab.
  const summaryMatches = !!summary && (!orderFromUrl || summary.orderName === orderFromUrl);
  const orderName = (summaryMatches ? summary?.orderName : undefined) ?? orderFromUrl ?? undefined;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!orderName) return;
    confettiRef.current?.fire({ particleCount: 90, spread: 80, origin: { x: 0.5, y: 0.35 } });
    const timers = [
      setTimeout(
        () => confettiRef.current?.fire({ particleCount: 50, angle: 60, spread: 60, origin: { x: 0, y: 0.6 } }),
        200,
      ),
      setTimeout(
        () => confettiRef.current?.fire({ particleCount: 50, angle: 120, spread: 60, origin: { x: 1, y: 0.6 } }),
        200,
      ),
    ];
    return () => timers.forEach(clearTimeout);
  }, [orderName]);

  // Purchase is intentionally NOT tracked from here. It's sent server-side instead,
  // from the orders/create Shopify webhook (see src/lib/shopify/meta-capi.ts) —
  // that's the only reliable signal for COD orders, which are completed via the
  // Admin API and never touch Shopify's hosted checkout (no browser session for
  // Shopify's own native Facebook & Instagram channel to observe). Pairing our own
  // browser-side Purchase alongside a server-side one previously left ~36% of
  // orders double-counted in Meta (confirmed via Events Manager's deduplication
  // panel) — don't re-add a client-side trackPurchase() call here.

  function copyOrderName() {
    if (!orderName) return;
    navigator.clipboard.writeText(orderName);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const shipping = summaryMatches ? summary?.shipping : undefined;
  const addressLines = shipping
    ? [shipping.address1, shipping.address2].filter(Boolean).join(", ") +
      ` — ${shipping.city}, ${shipping.state} ${shipping.pincode}`
    : null;

  return (
    <main className="relative mx-auto max-w-lg px-6 py-16 text-center">
      <Confetti
        ref={confettiRef}
        manualstart
        className="pointer-events-none fixed inset-0 z-50 size-full"
      />

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-success/10"
      >
        <CheckCircle2 className="size-8 text-success" />
      </motion.div>

      <motion.div
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.3 }}
      >
        <h1 className="mb-2 text-2xl font-medium md:text-3xl">Order placed!</h1>
        <p className="mb-5 text-muted-foreground">Thank you — your order has been confirmed.</p>
      </motion.div>

      {orderName && (
        <motion.button
          type="button"
          onClick={copyOrderName}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.3 }}
          className="mx-auto mb-8 flex items-center gap-2.5 rounded-full border bg-muted/40 px-4 py-2 text-sm hover:bg-muted"
        >
          <Package className="size-4 text-muted-foreground" />
          <span className="font-mono font-medium">{orderName}</span>
          {copied ? (
            <Check className="size-3.5 text-success" />
          ) : (
            <Copy className="size-3.5 text-muted-foreground" />
          )}
        </motion.button>
      )}

      {mounted && summaryMatches && summary && (
        <div className="mb-6 flex flex-col gap-4 rounded-lg border p-5 text-left">
          <h2 className="text-sm font-semibold">Order Summary</h2>
          <div className="flex flex-col gap-3">
            {summary.lines.map((line, index) => (
              <div key={index} className="flex gap-3">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={line.image.url}
                    alt={line.image.altText}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-0.5">
                  <span className="text-sm font-medium">{line.title}</span>
                  <span className="text-xs text-muted-foreground">{line.variantTitle}</span>
                  <span className="text-xs text-muted-foreground">Qty {line.quantity}</span>
                </div>
                <span className="shrink-0 text-sm font-medium tabular-nums">
                  {formatMoney({ amount: line.price.amount * line.quantity, currencyCode: "INR" })}
                </span>
              </div>
            ))}
          </div>

          <Separator />

          <div className="flex flex-col gap-1.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="tabular-nums">{formatMoney({ amount: summary.subtotal, currencyCode: "INR" })}</span>
            </div>
            {summary.discountAmount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Discount</span>
                <span className="tabular-nums">
                  -{formatMoney({ amount: summary.discountAmount, currencyCode: "INR" })}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>Free</span>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between text-base font-medium">
            <span>Total</span>
            <span className="tabular-nums">{formatMoney({ amount: summary.total, currencyCode: "INR" })}</span>
          </div>
        </div>
      )}

      {mounted && shipping && (
        <div className="mb-6 flex flex-col gap-3 rounded-lg border p-5 text-left">
          <h2 className="text-sm font-semibold">Delivery Details</h2>
          <div className="flex items-start gap-2.5 text-sm">
            <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="font-medium">{shipping.fullName}</p>
              <p className="text-muted-foreground">{addressLines}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-sm">
            <Phone className="size-4 shrink-0 text-muted-foreground" />
            <span>+91 {shipping.phone}</span>
          </div>
          {shipping.email && (
            <div className="flex items-center gap-2.5 text-sm">
              <Mail className="size-4 shrink-0 text-muted-foreground" />
              <span>{shipping.email}</span>
            </div>
          )}
        </div>
      )}

      <div className="mb-8 flex flex-col gap-3 rounded-lg border p-5 text-left">
        <div className="flex items-center gap-2.5 text-sm">
          <Banknote className="size-4 shrink-0 text-muted-foreground" />
          <span>Pay in cash to the delivery agent when your order arrives</span>
        </div>
        <div className="flex items-center gap-2.5 text-sm">
          <Truck className="size-4 shrink-0 text-muted-foreground" />
          <span>{estimatedDeliveryLabel(new Date())}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        {orderName && (
          <Button
            variant="outline"
            render={<Link href={routes.trackOrder()} onClick={() => clearSummary()} />}
            nativeButton={false}
          >
            <span>Track Order</span>
          </Button>
        )}
        <Button render={<Link href={routes.shop()} onClick={() => clearSummary()} />} nativeButton={false}>
          <span>Continue Shopping</span>
        </Button>
      </div>
    </main>
  );
}
