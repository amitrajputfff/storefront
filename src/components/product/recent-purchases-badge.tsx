import { Product } from "@/types";
import { getRecentPurchaseCount } from "@/lib/social-proof";
import { NumberTicker } from "@/components/ui/number-ticker";

export function RecentPurchasesBadge({ product }: { product: Product }) {
  const count =
    product.recentPurchases && product.recentPurchases > 0
      ? product.recentPurchases
      : getRecentPurchaseCount(product.id);

  return (
    <span className="bg-destructive/10 border-destructive/20 text-destructive inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1">
      <span className="relative flex size-1.5">
        <span className="bg-destructive absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
        <span className="bg-destructive relative inline-flex size-1.5 rounded-full" />
      </span>
      <NumberTicker value={count} className="text-destructive text-xs font-semibold tracking-normal" />
      <span className="text-xs font-medium">bought in the last 7 days</span>
    </span>
  );
}
