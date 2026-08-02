import {
  AuthoredProduct,
  Money,
  Product,
  ProductCategory,
  ProductOption,
  Variant,
} from "@/types";

function money(amount: number): Money {
  return { amount, currencyCode: "INR" };
}

function deriveOptions(authored: AuthoredProduct): ProductOption[] {
  if (authored.options) return authored.options;
  const map = new Map<string, Set<string>>();
  for (const variant of authored.variants) {
    for (const opt of variant.selectedOptions) {
      if (!map.has(opt.name)) map.set(opt.name, new Set());
      map.get(opt.name)!.add(opt.value);
    }
  }
  return Array.from(map.entries()).map(([name, values]) => ({
    name,
    values: Array.from(values),
  }));
}

/**
 * Mock catalog entries use free-text descriptive tags ("cast-iron",
 * "stovetop") rather than category tags, so — unlike the live Shopify
 * mapper — categories here come from the explicit `category`/`categories`
 * fields an author sets, not from every tag on the product.
 */
function deriveAuthoredCategories(authored: AuthoredProduct): ProductCategory[] {
  return authored.categories && authored.categories.length > 0
    ? authored.categories
    : [authored.category];
}

export function buildProduct(authored: AuthoredProduct, index: number): Product {
  const productId = `gid://mock/Product/${index + 1}`;

  const variants: Variant[] = authored.variants.map((v, vIndex) => ({
    id: `gid://mock/Variant/${index + 1}-${vIndex + 1}`,
    title: v.title,
    sku: v.sku,
    price: money(v.price),
    compareAtPrice: v.compareAtPrice !== undefined ? money(v.compareAtPrice) : undefined,
    selectedOptions: v.selectedOptions,
    availableForSale: v.availableForSale ?? v.inventoryQuantity > 0,
    inventoryQuantity: v.inventoryQuantity,
    image: v.image,
  }));

  const prices = variants.map((v) => v.price.amount);
  const compareAtPrices = variants
    .map((v) => v.compareAtPrice?.amount)
    .filter((n): n is number => n !== undefined);

  const tags = new Set(authored.tags ?? []);
  if (authored.isBestseller) tags.add("bestseller");
  if (authored.isTrending) tags.add("trending");
  if (authored.isNewArrival) tags.add("new");
  if (authored.isLimitedTimeOffer) tags.add("limited-time");
  if (compareAtPrices.length > 0) tags.add("sale");

  return {
    id: productId,
    handle: authored.handle,
    title: authored.title,
    description: authored.description,
    categories: deriveAuthoredCategories(authored),
    tags: Array.from(tags),
    images: authored.images,
    options: deriveOptions(authored),
    variants,
    priceRange: {
      min: money(Math.min(...prices)),
      max: money(Math.max(...prices)),
    },
    compareAtPriceRange:
      compareAtPrices.length > 0
        ? {
            min: money(Math.min(...compareAtPrices)),
            max: money(Math.max(...compareAtPrices)),
          }
        : undefined,
    rating: authored.rating,
    reviewCount: authored.reviewCount,
    isBestseller: authored.isBestseller ?? false,
    isTrending: authored.isTrending ?? false,
    isNewArrival: authored.isNewArrival ?? false,
    isFeatured: authored.isFeatured ?? false,
    isLimitedTimeOffer: authored.isLimitedTimeOffer ?? false,
    totalInventory: variants.reduce((sum, v) => sum + v.inventoryQuantity, 0),
    createdAt: authored.createdAt,
    materialsLine: authored.materialsLine,
    recentPurchases: authored.recentPurchases,
    careInstructions: authored.careInstructions,
    shippingReturnsNote:
      authored.shippingReturnsNote ??
      "Ships in 1-2 business days. Free returns within 7 days.",
    minDeliveryDays: 2,
    maxDeliveryDays: 5,
  };
}
