import { create } from "zustand";

interface LocationInfo {
  type: string;
  address: string;
}

interface LocationStore {
  locations: {
    [groupId: string]: {
      [memberId: string]: LocationInfo;
    };
  };
  setLocation: (groupId: string, memberId: string, data: LocationInfo) => void;
}

export const useLocationStore = create<LocationStore>((set) => ({
  locations: {},

  setLocation: (groupId, memberId, data) =>
    set((state) => ({
      locations: {
        ...state.locations,
        [groupId]: {
          ...(state.locations[groupId] || {}),
          [memberId]: data,
        },
      },
    })),
}));
