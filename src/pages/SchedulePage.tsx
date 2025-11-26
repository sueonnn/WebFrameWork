import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

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
  const location = useLocation();
  const { groupId, memberId } = useParams<{ groupId: string; memberId: string }>();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<WeekType>("this");

  /** 개인 스케줄 (UI + temp 포함) */
  const { schedules, setSchedules } = useMyScheduleStore();

  /** 전체 유저 스케줄 저장 위한 store */
  const { schedules: allSchedules, setUserSchedule, hasHydrated } = useAllUserScheduleStore();
  

  /** 사용자 환경 설정 */
  const {
    autoSave,
    showWorkingHoursOnly,
    setAutoSave,
    setShowWorkingHoursOnly,
  } = useUserSettingStore();

  

  const currentGroupId = groupId ?? "g1";
  const currentMemberId =
    memberId ?? (user as any)?.memberId ?? (user as any)?.id ?? "m1";

  const backTo =
    (location.state as any)?.from ?? `/groups/${currentGroupId}/timeline`;
  
  const totalHours = schedules?.[activeTab]?.size ?? 0;

  const restoredForRef = useRef<string | null>(null);

   useEffect(() => {
    // memberId가 바뀌면 다시 복원해야 함
    restoredForRef.current = null;
  }, [currentMemberId]);

  useEffect(() => {
    if (!hasHydrated) return;
    if (restoredForRef.current === currentMemberId) return;

    const saved = allSchedules?.[currentMemberId];

    setSchedules(() => ({
      this: new Set(saved?.this ? Array.from(saved.this) : []),
      next: new Set(saved?.next ? Array.from(saved.next) : []),
    }));

    restoredForRef.current = currentMemberId;
  }, [hasHydrated, allSchedules, currentMemberId, setSchedules]);

  // allUserScheduleStore로 동기화 함수
  const syncToAll = useCallback(() => {
    const latest = useMyScheduleStore.getState().schedules;

    setUserSchedule(currentMemberId, {
      this: new Set(latest.this),
      next: new Set(latest.next),
    });
  }, [currentMemberId, setUserSchedule]);

  // autoSave=true면, 스케줄이 바뀔 때마다 자동으로 allSchedules에 반영
  useEffect(() => {
    if (!autoSave) return;
    if (!hasHydrated) return;
    if (restoredForRef.current !== currentMemberId) return;
    syncToAll();
  }, [autoSave, schedules, hasHydrated, currentMemberId, syncToAll]);

  const handleClear = () => {
    if (autoSave) {
      setSchedules((prev) => {
        const next = { this: new Set(prev.this), next: new Set(prev.next) };
        next[activeTab] = new Set();

        setUserSchedule(currentMemberId, {
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
      new CustomEvent("commit-temp-cells", {
        detail: { week: activeTab, weekType: activeTab },
      })
    );

    // commit 후 allSchedules에 반영
    setTimeout(() => syncToAll(), 0);
  };

  // 뒤로가기에서도 (autosave=false면) 커밋 + 동기화 하고 이동
  const handleBack = () => {
    if (!autoSave) {
      window.dispatchEvent(
        new CustomEvent("commit-temp-cells", {
          detail: { week: activeTab, weekType: activeTab },
        })
      );
      setTimeout(() => {
        syncToAll();
        navigate(backTo);
      }, 0);
      return;
    }

    // autoSave=true도 마지막 동기화 한번 더 안전하게
    syncToAll();
    navigate(backTo);
  };


  return (
    <section className="min-h-screen bg-[#F9FAFB] py-10">
      <div className="mx-auto w-[1200px] grid grid-cols-[minmax(0,1fr)_320px] gap-6 items-stretch">
        <div className="rounded-2xl bg-white p-10 shadow-sm border border-gray-200 relative">
          <div className="relative z-20 mb-4 border-b border-gray-200 pb-3 text-sm font-medium text-gray-700">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={handleBack}
                className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 border border-indigo-200 rounded-full bg-white hover:bg-indigo-50/50 transition"
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
