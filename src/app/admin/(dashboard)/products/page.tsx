import { listProductsWithOverrideStatus } from "@/lib/admin/product-overrides-actions";
import { ProductsClient } from "./products-client";

export default async function AdminProductsPage() {
  const result = await listProductsWithOverrideStatus();
  const items = result.ok ? result.data : [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Products</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Override a product&apos;s title, description, and images shown on the site — price, variants, and
          inventory always stay driven by Shopify.
        </p>
      </div>
      <ProductsClient initialItems={items} />
    </div>
  );
}
