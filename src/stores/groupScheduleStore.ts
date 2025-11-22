import { create } from "zustand";
import type { WeekType } from "../types/schedule";

interface GroupScheduleState {
  groupName: string;
  memberIds: string[];   // 그룹 멤버
  memberCount: number;

  groupSchedules: {
    this: Record<string, number>;
    next: Record<string, number>;
  };

  setGroupSchedules: (s: {
    this: Record<string, number>;
    next: Record<string, number>;
  }) => void;
}

export const useGroupScheduleStore = create<GroupScheduleState>((set) => ({
  groupName: "우리 팀",
  memberIds: ["user1", "user2", "user3"],
  memberCount: 3,

  groupSchedules: {
    this: {},
    next: {},
  },

  setGroupSchedules: (groupSchedules) => set({ groupSchedules }),
}));
