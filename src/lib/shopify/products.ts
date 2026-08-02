import { Product } from "@/types";
import { shopifyFetch } from "./client";
import { mapShopifyProduct, ShopifyProductNode } from "./mappers";
import { ALL_PRODUCTS_QUERY, PRODUCT_BY_HANDLE_QUERY, SEARCH_PRODUCTS_QUERY } from "./queries";

async function fetchAllProducts(): Promise<Product[]> {
  // Caching is handled entirely by Next.js's fetch cache (see shopifyFetch) —
  // tagged "shopify-products" and revalidated instantly by the Shopify
  // webhook, with a 1hr time-based fallback. No separate in-memory cache here.
  const data = await shopifyFetch<{ products: { edges: { node: ShopifyProductNode }[] } }>({
    query: ALL_PRODUCTS_QUERY,
  });

  return data.products.edges.map((e) => mapShopifyProduct(e.node));
}

export async function getAllProducts(): Promise<Product[]> {
  return fetchAllProducts();
}

export async function getProductByHandle(handle: string): Promise<Product | undefined> {
  const data = await shopifyFetch<{ productByHandle: ShopifyProductNode | null }>({
    query: PRODUCT_BY_HANDLE_QUERY,
    variables: { handle },
  });

  return data.productByHandle ? mapShopifyProduct(data.productByHandle) : undefined;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const all = await fetchAllProducts();
  return all.filter((p) => p.categories.includes(category));
}

export async function getProductsByHandles(handles: string[]): Promise<Product[]> {
  const set = new Set(handles);
  const all = await fetchAllProducts();
  return all.filter((p) => set.has(p.handle));
}

export async function getRelatedProducts(product: Product, limit = 8): Promise<Product[]> {
  const all = await fetchAllProducts();
  return all
    .filter((p) => p.id !== product.id && p.categories.some((c) => product.categories.includes(c)))
    .slice(0, limit);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.trim();
  if (!q) return [];

  const data = await shopifyFetch<{ products: { edges: { node: ShopifyProductNode }[] } }>({
    query: SEARCH_PRODUCTS_QUERY,
    variables: { query: `title:*${q}* OR tag:*${q}* OR product_type:*${q}*` },
  });

  return data.products.edges.map((e) => mapShopifyProduct(e.node));
}
