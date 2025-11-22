export type Task = {
  id: string;
  title: string;
  addedBy: string;
  date: string;
  done: boolean;
  assignee: string | null;
};