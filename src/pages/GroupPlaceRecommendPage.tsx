import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Station, Member } from '../components/group/types';
import { GroupPlaceHeader } from '../components/group/GroupPlaceHeader';
import { GroupPlaceRadiusSelector } from '../components/group/GroupPlaceRadiusSelector';
import { GroupPlaceMap } from '../components/group/GroupPlaceMap';
import { GroupPlaceStationList } from '../components/group/GroupPlaceStationList';
import { MEMBERS } from '../mock';

const RADIUS_OPTIONS = [300, 500, 800, 1000, 1500, 2000];


export default function GroupPlaceRecommendPage() {
  const nav = useNavigate();

  // 선택된 검색 반경
  const [radius, setRadius] = useState(500);
  // 카카오 Places 검색 결과(Station 목록)
  const [stations, setStations] = useState<Station[]>([]);

  // 나중에 store 연동 시를 대비해 useMemo 사용 (여기서는 mock 고정)
  const members: Member[] = useMemo(() => MEMBERS, []);

  // 상위 3개 추천 역
  const top3 = useMemo(() => stations.slice(0, 3), [stations]);

  return (
    <section className="p-6">
      {/* 상단 헤더 */}
      <div className="flex items-start justify-between gap-4">
        <GroupPlaceHeader />
        <button
          type="button"
          onClick={() => nav('/')}
          className="h-9 shrink-0 rounded-lg border px-3 text-sm hover:bg-gray-50"
          title="메인으로 이동"
        >
          ← 뒤로가기
        </button>
      </div>

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

        {/* 우측 추천 역 리스트 (내부에도 뒤로가기 버튼 있음) */}
        <div>
          <GroupPlaceStationList topStations={top3} />
        </div>
      </div>
    </section>
  );
}
