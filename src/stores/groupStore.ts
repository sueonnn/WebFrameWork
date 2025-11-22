import { create } from 'zustand';
import type { CreateGroupDTO, CreateGroupResponse } from '../types/group';
import { apiCreateGroup } from '../apis/groups';

const makeInviteCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // O/0, I/1 제외
  let s = '';
  for (let i = 0; i < 8; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
};

type GroupState = {
  creating: boolean;
  createGroup: (payload: CreateGroupDTO) => Promise<CreateGroupResponse>;
};

export const useGroupStore = create<GroupState>((set) => ({
  creating: false,
  createGroup: async (payload) => {
    set({ creating: true });
    try {
      console.log('[createGroup] payload', payload);
      // 실제 API (없으면 throw되어 catch로 감)
      const res = await apiCreateGroup(payload); // { id, inviteCode }
      console.log('[createGroup] response', res);
      return res;
    } catch (e) {
      console.warn('[createGroup] API 실패 → dev fallback 사용', e);
      await new Promise((r) => setTimeout(r, 600));
      return { id: crypto.randomUUID(), inviteCode: makeInviteCode() };
    } finally {
      set({ creating: false });
    }
  },
}));
