import { getAllProducts } from "@/mock/products";
import { RecentPurchaseToastMounter } from "@/components/shared/recent-purchase-toast-mounter";

export async function RecentPurchaseToastLoader() {
  const products = await getAllProducts();
  return <RecentPurchaseToastMounter productTitles={products.map((p) => p.title)} />;
}
