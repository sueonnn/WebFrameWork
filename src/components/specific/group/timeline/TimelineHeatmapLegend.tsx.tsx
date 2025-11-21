export default function TimelineHeatmapLegend() {
  return (
    <div className="flex items-center justify-between mb-12">
      <div className="flex items-center gap-80">
        <h3 className="text-[19px] font-semibold text-gray-900">
          주간 가능 시간 히트맵
        </h3>

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
  );
}
