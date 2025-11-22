interface Props {
  activeTab: "this" | "next";
  setActiveTab: (t: "this" | "next") => void;
}

export default function ScheduleTabs({ activeTab, setActiveTab }: Props) {
  return (
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
  );
}
