import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const COOLDOWN_MS = 3 * 24 * 60 * 60 * 1000;
const OFFER_WINDOW_MS = 30 * 60 * 1000;

interface WelcomeOfferState {
  dismissedUntil: number | null;
  offerExpiresAt: number | null;
  dismiss: () => void;
  ensureOfferWindow: () => void;
}

export const useWelcomeOfferStore = create<WelcomeOfferState>()(
  persist(
    (set, get) => ({
      dismissedUntil: null,
      offerExpiresAt: null,
      dismiss: () => set({ dismissedUntil: Date.now() + COOLDOWN_MS }),
      ensureOfferWindow: () => {
        const { offerExpiresAt } = get();
        if (!offerExpiresAt || offerExpiresAt < Date.now()) {
          set({ offerExpiresAt: Date.now() + OFFER_WINDOW_MS });
        }
      },
    }),
    {
      name: "zeevara-welcome-offer",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export function canShowWelcomeOffer(dismissedUntil: number | null): boolean {
  return !dismissedUntil || dismissedUntil < Date.now();
}
