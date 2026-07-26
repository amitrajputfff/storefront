import { CartItem } from "@/types";

export function useCartReservation(items: CartItem[], minutes = 15): Date | null {
  if (items.length === 0) return null;
  const oldestAddedAt = Math.min(...items.map((i) => i.addedAt ?? Date.now()));
  return new Date(oldestAddedAt + minutes * 60_000);
}
