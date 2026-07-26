import { CategoryDef } from "@/types";
import { categories } from "@/mock/categories";
import { getAllProducts } from "@/mock/products";

export async function getActiveCategories(): Promise<CategoryDef[]> {
  const products = await getAllProducts();
  const present = new Set<string>(products.map((p) => p.category));
  return categories.filter((c) => present.has(c.handle));
}
