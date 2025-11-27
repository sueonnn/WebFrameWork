import { create } from "zustand";

export type VoteStatus = "agree" | "pending" | null;

interface TimeVoteState {
  myVotesByGroup: Record<string, Record<string, VoteStatus>>;

  setMyVote: (groupId: string, candidateId: string, vote: VoteStatus) => void;
  clearGroupVotes: (groupId: string) => void;
}

export const useTimeVoteStore = create<TimeVoteState>((set) => ({
  myVotesByGroup: {},

  setMyVote: (groupId, candidateId, vote) =>
    set((state) => {
      const prevGroupVotes = state.myVotesByGroup[groupId] ?? {};
      const nextGroupVotes = {
        ...prevGroupVotes,
        [candidateId]: vote,
      };

      return {
        myVotesByGroup: {
          ...state.myVotesByGroup,
          [groupId]: nextGroupVotes,
        },
      };
    }),

  clearGroupVotes: (groupId) =>
    set((state) => {
      const next = { ...state.myVotesByGroup };
      delete next[groupId];
      return { myVotesByGroup: next };
    }),
}));
