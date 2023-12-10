import {create} from "zustand";

interface GStore {
    count: number;
    inc: () => void;
    dec: () => void;
}

export const useGStore = create<GStore>((set) => ({
    count: 0,
    inc: () => set((state) => ({count: state.count + 1})),
    dec: () => set((state) => ({count: state.count - 1}))
}));