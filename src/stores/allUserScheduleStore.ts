// import { create } from "zustand";
// import type { MySchedule } from "./schedule"; 

// interface AllUserScheduleState {
//   schedules: Record<string, MySchedule>;
//   setUserSchedule: (userId: string, schedule: MySchedule) => void;
//   setMany: (data: Record<string, MySchedule>) => void;
// }

// export const useAllUserScheduleStore = create<AllUserScheduleState>((set) => ({
//   schedules: {},

//   setUserSchedule: (userId, schedule) =>
//     set((prev) => ({
//       schedules: {
//         ...prev.schedules,
//         [userId]: schedule,
//       },
//     })),

//   setMany: (data) =>
//     set(() => ({
//       schedules: data,
//     })),
// }));


// src/stores/allUserScheduleStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { MySchedule } from "./schedule";

/** localStorage 안에 저장되는 형태 */
type EncodedSchedule = {
  this: string[];
  next: string[];
};

type PersistedState = {
  schedules: Record<string, EncodedSchedule>;
};

type AllUserScheduleState = {
  // 메모리에 들고 있는 실제 스케줄 (Set 사용)
  schedules: Record<string, MySchedule>;
  hasHydrated: boolean;

  setUserSchedule: (memberId: string, schedule: MySchedule) => void;
  setHasHydrated: (value: boolean) => void;

  // storage 변경 이벤트로 한 번에 교체할 때 사용
  replaceAll: (next: Record<string, MySchedule>) => void;
};

function encodeSchedule(s: MySchedule): EncodedSchedule {
  return {
    this: Array.from(s.this ?? []),
    next: Array.from(s.next ?? []),
  };
}

function decodeSchedule(raw: EncodedSchedule | undefined): MySchedule {
  return {
    this: new Set(raw?.this ?? []),
    next: new Set(raw?.next ?? []),
  };
}

export const useAllUserScheduleStore = create<AllUserScheduleState>()(
  persist(
    (set, get) => ({
      schedules: {},
      hasHydrated: false,

      setUserSchedule: (memberId, schedule) =>
        set((state) => ({
          schedules: {
            ...state.schedules,
            [memberId]: schedule,
          },
        })),

      setHasHydrated: (value) => set({ hasHydrated: value }),

      replaceAll: (next) => set({ schedules: next }),
    }),
    {
      name: "all-user-schedules",
      storage: createJSONStorage(() => localStorage),

      // Set -> Array 로만 바꿔서 저장
      partialize: (state): PersistedState => {
        const encoded: Record<string, EncodedSchedule> = {};
        for (const [memberId, sched] of Object.entries(state.schedules)) {
          encoded[memberId] = encodeSchedule(sched);
        }
        return { schedules: encoded };
      },

      // ❗ 여기가 핵심: persistedState는 이미 { schedules: ... } 형태다.
      merge: (persistedState: any, currentState) => {
        const rawSchedules: Record<string, EncodedSchedule> =
          (persistedState?.schedules as Record<string, EncodedSchedule>) ?? {};

        const decoded: Record<string, MySchedule> = {};
        for (const [memberId, raw] of Object.entries(rawSchedules)) {
          decoded[memberId] = decodeSchedule(raw);
        }

        return {
          ...currentState,
          schedules: {
            ...currentState.schedules,
            ...decoded,
          },
        };
      },

      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

// 🔄 같은 브라우저 다른 탭/창에서도 동기화되게 localStorage 이벤트 리스너 추가
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key !== "all-user-schedules" || !event.newValue) return;

    try {
      // persist 기본 포맷: { state: PersistedState, version: number }
      const parsed = JSON.parse(event.newValue) as {
        state?: PersistedState;
        version?: number;
      };

      const persisted = parsed.state;
      if (!persisted || !persisted.schedules) return;

      const decoded: Record<string, MySchedule> = {};
      for (const [memberId, raw] of Object.entries(persisted.schedules)) {
        decoded[memberId] = decodeSchedule(raw as EncodedSchedule);
      }

      const current = useAllUserScheduleStore.getState().schedules;
      useAllUserScheduleStore
        .getState()
        .replaceAll({ ...current, ...decoded });
    } catch (e) {
      console.error("[allUserScheduleStore] storage sync error", e);
    }
  });
}
