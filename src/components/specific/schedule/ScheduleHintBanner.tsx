export default function ScheduleHintBanner() {
  return (
    <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#D5DCFF] bg-[#EEF2FF] px-4 py-3 text-[#3730A3] font-semibold text-sm">
      <svg
        className="w-[1em] h-[1em]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12" y2="8" />
      </svg>
      <p>
        클릭&드래그로 셀을 토글하세요.{" "}
        <span className="text-indigo-800 font-bold">
          (자동저장 OFF일 땐 저장하기 필요)
        </span>
      </p>
    </div>
  );
}
