/**
 * Tags that describe product state/marketing flags rather than a shopping
 * category — a product tagged "bestseller" shouldn't spawn a "Bestseller"
 * category page alongside its real categories (kitchen, home-decor, etc).
 * Mirrors the tag variants checked in lib/shopify/mappers.ts's hasAnyTag().
 */
const FUNCTIONAL_TAGS = new Set([
  "bestseller",
  "best seller",
  "best-seller",
  "trending",
  "new",
  "featured",
  "limited-time",
  "limited time",
  "limitedtime",
  "sale",
]);

/**
 * Every remaining tag on a product becomes a category it belongs to, so a
 * product tagged both "kitchen" and "home-decor" in Shopify shows up under
 * both collections — and a brand-new tag gets its own working category page
 * automatically, with no code change or redeploy needed.
 */
export function deriveCategories(tags: string[]): string[] {
  const lower = tags.map((t) => t.toLowerCase());
  const matched = Array.from(new Set(lower.filter((t) => !FUNCTIONAL_TAGS.has(t))));
  return matched.length > 0 ? matched : ["lifestyle"];
}
