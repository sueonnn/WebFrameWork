interface Props {
  activeTab: "this" | "next";
  setActiveTab: (v: "this" | "next") => void;
  showWorkingHoursOnly: boolean;
  setShowWorkingHoursOnly: (v: boolean) => void;
}

export default function TimelineWeekTabs({
  activeTab,
  setActiveTab,
  showWorkingHoursOnly,
  setShowWorkingHoursOnly,
}: Props) {
  return (
    <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-3 text-sm font-medium text-gray-700">
      <div className="flex items-center rounded-2xl bg-gray-100 p-1">
        <button
          onClick={() => setActiveTab("this")}
          className={`px-5 py-2 rounded-xl font-semibold transition-all ${
            activeTab === "this"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-gray-700 hover:text-indigo-500"
          }`}
        >
          이번주
        </button>

        <button
          onClick={() => setActiveTab("next")}
          className={`px-5 py-2 rounded-xl font-semibold transition-all ${
            activeTab === "next"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-gray-700 hover:text-indigo-500"
          }`}
        >
          다음주
        </button>
      </div>

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
  );
}
