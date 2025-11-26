// src/data/dummyMeetings.ts
import { MeetingInfo } from "../types/MeetingInfo";

export const dummyMeetings: MeetingInfo[] = [
  {
    id: "m1",
    groupId: "g1",     // 그룹 ID
    title: "프로젝트 팀",
    date: "2024년 1월 15일",
    time: "목요일 19:00~20:00",
    location: "한성대학교",
    participants: ["김철수", "이영희", "박민수", "최지영", "정다은"],
  },
  {
    id: "m2",
    groupId: "g2",
    title: "스터디 그룹",
    date: "2024년 2월 3일",
    time: "토요일 17:00~19:00",
    location: "홍대 메가커피 2층",
    participants: ["김철수", "이영희", "정다은"],
  },
];
