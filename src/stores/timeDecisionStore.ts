import { create } from "zustand";

export interface CandidateItem {
  id: string;
  timeLabel: string;
  availableCount: number;
  availableNames?: string[];
}

export interface TopItem {
  rank: number;
  time: string;
  percent: number;
  members: string;
}

interface TimeDecisionState {
  top3: TopItem[];
  candidates: CandidateItem[];
  participants: string[];
  setDecisionData: (data: {
    top3: TopItem[];
    candidates: CandidateItem[];
    participants: string[];
  }) => void;
}

export const useTimeDecisionStore = create<TimeDecisionState>((set) => ({
  top3: [],
  candidates: [],
  participants: [],
  setDecisionData: (data) =>
    set({
      top3: data.top3,
      candidates: data.candidates,
      participants: data.participants,
    }),
}));
