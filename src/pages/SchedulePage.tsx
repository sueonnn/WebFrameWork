// pages/SchedulePage.tsx
import React, { useState } from "react";

import TimeGrid from "../components/specific/schedule/TimeGrid";
import ScheduleSidebar from "../components/specific/schedule/ScheduleSidebar";

import ScheduleTabs from "../components/specific/schedule/ScheduleTabs";
import ScheduleToggles from "../components/specific/schedule/ScheduleToggles";
import ScheduleHintBanner from "../components/specific/schedule/ScheduleHintBanner";
import ScheduleActionButtons from "../components/specific/schedule/ScheduleActionButtons";

import { useMyScheduleStore } from "../stores/myScheduleStore";
import { useUserSettingStore } from "../stores/userScheduleSettingStore";
import { useAllUserScheduleStore } from "../stores/allUserScheduleStore";

import type { WeekType } from "../types/schedule";

export default function SchedulePage() {
  const [activeTab, setActiveTab] = useState<WeekType>("this");

  /** 개인 스케줄 (UI + temp 포함) */
  const { schedules, setSchedules } = useMyScheduleStore();

  /** 전체 유저 스케줄 저장 위한 store */
  const { setUserSchedule } = useAllUserScheduleStore();

  /** 사용자 환경 설정 */
  const {
    autoSave,
    showWorkingHoursOnly,
    setAutoSave,
    setShowWorkingHoursOnly,
  } = useUserSettingStore();

  const totalHours = schedules?.[activeTab]?.size ?? 0;

  // ===========================================================
  // 🧨 전체 삭제 (Delete All)
  // ===========================================================
  const handleClear = () => {
    if (autoSave) {
      // 자동저장 ON → store에 즉시 반영
      setSchedules((prev) => {
        const copy = { this: new Set(prev.this), next: new Set(prev.next) };
        copy[activeTab] = new Set();
        return copy;
      });

      // 전체 userStore에도 즉시 반영
      setUserSchedule("user1", {
        this: new Set(schedules.this),
        next: new Set(schedules.next),
      });
    } else {
      // 자동저장 OFF → 임시 셀만 초기화 요청
      window.dispatchEvent(new CustomEvent("clear-temp-cells"));
    }
  };

  // ===========================================================
  // 🧨 저장하기 (자동저장 OFF 전용)
  // ===========================================================
  const handleSave = () => {
    // temp → store로 commit 되도록 TimeGrid에게 알림
    window.dispatchEvent(
      new CustomEvent("commit-temp-cells", { detail: { week: activeTab } })
    );

    // UI 즉시 반영
    setSchedules((prev) => ({
      this: new Set(prev.this),
      next: new Set(prev.next),
    }));

    // 🔥 전체(allUser) store에도 저장 반영
    setUserSchedule("user1", {
      this: new Set(schedules.this),
      next: new Set(schedules.next),
    });
  };

  return (
    <section className="min-h-screen bg-[#F9FAFB] py-10">
      <div className="mx-auto w-[1200px] grid grid-cols-[minmax(0,1fr)_320px] gap-6 items-stretch">

        {/* ================================================================= */}
        {/* ========================= 왼쪽: 시간표 ========================== */}
        {/* ================================================================= */}
        <div className="rounded-2xl bg-white p-10 shadow-sm border border-gray-200 relative">
          
          {/* ============================ 상단바 ============================= */}
          <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3 text-sm font-medium text-gray-700">
            <ScheduleTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            <ScheduleToggles
              showWorkingHoursOnly={showWorkingHoursOnly}
              setShowWorkingHoursOnly={setShowWorkingHoursOnly}
              autoSave={autoSave}
              setAutoSave={setAutoSave}
            />
          </div>

          {/* 안내 문구 */}
          <ScheduleHintBanner />

          {/* 타임그리드 */}
          <TimeGrid weekType={activeTab} />

          {/* 하단 버튼 */}
          <ScheduleActionButtons
            autoSave={autoSave}
            onClear={handleClear}
            onSave={handleSave}
          />
        </div>

        {/* ================================================================= */}
        {/* ========================= 오른쪽: 패널 ========================== */}
        {/* ================================================================= */}
        <ScheduleSidebar totalHours={totalHours} />
      </div>
    </section>
  );
}
