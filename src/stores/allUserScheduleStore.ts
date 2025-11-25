import { create } from "zustand";
import type { MySchedule } from "./schedule"; 

interface AllUserScheduleState {
  schedules: Record<string, MySchedule>;
  setUserSchedule: (userId: string, schedule: MySchedule) => void;
  setMany: (data: Record<string, MySchedule>) => void;
}

export const useAllUserScheduleStore = create<AllUserScheduleState>((set) => ({
  schedules: {},

  setUserSchedule: (userId, schedule) =>
    set((prev) => ({
      schedules: {
        ...prev.schedules,
        [userId]: schedule,
      },
    })),

  setMany: (data) =>
    set(() => ({
      schedules: data,
    })),
}));
