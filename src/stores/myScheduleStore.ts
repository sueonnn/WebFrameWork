import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WeekType, SchedulesMap } from "../types/schedule";

type Updater<T> = T | ((prev: T) => T);

interface MyScheduleState {
  schedules: SchedulesMap;
  toggleCell: (week: WeekType, day: number, hour: number) => void;
  clearWeek: (week: WeekType) => void;
  setSchedules: (updater: Updater<SchedulesMap>) => void;
}

// Set <-> Array 변환 유틸
const setsToArrays = (s: SchedulesMap) => ({
  this: Array.from(s.this),
  next: Array.from(s.next),
});
const arraysToSets = (a: { this: string[]; next: string[] }): SchedulesMap => ({
  this: new Set(a.this || []),
  next: new Set(a.next || []),
});

// 커스텀 localStorage adapter (타입 안전)
const customStorage = {
  getItem: (name: string): any => {
    const str = localStorage.getItem(name);
    if (!str) return null;
    try {
      const parsed = JSON.parse(str);
      if (parsed.state?.schedules) {
        parsed.state.schedules = arraysToSets(parsed.state.schedules);
      }
      return parsed;
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: any) => {
    try {
      const copy = { ...value };
      if (copy.state?.schedules) {
        copy.state.schedules = setsToArrays(copy.state.schedules);
      }
      localStorage.setItem(name, JSON.stringify(copy));
    } catch (e) {
      console.error("Failed to persist schedules:", e);
    }
  },
  removeItem: (name: string) => localStorage.removeItem(name),
};

export const useMyScheduleStore = create<MyScheduleState>()(
  persist(
    (set, get) => ({
      schedules: { this: new Set<string>(), next: new Set<string>() },
      setSchedules: (updater) => {
        set((state) => {
          const prev = state.schedules;
          const next =
            typeof updater === "function"
              ? (updater as (p: SchedulesMap) => SchedulesMap)(prev)
              : updater;
          return { schedules: next };
        });
      },
      toggleCell: (week, day, hour) => {
        set((state) => {
          const key = `${day}-${hour}`;
          const copy: SchedulesMap = {
            this: new Set(state.schedules.this),
            next: new Set(state.schedules.next),
          };
          const target = copy[week];
          target.has(key) ? target.delete(key) : target.add(key);
          return { schedules: copy };
        });
      },
      clearWeek: (week) =>
        set((state) => {
          const copy: SchedulesMap = {
            this: new Set(state.schedules.this),
            next: new Set(state.schedules.next),
          };
          copy[week] = new Set();
          return { schedules: copy };
        }),
    }),
    {
      name: "my-schedules",
      storage: customStorage,
    }
  )
);
