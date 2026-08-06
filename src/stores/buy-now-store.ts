import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem } from "@/types";

export type BuyNowItem = Omit<CartItem, "id" | "addedAt">;

interface BuyNowState {
  item: BuyNowItem | null;
  setItem: (item: BuyNowItem) => void;
  clear: () => void;
}

/** Holds a single "Buy Now" item outside the persistent cart, so clicking Buy Now
 * on a product never mixes it into (or checks out) whatever else is already in the cart. */
export const useBuyNowStore = create<BuyNowState>()(
  persist(
    (set) => ({
      item: null,
      setItem: (item) => set({ item }),
      clear: () => set({ item: null }),
    }),
    {
      name: "zeevara-buy-now",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
