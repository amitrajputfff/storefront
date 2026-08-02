"use server";

import { Product } from "@/types";
import { buildProduct } from "./builder";
import { isShopifyConfigured } from "@/lib/shopify/client";
import * as shopify from "@/lib/shopify/products";

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

const allProducts: Product[] = authoredProducts.map((authored, index) =>
  buildProduct(authored, index),
);

/**
 * Reads from the live Shopify Storefront API once SHOPIFY_STORE_DOMAIN and
 * SHOPIFY_STOREFRONT_ACCESS_TOKEN are set (see .env.local.example), otherwise
 * falls back to the local mock catalog so the app keeps running unconfigured.
 */

export async function getAllProducts(): Promise<Product[]> {
  if (isShopifyConfigured()) return shopify.getAllProducts();
  return allProducts;
}

export async function getProductByHandle(handle: string): Promise<Product | undefined> {
  if (isShopifyConfigured()) return shopify.getProductByHandle(handle);
  return allProducts.find((p) => p.handle === handle);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  if (isShopifyConfigured()) return shopify.getProductsByCategory(category);
  return allProducts.filter((p) => p.categories.includes(category));
}

export async function getProductsByHandles(handles: string[]): Promise<Product[]> {
  if (isShopifyConfigured()) return shopify.getProductsByHandles(handles);
  const set = new Set(handles);
  return allProducts.filter((p) => set.has(p.handle));
}

export async function getRelatedProducts(product: Product, limit = 8): Promise<Product[]> {
  if (isShopifyConfigured()) return shopify.getRelatedProducts(product, limit);
  return allProducts
    .filter((p) => p.id !== product.id && p.categories.some((c) => product.categories.includes(c)))
    .slice(0, limit);
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
  if (isShopifyConfigured()) return shopify.searchProducts(query);

  const q = query.trim().toLowerCase();
  if (!q) return [];

  return allProducts
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
}
