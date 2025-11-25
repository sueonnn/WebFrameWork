// src/types/MeetingInfo.ts

export interface MeetingInfo {
  id: string;                // 모임 ID
  groupId: string;           // 그룹 ID
  title: string;             // 모임 이름
  date: string;              // "2024년 1월 15일" 형태
  time: string;              // "목요일 19:00~20:00"
  location: string;          // "강남역 2번 출구 스타벅스"
  participants: string[];    // 참석자 리스트 ["김철수", "이영희"...]
  //memo?: string;             // 선택적 메모
}

