export interface SocialProofStats {
  soldLabel: string;
}

/** Purely decorative, randomized on each mount — not tied to real sales data. */
export function getSocialProofStats(): SocialProofStats {
  const soldThousands = 1 + Math.random() * 9;

  return {
    soldLabel: `${soldThousands.toFixed(1)}k+ Sold`,
  };
}
