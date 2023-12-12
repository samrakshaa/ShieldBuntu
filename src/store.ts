import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface GStore {
  firewall: boolean;
}

export const useGStore = create(
  persist<GStore>(
    (set) => ({
      firewall: false,
      toggleFirewall: () => set((state) => ({ firewall: !state.firewall })),
    }),
    {
      name: "global-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
