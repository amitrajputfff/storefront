export interface SocialProofStats {
  soldLabel: string;
  visitorCount: number;
}

/** Purely decorative, randomized on each mount — not tied to real sales/traffic data. */
export function getSocialProofStats(): SocialProofStats {
  const soldThousands = 1 + Math.random() * 9;
  const visitorCount = 40 + Math.floor(Math.random() * 260);

  return {
    soldLabel: `${soldThousands.toFixed(1)}k+ Sold`,
    visitorCount,
  };
}
