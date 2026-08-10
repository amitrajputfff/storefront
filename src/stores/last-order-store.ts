import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Money, ProductImage } from "@/types";

export interface LastOrderLine {
  variantId: string;
  title: string;
  variantTitle: string;
  image: ProductImage;
  quantity: number;
  price: Money;
}

export interface LastOrderShipping {
  fullName: string;
  phone: string;
  email?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface LastOrderSummary {
  orderName: string;
  lines: LastOrderLine[];
  subtotal: number;
  discountAmount: number;
  total: number;
  paymentMethod: "cod";
  shipping: LastOrderShipping;
  placedAt: number;
}

interface LastOrderState {
  summary: LastOrderSummary | null;
  setSummary: (summary: LastOrderSummary) => void;
  clear: () => void;
}

/** Carries the just-placed order's line items/total from checkout to the thank-you page. */
export const useLastOrderStore = create<LastOrderState>()(
  persist(
    (set) => ({
      summary: null,
      setSummary: (summary) => set({ summary }),
      clear: () => set({ summary: null }),
    }),
    {
      name: "zeevara-last-order",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
