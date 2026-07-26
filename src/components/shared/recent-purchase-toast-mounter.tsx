"use client";

import { useRecentPurchaseToast } from "@/hooks/use-recent-purchase-toast";

export function RecentPurchaseToastMounter({ productTitles }: { productTitles: string[] }) {
  useRecentPurchaseToast(productTitles);
  return null;
}
