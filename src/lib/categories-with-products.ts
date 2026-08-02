import { CategoryDef } from "@/types";
import { categories, getCategoryByHandle } from "@/mock/categories";
import { getAllProducts } from "@/mock/products";

/**
 * Curated categories keep their designed order; any other tag present on a
 * product (a brand-new Shopify tag with no curated entry yet) is appended
 * after, so it still surfaces in nav without a code change.
 */
export async function getActiveCategories(): Promise<CategoryDef[]> {
  const products = await getAllProducts();
  const present = new Set<string>(products.flatMap((p) => p.categories));

  const curated = categories.filter((c) => present.has(c.handle));
  const curatedHandles = new Set(curated.map((c) => c.handle));
  const extra = Array.from(present)
    .filter((handle) => !curatedHandles.has(handle))
    .sort()
    .map((handle) => getCategoryByHandle(handle));

  return [...curated, ...extra];
}
