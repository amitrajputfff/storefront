"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Money } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PROMO_CODES: Record<string, number> = {
  WELCOME10: 0.1,
  FREESHIP: 0,
};

type Status = "idle" | "loading" | "success" | "error";

export function PromoCodeInput({
  subtotal,
  onApply,
}: {
  subtotal: Money;
  onApply: (discount: Money | null) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [appliedPercent, setAppliedPercent] = useState<number | null>(null);

  function handleApply() {
    const normalized = code.trim().toUpperCase();
    setStatus("loading");
    setTimeout(() => {
      const percent = PROMO_CODES[normalized];
      if (percent === undefined) {
        setStatus("error");
        setAppliedPercent(null);
        onApply(null);
        return;
      }
      setStatus("success");
      setAppliedPercent(percent);
      onApply({
        amount: subtotal.amount * percent,
        currencyCode: subtotal.currencyCode,
      });
    }, 500);
  }

  if (!expanded) {
    return (
      <div className="px-6 py-2">
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
        >
          Have a promo code?
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2 px-6 py-2">
      <div className="flex items-center gap-2">
        <Input
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setStatus("idle");
          }}
          placeholder="Enter promo code"
          disabled={status === "loading"}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          disabled={status === "loading" || code.trim().length === 0}
          onClick={handleApply}
        >
          <span className="flex items-center gap-1.5">
            {status === "loading" && <Loader2 className="size-3.5 animate-spin" />}
            Apply
          </span>
        </Button>
      </div>

      {status === "success" && appliedPercent !== null && (
        <p className="text-xs text-success">
          Promo applied: {appliedPercent * 100}% off
        </p>
      )}

      {status === "error" && (
        <p className="text-xs text-error">Invalid promo code</p>
      )}
    </div>
  );
}
