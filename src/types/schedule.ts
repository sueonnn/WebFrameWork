// types/schedule.ts
export type WeekType = "this" | "next";

export type SchedulesMap = {
  this: Set<string>;
  next: Set<string>;
};
