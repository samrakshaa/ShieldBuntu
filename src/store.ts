import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface GFireStore {
  firewall: boolean;
  changeFirewall: (status: boolean) => void;
}

interface USBDevice {
  sequence: number;
  id: string;
  name: string;
  status: "blocked" | "active";
}
interface GUsbStore {
  usbStatus: boolean;
  connectedUsbs: USBDevice[];
  whiteListedUsbs: USBDevice[];
  blackListedUsbs: USBDevice[];
  changeUsbStatus: (status: boolean) => void;
  setConnectedUsbs: (usbs: USBDevice[]) => void;
}
interface GNetworkStore {
  ssh: boolean;
  tor: boolean;
  changeSSH: (status: boolean) => void;
  changeTor: (status: boolean) => void;
}

export const useFirewallStore = create(
  persist<GFireStore>(
    (set) => ({
      firewall: false,
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
      changeTor: (status: boolean) => set(() => ({ tor: status })),
      changeSSH: (status: boolean) => set(() => ({ ssh: status })),
    }),
    {
      name: "network-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useUsbStore = create(
  persist<GUsbStore>(
    (set) => ({
      usbStatus: false,
      connectedUsbs: [],
      whiteListedUsbs: [],
      blackListedUsbs: [],
      changeUsbStatus: (status: boolean) => set(() => ({ usbStatus: status })),
      setConnectedUsbs: (connUsbs: USBDevice[]) =>
        set(() => ({ connectedUsbs: connUsbs })),
    }),
    {
      name: "usb-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
