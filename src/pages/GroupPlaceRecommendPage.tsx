import { useMemo, useState } from 'react';
import { Station, Member } from '../components/group/types';
import { GroupPlaceHeader } from '../components/group/GroupPlaceHeader';
import { GroupPlaceRadiusSelector } from '../components/group/GroupPlaceRadiusSelector';
import { GroupPlaceMap } from '../components/group/GroupPlaceMap';
import { GroupPlaceStationList } from '../components/group/GroupPlaceStationList';

const RADIUS_OPTIONS = [300, 500, 800, 1000, 1500, 2000];

// TODO: 추후 전역 store에서 주입받을 멤버 목록 (현재는 mock)
const mockMembers: Member[] = [
  { id: 'u1', name: 'A', type: 'HOME',    pos: { lat: 37.5826, lng: 127.0103 } },
  { id: 'u2', name: 'B', type: 'COMPANY', pos: { lat: 37.5771, lng: 127.0018 } },
  { id: 'u3', name: 'C', type: 'SCHOOL',  pos: { lat: 37.5882, lng: 127.0064 } },
];

export default function GroupPlaceRecommendPage() {
  // 선택된 검색 반경
  const [radius, setRadius] = useState(500);
  // 카카오 Places 검색 결과(Station 목록)
  const [stations, setStations] = useState<Station[]>([]);

  // 나중에 store 연동 시를 대비해 useMemo 사용 (여기서는 mock 고정)
  const members = useMemo(() => mockMembers, []);

  // 상위 3개 추천 역
  const top3 = useMemo(() => stations.slice(0, 3), [stations]);

  return (
    <section className="p-6">
      {/* 상단 헤더 */}
      <GroupPlaceHeader />

      {/* 반경 선택 UI */}
      <GroupPlaceRadiusSelector
        radius={radius}
        options={RADIUS_OPTIONS}
        onChange={setRadius}
      />

      {/* 메인 레이아웃: 좌측 지도 / 우측 추천 리스트 */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 지도 영역 */}
        <div className="lg:col-span-2 rounded-2xl border bg-green-50 min-h-[420px] p-2">
          <GroupPlaceMap
            members={members}
            radius={radius}
            // 지도에서 역 검색 결과가 바뀔 때 상태 업데이트
            onStationsChange={setStations}
          />
        </div>

        {/* 우측 추천 역 리스트 */}
        <div>
          <GroupPlaceStationList topStations={top3} />
        </div>
      </div>
    </section>
  );
}
