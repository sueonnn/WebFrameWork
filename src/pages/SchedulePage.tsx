// SchedulePage.tsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import TimeGrid from "../components/specific/schedule/TimeGrid";
import ScheduleSidebar from "../components/specific/schedule/ScheduleSidebar";

import ScheduleTabs from "../components/specific/schedule/ScheduleTabs";
import ScheduleHintBanner from "../components/specific/schedule/ScheduleHintBanner";
import ScheduleActionButtons from "../components/specific/schedule/ScheduleActionButtons";
import BackArrow from "../components/icons/BackArrow";

import { useMyScheduleStore } from "../stores/myScheduleStore";
import { useUserSettingStore } from "../stores/userScheduleSettingStore";
import { useAllUserScheduleStore } from "../stores/allUserScheduleStore";

import type { WeekType } from "../types/schedule";

export default function SchedulePage() {
  const navigate = useNavigate();
  const { groupId, memberId } = useParams();

  const [activeTab, setActiveTab] = useState<WeekType>("this");

  /** 개인 스케줄 (UI + temp 포함) — 멤버별로 분리 저장된 store 사용 */
  const { schedules, loadMemberSchedule, updateMemberSchedule } =
    useMyScheduleStore();

  /** 전체 유저 스케줄 저장 store */
  const { setUserSchedule, schedules: allSchedules } = useAllUserScheduleStore();

  /** 사용자 설정 */
  const {
    autoSave,
    showWorkingHoursOnly,
    setAutoSave,
    setShowWorkingHoursOnly,
  } = useUserSettingStore();

  const targetUserId = memberId!;

  /** ✔ 페이지 진입 시 해당 멤버 스케줄 로딩 */
  const saved = allSchedules[groupId!]?.[targetUserId];
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    if (saved) {
      loadMemberSchedule(targetUserId, {
        this: new Set(saved.this),
        next: new Set(saved.next),
      });
    } else {
      loadMemberSchedule(targetUserId, {
        this: new Set(),
        next: new Set(),
      });
    }
  }, []);

  /** 현재 멤버의 스케줄 */
  const mySchedule = schedules[targetUserId];

  /** 총 시간 */
  const totalHours = mySchedule?.[activeTab]?.size ?? 0;

  /** 전체 삭제 */
  const handleClear = () => {
    if (autoSave) {
      updateMemberSchedule(targetUserId, (prev) => {
        const next = {
          this: new Set(prev.this),
          next: new Set(prev.next),
        };
        next[activeTab] = new Set(); // 현재 주차만 초기화
        return next;
      });

      // 전체 store에도 반영
      setUserSchedule(groupId!, targetUserId, {
        this: new Set(),
        next: new Set(),
      });
    } else {
      window.dispatchEvent(new CustomEvent("clear-temp-cells"));
    }
  };

  const handleSave = () => {
    if (autoSave) return;

    requestAnimationFrame(() => {
  window.dispatchEvent(
    new CustomEvent("commit-temp-cells", { detail: { week: activeTab } })
  );
});
  };

  return (
    <section className="min-h-screen bg-[#F9FAFB] py-10">
      <div className="mx-auto w-[1200px] grid grid-cols-[minmax(0,1fr)_320px] gap-6">

        <div className="rounded-2xl bg-white p-10 shadow-sm border border-gray-200">

          {/* 상단 */}
          <div className="mb-4 border-b border-gray-200 pb-3">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => navigate(`/groups/${groupId}/timeline`)}
                className="flex items-center gap-1 px-4 py-2 text-sm font-semibold
                  text-indigo-600 border border-indigo-200 rounded-full bg-white hover:bg-indigo-50 transition"
              >
                <BackArrow />
                돌아가기
              </button>

              <label className="flex items-center gap-2 text-gray-600 text-sm">
                <input
                  type="checkbox"
                  checked={autoSave}
                  onChange={(e) => setAutoSave(e.target.checked)}
                />
                자동저장
              </label>
            </div>

            <div className="mt-6 mb-2 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <ScheduleTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                <label className="flex items-center gap-2 text-gray-600 text-sm">
                  <input
                    type="checkbox"
                    checked={showWorkingHoursOnly}
                    onChange={(e) => setShowWorkingHoursOnly(e.target.checked)}
                  />
                  근무시간만 보기
                </label>
              </div>

              <ScheduleActionButtons
                autoSave={autoSave}
                onClear={handleClear}
                onSave={handleSave}
              />
            </div>
          </div>

          <ScheduleHintBanner />

          {/* 타임그리드 */}
          <TimeGrid weekType={activeTab} />
        </div>

        {/* 오른쪽 사이드바 */}
        <ScheduleSidebar totalHours={totalHours} groupId={groupId!} />
      </div>
    </section>
  );
}
