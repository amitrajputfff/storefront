"use server";

import { Product } from "@/types";
import { buildProduct } from "./builder";
import { isShopifyConfigured } from "@/lib/shopify/client";
import * as shopify from "@/lib/shopify/products";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin-client";

interface ProductOverrideRow {
  product_handle: string;
  title: string | null;
  description: string | null;
  description_html: string | null;
  images: Product["images"] | null;
  compare_at_price: number | null;
  materials_line: string | null;
  care_instructions: string | null;
  shipping_returns_note: string | null;
}

/** Admin-editable overrides (src/app/admin/(dashboard)/products/) layered on
 * top of whatever the live source (real Shopify or the local mock catalog
 * below) says. Never throws — an unconfigured/unreachable Supabase just means
 * no overrides apply, so the page still renders the source data untouched. */
async function applyOverrides(products: Product[]): Promise<Product[]> {
  if (products.length === 0 || !isSupabaseAdminConfigured()) return products;

  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("product_overrides")
      .select("*")
      .in(
        "product_handle",
        products.map((p) => p.handle),
      );

    if (error || !data || data.length === 0) return products;

    const overrides = new Map<string, ProductOverrideRow>(
      (data as ProductOverrideRow[]).map((row) => [row.product_handle, row]),
    );

    return products.map((product) => {
      const override = overrides.get(product.handle);
      if (!override) return product;

      // compare_at_price is the only pricing-adjacent field that's overridable
      // — it's just the "was ₹X" display figure (never what's actually
      // charged), so it's applied everywhere the app reads a compare-at price
      // from: both product-level (cards, badges, bundle) and every variant
      // (PDP buy box, sticky buy bar) — see components that read
      // product.compareAtPriceRange vs variant.compareAtPrice.
      const compareAtPrice =
        override.compare_at_price != null
          ? { amount: override.compare_at_price, currencyCode: "INR" as const }
          : undefined;

      return {
        ...product,
        title: override.title ?? product.title,
        description: override.description ?? product.description,
        descriptionHtml: override.description_html ?? product.descriptionHtml,
        images: override.images && override.images.length > 0 ? override.images : product.images,
        materialsLine: override.materials_line ?? product.materialsLine,
        careInstructions: override.care_instructions ?? product.careInstructions,
        shippingReturnsNote: override.shipping_returns_note ?? product.shippingReturnsNote,
        ...(compareAtPrice && {
          compareAtPriceRange: { min: compareAtPrice, max: compareAtPrice },
          variants: product.variants.map((v) => ({ ...v, compareAtPrice })),
        }),
      };
    });
  } catch {
    return products;
  }
}

import { products as homeDecor } from "./home-decor";
import { products as kitchen } from "./kitchen";
import { products as office } from "./office";
import { products as travel } from "./travel";
import { products as accessories } from "./accessories";
import { products as fitness } from "./fitness";
import { products as lifestyle } from "./lifestyle";
import { products as pets } from "./pets";
import { products as beauty } from "./beauty";
import { products as electronics } from "./electronics";

const authoredProducts = [
  ...homeDecor,
  ...kitchen,
  ...office,
  ...travel,
  ...accessories,
  ...fitness,
  ...lifestyle,
  ...pets,
  ...beauty,
  ...electronics,
];

// Ordered by date added (earliest first) by default so every consumer that
// reads this array directly (collections, related products, admin list)
// inherits date-added order without needing its own sort.
const allProducts: Product[] = authoredProducts
  .map((authored, index) => buildProduct(authored, index))
  .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

/**
 * Reads from the live Shopify Storefront API once SHOPIFY_STORE_DOMAIN and
 * SHOPIFY_STOREFRONT_ACCESS_TOKEN are set (see .env.local.example), otherwise
 * falls back to the local mock catalog so the app keeps running unconfigured.
 */

export async function getAllProducts(): Promise<Product[]> {
  const products = isShopifyConfigured() ? await shopify.getAllProducts() : allProducts;
  return applyOverrides(products);
}

export async function getProductByHandle(handle: string): Promise<Product | undefined> {
  const product = isShopifyConfigured()
    ? await shopify.getProductByHandle(handle)
    : allProducts.find((p) => p.handle === handle);
  if (!product) return undefined;
  const [merged] = await applyOverrides([product]);
  return merged;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const products = isShopifyConfigured()
    ? await shopify.getProductsByCategory(category)
    : allProducts.filter((p) => p.categories.includes(category));
  return applyOverrides(products);
}

export async function getProductsByHandles(handles: string[]): Promise<Product[]> {
  const products = isShopifyConfigured()
    ? await shopify.getProductsByHandles(handles)
    : (() => {
        const set = new Set(handles);
        return allProducts.filter((p) => set.has(p.handle));
      })();
  return applyOverrides(products);
}

export async function getRelatedProducts(product: Product, limit = 8): Promise<Product[]> {
  const products = isShopifyConfigured()
    ? await shopify.getRelatedProducts(product, limit)
    : allProducts
        .filter((p) => p.id !== product.id && p.categories.some((c) => product.categories.includes(c)))
        .slice(0, limit);
  return applyOverrides(products);
}

/** Category handles that actually have real products right now, ranked by how many. */
export async function getPopulatedCategoryHandles(limit = 4): Promise<string[]> {
  const products = await getAllProducts();
  const counts = new Map<string, number>();
  for (const p of products) {
    for (const c of p.categories) {
      counts.set(c, (counts.get(c) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([category]) => category);
}

export async function searchProducts(query: string): Promise<Product[]> {
  if (isShopifyConfigured()) return applyOverrides(await shopify.searchProducts(query));

  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results = allProducts
    .map((p) => {
      let score = 0;
      if (p.title.toLowerCase().includes(q)) score += 3;
      if (p.tags.some((t) => t.toLowerCase().includes(q))) score += 2;
      if (p.categories.some((c) => c.toLowerCase().includes(q))) score += 2;
      if (p.description.toLowerCase().includes(q)) score += 1;
      return { product: p, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.product);

  return applyOverrides(results);
}
