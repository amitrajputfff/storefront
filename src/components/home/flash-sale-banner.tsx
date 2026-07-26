"use client";

import { useMemo } from "react";
import { Zap } from "lucide-react";
import { StickyBanner } from "@/components/ui/sticky-banner";
import { CountdownTimer } from "@/components/shared/countdown-timer";
import { getFlashSaleEndsAt } from "@/lib/urgency";

export function FlashSaleBanner() {
  const endsAt = useMemo(() => getFlashSaleEndsAt(), []);

  return (
    <StickyBanner className="bg-destructive top-[calc(var(--announcement-height,2.25rem)+var(--header-height,4.5rem))] z-20 text-white">
      <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium">
        <Zap className="size-4 shrink-0" />
        <span>Flash Sale — up to 40% off, ends in</span>
        <CountdownTimer endsAt={endsAt} size="sm" className="bg-white text-black" />
      </div>
    </StickyBanner>
  );
}
