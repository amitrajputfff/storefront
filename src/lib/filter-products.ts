import { Product } from "@/types";

export interface ProductFilterParams {
  category?: string;
  rating?: string;
  priceMin?: string;
  priceMax?: string;
  sort?: string;
}

export function filterAndSortProducts(
  products: Product[],
  params: ProductFilterParams,
): Product[] {
  let result = [...products];

  const categories = params.category?.split(",").filter(Boolean) ?? [];
  const minRating = params.rating ? Number(params.rating) : undefined;
  const priceMin = params.priceMin ? Number(params.priceMin) : undefined;
  const priceMax = params.priceMax ? Number(params.priceMax) : undefined;

  if (categories.length > 0) {
    result = result.filter((p) => p.categories.some((c) => categories.includes(c)));
  }

  if (minRating !== undefined) {
    result = result.filter((p) => p.rating >= minRating);
  }

  if (priceMin !== undefined) {
    result = result.filter((p) => p.priceRange.min.amount >= priceMin);
  }

  if (priceMax !== undefined) {
    result = result.filter((p) => p.priceRange.min.amount <= priceMax);
  }

  switch (params.sort) {
    case "price-asc":
      result.sort((a, b) => a.priceRange.min.amount - b.priceRange.min.amount);
      break;
    case "price-desc":
      result.sort((a, b) => b.priceRange.min.amount - a.priceRange.min.amount);
      break;
    case "newest":
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case "rating":
      result.sort((a, b) => b.rating - a.rating);
      break;
    case "best-selling":
      result.sort((a, b) => Number(b.isBestseller) - Number(a.isBestseller));
      break;
    default:
      result.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
  }

  return result;
}
