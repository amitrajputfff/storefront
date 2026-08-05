import { Product } from "@/types";

export function getBadge(product: Product): { label: string; className?: string } | null {
  if (product.totalInventory === 0) {
    return { label: "Out of Stock", className: "bg-muted text-muted-foreground" };
  }
  if (product.isLimitedTimeOffer) {
    return { label: "Limited Time Offer", className: "bg-destructive text-white" };
  }
  const hasDiscount =
    product.compareAtPriceRange &&
    product.compareAtPriceRange.min.amount > product.priceRange.min.amount;
  if (hasDiscount) return { label: "Sale" };
  if (product.isBestseller) return { label: "Best Seller" };
  if (product.isNewArrival) return { label: "New" };
  return null;
}
