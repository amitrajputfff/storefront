import { create } from "zustand";

interface UiState {
  isCartOpen: boolean;
  isMobileNavOpen: boolean;
  quickViewProductHandle: string | null;
  openCart: () => void;
  closeCart: () => void;
  toggleMobileNav: (open?: boolean) => void;
  openQuickView: (handle: string) => void;
  closeQuickView: () => void;
}

export const useUiStore = create<UiState>()((set) => ({
  isCartOpen: false,
  isMobileNavOpen: false,
  quickViewProductHandle: null,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleMobileNav: (open) =>
    set((state) => ({ isMobileNavOpen: open ?? !state.isMobileNavOpen })),
  openQuickView: (handle) => set({ quickViewProductHandle: handle }),
  closeQuickView: () => set({ quickViewProductHandle: null }),
}));
