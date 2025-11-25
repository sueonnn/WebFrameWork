import React, { useState, useEffect, useMemo, useRef } from "react";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";

import { useMyScheduleStore } from "../../../stores/myScheduleStore";
import { useUserSettingStore } from "../../../stores/userScheduleSettingStore";
import { useAllUserScheduleStore } from "../../../stores/allUserScheduleStore";

import type { WeekType } from "../../../types/schedule";

interface TimeGridProps {
  weekType: WeekType;
}

export default function TimeGrid({ weekType }: TimeGridProps) {
  const { groupId, memberId } = useParams<{ groupId: string; memberId: string }>();

  const currentUserId = memberId!;  
  const { schedules, updateMemberSchedule } = useMyScheduleStore();
  const { autoSave, showWorkingHoursOnly } = useUserSettingStore();
  const { setUserSchedule } = useAllUserScheduleStore();

  const [tempSelected, setTempSelected] = useState<Set<string>>(new Set());
  const isDraggingRef = useRef(false);

  const mySchedule =
    schedules[currentUserId] ?? { this: new Set<string>(), next: new Set<string>() };

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

  const displayedSet = useMemo(() => {
    const base = new Set(mySchedule[weekType]); 

    tempSelected.forEach((k) => {
      if (base.has(k)) base.delete(k);
      else base.add(k);
    });

    return base;
  }, [mySchedule, weekType, tempSelected]);

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
    toggleTemp(day, hour);
  };

  const handleMouseEnter = (day: number, hour: number) => {
    if (!isDraggingRef.current) return;
    toggleTemp(day, hour);
  };

  /** 🔥 실제 저장 (tempSelected → store 반영) */
  const applyCommit = (week: WeekType) => {
    if (!groupId) return;

    updateMemberSchedule(currentUserId, (prev) => {
      const copy = {
        this: new Set(prev.this),
        next: new Set(prev.next),
      };

      const base = copy[week];

      tempSelected.forEach((k) => {
        if (base.has(k)) base.delete(k);
        else base.add(k);
      });

      setUserSchedule(groupId, currentUserId, {
        this: new Set(copy.this),
        next: new Set(copy.next),
      });

      return copy;
    });

    setTempSelected(new Set());
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    if (autoSave) {
      applyCommit(weekType);
    }
  };

  useEffect(() => {
    const clearTemp = () => {
      if (!autoSave) {
        setTempSelected(new Set());
      }
    };

    const commitTemp = (e: Event) => {
      const { week } = (e as CustomEvent<{ week: WeekType }>).detail || {};
      if (!week || autoSave) return;
      applyCommit(week);
    };

    window.addEventListener("clear-temp-cells", clearTemp);
    window.addEventListener("commit-temp-cells", commitTemp as EventListener);

    return () => {
      window.removeEventListener("clear-temp-cells", clearTemp);
      window.removeEventListener("commit-temp-cells", commitTemp as EventListener);
    };
  }, [autoSave, tempSelected, weekType]);

  useEffect(() => {
    setTempSelected(new Set());
  }, [weekType]);

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
