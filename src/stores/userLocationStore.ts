import { create } from "zustand";

interface UserLocationState {
  address: string;
  setAddress: (addr: string) => void;
}

export const useUserLocationStore = create<UserLocationState>((set) => ({
  address: "",
  setAddress: (addr) => set({ address: addr }),
}));
