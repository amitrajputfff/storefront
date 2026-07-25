import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const MAX_ITEMS = 10;

interface RecentlyViewedState {
  handles: string[];
  addHandle: (handle: string) => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      handles: [],
      addHandle: (handle) =>
        set((state) => ({
          handles: [handle, ...state.handles.filter((h) => h !== handle)].slice(
            0,
            MAX_ITEMS,
          ),
        })),
    }),
    {
      name: "zeevara-recently-viewed",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
