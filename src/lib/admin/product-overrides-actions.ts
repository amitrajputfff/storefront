"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdminClient } from "@/lib/supabase/admin-client";
import { requireAdminSession } from "./require-session";
import { getAllProducts, getProductByHandle, searchProducts } from "@/mock/products";
import type { Product, ProductImage } from "@/types";

export type ProductActionResult<T = undefined> = { ok: true; data: T } | { ok: false; error: string };

export interface AdminProductListItem {
  handle: string;
  title: string;
  thumbnailUrl: string | null;
  hasOverride: boolean;
}

export interface ProductOverrideFields {
  title: string | null;
  description: string | null;
  descriptionHtml: string | null;
  images: ProductImage[] | null;
  /** The "was ₹X" display figure only — never what's actually charged, so
   * it's the one price-adjacent field that's safe to override independently
   * of Shopify (real price/variants/inventory are never overridable here). */
  compareAtPrice: number | null;
  materialsLine: string | null;
  careInstructions: string | null;
  shippingReturnsNote: string | null;
}

const EMPTY_OVERRIDE: ProductOverrideFields = {
  title: null,
  description: null,
  descriptionHtml: null,
  images: null,
  compareAtPrice: null,
  materialsLine: null,
  careInstructions: null,
  shippingReturnsNote: null,
};

interface ProductOverrideRow {
  product_handle: string;
  title: string | null;
  description: string | null;
  description_html: string | null;
  images: ProductImage[] | null;
  compare_at_price: number | null;
  materials_line: string | null;
  care_instructions: string | null;
  shipping_returns_note: string | null;
}

function rowToFields(row: ProductOverrideRow): ProductOverrideFields {
  return {
    title: row.title,
    description: row.description,
    descriptionHtml: row.description_html,
    images: row.images,
    compareAtPrice: row.compare_at_price,
    materialsLine: row.materials_line,
    careInstructions: row.care_instructions,
    shippingReturnsNote: row.shipping_returns_note,
  };
}

export async function listProductsWithOverrideStatus(): Promise<ProductActionResult<AdminProductListItem[]>> {
  await requireAdminSession();

  const products = await getAllProducts();
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.from("product_overrides").select("product_handle");
  if (error) return { ok: false, error: error.message };

  const overridden = new Set((data ?? []).map((r) => r.product_handle as string));

  return {
    ok: true,
    data: products.map((p) => ({
      handle: p.handle,
      title: p.title,
      thumbnailUrl: p.images[0]?.url ?? null,
      hasOverride: overridden.has(p.handle),
    })),
  };
}

/** Returns the current effective product (live source + any override already
 * merged in, used for placeholders/defaults in the edit form) alongside the
 * raw override row (used to know exactly which fields are actually
 * overridden, so the form doesn't show every field as "customized"). */
export async function getProductForEdit(
  handle: string,
): Promise<ProductActionResult<{ product: Product; override: ProductOverrideFields }>> {
  await requireAdminSession();

  const product = await getProductByHandle(handle);
  if (!product) return { ok: false, error: "Product not found." };

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("product_overrides")
    .select("*")
    .eq("product_handle", handle)
    .maybeSingle();

  if (error) return { ok: false, error: error.message };

  return { ok: true, data: { product, override: data ? rowToFields(data) : EMPTY_OVERRIDE } };
}

/** Blank strings/empty arrays are treated as "no override" (falls back to the
 * live source) rather than saved as literal empty values — clearing a field
 * in the form reverts just that field, not the whole product. */
export async function saveProductOverride(
  handle: string,
  fields: ProductOverrideFields,
): Promise<ProductActionResult> {
  await requireAdminSession();

  const normalizeText = (v: string | null) => (v && v.trim().length > 0 ? v.trim() : null);
  const compareAtPrice =
    fields.compareAtPrice != null && fields.compareAtPrice > 0 ? fields.compareAtPrice : null;

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("product_overrides").upsert({
    product_handle: handle,
    title: normalizeText(fields.title),
    description: normalizeText(fields.description),
    description_html: normalizeText(fields.descriptionHtml),
    images: fields.images && fields.images.length > 0 ? fields.images : null,
    compare_at_price: compareAtPrice,
    materials_line: normalizeText(fields.materialsLine),
    care_instructions: normalizeText(fields.careInstructions),
    shipping_returns_note: normalizeText(fields.shippingReturnsNote),
  });

  if (error) return { ok: false, error: error.message };

  revalidatePath("/", "layout");
  return { ok: true, data: undefined };
}

export async function resetProductOverride(handle: string): Promise<ProductActionResult> {
  await requireAdminSession();

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("product_overrides").delete().eq("product_handle", handle);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/", "layout");
  return { ok: true, data: undefined };
}

export interface AdminProductSearchResult {
  handle: string;
  title: string;
  thumbnailUrl: string | null;
}

/** Used by the Reviews admin's "Add Review" product picker. */
export async function searchProductsForAdmin(query: string): Promise<ProductActionResult<AdminProductSearchResult[]>> {
  await requireAdminSession();

  const trimmed = query.trim();
  const products = trimmed ? await searchProducts(trimmed) : (await getAllProducts()).slice(0, 20);

  return {
    ok: true,
    data: products.map((p) => ({
      handle: p.handle,
      title: p.title,
      thumbnailUrl: p.images[0]?.url ?? null,
    })),
  };
}
