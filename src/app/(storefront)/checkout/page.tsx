"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Banknote,
  CreditCard,
  Loader2,
  MapPin,
  ShieldCheck,
  Check,
  X,
  Minus,
  Plus,
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { BuyNowItem, useBuyNowStore } from "@/stores/buy-now-store";
import { useLastOrderStore } from "@/stores/last-order-store";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { cartSubtotal } from "@/stores/cart-store";
import { checkoutSchema, checkoutDefaultValues, CheckoutValues } from "@/lib/checkout/schema";
import { lookupPincode } from "@/lib/pincode";
import { createCheckoutUrl } from "@/lib/shopify/cart";
import { createCodOrder } from "@/lib/shopify/create-order";
import { trackInitiateCheckout } from "@/lib/meta-pixel";
import { INDIAN_STATES } from "@/constants/india";
import { routes } from "@/constants/routes";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import { CartItem } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { PaymentIconGroup } from "@/components/product/payment-icon-badge";
import { CheckoutPriceLockTimer } from "@/components/checkout/price-lock-timer";
import { AddressSearchInput } from "@/components/checkout/address-search-input";

const onlinePaymentIcons = [
  { src: "/payments/gpay.png", alt: "Google Pay" },
  { src: "/payments/phonepe.png", alt: "PhonePe" },
  { src: "/payments/paytm.png", alt: "Paytm" },
] as const;

export default function CheckoutPage() {
  const router = useRouter();
  const { items: cartItems, addItem, clearCart, updateQuantity, removeItem } = useCart();
  const buyNowItem = useBuyNowStore((s) => s.item);
  const clearBuyNow = useBuyNowStore((s) => s.clear);
  const setLastOrder = useLastOrderStore((s) => s.setSummary);
  const [pincodeStatus, setPincodeStatus] = useState<"idle" | "loading" | "found" | "not-found">(
    "idle",
  );

  const isBuyNow = !!buyNowItem;
  // Set the instant the order succeeds, before clearBuyNow()/clearCart() run —
  // those clear the global store synchronously, which would otherwise
  // re-render this still-mounted page showing whatever's left in the cart
  // (e.g. an unrelated item from days ago) for a flash before the redirect
  // to /checkout/success completes.
  const placedItemsRef = useRef<CartItem[] | null>(null);
  const effectiveItems: CartItem[] =
    placedItemsRef.current ??
    (isBuyNow ? [{ ...buyNowItem, id: "buy-now", addedAt: 0 }] : cartItems);
  const shouldMoveBuyNowToCartOnExit = useRef(false);
  const buyNowItemRef = useRef<BuyNowItem | null>(null);
  const addItemRef = useRef(addItem);
  const clearBuyNowRef = useRef(clearBuyNow);

  buyNowItemRef.current = buyNowItem;
  shouldMoveBuyNowToCartOnExit.current = isBuyNow;
  addItemRef.current = addItem;
  clearBuyNowRef.current = clearBuyNow;

  const singleItem = effectiveItems.length === 1 ? effectiveItems[0] : null;

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: checkoutDefaultValues,
  });

  const paymentMethod = watch("paymentMethod");
  const pincode = watch("pincode");
  const debouncedPincode = useDebouncedValue(pincode, 400);

  function applyDetectedLocation(city: string, state: string) {
    setValue("city", city, { shouldValidate: true });
    const matchedState = INDIAN_STATES.find((s) => s.toLowerCase() === state.toLowerCase());
    if (matchedState) {
      setValue("state", matchedState, { shouldValidate: true });
    }
  }

  useEffect(() => {
    if (!/^[1-9]\d{5}$/.test(debouncedPincode)) {
      setPincodeStatus("idle");
      return;
    }

    let cancelled = false;
    setPincodeStatus("loading");

    lookupPincode(debouncedPincode).then((result) => {
      if (cancelled) return;
      if (result.valid) {
        applyDetectedLocation(result.city, result.state);
        setPincodeStatus("found");
      } else {
        setPincodeStatus("not-found");
      }
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedPincode]);

  const lineItems = effectiveItems.map((item) => ({
    variantId: item.variantId,
    quantity: item.quantity,
  }));

  const subtotalAmount = cartSubtotal(effectiveItems).amount;
  const discountAmount = 0;
  const total = subtotalAmount;

  useEffect(() => {
    if (effectiveItems.length === 0) return;
    // Dedupe per cart contents, not just per mount — otherwise reloading /checkout
    // or navigating back to it (items still in localStorage) refires this every time.
    const checkoutSignature = effectiveItems
      .map((item) => `${item.variantId}:${item.quantity}`)
      .sort()
      .join("|");
    const dedupeKey = `meta-pixel-initiate-checkout:${checkoutSignature}`;
    if (sessionStorage.getItem(dedupeKey) === "1") return;
    sessionStorage.setItem(dedupeKey, "1");

    trackInitiateCheckout({
      contentIds: effectiveItems.map((item) => item.variantId),
      value: subtotalAmount,
      currency: "INR",
      numItems: effectiveItems.reduce((sum, item) => sum + item.quantity, 0),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveItems.length > 0]);

  async function onSubmit(values: CheckoutValues) {
    const customer = {
      fullName: values.fullName,
      phone: values.phone,
      email: values.email || undefined,
      address1: values.address1,
      address2: values.address2 || undefined,
      city: values.city,
      state: values.state,
      pincode: values.pincode,
    };

    if (values.paymentMethod === "online") {
      try {
        const checkoutUrl = await createCheckoutUrl(lineItems, customer);
        window.location.href = checkoutUrl;
      } catch {
        toast.error("Couldn't start checkout — please try again.");
      }
      return;
    }

    const result = await createCodOrder({
      lineItems,
      customer,
    });

    if (result.success) {
      shouldMoveBuyNowToCartOnExit.current = false;
      placedItemsRef.current = effectiveItems;
      setLastOrder({
        orderName: result.orderName,
        lines: effectiveItems.map((item) => ({
          variantId: item.variantId,
          title: item.title,
          variantTitle: item.variantTitle,
          image: item.image,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal: subtotalAmount,
        discountAmount,
        total,
        paymentMethod: "cod",
        shipping: customer,
        placedAt: Date.now(),
      });

      if (isBuyNow) {
        clearBuyNow();
      } else {
        clearCart();
      }
      // replace, not push — a completed order shouldn't leave a live, stale
      // checkout form one "back" tap away.
      router.replace(`/checkout/success?order=${encodeURIComponent(result.orderName)}`);
    } else {
      toast.error(result.error);
    }
  }

  useEffect(() => {
    return () => {
      if (shouldMoveBuyNowToCartOnExit.current && buyNowItemRef.current) {
        addItemRef.current(buyNowItemRef.current);
        clearBuyNowRef.current();
      }
    };
  }, []);

  if (effectiveItems.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="mb-3 text-2xl font-medium">Your cart is empty</h1>
        <p className="mb-6 text-muted-foreground">Add something you love before checking out.</p>
        <Button render={<Link href={routes.shop()} />} nativeButton={false}>
          <span>Continue Shopping</span>
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 md:py-16 md:pb-16 pb-24">
      <h1 className="mb-8 text-2xl font-medium md:text-3xl">Checkout</h1>

      <form
        id="checkout-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="grid gap-10 md:grid-cols-[1fr_360px]"
      >
        <div className="flex flex-col gap-8">
          <section className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold">Contact &amp; Shipping</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" placeholder="Priya Sharma" aria-invalid={!!errors.fullName} {...register("fullName")} />
                {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="phone">Mobile Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="98765 43210"
                  aria-invalid={!!errors.phone}
                  {...register("phone")}
                />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="address1">Address</Label>
                <Controller
                  control={control}
                  name="address1"
                  render={({ field }) => (
                    <AddressSearchInput
                      id="address1"
                      value={field.value}
                      onChange={field.onChange}
                      ariaInvalid={!!errors.address1}
                      placeholder="Start typing your address…"
                      onSelectSuggestion={(suggestion) => {
                        setValue("address1", suggestion.address1, { shouldValidate: true });
                        // Best-effort immediate fill — OSM's city tagging for India is
                        // inconsistent, so if we have a pincode the effect below re-derives
                        // the authoritative city/state from India Post and overwrites this.
                        if (suggestion.city) setValue("city", suggestion.city, { shouldValidate: true });
                        if (suggestion.state) applyDetectedLocation(suggestion.city, suggestion.state);
                        if (suggestion.pincode) {
                          setValue("pincode", suggestion.pincode, { shouldValidate: true });
                        }
                      }}
                    />
                  )}
                />
                {errors.address1 && <p className="text-xs text-destructive">{errors.address1.message}</p>}
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="address2">Landmark / Apartment (optional)</Label>
                <Input id="address2" placeholder="Near..." {...register("address2")} />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pincode">Pincode</Label>
                <div className="relative">
                  <Input
                    id="pincode"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="400001"
                    aria-invalid={!!errors.pincode}
                    {...register("pincode")}
                  />
                  {pincodeStatus === "loading" && (
                    <Loader2 className="absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 animate-spin text-muted-foreground" />
                  )}
                  {pincodeStatus === "found" && (
                    <Check className="absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-success" />
                  )}
                  {pincodeStatus === "not-found" && (
                    <X className="absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-destructive" />
                  )}
                </div>
                {errors.pincode && <p className="text-xs text-destructive">{errors.pincode.message}</p>}
                {pincodeStatus === "found" && (
                  <p className="flex items-center gap-1 text-xs text-success">
                    <MapPin className="size-3" /> City &amp; state detected below
                  </p>
                )}
                {pincodeStatus === "not-found" && (
                  <p className="text-xs text-muted-foreground">
                    Couldn&apos;t detect this pincode — enter city &amp; state manually.
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="Mumbai" aria-invalid={!!errors.city} {...register("city")} />
                {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="state">State</Label>
                <Controller
                  control={control}
                  name="state"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="state" className="w-full" aria-invalid={!!errors.state}>
                        <SelectValue>{(value: string) => value || "Select state"}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {INDIAN_STATES.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.state && <p className="text-xs text-destructive">{errors.state.message}</p>}
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold">Payment Method</h2>
            <Controller
              control={control}
              name="paymentMethod"
              render={({ field }) => (
                <RadioGroup value={field.value} onValueChange={field.onChange} className="gap-3">
                  <label
                    className={cn(
                      "flex cursor-pointer items-center justify-between gap-3 rounded-lg border px-4 py-3 transition-colors",
                      field.value === "cod" ? "border-foreground bg-muted/50" : "border-border",
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <RadioGroupItem value="cod" />
                      <span className="flex flex-col">
                        <span className="flex items-center gap-1.5 text-sm font-medium">
                          <Banknote className="size-4" /> Cash on Delivery
                        </span>
                        <span className="text-xs text-muted-foreground">Pay in cash when your order arrives</span>
                      </span>
                    </span>
                  </label>

                  <label
                    className={cn(
                      "flex cursor-pointer items-center justify-between gap-3 rounded-lg border px-4 py-3 transition-colors",
                      field.value === "online" ? "border-foreground bg-muted/50" : "border-border",
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <RadioGroupItem value="online" />
                      <span className="flex flex-col">
                        <span className="flex items-center gap-1.5 text-sm font-medium">
                          <CreditCard className="size-4" /> Pay Online
                        </span>
                        <span className="text-xs text-success">Extra 10% off — cards, UPI &amp; wallets</span>
                      </span>
                    </span>
                    <PaymentIconGroup icons={onlinePaymentIcons} size={24} overlap={8} />
                  </label>
                </RadioGroup>
              )}
            />
          </section>
        </div>

        <div className="flex h-fit flex-col gap-4 rounded-lg border p-5">
          <h2 className="text-sm font-semibold">Order Summary</h2>

          <div className="flex flex-col gap-3">
            {singleItem ? (
              <div className="flex gap-3">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={singleItem.image.url}
                    alt={singleItem.image.altText}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-0.5">
                  <span className="text-sm font-medium">{singleItem.title}</span>
                  <span className="text-xs text-muted-foreground">{singleItem.variantTitle}</span>
                  <span className="text-xs text-muted-foreground">Qty {singleItem.quantity}</span>
                </div>
              </div>
            ) : (
              effectiveItems.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={item.image.url}
                      alt={item.image.altText}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-0.5">
                    <span className="text-sm font-medium">{item.title}</span>
                    <span className="text-xs text-muted-foreground">{item.variantTitle}</span>
                    <div className="flex items-center gap-2 pt-0.5">
                      <div className="flex items-center rounded-full border border-border">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          disabled={item.quantity <= 1}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex size-6 items-center justify-center disabled:opacity-30"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-5 text-center text-xs tabular-nums">{item.quantity}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          disabled={item.quantity >= item.maxQuantity}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex size-6 items-center justify-center disabled:opacity-30"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <span className="shrink-0 text-sm font-medium tabular-nums">
                    {formatMoney({ amount: item.price.amount * item.quantity, currencyCode: "INR" })}
                  </span>
                </div>
              ))
            )}
          </div>

          <Separator />

          <div className="flex flex-col gap-1.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="tabular-nums">{formatMoney({ amount: subtotalAmount, currencyCode: "INR" })}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Discount</span>
                <span className="tabular-nums">
                  -{formatMoney({ amount: discountAmount, currencyCode: "INR" })}
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
            <span className="tabular-nums">{formatMoney({ amount: total, currencyCode: "INR" })}</span>
          </div>

          <CheckoutPriceLockTimer />

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            <span>
              {isSubmitting
                ? "Placing order…"
                : paymentMethod === "cod"
                  ? "Complete Order"
                  : "Continue to Payment"}
            </span>
          </Button>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5 shrink-0" />
            <span>Secure checkout · No advance payment for COD</span>
          </div>
        </div>
      </form>

      {/* Mobile only — on mobile the Order Summary sits below the whole form
       * (grid stacks to 1 column under md), so without this the total and
       * Complete Order button are the very last thing on the page, behind a
       * long scroll of fields. Keeping them pinned removes that friction. */}
      <div className="bg-background/95 fixed inset-x-0 bottom-0 z-40 border-t p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.12)] backdrop-blur-sm md:hidden">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-xs">Total</span>
            <span className="text-base font-semibold tabular-nums">
              {formatMoney({ amount: total, currencyCode: "INR" })}
            </span>
          </div>
          <Button type="submit" form="checkout-form" size="lg" className="h-12 flex-1" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            <span>
              {isSubmitting
                ? "Placing order…"
                : paymentMethod === "cod"
                  ? "Complete Order"
                  : "Continue to Payment"}
            </span>
          </Button>
        </div>
      </div>
    </main>
  );
}
