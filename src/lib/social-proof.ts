function seededValue(seed: string, salt: number, mod: number): number {
  let hash = 0;
  const str = `${seed}-${salt}`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 1000000007;
  }
  return Math.abs(hash) % mod;
}

export interface SocialProofStats {
  soldLabel: string;
  visitorCount: number;
}

/** Deterministic per-product "social proof" numbers — stable per id, varied across the catalog. */
export function getSocialProofStats(seed: string): SocialProofStats {
  const soldThousands = 1 + seededValue(seed, 1, 90) / 10;
  const visitorCount = 40 + seededValue(seed, 2, 260);

  return {
    soldLabel: `${soldThousands.toFixed(1)}k+ Sold`,
    visitorCount,
  };
}
