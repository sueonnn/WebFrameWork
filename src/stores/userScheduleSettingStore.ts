import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserSettingState {
  autoSave: boolean;
  showWorkingHoursOnly: boolean;
  setAutoSave: (value: boolean) => void;
  setShowWorkingHoursOnly: (value: boolean) => void;
}

export const useUserSettingStore = create<UserSettingState>()(
  persist(
    (set) => ({
      autoSave: true,
      showWorkingHoursOnly: false,
      setAutoSave: (value) => set({ autoSave: value }),
      setShowWorkingHoursOnly: (value) => set({ showWorkingHoursOnly: value }),
    }),
    {
      name: "user-schedule-setting",
      storage: {
        getItem: (name) => {
          const value = localStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
