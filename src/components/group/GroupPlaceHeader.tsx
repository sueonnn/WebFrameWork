export const GroupPlaceHeader = () => (
  <div className="flex items-center justify-between">
    <div>
      <h2 className="text-xl font-semibold">스마트 장소 추천</h2>
      <p className="text-sm text-gray-500">
        그룹 멤버들의 위치를 기반으로 모두에게 공평한 만남 장소를 찾아줘요
      </p>
    </div>
    <div className="text-xs text-gray-500 max-w-[220px] text-right">
      반경 내 지하철역을 검색하고, 중간 지점 거리와 평균 이동 거리를 함께 고려해 추천합니다.
    </div>
  </div>
);
