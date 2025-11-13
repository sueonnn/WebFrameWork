type Props = {
  radius: number;          // 현재 선택된 반경
  options: number[];       // 선택 가능한 반경 목록
  onChange: (value: number) => void; // 반경 변경 콜백
};

export const GroupPlaceRadiusSelector = ({ radius, options, onChange }: Props) => {
  return (
    <div className="mt-4 flex items-center gap-3">
      <label className="text-sm font-medium">반경</label>
      <select
        value={radius}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="rounded-lg border px-2 py-1 text-sm"
      >
        {options.map((r) => (
          <option key={r} value={r}>
            {r >= 1000 ? `${r / 1000}km` : `${r}m`}
          </option>
        ))}
      </select>
      <span className="text-xs text-gray-400">
        중심 지점 기준 검색 범위를 선택하세요.
      </span>
    </div>
  );
};
