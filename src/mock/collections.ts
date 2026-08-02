import { Collection, Product } from "@/types";
import { categoryImages } from "./images";
import { getAllProducts } from "./products";
import { getCategoryByHandle } from "./categories";

export interface DerivedCollection extends Collection {
  products: Product[];
}

async function buildCollection(
  handle: string,
  title: string,
  description: string,
  imageCategory: keyof typeof categoryImages,
  filter: (p: Product) => boolean,
  sort?: (a: Product, b: Product) => number,
): Promise<DerivedCollection> {
  const all = await getAllProducts();
  let matched = all.filter(filter);
  if (sort) matched = matched.sort(sort);

  return {
    id: `gid://mock/Collection/${handle}`,
    handle,
    title,
    description,
    image: categoryImages[imageCategory][0],
    productIds: matched.map((p) => p.id),
    products: matched,
  };
}

const MIN_BEST_SELLERS = 8;

export async function getBestSellers(): Promise<DerivedCollection> {
  const all = await getAllProducts();
  const tagged = all.filter((p) => p.isBestseller);

  // Not enough products actually tagged "best seller" yet — pad with the
  // highest-rated of the rest rather than leaving the section sparse.
  const padding = all
    .filter((p) => !p.isBestseller)
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
  const matched = [...tagged, ...padding].slice(0, Math.max(MIN_BEST_SELLERS, tagged.length));

  return {
    id: "gid://mock/Collection/best-sellers",
    handle: "best-sellers",
    title: "Best Sellers",
    description: "The pieces our customers keep coming back for.",
    image: categoryImages["home-decor"][0],
    productIds: matched.map((p) => p.id),
    products: matched,
  };
}

export async function getNewArrivals(): Promise<DerivedCollection> {
  return buildCollection(
    "new-arrivals",
    "New Arrivals",
    "Freshly landed — the latest additions to the ZEEVARA catalog.",
    "lifestyle",
    (p) => p.isNewArrival,
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function getTrending(): Promise<DerivedCollection> {
  return buildCollection(
    "trending",
    "Trending This Week",
    "What everyone's adding to cart right now.",
    "electronics",
    (p) => p.isTrending,
  );
}

export async function getFeatured(): Promise<DerivedCollection> {
  return buildCollection(
    "featured",
    "The Work-From-Anywhere Edit",
    "A curated edit for a life that moves between home, office, and everywhere in between.",
    "office",
    (p) => p.isFeatured,
  );
}

export async function getDeals(): Promise<DerivedCollection> {
  return buildCollection(
    "deals",
    "Deals",
    "Considered pieces, presently discounted.",
    "accessories",
    (p) => p.compareAtPriceRange !== undefined,
  );
}

const NAMED_COLLECTIONS: Record<string, () => Promise<DerivedCollection>> = {
  "best-sellers": getBestSellers,
  "new-arrivals": getNewArrivals,
  trending: getTrending,
  featured: getFeatured,
  deals: getDeals,
};

/**
 * Category collections aren't limited to the curated list in mock/categories
 * — any tag present on at least one product resolves here, so a brand-new
 * Shopify tag gets a working /collections/<tag> page immediately.
 */
export async function getCollectionByHandle(
  handle: string,
): Promise<DerivedCollection | undefined> {
  if (NAMED_COLLECTIONS[handle]) return NAMED_COLLECTIONS[handle]();

  const all = await getAllProducts();
  const matched = all.filter((p) => p.categories.includes(handle));
  if (matched.length === 0) return undefined;

  const category = getCategoryByHandle(handle);
  return {
    id: `gid://mock/Collection/${handle}`,
    handle,
    title: category.name,
    description: category.description,
    image: category.image,
    productIds: matched.map((p) => p.id),
    products: matched,
  };
}

export async function getAllCollectionHandles(): Promise<string[]> {
  const all = await getAllProducts();
  const present = new Set<string>(all.flatMap((p) => p.categories));
  return [...Object.keys(NAMED_COLLECTIONS), ...present];
}
