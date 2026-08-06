"use client";

import { useState } from "react";
import { Flame } from "lucide-react";
import { CountdownTimer } from "@/components/shared/countdown-timer";
import { getFlashSaleEndsAt } from "@/lib/urgency";

export function SaleTimerBar({ className }: { className?: string }) {
  const [endsAt, setEndsAt] = useState(() => getFlashSaleEndsAt());

  return (
    <div
      className={`bg-foreground text-background mb-6 flex items-center justify-between gap-3 rounded-lg px-3.5 py-2.5 ${className ?? ""}`}
    >
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
        <Flame className="size-3.5 shrink-0" />
        Hurry! Sale ends in
      </span>
      <CountdownTimer
        endsAt={endsAt}
        size="sm"
        className="bg-background text-foreground"
        onExpire={() => setEndsAt(getFlashSaleEndsAt())}
      />
    </div>
  );
}
