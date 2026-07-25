import { ShieldCheck } from "lucide-react";
import { Money } from "@/types";
import { FREE_SHIPPING_THRESHOLD } from "@/constants/site";
import { formatMoney } from "@/lib/format";
import { Separator } from "@/components/ui/separator";

export function CartSummary({
  subtotal,
  discount,
}: {
  subtotal: Money;
  discount?: Money;
}) {
  const discountAmount = discount?.amount ?? 0;
  const total: Money = {
    amount: Math.max(subtotal.amount - discountAmount, 0),
    currencyCode: subtotal.currencyCode,
  };
  const freeShipping = subtotal.amount >= FREE_SHIPPING_THRESHOLD;

  return (
    <div className="space-y-3 px-6 py-4">
      <div className="space-y-1.5 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="tabular-nums">{formatMoney(subtotal)}</span>
        </div>

        {discount && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Discount</span>
            <span className="tabular-nums">
              -{formatMoney({ amount: discountAmount, currencyCode: subtotal.currencyCode })}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>{freeShipping ? "Free" : "Calculated at checkout"}</span>
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between text-base font-medium">
        <span>Total</span>
        <span className="tabular-nums">{formatMoney(total)}</span>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="size-3.5" />
        <span>Secure checkout</span>
      </div>
    </div>
  );
}
