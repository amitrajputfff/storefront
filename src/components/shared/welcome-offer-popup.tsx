"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Copy, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/shared/countdown-timer";
import { useMounted } from "@/hooks/use-mounted";
import { useWelcomeOfferStore, canShowWelcomeOffer } from "@/stores/welcome-offer-store";
import { PromoCode } from "@/lib/shopify/discounts";
import { routes } from "@/constants/routes";

const DELAY_MS = 8000;

export function WelcomeOfferPopup({ promoCodes }: { promoCodes: PromoCode[] }) {
  const mounted = useMounted();
  const [open, setOpen] = useState(false);
  const triggeredRef = useRef(false);

  const dismissedUntil = useWelcomeOfferStore((s) => s.dismissedUntil);
  const offerExpiresAt = useWelcomeOfferStore((s) => s.offerExpiresAt);
  const dismiss = useWelcomeOfferStore((s) => s.dismiss);
  const ensureOfferWindow = useWelcomeOfferStore((s) => s.ensureOfferWindow);

  const promo = promoCodes[0];

  useEffect(() => {
    if (!mounted || !promo || !canShowWelcomeOffer(dismissedUntil)) return;

    function trigger() {
      if (triggeredRef.current) return;
      triggeredRef.current = true;
      ensureOfferWindow();
      setOpen(true);
    }

    const timeout = setTimeout(trigger, DELAY_MS);

    // Exit intent: mouse leaving toward the top of the viewport (browser chrome).
    function handleExitIntent(event: MouseEvent) {
      if (event.clientY <= 0) trigger();
    }
    document.addEventListener("mouseout", handleExitIntent);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("mouseout", handleExitIntent);
    };
  }, [mounted, promo, dismissedUntil, ensureOfferWindow]);

  if (!promo) return null;

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) dismiss();
  }

  function handleCopy() {
    navigator.clipboard.writeText(promo.code);
    toast.success(`Code ${promo.code} copied`);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="text-center sm:max-w-sm">
        <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-foreground text-background">
          <Sparkles className="size-5" />
        </div>
        <DialogTitle className="text-xl">A welcome offer for you</DialogTitle>
        <DialogDescription className="text-base text-foreground">{promo.label}</DialogDescription>

        <div className="flex items-center justify-center gap-2">
          <code className="rounded-md border border-dashed border-foreground/30 bg-muted px-3 py-1.5 font-mono text-sm font-semibold tracking-wide">
            {promo.code}
          </code>
          <Button type="button" variant="outline" size="icon-sm" onClick={handleCopy} aria-label="Copy code">
            <Copy className="size-4" />
          </Button>
        </div>

        {offerExpiresAt && (
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>Reserved for</span>
            <CountdownTimer
              endsAt={new Date(offerExpiresAt)}
              size="sm"
              onExpire={() => handleOpenChange(false)}
            />
          </div>
        )}

        <Button
          render={<Link href={routes.shop()} />}
          nativeButton={false}
          className="w-full"
          onClick={() => {
            handleCopy();
            handleOpenChange(false);
          }}
        >
          <span>Shop now</span>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
