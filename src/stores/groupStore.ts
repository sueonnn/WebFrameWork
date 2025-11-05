
import { create } from 'zustand';
import { CreateGroupDTO } from '../types/group.ts';

type GroupState = {
  creating: boolean;
  createGroup: (payload: CreateGroupDTO) => Promise<string>; // returns new groupId
};

export const useGroupStore = create<GroupState>((set) => ({
  creating: false,
  createGroup: async (payload) => {
    set({ creating: true });
    try {
      // TODO: 실제 API 연동 자리 (fetch/axios)
      console.log('[createGroup] payload', payload); // 사용자가 console.log 선호
      await new Promise((r) => setTimeout(r, 600));
      return crypto.randomUUID(); // 더미 groupId
    } finally {
      set({ creating: false });
    }
  },
}));
