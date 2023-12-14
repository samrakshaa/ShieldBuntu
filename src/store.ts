import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface GFireStore {
  firewall: boolean;
  toggleFirewall: () => void;
  changeFirewall: (status: boolean) => void;
}

interface GNetworkStore {
  ssh: boolean;
  tor: boolean;
  toggleSSH: () => void;
  changeSSH: (status: boolean) => void;
  toggleTor: () => void;
  changeTor: (status: boolean) => void;
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
      changeFirewall: (status: boolean) => set(() => ({ firewall: status })),
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
      tor: false,
      toggleTor: () => set((state) => ({ tor: !state.tor })),
      changeTor: (status: boolean) => set(() => ({ ssh: status })),
      toggleSSH: () => set((state) => ({ ssh: !state.ssh })),
      changeSSH: (status: boolean) => set(() => ({ ssh: status })),
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
