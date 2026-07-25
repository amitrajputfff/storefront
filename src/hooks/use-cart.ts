"use client";

import { useMemo } from "react";
import { useCartStore, cartSubtotal, cartTotalQuantity } from "@/stores/cart-store";

export function useCart() {
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);

  const subtotal = useMemo(() => cartSubtotal(items), [items]);
  const totalQuantity = useMemo(() => cartTotalQuantity(items), [items]);

  return { items, addItem, removeItem, updateQuantity, clearCart, subtotal, totalQuantity };
}
