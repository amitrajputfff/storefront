"use client";

import { useWishlistStore } from "@/stores/wishlist-store";

export function useWishlist() {
  const items = useWishlistStore((s) => s.items);
  const toggle = useWishlistStore((s) => s.toggle);
  const remove = useWishlistStore((s) => s.remove);
  const has = useWishlistStore((s) => s.has);

  return { items, toggle, remove, has };
}
