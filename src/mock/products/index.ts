import { Product } from "@/types";
import { buildProduct } from "./builder";

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

export async function getAllProducts(): Promise<Product[]> {
  return allProducts;
}

export async function getProductByHandle(handle: string): Promise<Product | undefined> {
  return allProducts.find((p) => p.handle === handle);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  return allProducts.filter((p) => p.category === category);
}

export async function getProductsByHandles(handles: string[]): Promise<Product[]> {
  const set = new Set(handles);
  return allProducts.filter((p) => set.has(p.handle));
}

export async function getRelatedProducts(product: Product, limit = 8): Promise<Product[]> {
  return allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return allProducts
    .map((p) => {
      let score = 0;
      if (p.title.toLowerCase().includes(q)) score += 3;
      if (p.tags.some((t) => t.toLowerCase().includes(q))) score += 2;
      if (p.category.toLowerCase().includes(q)) score += 2;
      if (p.description.toLowerCase().includes(q)) score += 1;
      return { product: p, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.product);
}
