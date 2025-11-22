import { useNavigate } from "react-router-dom";
import { Station } from "./types";

type Props = { topStations: Station[] };

export const GroupPlaceStationList = ({ topStations }: Props) => {
  const nav = useNavigate();

  const openCafes = (s: Station) => {
    nav(
      `/stations/cafes?name=${encodeURIComponent(s.name)}&lat=${s.pos.lat}&lng=${s.pos.lng}`
    );
  };

  return (
    <div className="rounded-2xl border bg-white p-4">
      {/* 버튼 바로 아래에 설명 문구 */}
      <p className="mt-2 mb-3 text-xs text-gray-500 leading-relaxed">
        반경 내 지하철역을 검색하고, 중간 지점 거리와 평균 이동 거리를 함께 고려해 추천합니다.
      </p>

      <h3 className="font-semibold mb-3">추천 지하철역</h3>

      {topStations.length === 0 && (
        <div className="text-sm text-gray-500">
          선택한 반경 내에 추천할 역이 없어요. 반경을 조금 넓혀보세요.
        </div>
      )}

      <ol className="space-y-3">
        {topStations.map((s, idx) => (
          <li
            key={`${s.name}-${idx}`}
            onClick={() => openCafes(s)}
            className="cursor-pointer rounded-xl border p-3 hover:border-indigo-500 hover:bg-indigo-50/40 transition"
            title="이 역 주변 카페 보기"
          >
            <div className="flex items-center justify-between">
              <div className="font-medium">{s.name}</div>
              <div className="text-xs text-gray-500">#{idx + 1}</div>
            </div>

            <div className="mt-1 text-xs text-gray-500">
              {s.address || "주소 정보 없음"}
            </div>

            <div className="mt-2 text-sm">
              <span className="mr-3">
                중간 지점 기준 {s.distance.toFixed(0)}m
              </span>
              <span className="text-gray-500">
                평균 약 {(s.avgDistance / 80).toFixed(0)}분 소요 예상
              </span>
            </div>
          </li>
        ))}
      </ol>

      {topStations.length > 0 && (
        <div className="mt-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm px-3 py-2">
          멤버들의 이동 거리 균형을 고려해 최적의 역을 선별했어요.
        </div>
      )}
    </div>
  );
};