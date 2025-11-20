// src/types/Task.ts
export type Task = {
  id: string;       // Firestore 문서 id 역할
  title: string;
  addedBy: string;
  date: string;
  done: boolean;
  assignee: string | null;
  
};
