"use client";

import { useEffect, useMemo, useState } from "react";
import { Marquee } from "@/components/ui/marquee";
import { useReportHeight } from "@/hooks/use-report-height";
import { PromoCode } from "@/lib/shopify/discounts";

export function AnnouncementBar({
  promoCodes = [],
  messages: contentMessages,
}: {
  promoCodes?: PromoCode[];
  messages: string[];
}) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const ref = useReportHeight<HTMLDivElement>("--announcement-height");

  const messages = useMemo(() => {
    const promoMessages = promoCodes.map(
      (promo) => `Use code ${promo.code} — ${promo.label}`,
    );
    return [...promoMessages, ...contentMessages];
  }, [promoCodes, contentMessages]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const listener = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);

  return (
    <div ref={ref} className="sticky top-0 z-40 w-full overflow-hidden bg-foreground text-background">
      <div className="mx-auto flex h-9 max-w-[1400px] items-center px-4">
        {reducedMotion ? (
          <span className="mx-auto text-xs font-medium tracking-wide">{messages[0]}</span>
        ) : (
          <Marquee className="[--duration:28s] [--gap:2.5rem]">
            {messages.map((message) => (
              <span
                key={message}
                className="flex shrink-0 items-center gap-10 text-xs font-medium tracking-wide"
              >
                {message}
                <span aria-hidden className="opacity-50">
                  •
                </span>
              </span>
            ))}
          </Marquee>
        )}
      </div>
    </div>
  );
}
