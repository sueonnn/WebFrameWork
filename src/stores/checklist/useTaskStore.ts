import { create } from "zustand";
import type { Task } from "../../types/Task";
import { TASKS_BY_MEETING } from "../../mock"; // ⭐ mock 가져오기

interface TaskStore {
  tasksByMeeting: Record<string, Task[]>;
  setTasks: (meetingId: string, tasks: Task[]) => void;
  addTask: (meetingId: string, task: Task) => void;
  updateTask: (meetingId: string, taskId: string, update: Partial<Task>) => void;
  deleteTask: (meetingId: string, taskId: string) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  // ⭐ mock 데이터로 초기화
  tasksByMeeting: { ...TASKS_BY_MEETING },

  setTasks: (meetingId, tasks) =>
    set((state) => ({
      tasksByMeeting: { ...state.tasksByMeeting, [meetingId]: tasks },
    })),

  addTask: (meetingId, task) =>
    set((state) => ({
      tasksByMeeting: {
        ...state.tasksByMeeting,
        [meetingId]: [...(state.tasksByMeeting[meetingId] ?? []), task],
      },
    })),

  updateTask: (meetingId, taskId, update) =>
    set((state) => ({
      tasksByMeeting: {
        ...state.tasksByMeeting,
        [meetingId]: state.tasksByMeeting[meetingId].map((t) =>
          t.id === taskId ? { ...t, ...update } : t
        ),
      },
    })),

  deleteTask: (meetingId, taskId) =>
    set((state) => ({
      tasksByMeeting: {
        ...state.tasksByMeeting,
        [meetingId]: state.tasksByMeeting[meetingId].filter(
          (t) => t.id !== taskId
        ),
      },
    })),
}));
