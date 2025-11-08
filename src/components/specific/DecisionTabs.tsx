import React from "react";

// DecisionPage에서 정의된 탭 유형을 재사용
type DecisionMode = "roulette" | "vote";

interface DecisionTabsProps {
  mode: DecisionMode;
  setMode: (mode: DecisionMode) => void;
}

const DecisionTabs: React.FC<DecisionTabsProps> = ({ mode, setMode }) => {
  const tabs: { key: DecisionMode; label: string }[] = [
    { key: "roulette", label: "타임룰렛" },
    { key: "vote", label: "투표" },
  ];

  return (
    <div className="flex space-x-2 border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setMode(tab.key)}
          className={`px-4 py-2 text-md font-semibold transition-colors duration-200 
            ${
              mode === tab.key
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default DecisionTabs;
