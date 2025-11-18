// 선택된 카페 정보 패널
import { FC } from "react";
import type { Cafe } from "./types";

type SelectedCafePanelProps = {
  cafe: Cafe | null;
};

const SelectedCafePanel: FC<SelectedCafePanelProps> = ({ cafe }) => {
  if (!cafe) return null;

  return (
    <div className="px-4 py-3 border-t bg-white">
      <div className="text-sm font-semibold">{cafe.name}</div>
      <div className="text-xs text-gray-500 mt-0.5">{cafe.address}</div>
      <div className="flex gap-2 mt-2">
        {cafe.placeUrl && (
          <a
            target="_blank"
            rel="noreferrer"
            href={cafe.placeUrl}
            className="px-3 py-1.5 text-xs rounded-lg bg-indigo-600 text-white"
          >
            카카오맵 장소상세
          </a>
        )}
        <a
          target="_blank"
          rel="noreferrer"
          href={`https://map.kakao.com/link/to/${encodeURIComponent(
            cafe.name
          )},${cafe.pos.lat},${cafe.pos.lng}`}
          className="px-3 py-1.5 text-xs rounded-lg bg-emerald-600 text-white"
        >
          길찾기
        </a>
      </div>
    </div>
  );
};

export default SelectedCafePanel;  
