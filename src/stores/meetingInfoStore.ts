// stores/meetingInfoStore.ts
import { create } from "zustand";
import { MEETING_INFOS } from "../mock";
import type { MeetingInfo } from "../types/MeetingInfo";

type MeetingInfoState = {
  meetingInfos: MeetingInfo[];
  updateLocationByGroupId: (groupId: string, location: string) => void;
  updateTimeByMeetingId: (meetingId: string, time: string) => void;  
  getByGroupId: (groupId: string) => MeetingInfo | undefined;
  getByMeetingId: (meetingId: string) => MeetingInfo | undefined;    
};

export const useMeetingInfoStore = create<MeetingInfoState>((set, get) => ({
  meetingInfos: MEETING_INFOS,

  updateLocationByGroupId: (groupId, location) =>
    set((state) => ({
      meetingInfos: state.meetingInfos.map((m) =>
        m.groupId === groupId ? { ...m, location } : m
      ),
    })),

  // 시간 확정용
  updateTimeByMeetingId: (meetingId, time) =>
    set((state) => ({
      meetingInfos: state.meetingInfos.map((m) =>
        m.id === meetingId ? { ...m, time } : m
      ),
    })),

  getByGroupId: (groupId) =>
    get().meetingInfos.find((m) => m.groupId === groupId),

  getByMeetingId: (meetingId) =>
    get().meetingInfos.find((m) => m.id === meetingId),
}));
