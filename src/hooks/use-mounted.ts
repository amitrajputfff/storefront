"use client";

import { useEffect, useState } from "react";

/**
 * Guards against SSR/client hydration mismatches for state hydrated from
 * localStorage (cart/wishlist/recently-viewed counts). Render a stable
 * placeholder until this returns true.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}
