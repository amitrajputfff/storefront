import { PackageSearch } from "lucide-react";
import { Product } from "@/types";
import { EmptyState } from "@/components/shared/empty-state";
import { StaggerGroup, StaggerItem } from "@/components/shared/reveal";
import { ProductCard } from "@/components/product/product-card";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return <EmptyState icon={PackageSearch} title="No products found" />;
  }

  return (
    <StaggerGroup className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <StaggerItem key={product.id}>
          <ProductCard product={product} />
        </StaggerItem>
      ))}
    </StaggerGroup>
  );
}
