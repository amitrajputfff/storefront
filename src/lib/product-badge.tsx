import type { ReactNode } from "react";
import { Zap, Flame, Tag, Award, Sparkles, PackageX } from "lucide-react";
import { Product } from "@/types";
import { getSellingOutPercent } from "@/lib/social-proof";

export interface ProductBadge {
  label: string;
  // Rendered here (not a bare component reference) so this object stays a
  // valid prop when a Server Component passes it into a Client Component —
  // React elements cross that boundary fine, function references don't.
  icon: ReactNode;
  className: string;
  /** Only for genuinely time/stock-urgent badges — overusing this cheapens the signal. */
  pulse?: boolean;
}

const LOW_STOCK_THRESHOLD = 5;
const SELLING_FAST_PERCENT = 85;

export function getBadge(product: Product): ProductBadge | null {
  if (product.totalInventory === 0) {
    return { label: "Out of Stock", icon: <PackageX />, className: "bg-muted text-muted-foreground" };
  }
  if (product.isLimitedTimeOffer) {
    return { label: "Limited Time Offer", icon: <Zap />, className: "bg-destructive text-white", pulse: true };
  }

  const sellingFast =
    product.totalInventory <= LOW_STOCK_THRESHOLD ||
    getSellingOutPercent(product.id) >= SELLING_FAST_PERCENT;
  if (sellingFast) {
    return { label: "Selling Fast", icon: <Flame />, className: "bg-gold text-black", pulse: true };
  }

  const hasDiscount =
    product.compareAtPriceRange &&
    product.compareAtPriceRange.min.amount > product.priceRange.min.amount;
  if (hasDiscount) return { label: "Sale", icon: <Tag />, className: "bg-destructive text-white" };

  if (product.isBestseller)
    return { label: "Best Seller", icon: <Award />, className: "bg-foreground text-background" };
  if (product.isNewArrival)
    return { label: "New", icon: <Sparkles />, className: "bg-success text-white" };

  return null;
}
