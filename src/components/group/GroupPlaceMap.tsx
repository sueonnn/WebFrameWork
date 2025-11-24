// 역할 정리:
// 1) useKakaoLoader 로딩 후 지도 1회 초기화
// 2) members / radius 기준으로:
//    - 중간 지점 계산(centroid)
//    - 중심 원(검색 반경) + 중심 마커(보라 핀)
//    - 멤버는 "마커 없이" 작은 원 + 이름 라벨만 표시(깔끔 모드)
// 3) 카카오 Places 카테고리 검색(SW8: 지하철역)
//    - 반경 내 역들을 Station[]으로 변환
//    - "중심까지 거리 + 평균 이동 거리" 기준으로 정렬
//    - 상위 역들에 초록 핀 표시
//    - 결과를 onStationsChange로 부모에 전달

import { useEffect, useRef } from 'react';
import useKakaoLoader from '../../hooks/useKakaoLoader';
import { centroid, distanceMeters } from '../../utils/geo';
import { Member, Station } from './types';
import MapLegend from '../common/MapLegend';

type Props = {
  members: Member[];
  radius: number;
  onStationsChange: (stations: Station[]) => void;
};

// SVG 핀(보라/초록 등 색상 주입)
const makeSvgPin = (kakao: any, fill: string, stroke = 'white') => {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="40" viewBox="0 0 28 40">
    <path d="M14 1C7 1 1.5 6.6 1.5 13.5C1.5 22 14 39 14 39S26.5 22 26.5 13.5C26.5 6.6 21 1 14 1Z"
          fill="${fill}" stroke="${stroke}" stroke-width="2"/>
    <circle cx="14" cy="13" r="4.2" fill="white" />
  </svg>`;
  return new kakao.maps.MarkerImage(
    'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
    new kakao.maps.Size(28, 40),
    { offset: new kakao.maps.Point(14, 40) } // 꼭지점이 앵커가 되도록
  );
};

export const GroupPlaceMap = ({ members, radius, onStationsChange }: Props) => {
  const ready = useKakaoLoader();
  const mapRef = useRef<any>(null);
  const mapElRef = useRef<HTMLDivElement>(null);

  // 멤버/중심/반경 시각화용 오버레이(원, 라벨, 중심원/마커)
  const overlayRefs = useRef<{
    centerMarker: any | null;
    centerCircle: any | null;
    circles: any[];
    labels: any[];
  }>({ centerMarker: null, centerCircle: null, circles: [], labels: [] });

  // 역 마커
  const stationMarkerRefs = useRef<any[]>([]);

  // 중심 좌표(멤버들의 centroid)
  const center = centroid(members.map((m) => m.pos));

  // 공통 정리 유틸
  const clearMemberOverlays = () => {
    overlayRefs.current.circles.forEach((c) => c.setMap(null));
    overlayRefs.current.labels.forEach((l) => l.setMap(null));
    overlayRefs.current.circles = [];
    overlayRefs.current.labels = [];
    if (overlayRefs.current.centerCircle) {
      overlayRefs.current.centerCircle.setMap(null);
      overlayRefs.current.centerCircle = null;
    }
    if (overlayRefs.current.centerMarker) {
      overlayRefs.current.centerMarker.setMap(null);
      overlayRefs.current.centerMarker = null;
    }
  };
  const clearStationMarkers = () => {
    stationMarkerRefs.current.forEach((m) => m.setMap(null));
    stationMarkerRefs.current = [];
  };

  // 멤버별 색 팔레트(식별성)
  const palette = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#06b6d4', '#e11d48'];
  const colorByMemberIdx = (i: number) => palette[i % palette.length];

  // target까지 멤버 평균 이동거리(m)
  const avgMemberDistance = (target: { lat: number; lng: number }) => {
    if (!members.length) return 0;
    const sum = members.reduce((acc, m) => acc + distanceMeters(m.pos, target), 0);
    return sum / members.length;
  };

  // 1) 지도 1회 초기화
  useEffect(() => {
    if (!ready || !mapElRef.current) return;
    const { kakao } = window as any;
    mapRef.current = new kakao.maps.Map(mapElRef.current, {
      center: new kakao.maps.LatLng(center.lat, center.lng),
      level: 5,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  // 2) 멤버/중심/반경 렌더링(깔끔 모드)
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const { kakao } = window as any;
    const map = mapRef.current;

    // 이전 오버레이 정리 → 다시 그림
    clearMemberOverlays();
    map.setCenter(new kakao.maps.LatLng(center.lat, center.lng));

    // 중심 원(검색 반경)
    const centerCircle = new kakao.maps.Circle({
      center: new kakao.maps.LatLng(center.lat, center.lng),
      radius,
      strokeWeight: 2,
      strokeColor: '#7F9CF5',
      strokeOpacity: 0.8,
      strokeStyle: 'solid',
      fillColor: '#C3DAFE',
      fillOpacity: 0.08,
      zIndex: 1,
    });
    centerCircle.setMap(map);
    overlayRefs.current.centerCircle = centerCircle;

    // 중심 마커(보라 핀)
    const centerImg = makeSvgPin(kakao, '#7C3AED');
    const centerMarker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(center.lat, center.lng),
      image: centerImg,
      title: '중간 지점',
      zIndex: 6,
    });
    centerMarker.setMap(map);
    overlayRefs.current.centerMarker = centerMarker;

    // 멤버: 마커 없이 "작은 원 + 이름 라벨"
    members.forEach((m, i) => {
      const color = colorByMemberIdx(i);

      // 위치 원(작게)
      const circle = new kakao.maps.Circle({
        center: new kakao.maps.LatLng(m.pos.lat, m.pos.lng),
        radius: 26, // 26m
        strokeWeight: 3,
        strokeColor: color,
        strokeOpacity: 0.9,
        fillColor: `${color}33`,
        fillOpacity: 0.5,
        zIndex: 3,
      });
      circle.setMap(map);
      overlayRefs.current.circles.push(circle);

      // 이름 라벨
      // 라벨을 앵커로 고정하고, 고정 px 스페이서로 간격 확보
      const wrapper = document.createElement('div');
      wrapper.style.pointerEvents = 'none'; // 맵 인터랙션 방해 X

      // 고정 픽셀 간격(라벨을 원 위로 16px 띄우기)
      const spacer = document.createElement('div');
      spacer.style.height = '16px';
      wrapper.appendChild(spacer);

      // 실제 칩 UI
      const chip = document.createElement('div');
      chip.textContent = m.name;
      chip.style.cssText = [
        'padding:2px 8px',
        'border-radius:6px',
        'font-size:12px',
        'font-weight:500',
        'background:white',
        'border:1px solid #e5e7eb',
        'color:#111827',
        'box-shadow:0 1px 2px rgba(0,0,0,.08)',
        'white-space:nowrap',
      ].join(';');
      wrapper.appendChild(chip);

      // ⬇️ transform 대신 앵커 사용 (줌해도 좌표 고정)
      const label = new kakao.maps.CustomOverlay({
        position: new kakao.maps.LatLng(m.pos.lat, m.pos.lng),
        content: wrapper,
        xAnchor: 0.5, // 가운데 정렬
        yAnchor: 1,   // wrapper의 '아래'가 좌표에 붙음 (스페이서만큼 위로 띄워짐)
        zIndex: 4,
      });
      label.setMap(map);
      overlayRefs.current.labels.push(label);
    });

    // deps 변경/언마운트 시 정리
    return () => {
      clearMemberOverlays();
    };
  }, [ready, radius, members, center.lat, center.lng]);

  // 3) 지하철역 검색 + 마커 + 부모로 결과 전달
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const { kakao } = window as any;

    const ps = new kakao.maps.services.Places();
    const loc = new kakao.maps.LatLng(center.lat, center.lng);

    ps.categorySearch(
      'SW8', // 지하철역 카테고리
      (results: any[], status: string) => {
        if (status !== kakao.maps.services.Status.OK) {
          onStationsChange([]);
          clearStationMarkers();
          return;
        }

        // Kakao → Station으로 변환 + 정렬
        const list: Station[] = results
          .map((r: any) => {
            const pos = { lat: parseFloat(r.y), lng: parseFloat(r.x) };
            return {
              name: r.place_name,
              address: r.road_address_name || r.address_name,
              pos,
              distance: distanceMeters(center, pos), // 중심까지 직선거리
              avgDistance: avgMemberDistance(pos),  // 멤버 평균 이동거리
            };
          })
          .filter((s) => s.distance <= radius)
          .sort((a, b) => a.distance + a.avgDistance - (b.distance + b.avgDistance));

        onStationsChange(list);

        // 상위 N개 초록 핀으로 표시
        const map = mapRef.current;
        clearStationMarkers();
        const stationImg = makeSvgPin(kakao, '#10B981'); // 초록(에메랄드) 핀
        list.slice(0, 5).forEach((s) => {
          const mk = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(s.pos.lat, s.pos.lng),
            title: s.name,
            image: stationImg,
            zIndex: 3,
          });
          mk.setMap(map);
          stationMarkerRefs.current.push(mk);
        });
      },
      { location: loc, radius, sort: (window as any).kakao.maps.services.SortBy.DISTANCE }
    );

    // deps 변경/언마운트 시 역 마커 정리
    return () => {
      clearStationMarkers();
    };
  }, [ready, center.lat, center.lng, radius, members.length, onStationsChange]);

  return (
    <>
      {/* 실제 지도 컨테이너 */}
      <div ref={mapElRef} className="h-[420px] w-full rounded-xl border bg-white" />

      {/* 범례: 멤버들 + 보라 핀(중간 지점) + 초록 핀(지하철역) */}
      <MapLegend
        items={[
          ...members.map((m, i) => ({
            color: palette[i % palette.length],
            label: m.name,
          })),
          { color: '#7C3AED', label: '중간 지점(보라 핀)' },
          { color: '#10B981', label: '지하철역(초록 핀)' },
        ]}
      />
    </>
  );
};
