import { Money } from "@/types";
import { discountPercent, formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

export function PriceDisplay({
  price,
  compareAtPrice,
  className,
  size = "md",
}: {
  price: Money;
  compareAtPrice?: Money;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const discount = discountPercent(price, compareAtPrice);
  const sizeClass = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-2xl",
    xl: "text-3xl md:text-4xl",
  }[size];

  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span className={cn("font-medium tabular-nums", sizeClass)}>
        {formatMoney(price)}
      </span>
      {compareAtPrice && discount && (
        <>
          <span className="text-muted-foreground text-sm tabular-nums line-through">
            {formatMoney(compareAtPrice)}
          </span>
          <span className="text-gold text-xs font-semibold">{discount}% off</span>
        </>
      )}
    </div>
  );
}
