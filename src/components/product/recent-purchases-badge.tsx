import { Product } from "@/types";
import { getRecentPurchaseCount } from "@/lib/social-proof";
import { NumberTicker } from "@/components/ui/number-ticker";

export function RecentPurchasesBadge({ product }: { product: Product }) {
  const count =
    product.recentPurchases && product.recentPurchases > 0
      ? product.recentPurchases
      : getRecentPurchaseCount(product.id);

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="relative flex size-1.5">
        <span className="bg-destructive absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
        <span className="bg-destructive relative inline-flex size-1.5 rounded-full" />
      </span>
      <NumberTicker value={count} className="text-foreground text-xs font-medium tracking-normal" />
      <span>bought in the last month</span>
    </span>
  );
}
