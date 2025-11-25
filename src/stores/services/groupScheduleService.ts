// src/services/groupScheduleService.ts
import type { MySchedule } from "../schedule";

/**
 * 여러 사람의 스케줄 데이터를 합산하여
 * 그룹 히트맵 스케줄을 계산하는 함수.
 *
 * @param memberSchedules - { userId: MySchedule } 형태로 저장된 전체 사용자 스케줄
 * @param memberIds       - 이 그룹에 포함된 사용자 ID 배열
 * @returns {
 *   this: { "2-14": 2, ... },
 *   next: { "3-15": 1, ... }
 * }
 */
export function computeGroupSchedule(
  memberSchedules: Record<string, MySchedule>,
  memberIds: string[]
) {
  const result = {
    this: {} as Record<string, number>,
    next: {} as Record<string, number>,
  };

  memberIds.forEach((uid) => {
    const schedule = memberSchedules[uid];
    if (!schedule) return; // 스케줄 없는 사람은 스킵

    (["this", "next"] as const).forEach((week) => {
      schedule[week].forEach((cellKey) => {
        result[week][cellKey] = (result[week][cellKey] || 0) + 1;
      });
    });
  });

  return result;
}
