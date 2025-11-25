import { create } from "zustand";
import type { MySchedule } from "./schedule";

interface MyScheduleState {
  schedules: Record<string, MySchedule>;

  loadMemberSchedule: (memberId: string, data: MySchedule) => void;

  updateMemberSchedule: (
    memberId: string,
    updater: (prev: MySchedule) => MySchedule
  ) => void;
}

export const useMyScheduleStore = create<MyScheduleState>((set) => ({
  schedules: {},

  loadMemberSchedule: (memberId, data) =>
    set((state) => ({
      schedules: {
        ...state.schedules,
        [memberId]: data,
      },
    })),

  updateMemberSchedule: (memberId, updater) =>
    set((state) => {
      const prev = state.schedules[memberId] ?? { this: new Set(), next: new Set() };
      return {
        schedules: {
          ...state.schedules,
          [memberId]: updater(prev),
        },
      };
    }),
}));
