"use client";

import { cn } from "@/lib/utils";

interface Pack {
  quantity: number;
  label: string;
  popular?: boolean;
}

const PACKS: Pack[] = [
  { quantity: 1, label: "Pack of 1" },
  { quantity: 2, label: "Pack of 2" },
  { quantity: 3, label: "Pack of 3 (Value deal)", popular: true },
  { quantity: 4, label: "Pack of 4 (Highest Value)" },
];

export function QuantityPacks({
  quantity,
  onChange,
  maxQuantity,
}: {
  quantity: number;
  onChange: (quantity: number) => void;
  maxQuantity: number;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium">Quantity</p>
      <div className="flex flex-wrap gap-x-3 gap-y-4">
        {PACKS.map((pack) => {
          const disabled = pack.quantity > maxQuantity;
          const selected = quantity === pack.quantity;

          return (
            <div key={pack.quantity} className="relative">
              {pack.popular && (
                <span className="bg-primary text-primary-foreground absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-2.5 py-0.5 text-[10px] font-medium whitespace-nowrap">
                  Most Popular
                </span>
              )}
              <button
                type="button"
                disabled={disabled}
                onClick={() => onChange(pack.quantity)}
                aria-pressed={selected}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                  selected
                    ? "bg-foreground text-background border-foreground"
                    : "hover:bg-muted border-border",
                )}
              >
                {pack.label}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
