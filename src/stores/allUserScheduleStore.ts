import { create } from "zustand";
import type { MySchedule } from "./schedule"; 

interface AllUserScheduleState {
  schedules: Record<
    string, 
    Record<
      string, 
      MySchedule
    >
  >;

  setUserSchedule: (
    groupId: string,
    memberId: string,
    schedule: MySchedule
  ) => void;

  setManyGroupSchedules: (
    groupId: string,
    data: Record<string, MySchedule>
  ) => void;
}

export const useAllUserScheduleStore = create<AllUserScheduleState>((set) => ({
  schedules: {},

  /** 그룹 + 멤버 단위로 저장 */
  setUserSchedule: (groupId, memberId, schedule) =>
    set((state) => ({
      schedules: {
        ...state.schedules,
        [groupId]: {
          ...(state.schedules[groupId] ?? {}),
          [memberId]: schedule,
        },
      },
    })),

  /** 한 그룹의 여러 멤버 스케줄을 한 번에 저장 */
  setManyGroupSchedules: (groupId, data) =>
    set((state) => ({
      schedules: {
        ...state.schedules,
        [groupId]: data,
      },
    })),
}));
