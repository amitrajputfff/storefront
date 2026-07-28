import { Product } from "@/types";

const BENEFIT_COUNT = 5;

const cache = new Map<string, string[]>();

function fallbackBenefits(product: Product): string[] {
  const clauses = product.description
    .split(/[.•\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && s.length <= 60);
  if (clauses.length > 0) return clauses.slice(0, BENEFIT_COUNT);
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
 * Generated once per product at build time via Gemini, then cached in memory —
 * this runs during static generation, not per-request, so a Map is enough to
 * avoid duplicate calls across the handful of pages that reuse a product.
 */
export async function getKeyBenefits(product: Product): Promise<string[]> {
  const cached = cache.get(product.id);
  if (cached) return cached;

  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash";

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
      const fallback = fallbackBenefits(product);
      cache.set(product.id, fallback);
      return fallback;
    }

    const data = await res.json();
    const text: string | undefined = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const benefits = text ? parseBenefits(text) : [];
    const result = benefits.length > 0 ? benefits : fallbackBenefits(product);
    cache.set(product.id, result);
    return result;
  } catch (error) {
    console.error("Key benefits generation failed:", error);
    const fallback = fallbackBenefits(product);
    cache.set(product.id, fallback);
    return fallback;
  }
}
