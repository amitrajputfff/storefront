import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem, Money } from "@/types";

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id" | "addedAt">) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.variantId === item.variantId,
          );
          if (existing) {
            const nextQuantity = Math.min(
              existing.quantity + item.quantity,
              existing.maxQuantity,
            );
            return {
              items: state.items.map((i) =>
                i.id === existing.id ? { ...i, quantity: nextQuantity } : i,
              ),
            };
          }
          const now = Date.now();
          return {
            items: [
              ...state.items,
              { ...item, id: `${item.variantId}-${now}`, addedAt: now },
            ],
          };
        }),
      removeItem: (lineId) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== lineId),
        })),
      updateQuantity: (lineId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.id !== lineId)
              : state.items.map((i) =>
                  i.id === lineId
                    ? { ...i, quantity: Math.min(quantity, i.maxQuantity) }
                    : i,
                ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "zeevara-cart",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export function cartSubtotal(items: CartItem[]): Money {
  return {
    amount: items.reduce((sum, i) => sum + i.price.amount * i.quantity, 0),
    currencyCode: "INR",
  };
}

export function cartTotalQuantity(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}
