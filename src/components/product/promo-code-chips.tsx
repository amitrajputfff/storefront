"use client";

import { useState } from "react";
import { Copy, Check, Ticket } from "lucide-react";
import { toast } from "sonner";
import { PromoCode } from "@/lib/shopify/discounts";
import { cn } from "@/lib/utils";

export function PromoCodeChips({ codes }: { codes: PromoCode[] }) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (codes.length === 0) return null;

  async function handleCopy(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success(`Copied "${code}" — paste it at checkout`);
      setTimeout(() => setCopiedCode((c) => (c === code ? null : c)), 2000);
    } catch {
      toast.error("Couldn't copy — please select and copy manually");
    }
  }

  return (
    <div className="flex flex-col gap-3 pt-2">
      {codes.map((promo) => (
        <button
          key={promo.code}
          type="button"
          onClick={() => handleCopy(promo.code)}
          className="hover:bg-muted relative flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-3.5 text-left text-sm transition-colors"
        >
          <span className="bg-foreground text-background absolute -top-2.5 left-3 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide">
            CODE {promo.code}
          </span>
          <span className="flex min-w-0 items-center gap-2">
            <Ticket className="text-muted-foreground size-4 shrink-0" />
            <span className="min-w-0 truncate font-medium">{promo.label}</span>
          </span>
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1 text-xs font-medium",
              copiedCode === promo.code ? "text-success" : "text-foreground",
            )}
          >
            {copiedCode === promo.code ? (
              <>
                <Check className="size-3.5" /> Copied
              </>
            ) : (
              <>
                <Copy className="size-3.5" /> Copy
              </>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}
