import { Product } from "@/types";
import { adminFetch, isShopifyAdminConfigured } from "@/lib/shopify/admin-client";

const BENEFIT_COUNT = 5;
const METAFIELD_NAMESPACE = "storefront";
const METAFIELD_KEY = "key_benefits";

const cache = new Map<string, string[]>();

const KEY_BENEFITS_METAFIELD_QUERY = `
  query KeyBenefitsMetafield($id: ID!, $namespace: String!, $key: String!) {
    product(id: $id) {
      metafield(namespace: $namespace, key: $key) { value }
    }
  }
`;

const SET_KEY_BENEFITS_METAFIELD_MUTATION = `
  mutation SetKeyBenefitsMetafield($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      userErrors { field message }
    }
  }
`;

/** Reads previously-generated benefits back from a Shopify product metafield,
 * so a rebuild or cold start doesn't have to re-spend Gemini's daily quota on
 * a product we've already generated benefits for. */
async function readKeyBenefitsMetafield(productId: string): Promise<string[] | null> {
  try {
    const data = await adminFetch<{ product: { metafield: { value: string } | null } | null }>(
      KEY_BENEFITS_METAFIELD_QUERY,
      { id: productId, namespace: METAFIELD_NAMESPACE, key: METAFIELD_KEY },
    );
    const raw = data.product?.metafield?.value;
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.every((b) => typeof b === "string") ? parsed : null;
  } catch (error) {
    console.error("Reading key benefits metafield failed:", error);
    return null;
  }
}

async function writeKeyBenefitsMetafield(productId: string, benefits: string[]): Promise<void> {
  try {
    await adminFetch(SET_KEY_BENEFITS_METAFIELD_MUTATION, {
      metafields: [
        {
          ownerId: productId,
          namespace: METAFIELD_NAMESPACE,
          key: METAFIELD_KEY,
          type: "json",
          value: JSON.stringify(benefits),
        },
      ],
    });
  } catch (error) {
    console.error("Saving key benefits metafield failed:", error);
  }
}

// Splitting a sentence on commas leaves mid-clause fragments like "A soft" —
// these all signal "this clause was truncated," not a real standalone benefit.
const FRAGMENT_START_WORDS = new Set([
  "a", "an", "the", "for", "with", "in", "of", "and", "or", "to", "at", "by",
]);

function isCompletePhrase(clause: string): boolean {
  const words = clause.split(/\s+/);
  // A comma-separated list ("...for Plants, Pots, Gardens and Home Plants")
  // splits into dangling one-or-two-word list items like "Pots" — these
  // aren't sentence fragments by their starting word, so they slip past the
  // stopword check above; requiring at least 3 words filters them out too.
  if (words.length < 3) return false;
  return !FRAGMENT_START_WORDS.has(words[0].toLowerCase());
}

/**
 * Only a safety net for when Gemini is unreachable — splits the description
 * into distinct clauses rather than ever echoing the title/description back
 * as a single fake "benefit" (many dropship listings are just one sentence
 * identical to the title, which reads as embarrassing filler, not a benefit).
 */
function fallbackBenefits(product: Product): string[] {
  const normalizedTitle = product.title.trim().toLowerCase();
  const clauses = product.description
    .split(/[.•\n,]/)
    .map((s) => s.trim())
    .filter(
      (s) =>
        s.length > 0 &&
        s.length <= 60 &&
        isCompletePhrase(s) &&
        s.toLowerCase() !== normalizedTitle,
    );

  if (clauses.length >= 2) return clauses.slice(0, BENEFIT_COUNT);
  return [product.materialsLine].filter(Boolean);
}

function parseBenefits(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.replace(/^[\s\-*•\d.)]+/, "").trim())
    .filter(Boolean)
    .slice(0, BENEFIT_COUNT);
}

/**
 * Generated once per product via Gemini, then persisted to a Shopify product
 * metafield so future builds/cold starts reuse it instead of re-spending
 * Gemini's daily quota — the in-memory Map only dedupes calls within a single
 * process (e.g. the same product rendered on several pages in one build).
 */
export async function getKeyBenefits(product: Product): Promise<string[]> {
  const cached = cache.get(product.id);
  if (cached) return cached;

  if (isShopifyAdminConfigured()) {
    const saved = await readKeyBenefitsMetafield(product.id);
    if (saved) {
      cache.set(product.id, saved);
      return saved;
    }
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  if (!apiKey) {
    const fallback = fallbackBenefits(product);
    cache.set(product.id, fallback);
    return fallback;
  }

  const prompt = `Product title: ${product.title}
Product description: ${product.description}

Write exactly ${BENEFIT_COUNT} short, scannable key-benefit bullet points a shopper would read before buying this product. Each bullet must be under 6 words, start with a capital letter, contain no trailing punctuation, and contain no markdown or numbering. Return only the ${BENEFIT_COUNT} bullets, one per line, nothing else.`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }),
      },
    );

    if (!res.ok) {
      console.error(
        `Key benefits generation failed for "${product.title}": Gemini returned ${res.status} ${res.statusText}`,
        await res.text().catch(() => ""),
      );
      const fallback = fallbackBenefits(product);
      cache.set(product.id, fallback);
      return fallback;
    }

    const data = await res.json();
    const text: string | undefined = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const benefits = text ? parseBenefits(text) : [];
    const result = benefits.length > 0 ? benefits : fallbackBenefits(product);
    cache.set(product.id, result);
    if (benefits.length > 0 && isShopifyAdminConfigured()) {
      await writeKeyBenefitsMetafield(product.id, result);
    }
    return result;
  } catch (error) {
    console.error("Key benefits generation failed:", error);
    const fallback = fallbackBenefits(product);
    cache.set(product.id, fallback);
    return fallback;
  }
}
