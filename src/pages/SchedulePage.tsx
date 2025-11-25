import { useState } from "react";
import { useNavigate } from "react-router-dom";

import TimeGrid from "../components/specific/schedule/TimeGrid";
import ScheduleSidebar from "../components/specific/schedule/ScheduleSidebar";

import ScheduleTabs from "../components/specific/schedule/ScheduleTabs";
import ScheduleToggles from "../components/specific/schedule/ScheduleToggles";
import ScheduleHintBanner from "../components/specific/schedule/ScheduleHintBanner";
import ScheduleActionButtons from "../components/specific/schedule/ScheduleActionButtons";
import BackArrow from "../components/icons/BackArrow";

import { useMyScheduleStore } from "../stores/myScheduleStore";
import { useUserSettingStore } from "../stores/userScheduleSettingStore";
import { useAllUserScheduleStore } from "../stores/allUserScheduleStore";

import type { WeekType } from "../types/schedule";

export default function SchedulePage() {
  const navigate = useNavigate();
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

  // Mock 데이터 임시 고정
  const currentGroupId = "g1";

  const handleClear = () => {
    if (autoSave) {
      setSchedules((prev) => {
        const next = {
          this: new Set(prev.this),
          next: new Set(prev.next),
        };
        next[activeTab] = new Set(); 

        setUserSchedule("user1", {
          this: new Set(next.this),
          next: new Set(next.next),
        });

        return next;
      });
    } else {
      window.dispatchEvent(new CustomEvent("clear-temp-cells"));
    }
  };


  
  const handleSave = () => {
    if (autoSave) return; 

    window.dispatchEvent(
      new CustomEvent("commit-temp-cells", { detail: { week: activeTab } })
    );
  };


  return (
    <section className="min-h-screen bg-[#F9FAFB] py-10">
      <div className="mx-auto w-[1200px] grid grid-cols-[minmax(0,1fr)_320px] gap-6 items-stretch">

       
        <div className="rounded-2xl bg-white p-10 shadow-sm border border-gray-200 relative">

          
          <div className="mb-4 border-b border-gray-200 pb-3 text-sm font-medium text-gray-700">

            <div className="flex items-center justify-between mb-3">

              <button
                onClick={() => navigate("/groups/timeline")}
                className="
                flex items-center gap-1 
                px-4 py-2 
                text-sm font-semibold 
                text-indigo-600 
                hover:text-indigo-700
                border border-indigo-200
                rounded-full 
                bg-white
                hover:bg-indigo-50/50
                transition">
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

              <div className="flex items-center gap-3">
                <ScheduleActionButtons
                  autoSave={autoSave}
                  onClear={handleClear}
                  onSave={handleSave}
                />
              </div>
            </div>

          </div>

          <ScheduleHintBanner />

          <TimeGrid weekType={activeTab} />
        </div>


        <ScheduleSidebar totalHours={totalHours} groupId={currentGroupId} />
      </div>
    </section>
  );
}
