export interface SocialProofStats {
  soldLabel: string;
}

/**
 * Purely decorative, not tied to real sales data — seeded from the product id so it
 * stays roughly stable across refreshes instead of swinging wildly and looking fake.
 */
export function getSocialProofStats(seed: string): SocialProofStats {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const base = 1 + (hash % 90) / 10; // stable per product, 1.0k–9.9k
  const wobble = (Math.random() - 0.5) * 0.2; // tiny ±0.1k so it isn't perfectly static
  const soldThousands = Math.min(9.9, Math.max(1, base + wobble));

  return {
    soldLabel: `${soldThousands.toFixed(1)}k+ Sold`,
  };
}

/**
 * Purely decorative fallback for products without a real `recentPurchases` metafield —
 * seeded from the product id so it stays stable across refreshes instead of looking random.
 */
export function getRecentPurchaseCount(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return 2000 + (hash % 1500); // stable per product, always above 2000: 2000-3499
}

/**
 * Purely decorative fallback for products without a real reviewCount metafield —
 * seeded from the product id so it stays stable across refreshes, roughly 180-260.
 */
export function getFallbackReviewCount(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 37 + seed.charCodeAt(i)) >>> 0;
  }
  return 180 + (hash % 81);
}

/**
 * Purely decorative fallback for products without a real rating metafield —
 * seeded from the product id so it stays stable across refreshes, 4.2-5.0.
 */
export function getFallbackRating(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 43 + seed.charCodeAt(i)) >>> 0;
  }
  return 4.2 + (hash % 9) / 10;
}

/**
 * Purely decorative "selling out" stock bar — seeded from the product id so it stays
 * stable across refreshes, roughly 70-92% claimed.
 */
export function getSellingOutPercent(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 41 + seed.charCodeAt(i)) >>> 0;
  }
  return 70 + (hash % 23);
}

const INDIAN_CITIES = [
  "Mumbai",
  "Bengaluru",
  "Delhi",
  "Pune",
  "Hyderabad",
  "Chennai",
  "Jaipur",
  "Kolkata",
  "Ahmedabad",
  "Surat",
] as const;

export interface RecentPurchaseToastData {
  city: string;
  productTitle: string;
  minutesAgo: number;
}

/** Purely decorative, randomized — not tied to real sales data. */
export function getRecentPurchaseToast(productTitle: string): RecentPurchaseToastData {
  return {
    city: INDIAN_CITIES[Math.floor(Math.random() * INDIAN_CITIES.length)],
    productTitle,
    minutesAgo: 1 + Math.floor(Math.random() * 12),
  };
}
