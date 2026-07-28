import { Flame } from "lucide-react";
import { getSellingOutPercent } from "@/lib/social-proof";

export function StockProgressBar({ productId }: { productId: string }) {
  const percent = getSellingOutPercent(productId);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5 text-xs font-medium">
        <Flame className="text-gold size-3.5 shrink-0" />
        <span>Selling fast</span>
        <span className="text-muted-foreground ml-auto tabular-nums">{percent}% claimed</span>
      </div>
      <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
        <div
          className="from-gold to-gold/70 h-full rounded-full bg-gradient-to-r"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
