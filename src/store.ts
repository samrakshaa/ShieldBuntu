import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface GStore {
  count: number;
  inc: () => void;
  dec: () => void;
}

export const useGStore = create(
  persist<GStore>(
    (set) => ({
      count: 0,
      inc: () => set((state) => ({ count: state.count + 1 })),
      dec: () => set((state) => ({ count: state.count - 1 })),
    }),
    {
      name: "global-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
