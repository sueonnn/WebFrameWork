export type WeekType = "this" | "next";

// 개인 스케줄
export type MySchedule = {
  this: Set<string>;  // "요일-시간" → "2-14"
  next: Set<string>;
};
