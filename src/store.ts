import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface GFireStore {
  firewall: boolean;
  toggleFirewall: () => void;
}

interface GNetworkStore {
  ssh: boolean;
  toggleSSH: () => void;
}
interface GSidemenuStore {
  activeTab: number;
  setActiveTab: (index: GSidemenuStore["activeTab"]) => void;
}

export const useFirewallStore = create(
  persist<GFireStore>(
    (set) => ({
      firewall: false,
      toggleFirewall: () => set((state) => ({ firewall: !state.firewall })),
    }),
    {
      name: "firewall-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useNetworkStore = create(
  persist<GNetworkStore>(
    (set) => ({
      ssh: false,
      toggleSSH: () => set((state) => ({ ssh: !state.ssh })),
    }),
    {
      name: "network-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useSidemenuStore = create(
  persist<GSidemenuStore>(
    (set) => ({
      activeTab: 0,
      setActiveTab: (index) => set(() => ({ activeTab: index })),
    }),
    {
      name: "sidemenu-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
