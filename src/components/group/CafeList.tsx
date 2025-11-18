// 오른쪽 카페 리스트
import { FC } from "react";
import type { Cafe } from "./types";

type CafeListProps = {
  cafes: Cafe[];
  selectedCafeId?: string;
  onSelectCafe: (cafe: Cafe) => void;
};

const CafeList: FC<CafeListProps> = ({
  cafes,
  selectedCafeId,
  onSelectCafe,
}) => {
  return (
    <div className="rounded-2xl border bg-white p-4 max-h-[560px] overflow-auto">
      <h3 className="font-semibold mb-3">카페 목록</h3>
      {cafes.length === 0 ? (
        <div className="text-sm text-gray-500">
          주변에서 카페를 찾지 못했어요.
        </div>
      ) : (
        <ol className="space-y-3">
          {cafes.map((c) => {
            const isSel = selectedCafeId === c.id;
            return (
              <li
                key={c.id}
                onClick={() => onSelectCafe(c)}
                className={`rounded-xl border p-3 cursor-pointer hover:border-indigo-400 ${
                  isSel ? "border-indigo-500 ring-2 ring-indigo-100" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-gray-500">{c.distance}m</div>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {c.address || "주소 정보 없음"}
                </div>
                {c.phone && (
                  <div className="mt-1 text-xs text-gray-500">{c.phone}</div>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
};

export default CafeList;