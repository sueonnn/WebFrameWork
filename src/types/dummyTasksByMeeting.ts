import { Task } from "../types/Task";


export const dummyTasksByMeeting: Record<string, Task[]> = {
  m1: [
    {
      id: "t1",
      title: "회의실 예약하기",
      addedBy: "이영희",
      date: "2024. 1. 15",
      done: true,
      assignee: "김철수",
    },
    {
      id: "t2",
      title: "프레젠테이션 자료 준비",
      addedBy: "김철수",
      date: "2024. 1. 15",
      done: false,
      assignee: "박민수",
    },
    {
      id: "t3",
      title: "간식 준비",
      addedBy: "최지영",
      date: "2024. 1. 15",
      done: false,
      assignee: null,
    },
  ],
  m2: [
    {
      id: "t1",
      title: "스터디 발표자료 정리",
      addedBy: "김철수",
      date: "2024. 2. 3",
      done: false,
      assignee: "김철수",
    },
  ],
};
