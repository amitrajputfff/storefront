"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Pack {
  quantity: number;
  label: string;
}

const PACKS: Pack[] = [
  { quantity: 1, label: "Buy 1" },
  { quantity: 2, label: "Buy 2" },
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
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {PACKS.map((pack) => {
          const disabled = pack.quantity > maxQuantity;
          const selected = quantity === pack.quantity;

          return (
            <button
              key={pack.quantity}
              type="button"
              disabled={disabled}
              onClick={() => onChange(pack.quantity)}
              aria-pressed={selected}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:py-2",
                selected
                  ? "bg-foreground text-background border-foreground"
                  : "hover:bg-muted border-border",
              )}
            >
              {pack.label}
            </button>
          );
        })}

        <div className="border-border flex items-center rounded-full border">
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
            onClick={() => onChange(Math.max(1, quantity - 1))}
            className="flex size-8 items-center justify-center disabled:cursor-not-allowed disabled:opacity-40 sm:size-9"
          >
            <Minus className="size-3.5" />
          </button>
          <span className="w-6 text-center text-sm font-medium tabular-nums sm:w-8">{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            disabled={quantity >= maxQuantity}
            onClick={() => onChange(Math.min(maxQuantity, quantity + 1))}
            className="flex size-8 items-center justify-center disabled:cursor-not-allowed disabled:opacity-40 sm:size-9"
          >
            <Plus className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
