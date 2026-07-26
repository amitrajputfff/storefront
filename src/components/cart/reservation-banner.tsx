"use client";

import { useState } from "react";
import { Clock } from "lucide-react";
import { CartItem } from "@/types";
import { useCartReservation } from "@/hooks/use-cart-reservation";
import { CountdownTimer } from "@/components/shared/countdown-timer";

export function ReservationBanner({ items }: { items: CartItem[] }) {
  const expiresAt = useCartReservation(items);
  const [expired, setExpired] = useState(false);

  if (!expiresAt) return null;

  return (
    <div className="bg-muted flex items-center gap-2 rounded-lg px-4 py-3 text-sm">
      <Clock className="size-4 shrink-0" />
      {expired ? (
        <span>Item availability may have changed since you added these to your cart.</span>
      ) : (
        <span className="flex items-center gap-1.5">
          Your cart is reserved for the next
          <CountdownTimer endsAt={expiresAt} size="sm" onExpire={() => setExpired(true)} />
        </span>
      )}
    </div>
  );
}
