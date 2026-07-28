import { Collection, Product } from "@/types";
import { categoryImages } from "./images";
import { getAllProducts } from "./products";

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

export async function getCollectionByHandle(
  handle: string,
): Promise<DerivedCollection | undefined> {
  if (NAMED_COLLECTIONS[handle]) return NAMED_COLLECTIONS[handle]();

  const { categories } = await import("./categories");
  const category = categories.find((c) => c.handle === handle);
  if (!category) return undefined;

  return buildCollection(
    category.handle,
    category.name,
    category.description,
    category.handle as keyof typeof categoryImages,
    (p) => p.category === category.handle,
  );
}

export async function getAllCollectionHandles(): Promise<string[]> {
  const { categories } = await import("./categories");
  return [...Object.keys(NAMED_COLLECTIONS), ...categories.map((c) => c.handle)];
}
