"use client";

import { CheckCircle2, Truck } from "lucide-react";
import { motion } from "motion/react";
import { Money } from "@/types";
import { FREE_SHIPPING_THRESHOLD } from "@/constants/site";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

export function FreeShippingProgress({ subtotal }: { subtotal: Money }) {
  const progress = Math.min(subtotal.amount / FREE_SHIPPING_THRESHOLD, 1);
  const unlocked = progress >= 1;
  const remaining: Money = {
    amount: FREE_SHIPPING_THRESHOLD - subtotal.amount,
    currencyCode: subtotal.currencyCode,
  };

  return (
    <div className="space-y-2.5 px-6 py-4">
      <div className="flex items-center gap-2 text-sm">
        {unlocked ? (
          <CheckCircle2 className="size-4 shrink-0 text-success" />
        ) : (
          <Truck className="size-4 shrink-0 text-foreground" />
        )}
        <span className={cn(unlocked && "font-medium text-success")}>
          {unlocked
            ? "You've unlocked free shipping!"
            : `You're ${formatMoney(remaining)} away from free shipping`}
        </span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className={cn("h-full rounded-full", unlocked ? "bg-success" : "bg-foreground")}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
