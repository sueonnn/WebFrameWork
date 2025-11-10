import { create } from "zustand";
import type { WeekType } from "../types/schedule";

interface GroupScheduleState {
  groupName: string;
  memberCount: number;
  groupSchedules: Record<WeekType, Record<string, number>>; // "0-13": count
  setGroupName: (name: string) => void;
  updateSchedule: (week: WeekType, cellKey: string, count: number) => void;
  clearGroup: (week: WeekType) => void;
}

export const useGroupScheduleStore = create<GroupScheduleState>((set) => ({
  groupName: "D.L.O.O.L",
  memberCount: 6,
  groupSchedules: {
    this: {},
    next: {},
  },

  setGroupName: (name) => set({ groupName: name }),

  updateSchedule: (week, cellKey, count) =>
    set((state) => ({
      groupSchedules: {
        ...state.groupSchedules,
        [week]: { ...state.groupSchedules[week], [cellKey]: count },
      },
    })),

  clearGroup: (week) =>
    set((state) => ({
      groupSchedules: { ...state.groupSchedules, [week]: {} },
    })),
}));
