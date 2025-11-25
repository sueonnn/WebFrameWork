import { create } from "zustand";
import { USERS } from "../mock";
import type { User } from "../components/group/types";

type AuthState = {
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  // 초기에는 첫 번째 유저를 로그인 상태로 두고 싶으면 USERS[0], 
  // 완전 비로그인 상태로 시작하려면 null로 두면 됨.
  currentUser: USERS[0] ?? null,

  login: (user) => set({ currentUser: user }),
  logout: () => set({ currentUser: null }),
}));
