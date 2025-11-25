import { create } from "zustand";
import type { Meeting } from "../../types/history";

interface HistoryState {
  history: Meeting[];
  addHistory: (item: Meeting) => void;
  updateHistory: (id: string, updated: Partial<Meeting>) => void;
  updateOrAddHistory: (item: Meeting) => void;
  removeHistory: (id: string) => void;
}

export const useHistoryStore = create<HistoryState>((set) => ({
  history: JSON.parse(localStorage.getItem("history") ?? "[]"),

  addHistory: (item) =>
    set((state) => {
      const newList = [item, ...state.history];
      localStorage.setItem("history", JSON.stringify(newList));
      return { history: newList };
    }),

  updateHistory: (id, updated) =>
    set((state) => {
      const newList = state.history.map((m) =>
        m.id === id ? { ...m, ...updated } : m
      );
      localStorage.setItem("history", JSON.stringify(newList));
      return { history: newList };
    }),

  updateOrAddHistory: (item) =>
    set((state) => {
      const exists = state.history.some((m) => m.id === item.id);

      const newList = exists
        ? state.history.map((m) =>
            m.id === item.id ? { ...m, ...item } : m
          )
        : [item, ...state.history];

      localStorage.setItem("history", JSON.stringify(newList));
      return { history: newList };
    }),

  removeHistory: (id) =>
    set((state) => {
      const newList = state.history.filter((m) => m.id !== id);
      localStorage.setItem("history", JSON.stringify(newList));
      return { history: newList };
    }),
}));
