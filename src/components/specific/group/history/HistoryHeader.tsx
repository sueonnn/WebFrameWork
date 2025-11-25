import React from "react";

export default function HistoryHeader({
  title,
  date,
  participantCount,
}: {
  title: string;
  date: string;
  participantCount: number;
}) {
  return (
    <header className="space-y-4">
      <button
        onClick={() => window.history.back()}
        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#F4F4F7] text-[#5A60FF] font-semibold shadow-sm hover:shadow transition"
      >
        <span className="text-lg">←</span> 히스토리로
      </button>

      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>

      <p className="text-sm text-gray-500">
        {date} · {participantCount}명 참석
      </p>
    </header>
  );
}
