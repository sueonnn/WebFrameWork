import React, { useState, useEffect, useMemo, useRef } from "react";
import dayjs from "dayjs";
import { useMyScheduleStore } from "../../../stores/myScheduleStore";
import { useUserSettingStore } from "../../../stores/userScheduleSettingStore";
import type { WeekType } from "../../../types/schedule";

interface TimeGridProps {
  weekType: WeekType;
}

export default function TimeGrid({ weekType }: TimeGridProps) {
  // 🔹 toggleCell 제거 (이제 드래그 중에는 항상 tempSelected만 사용)
  const { schedules, setSchedules } = useMyScheduleStore();
  const { autoSave, showWorkingHoursOnly } = useUserSettingStore();

  const [tempSelected, setTempSelected] = useState<Set<string>>(new Set());
  const [hiddenSet, setHiddenSet] = useState<Set<string>>(new Set());
  const [prevAutoSave, setPrevAutoSave] = useState(autoSave);
  const [prevWeekType, setPrevWeekType] = useState<WeekType>(weekType);
  const isDraggingRef = useRef(false);

  // ===== 날짜 계산 =====
  const startOfWeek = useMemo(() => {
    const base = dayjs().startOf("week").add(1, "day");
    return weekType === "next" ? base.add(7, "day") : base;
  }, [weekType]);

  const days = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, i) => ({
        label: ["월", "화", "수", "목", "금", "토", "일"][i],
        dateText: startOfWeek.add(i, "day").format("MM/DD"),
      })),
    [startOfWeek]
  );

  const hours = useMemo(
    () =>
      showWorkingHoursOnly
        ? Array.from({ length: 9 }, (_, i) => i + 9)
        : Array.from({ length: 24 }, (_, i) => i),
    [showWorkingHoursOnly]
  );

  // ===== 표시용 셋 =====
  const displayedSet = useMemo(() => {
    const base = new Set(schedules?.[weekType] ?? []);
    // 숨김된 셀 제외 (UI 전체삭제 시)
    hiddenSet.forEach((k) => base.delete(k));

    // 🔹 autoSave여도 드래그 중인 tempSelected는 바로 UI에 표시
    const union = new Set(base);
    tempSelected.forEach((k) => union.add(k));
    return union;
  }, [schedules, weekType, tempSelected, hiddenSet]);

  // ===== 외부 이벤트 리스너 =====
  useEffect(() => {
    const clearTemp = () => {
      if (!autoSave) {
        // UI 전체삭제 시: 현재 주차 store값을 hidden 처리
        const storeSet = schedules?.[weekType] ?? new Set();
        setHiddenSet(new Set(storeSet));
      }
      setTempSelected(new Set());
    };

    const commitTemp = (e: Event) => {
      const { week } = (e as CustomEvent<{ week: WeekType }>).detail || {};
      if (!week) return;

      // temp → store 반영
      setSchedules((prev) => {
        const copy = {
          this: new Set(prev.this),
          next: new Set(prev.next),
        };
        tempSelected.forEach((k) => copy[week].add(k));
        return copy;
      });

      // 저장 후 temp / hidden 초기화
      setTempSelected(new Set());
      setHiddenSet(new Set());
    };

    window.addEventListener("clear-temp-cells", clearTemp);
    window.addEventListener("commit-temp-cells", commitTemp as EventListener);

    return () => {
      window.removeEventListener("clear-temp-cells", clearTemp);
      window.removeEventListener("commit-temp-cells", commitTemp as EventListener);
    };
  }, [tempSelected, setSchedules, autoSave, schedules, weekType]);

  // ===== 자동저장 전환 감지 (OFF→ON 시 temp commit) =====
  useEffect(() => {
    if (!prevAutoSave && autoSave && tempSelected.size > 0) {
      // OFF→ON 전환 시 temp commit
      setSchedules((prev) => {
        const copy = {
          this: new Set(prev.this),
          next: new Set(prev.next),
        };
        tempSelected.forEach((k) => copy[weekType].add(k));
        return copy;
      });
      setTempSelected(new Set());
    }
    // 자동저장 ON 시 숨김 해제
    if (autoSave && hiddenSet.size > 0) setHiddenSet(new Set());
    setPrevAutoSave(autoSave);
  }, [autoSave, prevAutoSave, tempSelected, hiddenSet, setSchedules, weekType]);

  // ===== ✅ 탭(weekType) 변경 감지 =====
  useEffect(() => {
    if (prevWeekType !== weekType) {
      // 주차 바뀌면 임시 상태 초기화 (UI 새로 렌더)
      setTempSelected(new Set());
      setHiddenSet(new Set());
      setPrevWeekType(weekType);
    }
  }, [weekType, prevWeekType]);

  // ===== 셀 토글 (항상 temp에만 기록) =====
  const toggleTemp = (day: number, hour: number) => {
    const key = `${day}-${hour}`;
    setTempSelected((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const handleMouseDown = (day: number, hour: number) => {
    isDraggingRef.current = true;
    // 🔹 autoSave 여부와 관계없이 드래그 중엔 tempSelected만 변경
    toggleTemp(day, hour);
  };

  const handleMouseEnter = (day: number, hour: number) => {
    if (!isDraggingRef.current) return;
    // 🔹 드래그 중인 셀 계속 tempSelected에 반영
    toggleTemp(day, hour);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;

    // 🔹 자동저장 ON일 때만 드래그가 끝난 시점에 store로 commit
    if (autoSave && tempSelected.size > 0) {
      setSchedules((prev) => {
        const copy = {
          this: new Set(prev.this),
          next: new Set(prev.next),
        };
        tempSelected.forEach((k) => copy[weekType].add(k));
        return copy;
      });
      setTempSelected(new Set());
    }
  };

  // ===== 렌더 =====
  return (
    <div
      className="overflow-x-auto select-none relative"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <table className="w-full border-separate border-spacing-[2px] text-sm">
        <thead>
          <tr className="text-gray-500">
            <th className="w-20"></th>
            {days.map((d) => (
              <th key={d.label} className="w-[120px] text-center">
                <div className="flex flex-col items-center">
                  <span className="text-sm font-semibold text-gray-800">
                    {d.label}
                  </span>
                  <span className="text-[12px] text-gray-400 mt-[2px]">
                    {d.dateText}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hours.map((hour) => (
            <tr key={hour}>
              <td className="text-right pr-2 text-xs text-gray-400 whitespace-nowrap">
                {String(hour).padStart(2, "0")}:00
              </td>
              {Array.from({ length: 7 }).map((_, day) => {
                const key = `${day}-${hour}`;
                const isSelected = displayedSet.has(key);
                return (
                  <td
                    key={key}
                    onMouseDown={() => handleMouseDown(day, hour)}
                    onMouseEnter={() => handleMouseEnter(day, hour)}
                    className={`h-10 w-[120px] border-[1.5px] rounded-sm cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-indigo-200 border-indigo-400"
                        : "bg-white border-[#EEEFF2] hover:bg-indigo-50"
                    }`}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
