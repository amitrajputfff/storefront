"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { CountdownTimer } from "@/components/shared/countdown-timer";
import { getPriceLockEndsAt } from "@/lib/urgency";
import { cn } from "@/lib/utils";

export function CheckoutPriceLockTimer({ className }: { className?: string }) {
  const [endsAt, setEndsAt] = useState(() => getPriceLockEndsAt());

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-lg border border-gold/30 bg-gold/10 px-3 py-2 text-xs font-medium text-foreground",
        className,
      )}
    >
      <span className="inline-flex items-center gap-1.5">
        <Lock className="text-gold size-3.5 shrink-0" />
        Your price is locked for
      </span>
      <CountdownTimer endsAt={endsAt} size="sm" onExpire={() => setEndsAt(getPriceLockEndsAt())} />
    </div>
  );
}
