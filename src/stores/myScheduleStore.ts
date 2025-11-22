import { create } from "zustand";
import type { MySchedule } from "./schedule";

interface MyScheduleState {
  /** 개인 일정 상태 (this / next 주차) */
  schedules: MySchedule;

  /** 일정 갱신 */
  setSchedules: (updater: (prev: MySchedule) => MySchedule) => void;
}

export const useMyScheduleStore = create<MyScheduleState>((set) => ({
  schedules: {
    this: new Set(),
    next: new Set(),
  },

  setSchedules: (updater) =>
    set((state) => ({
      schedules: updater(state.schedules),
    })),
}));
