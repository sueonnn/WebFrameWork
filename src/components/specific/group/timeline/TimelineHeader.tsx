import React from "react";

interface Props {
  groupName: string;
  memberCount: number;
  onClickSchedule: () => void;
}

export default function TimelineHeader({ groupName, memberCount, onClickSchedule }: Props) {
  return (
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
                     hover:bg-indigo-50"
        >
          🔄 새로고침
        </button>

        {/* 시간 입력 */}
        <button
          onClick={onClickSchedule}
          type="button"
          className="flex items-center justify-center gap-[6px] px-5 py-[10px] text-sm font-semibold text-white 
                     bg-[#4F47E6] rounded-full shadow"
        >
          ⏱ 시간 입력
        </button>
      </div>
    </div>
  );
}
