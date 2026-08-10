"use client";

import { useState } from "react";
import { Flame } from "lucide-react";
import { CountdownTimer } from "@/components/shared/countdown-timer";
import { getFlashSaleEndsAt } from "@/lib/urgency";
import { cn } from "@/lib/utils";

export function SaleTimerBar({ className }: { className?: string }) {
  const [endsAt, setEndsAt] = useState(() => getFlashSaleEndsAt());

  return (
    <div
      className={cn(
        "mb-6 flex items-center justify-between gap-3 rounded-xl border border-rose-300/70 bg-gradient-to-r from-rose-600 via-rose-500 to-orange-500 px-3.5 py-2.5 text-white shadow-lg",
        className,
      )}
    >
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
        <Flame className="size-3.5 shrink-0" />
        Hurry! Sale ends in
      </span>
      <CountdownTimer
        endsAt={endsAt}
        size="sm"
        className="bg-white text-rose-700 shadow-sm"
        onExpire={() => setEndsAt(getFlashSaleEndsAt())}
      />
    </div>
  );
}
