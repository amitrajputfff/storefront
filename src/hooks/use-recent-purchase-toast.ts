"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { getRecentPurchaseToast } from "@/lib/social-proof";

const MIN_GAP_MS = 30_000;
let lastShownAt = 0;

export function useRecentPurchaseToast(productTitles: string[]) {
  useEffect(() => {
    if (productTitles.length === 0) return;
    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout>;

    function scheduleNext() {
      const delay = 25_000 + Math.random() * 20_000;
      timeout = setTimeout(() => {
        if (cancelled) return;
        const now = Date.now();
        if (now - lastShownAt >= MIN_GAP_MS) {
          const title = productTitles[Math.floor(Math.random() * productTitles.length)];
          const data = getRecentPurchaseToast(title);
          toast(`Someone in ${data.city} just bought this`, {
            description: `${data.productTitle} • ${data.minutesAgo}m ago`,
          });
          lastShownAt = now;
        }
        scheduleNext();
      }, delay);
    }

    scheduleNext();
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productTitles.join("|")]);
}
