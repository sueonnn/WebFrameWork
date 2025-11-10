// pages/SchedulePage.tsx
import React, { useState } from "react";
import TimeGrid from "../components/specific/schedule/TimeGrid";
import ScheduleSidebar from "../components/specific/schedule/ScheduleSidebar";
import { useMyScheduleStore } from "../stores/myScheduleStore";
import { useUserSettingStore } from "../stores/userScheduleSettingStore";
import type { WeekType } from "../types/schedule";

export default function SchedulePage() {
  const [activeTab, setActiveTab] = useState<WeekType>("this");
  const { schedules, setSchedules } = useMyScheduleStore();
  const {
    autoSave,
    showWorkingHoursOnly,
    setAutoSave,
    setShowWorkingHoursOnly,
  } = useUserSettingStore();

  const totalHours = schedules?.[activeTab]?.size ?? 0;

  /** 전체 삭제 */
  const handleClear = () => {
    if (autoSave) {
      // ✅ 자동저장 ON → store 즉시 비움
      setSchedules((prev) => {
        const copy = { this: new Set(prev.this), next: new Set(prev.next) };
        copy[activeTab] = new Set();
        return copy;
      });
    } else {
      // 💤 자동저장 OFF → UI(temp) 상태만 초기화
      window.dispatchEvent(new CustomEvent("clear-temp-cells"));
    }
  };

  /** 저장하기 (자동저장 OFF 전용) */
  const handleSave = () => {
    // ✅ TimeGrid가 temp → store로 commit하도록 이벤트 전달
    window.dispatchEvent(
      new CustomEvent("commit-temp-cells", { detail: { week: activeTab } })
    );

    // 💡 보정용 (UI 즉시 반영)
    setSchedules((prev) => ({
      this: new Set(prev.this),
      next: new Set(prev.next),
    }));
  };

  return (
    <section className="min-h-screen bg-[#F9FAFB] py-10">
      <div className="mx-auto w-[1200px] grid grid-cols-[minmax(0,1fr)_320px] gap-6 items-stretch">
        {/* ===== 왼쪽: 시간표 ===== */}
        <div className="rounded-2xl bg-white p-10 shadow-sm border border-gray-200 relative">
          {/* ===== 상단 바 ===== */}
          <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3 text-sm font-medium text-gray-700">
            {/* 탭 버튼 */}
            <div className="flex items-center rounded-2xl bg-gray-100 p-1">
              <button
                onClick={() => setActiveTab("this")}
                className={`px-5 py-2 rounded-xl font-semibold ${
                  activeTab === "this"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-700 hover:text-indigo-500"
                }`}
              >
                이번주
              </button>
              <button
                onClick={() => setActiveTab("next")}
                className={`px-5 py-2 rounded-xl font-semibold ${
                  activeTab === "next"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-700 hover:text-indigo-500"
                }`}
              >
                다음주
              </button>
            </div>

            {/* 설정 토글 */}
            <div className="flex items-center gap-6 text-gray-600">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="accent-indigo-500"
                  checked={showWorkingHoursOnly}
                  onChange={(e) => setShowWorkingHoursOnly(e.target.checked)}
                />
                근무시간만 보기
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="accent-indigo-500"
                  checked={autoSave}
                  onChange={(e) => setAutoSave(e.target.checked)}
                />
                자동저장
              </label>
            </div>
          </div>

          {/* ===== 안내 문구 ===== */}
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#D5DCFF] bg-[#EEF2FF] px-4 py-3 text-[#3730A3] font-semibold text-sm">
            <svg
              className="w-[1em] h-[1em] shrink-0 text-[#3730A3]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12" y2="8" />
            </svg>
            <p>
              클릭&드래그로 셀을 토글하세요.{" "}
              <span className="text-indigo-800 font-bold">
                (자동저장 OFF일 때는 저장하기 필요)
              </span>
            </p>
          </div>

          {/* ===== 타임그리드 ===== */}
          <TimeGrid weekType={activeTab} />

          {/* ===== 하단 버튼 ===== */}
          <div className="mt-6 flex justify-end gap-3">
            {/* 전체삭제 */}
            <button
              onClick={handleClear}
              className="px-5 py-2 text-sm font-semibold text-gray-600 border border-gray-200 rounded-full hover:bg-gray-50 transition"
            >
              전체 삭제
            </button>

            {/* 저장하기 (자동저장 OFF일 때만 표시) */}
            {!autoSave && (
              <button
                onClick={handleSave}
                className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-full shadow hover:bg-indigo-700 transition"
              >
                저장하기
              </button>
            )}
          </div>
        </div>

        {/* ===== 오른쪽: 요약 패널 ===== */}
        <ScheduleSidebar totalHours={totalHours} />
      </div>
    </section>
  );
}
