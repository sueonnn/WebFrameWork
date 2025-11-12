import React, { useState, useMemo } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useGroupScheduleStore } from "../stores/groupScheduleStore";
import { useUserSettingStore } from "../stores/userScheduleSettingStore"; // ✅ 추가
import GroupSidebar from "../components/specific/group/GroupSidebar";

export default function GroupTimelinePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"this" | "next">("this");
  const { groupName, memberCount, groupSchedules } = useGroupScheduleStore();
  const { showWorkingHoursOnly, setShowWorkingHoursOnly } = useUserSettingStore(); // ✅ 추가

  // 날짜 계산
  const startOfWeek = useMemo(() => {
    const base = dayjs().startOf("week").add(1, "day");
    return activeTab === "next" ? base.add(7, "day") : base;
  }, [activeTab]);

  const days = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, i) => ({
        label: ["월", "화", "수", "목", "금", "토", "일"][i],
        dateText: startOfWeek.add(i, "day").format("MM/DD"),
      })),
    [startOfWeek]
  );

  // ✅ 근무시간 보기 반영
  const hours = useMemo(
    () =>
      showWorkingHoursOnly
        ? Array.from({ length: 9 }, (_, i) => i + 9) // 09~17시만
        : Array.from({ length: 24 }, (_, i) => i),
    [showWorkingHoursOnly]
  );

  const schedules = groupSchedules[activeTab] || {};
  const getColor = (value: number) => {
    if (!value) return "#ffffff";
    const ratio = value / memberCount;
    return `rgba(79,70,229,${ratio * 0.9 + 0.1})`;
  };

  return (
    <section className="min-h-screen bg-[#F9FAFB] py-10">
      <div className="mx-auto w-[1200px] flex flex-col gap-8">
        {/* 상단 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{groupName}</h1>
            <p className="text-sm text-gray-500 mt-1">총 {memberCount}명의 공통 가능 시간</p>
          </div>

          <div className="flex items-center gap-3">
            {/* 새로고침 */}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-[6px] px-5 py-[10px] text-sm font-semibold text-indigo-600 
                         bg-white rounded-full border border-indigo-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)]
                         hover:bg-indigo-50 active:bg-indigo-100 active:translate-y-[1px]
                         transition-all duration-150 ease-out"
            >
              <svg
                className="w-[25px] h-[29px] text-indigo-600 translate-y-[5px]"
                viewBox="0 0 1 2"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.666602 0.0718536V0.288436H0.25C0.111914 0.288436 0 0.433924 0 0.613436C0 0.668025 0.0113281 0.718553 0.0296875 0.763748L0.132812 0.668279C0.128125 0.651014 0.125 0.632986 0.125 0.61369C0.125 0.523807 0.181055 0.45119 0.25 0.45119H0.666602V0.667772L1 0.371721L0.666602 0.0718536ZM0.867188 0.667264C0.871875 0.684529 0.875 0.702557 0.875 0.721854C0.875 0.811736 0.819141 0.884354 0.75 0.884354H0.333398V0.667772L0.0296875 0.97094L0.333398 1.26369V1.04711H0.75C0.888086 1.04711 1 0.901619 1 0.722107C1 0.667518 0.988672 0.61699 0.970313 0.571795L0.867188 0.667264Z"
                  fill="currentColor"
                />
              </svg>
              <span className="translate-y-[0.5px]">새로고침</span>
            </button>

            {/* 시간 입력 */}
            <button
              onClick={() => navigate("/groups/schedule")}
              type="button"
              className="flex items-center justify-center gap-[6px] px-5 py-[10px] text-sm font-semibold text-white 
                         bg-[#4F47E6] rounded-full shadow-[0_2px_6px_rgba(79,71,230,0.25)]
                         hover:bg-[#5A54F0] active:bg-[#3E3BC9] active:translate-y-[1px] 
                         transition-all duration-150 ease-out"
            >
              <svg
                className="w-[18px] h-[29px] text-white translate-y-[-2px]"
                viewBox="0 0 1.5 1"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.699971 0.116665C1.02215 0.116665 1.2833 0.377823 1.2833 0.699998C1.2833 1.02217 1.02215 1.28333 0.699971 1.28333C0.377797 1.28333 0.116638 1.02217 0.116638 0.699998C0.116638 0.377823 0.377797 0.116665 0.699971 0.116665ZM0.699971 0.233332C0.576204 0.233332 0.457505 0.282498 0.369988 0.370015C0.282471 0.457532 0.233305 0.57623 0.233305 0.699998C0.233305 0.823766 0.282471 0.942464 0.369988 1.02998C0.457505 1.1175 0.576204 1.16666 0.699971 1.16666C0.823739 1.16666 0.942438 1.1175 1.02995 1.02998C1.11747 0.942464 1.16664 0.823766 1.16664 0.699998C1.16664 0.57623 1.11747 0.457532 1.02995 0.370015C0.942438 0.282498 0.823739 0.233332 0.699971 0.233332ZM0.699971 0.349998C0.714259 0.35 0.72805 0.355246 0.738727 0.36474C0.749404 0.374234 0.756225 0.387317 0.757896 0.401507L0.758305 0.408332V0.675848L0.916213 0.833757C0.926675 0.844254 0.932749 0.85834 0.933201 0.873154C0.933654 0.887968 0.928451 0.902398 0.918649 0.913514C0.908847 0.924631 0.895181 0.931599 0.880427 0.933005C0.865673 0.93441 0.850938 0.930147 0.839213 0.921082L0.83373 0.91624L0.65873 0.74124C0.649664 0.732166 0.643841 0.720357 0.642163 0.70764L0.641638 0.699998V0.408332C0.641638 0.392861 0.647784 0.378023 0.658724 0.367084C0.669663 0.356144 0.684501 0.349998 0.699971 0.349998Z"
                  fill="currentColor"
                />
              </svg>
              <span className="translate-y-[0.5px]">시간 입력</span>
            </button>
          </div>
        </div>

        {/* 안내 배너 */}
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 font-medium">
          💚 현재 겹칠 수 있는 시간대 업데이트 완료했어요.
        </div>

        {/* 메인 */}
        <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-6">
          {/* 왼쪽: 그룹 시간표 */}
          <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-8">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-80">
                <h3 className="text-[19px] font-semibold text-gray-900">주간 가능 시간 히트맵</h3>
                <div className="flex items-center gap-3 text-sm">
                  {[
                    { label: "일부 가능", color: "bg-indigo-100" },
                    { label: "대부분 가능", color: "bg-indigo-400" },
                    { label: "모두 가능", color: "bg-indigo-700" },
                  ].map(({ label, color }) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <span className={`inline-block w-3 h-3 rounded-full ${color}`} />
                      <span className="text-gray-600">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 주차 선택 바 */}
            <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-3 text-sm font-medium text-gray-700">
              <div className="flex items-center rounded-2xl bg-gray-100 p-1">
                <button
                  onClick={() => setActiveTab("this")}
                  className={`px-5 py-2 rounded-xl font-semibold transition-all ${
                    activeTab === "this" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-700 hover:text-indigo-500"
                  }`}
                >
                  이번주
                </button>
                <button
                  onClick={() => setActiveTab("next")}
                  className={`px-5 py-2 rounded-xl font-semibold transition-all ${
                    activeTab === "next" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-700 hover:text-indigo-500"
                  }`}
                >
                  다음주
                </button>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-gray-600 text-sm">
                  <input
                    type="checkbox"
                    className="accent-indigo-500"
                    checked={showWorkingHoursOnly}
                    onChange={(e) => setShowWorkingHoursOnly(e.target.checked)}
                  />
                  근무시간만 보기
                </label>
              </div>
            </div>

            {/* 그룹 히트맵 테이블 */}
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-[2px] text-sm">
                <thead>
                  <tr className="text-gray-500">
                    <th className="w-20"></th>
                    {days.map((d) => (
                      <th key={d.label} className="w-[120px] text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-semibold text-gray-800">{d.label}</span>
                          <span className="text-[12px] text-gray-400 mt-[2px]">{d.dateText}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {hours.map((hour) => ( // ✅ 수정된 부분
                    <tr key={hour}>
                      <td className="text-right pr-2 text-xs text-gray-400 whitespace-nowrap">
                        {String(hour).padStart(2, "0")}:00
                      </td>
                      {Array.from({ length: 7 }).map((_, day) => {
                        const key = `${day}-${hour}`;
                        const value = schedules[key] || 0;
                        return (
                          <td
                            key={key}
                            className="h-10 w-[120px] border-[1.5px] border-[#EEEFF2] rounded-sm cursor-default"
                            style={{ backgroundColor: getColor(value) }}
                          />
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 우측 패널 */}
          <GroupSidebar />
        </div>
      </div>
    </section>
  );
}
