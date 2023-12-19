import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type remote = boolean;
interface USBDevice {
  id: string;
  name: string;
  state: "block" | "allow";
}
interface GStore {
  isRemote: remote;
  setRemote: (client: remote) => void;
  firewall: boolean;
  changeFirewall: (status: boolean) => void;
  usbStatus: boolean;
  connectedUsbs: USBDevice[];
  changeUsbStatus: (status: boolean) => void;
  setConnectedUsbs: (usbs: USBDevice[]) => void;
  ssh: boolean;
  tor: boolean;
  torTimeout: boolean;
  torTimeoutTimestamp: number;
  changeSSH: (status: boolean) => void;
  runTorDisable: (status: boolean) => void;
  setTorTimeout: (status: boolean) => void;
}

export const useGStore = create(
  persist<GStore>(
    (set) => ({
      isRemote: false,
      setRemote: () => set((state) => ({ isRemote: !state.isRemote })),
      firewall: false,
      changeFirewall: (status: boolean) => set(() => ({ firewall: status })),
      ssh: false,
      tor: false,
      torTimeout: false,
      torTimeoutTimestamp: 0, // New property to store timestamp
      runTorDisable: (status: boolean) => set(() => ({ tor: status })),
      changeSSH: (status: boolean) => set(() => ({ ssh: status })),
      setTorTimeout: (status: boolean) => {
        set(() => ({ torTimeout: status }));
        if (status) {
          set(() => ({ torTimeoutTimestamp: Date.now() })); // Set timestamp when torTimeout is true
          setTimeout(() => {
            set(() => ({ torTimeout: false, torTimeoutTimestamp: 0 })); // Reset torTimeout and timestamp
          }, 10 * 60 * 1000); // 10 minutes timeout
        }
      },
      usbStatus: false,
      connectedUsbs: [],
      changeUsbStatus: (status: boolean) => set(() => ({ usbStatus: status })),
      setConnectedUsbs: (connUsbs: USBDevice[]) =>
        set(() => ({ connectedUsbs: connUsbs })),
    }),
    {
      name: "global-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
