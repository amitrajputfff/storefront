"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Circle, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { trackOrder, TrackedOrder } from "@/lib/orders";
import { getOrderStepIndex, getOrderSteps, formatFulfillmentStatus } from "@/lib/order-status";
import { formatFullDate } from "@/lib/format";
import { cn } from "@/lib/utils";

const trackSchema = z.object({
  confirmationNumber: z.string().min(1, "Enter your order number"),
  email: z.string().email("Enter a valid email address"),
});

type TrackValues = z.infer<typeof trackSchema>;

export function TrackOrderForm() {
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [notFoundError, setNotFoundError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TrackValues>({ resolver: zodResolver(trackSchema) });

  async function onSubmit(values: TrackValues) {
    setNotFoundError(null);
    setOrder(null);
    const result = await trackOrder(values.confirmationNumber, values.email);
    if (result.success && result.order) {
      setOrder(result.order);
    } else {
      setNotFoundError(result.error ?? "Something went wrong — please try again.");
    }
  }

  if (order) {
    const stepIndex = getOrderStepIndex(order.fulfillmentStatus);
    const steps = getOrderSteps();

    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-lg font-medium">Order {order.name}</p>
            <p className="text-muted-foreground text-sm">
              Placed {formatFullDate(order.createdAt)}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setOrder(null)}>
            <span>Track another order</span>
          </Button>
        </div>

        <div className="flex items-center">
          {steps.map((step, i) => (
            <div key={step} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-2 text-center">
                {i <= stepIndex ? (
                  <CheckCircle2 className="text-foreground size-6" />
                ) : (
                  <Circle className="text-muted-foreground/40 size-6" />
                )}
                <span
                  className={cn(
                    "w-20 text-xs",
                    i <= stepIndex ? "text-foreground font-medium" : "text-muted-foreground",
                  )}
                >
                  {step}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-2 h-0.5 flex-1",
                    i < stepIndex ? "bg-foreground" : "bg-muted",
                  )}
                />
              )}
            </div>
          ))}
        </div>

        <div className="rounded-lg border p-4 text-sm">
          <p className="font-medium">{formatFulfillmentStatus(order.fulfillmentStatus)}</p>
          {order.shippingCity && (
            <p className="text-muted-foreground mt-1">Shipping to {order.shippingCity}</p>
          )}
          {order.trackingNumber && (
            <p className="text-muted-foreground mt-1">
              Tracking: {order.trackingNumber}
              {order.trackingCompany && ` via ${order.trackingCompany}`}
              {order.trackingUrl && (
                <>
                  {" — "}
                  <a
                    href={order.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4"
                  >
                    Track shipment
                  </a>
                </>
              )}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {order.lineItems.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="bg-muted relative size-14 shrink-0 overflow-hidden rounded-md">
                {item.imageUrl && (
                  <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.title}</p>
                <p className="text-muted-foreground text-xs">Qty {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="space-y-2">
        <Label htmlFor="confirmationNumber">Order number</Label>
        <Input
          id="confirmationNumber"
          placeholder="e.g. GK5W0IWED"
          aria-invalid={!!errors.confirmationNumber}
          {...register("confirmationNumber")}
        />
        {errors.confirmationNumber && (
          <p className="text-error text-xs">{errors.confirmationNumber.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email used at checkout</Label>
        <Input
          id="email"
          type="email"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && <p className="text-error text-xs">{errors.email.message}</p>}
      </div>

      {notFoundError && <p className="text-error text-sm">{notFoundError}</p>}

      <Button type="submit" size="lg" disabled={isSubmitting}>
        <Package className="size-4" />
        <span>{isSubmitting ? "Looking up your order…" : "Track Order"}</span>
      </Button>
    </form>
  );
}
