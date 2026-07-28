import { Product, ProductCategory, ProductImage, SelectedOption, Variant } from "@/types";
import { getFallbackReviewCount } from "@/lib/social-proof";

const CATEGORY_TAGS: ProductCategory[] = [
  "home-decor",
  "kitchen",
  "office",
  "travel",
  "accessories",
  "fitness",
  "lifestyle",
  "pets",
  "beauty",
  "electronics",
];

interface ShopifyMoney {
  amount: string;
}

interface ShopifyImageNode {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

interface ShopifyMetafield {
  value: string;
}

interface ShopifyVariantNode {
  id: string;
  title: string;
  sku: string;
  availableForSale: boolean;
  quantityAvailable: number | null;
  price: ShopifyMoney;
  compareAtPrice: ShopifyMoney | null;
  selectedOptions: SelectedOption[];
  image: ShopifyImageNode | null;
}

export interface ShopifyProductNode {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  tags: string[];
  createdAt: string;
  totalInventory: number;
  images: { edges: { node: ShopifyImageNode }[] };
  options: { name: string; values: string[] }[];
  priceRange: { minVariantPrice: ShopifyMoney; maxVariantPrice: ShopifyMoney };
  compareAtPriceRange: { minVariantPrice: ShopifyMoney; maxVariantPrice: ShopifyMoney } | null;
  variants: { edges: { node: ShopifyVariantNode }[] };
  rating: ShopifyMetafield | null;
  reviewCount: ShopifyMetafield | null;
  materialsLine: ShopifyMetafield | null;
  careInstructions: ShopifyMetafield | null;
  shippingReturnsNote: ShopifyMetafield | null;
  recentPurchases: ShopifyMetafield | null;
  minDeliveryDays: ShopifyMetafield | null;
  maxDeliveryDays: ShopifyMetafield | null;
}

function toAmount(money: ShopifyMoney): number {
  return Math.round(parseFloat(money.amount));
}

function toImage(node: ShopifyImageNode, id: string): ProductImage {
  return {
    id,
    url: node.url,
    altText: node.altText ?? "",
    width: node.width,
    height: node.height,
  };
}

function deriveCategory(tags: string[]): ProductCategory {
  const lower = tags.map((t) => t.toLowerCase());
  return CATEGORY_TAGS.find((c) => lower.includes(c)) ?? "lifestyle";
}

function metafieldNumber(field: ShopifyMetafield | null, fallback: number): number {
  if (!field) return fallback;
  const parsed = parseFloat(field.value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function metafieldString(field: ShopifyMetafield | null, fallback: string): string {
  return field?.value ?? fallback;
}

/** Tags are free text in Shopify admin — accept common spelling variants
 * ("Best Seller" vs "bestseller" vs "best-seller") rather than requiring
 * one exact string. */
function hasAnyTag(tags: string[], ...variants: string[]): boolean {
  return variants.some((variant) => tags.includes(variant));
}

export function mapShopifyProduct(node: ShopifyProductNode): Product {
  const tags = node.tags.map((t) => t.toLowerCase());
  const images = node.images.edges.map((e, i) => toImage(e.node, `${node.id}-image-${i}`));

  const variants: Variant[] = node.variants.edges.map(({ node: v }) => ({
    id: v.id,
    title: v.title,
    sku: v.sku,
    price: { amount: toAmount(v.price), currencyCode: "INR" },
    compareAtPrice: v.compareAtPrice ? { amount: toAmount(v.compareAtPrice), currencyCode: "INR" } : undefined,
    selectedOptions: v.selectedOptions,
    availableForSale: v.availableForSale,
    inventoryQuantity: v.quantityAvailable ?? 0,
    image: v.image ? toImage(v.image, `${v.id}-image`) : undefined,
  }));

  const createdAt = new Date(node.createdAt);
  const isNewArrival = tags.includes("new") || Date.now() - createdAt.getTime() < 30 * 24 * 60 * 60 * 1000;

  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description,
    descriptionHtml: node.descriptionHtml,
    category: deriveCategory(tags),
    tags: node.tags,
    images,
    options: node.options,
    variants,
    priceRange: {
      min: { amount: toAmount(node.priceRange.minVariantPrice), currencyCode: "INR" },
      max: { amount: toAmount(node.priceRange.maxVariantPrice), currencyCode: "INR" },
    },
    compareAtPriceRange: node.compareAtPriceRange
      ? {
          min: { amount: toAmount(node.compareAtPriceRange.minVariantPrice), currencyCode: "INR" },
          max: { amount: toAmount(node.compareAtPriceRange.maxVariantPrice), currencyCode: "INR" },
        }
      : undefined,
    rating: metafieldNumber(node.rating, 4.5),
    reviewCount: node.reviewCount
      ? metafieldNumber(node.reviewCount, getFallbackReviewCount(node.handle))
      : getFallbackReviewCount(node.handle),
    isBestseller: hasAnyTag(tags, "bestseller", "best seller", "best-seller"),
    isTrending: hasAnyTag(tags, "trending"),
    isNewArrival,
    isFeatured: hasAnyTag(tags, "featured"),
    isLimitedTimeOffer: hasAnyTag(tags, "limited-time", "limited time", "limitedtime"),
    totalInventory: node.totalInventory,
    createdAt: node.createdAt,
    materialsLine: metafieldString(node.materialsLine, ""),
    recentPurchases: node.recentPurchases ? metafieldNumber(node.recentPurchases, 0) : undefined,
    careInstructions: metafieldString(node.careInstructions, ""),
    shippingReturnsNote: metafieldString(
      node.shippingReturnsNote,
      "Ships in 1-2 business days. Free returns within 7 days.",
    ),
    minDeliveryDays: metafieldNumber(node.minDeliveryDays, 2),
    maxDeliveryDays: metafieldNumber(node.maxDeliveryDays, 5),
  };
}
