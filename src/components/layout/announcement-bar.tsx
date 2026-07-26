"use client";

import { useEffect, useState } from "react";
import { Marquee } from "@/components/ui/marquee";
import { ANNOUNCEMENT_MESSAGES } from "@/constants/site";
import { useReportHeight } from "@/hooks/use-report-height";

export function AnnouncementBar() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const ref = useReportHeight<HTMLDivElement>("--announcement-height");

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
          <span className="mx-auto text-xs font-medium tracking-wide">
            {ANNOUNCEMENT_MESSAGES[0]}
          </span>
        ) : (
          <Marquee className="[--duration:28s] [--gap:2.5rem]">
            {ANNOUNCEMENT_MESSAGES.map((message) => (
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
