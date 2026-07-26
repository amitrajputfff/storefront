"use client";

import { useEffect, useState } from "react";
import { getSocialProofStats, SocialProofStats } from "@/lib/social-proof";

/** Returns null until after mount, so the server-rendered HTML never has to guess a random value. */
export function useSocialProof(): SocialProofStats | null {
  const [stats, setStats] = useState<SocialProofStats | null>(null);

  useEffect(() => {
    setStats(getSocialProofStats());
  }, []);

  return stats;
}
