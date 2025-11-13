// 역할:
// 1) 쿼리스트링(name, lat, lng)로 역 좌표 수신 → 지도 1회 초기화
// 2) 반경 변경 시 원/센터 업데이트
// 3) 카카오 Places 카테고리(CE7, 카페) 검색 → 하늘색 핀 표시
// 4) 카드/마커 클릭 시: 지도 panTo + InfoWindow(카카오맵) 열기 + 아래 상세 패널 갱신
// 5) 하단 범례(MapLegend)로 핀 의미 안내
import { useMemo, useRef, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import useKakaoLoader from "../hooks/useKakaoLoader";
import MapLegend from "../components/common/MapLegend";

type Cafe = {
  id: string;                 // kakao place id
  name: string;
  address?: string;
  phone?: string;
  pos: { lat: number; lng: number };
  distance: number;           // m
  placeUrl?: string;          // kakao place detail url
};

// 공통: SVG 핀(색상 커스터마이즈)
const makePin = (kakao: any, fill: string) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="36" viewBox="0 0 28 40">
      <path d="M14 1C7 1 1.5 6.6 1.5 13.5C1.5 22 14 39 14 39S26.5 22 26.5 13.5C26.5 6.6 21 1 14 1Z"
        fill="${fill}" stroke="white" stroke-width="2"/>
      <circle cx="14" cy="13" r="4.2" fill="white"/>
    </svg>`;
  return new kakao.maps.MarkerImage(
    "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
    new kakao.maps.Size(26, 36),
    { offset: new kakao.maps.Point(13, 36) }
  );
};

export default function StationCafePage() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const ready = useKakaoLoader();

  const stationName = sp.get("name") || "알 수 없는 역";
  const stationLat = parseFloat(sp.get("lat") || "0");
  const stationLng = parseFloat(sp.get("lng") || "0");
  const center = useMemo(() => ({ lat: stationLat, lng: stationLng }), [stationLat, stationLng]);

  const mapRef = useRef<any>(null);
  const mapElRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<any>(null);

  // 마커 관리: id -> marker
  const cafeMarkerMapRef = useRef<Map<string, any>>(new Map());
  const infoRef = useRef<any>(null);

  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [radius, setRadius] = useState(500); // 기본 500m
  const [selected, setSelected] = useState<Cafe | null>(null);

  const clearCafeMarkers = () => {
    cafeMarkerMapRef.current.forEach(mk => mk.setMap(null));
    cafeMarkerMapRef.current.clear();
  };

  // 1) 지도 1회 초기화 + 선택 역(보라 핀) + 반경 원 생성
  useEffect(() => {
    if (!ready || !mapElRef.current) return;
    const { kakao } = window as any;

    const map = new kakao.maps.Map(mapElRef.current, {
      center: new kakao.maps.LatLng(center.lat, center.lng),
      level: 4,
    });
    mapRef.current = map;

    const stationImg = makePin(kakao, "#7C3AED"); // 보라
    new kakao.maps.Marker({
      position: new kakao.maps.LatLng(center.lat, center.lng),
      image: stationImg,
      title: stationName,
      zIndex: 6,
      map,
    });

    const circle = new kakao.maps.Circle({
      center: new kakao.maps.LatLng(center.lat, center.lng),
      radius,
      strokeWeight: 2,
      strokeColor: "#7F9CF5",
      strokeOpacity: 0.8,
      fillColor: "#93C5FD",
      fillOpacity: 0.08,
      zIndex: 1,
    });
    circle.setMap(map);
    circleRef.current = circle;

    // InfoWindow 준비
    infoRef.current = new kakao.maps.InfoWindow({ removable: true });

    return () => {
      circle.setMap(null);
      infoRef.current?.close();
      mapRef.current = null;
    };
  }, [ready, center.lat, center.lng, stationName]);

  // 2) 반경/센터 변경 시 원 + 지도 센터 업데이트
  useEffect(() => {
    if (!mapRef.current || !circleRef.current) return;
    const { kakao } = window as any;
    circleRef.current.setRadius(radius);
    circleRef.current.setPosition(new kakao.maps.LatLng(center.lat, center.lng));
    mapRef.current.setCenter(new kakao.maps.LatLng(center.lat, center.lng));
  }, [radius, center.lat, center.lng]);

  // 공통 선택 핸들러: 카드/마커에서 모두 호출
  const selectCafe = (c: Cafe) => {
    const { kakao } = window as any;
    setSelected(c);
    const pos = new kakao.maps.LatLng(c.pos.lat, c.pos.lng);
    mapRef.current?.panTo(pos);

    // InfoWindow 컨텐츠
    const html = `
      <div style="width:220px;padding:8px 10px">
        <div style="font-weight:600;margin-bottom:4px">${c.name}</div>
        <div style="font-size:12px;color:#6b7280;margin-bottom:6px">
          ${c.address ?? ""}
        </div>
        <div style="display:flex;gap:6px">
          <a target="_blank" href="${c.placeUrl ?? "#"}"
             style="flex:1;text-align:center;background:#6366F1;color:#fff;padding:6px 0;border-radius:8px;font-size:12px;text-decoration:none">
            장소상세
          </a>
          <a target="_blank" href="https://map.kakao.com/link/to/${encodeURIComponent(c.name)},${c.pos.lat},${c.pos.lng}"
             style="flex:1;text-align:center;background:#10B981;color:#fff;padding:6px 0;border-radius:8px;font-size:12px;text-decoration:none">
            길찾기
          </a>
        </div>
      </div>`;
    infoRef.current.setContent(html);

    const anchor = cafeMarkerMapRef.current.get(c.id);
    if (anchor) {
      infoRef.current.open(mapRef.current, anchor);
    } else {
      // 앵커 없을 일은 거의 없지만, 안전하게 좌표로 오픈
      infoRef.current.open(mapRef.current, new kakao.maps.Marker({ position: pos }));
    }
  };

  // 3) 카페 검색(카테고리 CE7) + 하늘색 핀들 렌더
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const { kakao } = window as any;

    const ps = new kakao.maps.services.Places();
    const loc = new kakao.maps.LatLng(center.lat, center.lng);

    ps.categorySearch(
      "CE7",
      (results: any[], status: string) => {
        if (status !== kakao.maps.services.Status.OK) {
          setCafes([]);
          clearCafeMarkers();
          return;
        }

        const list: Cafe[] = results
          .map((r: any) => ({
            id: r.id,                                              // ★ id
            name: r.place_name,
            address: r.road_address_name || r.address_name,
            phone: r.phone,
            pos: { lat: parseFloat(r.y), lng: parseFloat(r.x) },
            distance: Number(r.distance || "0"),
            placeUrl: r.place_url,                                 // ★ url
          }))
          .filter((c) => c.distance <= radius)
          .sort((a, b) => a.distance - b.distance);

        setCafes(list);

        clearCafeMarkers();
        const cafeImg = makePin(kakao, "#0EA5E9"); // 하늘색
        list.slice(0, 20).forEach((c) => {
          const mk = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(c.pos.lat, c.pos.lng),
            image: cafeImg,
            title: c.name,
            zIndex: 4,
          });
          mk.setMap(mapRef.current);
          cafeMarkerMapRef.current.set(c.id, mk);

          // 마커 클릭 → 선택
          kakao.maps.event.addListener(mk, "click", () => selectCafe(c));
        });
      },
      { location: loc, radius, sort: (window as any).kakao.maps.services.SortBy.DISTANCE }
    );
  }, [ready, center.lat, center.lng, radius]); // radius 바뀌면 재검색

  return (
    <section className="p-6">
      {/* 상단 컨트롤 */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{stationName} 주변 카페</h2>
          <p className="text-sm text-gray-500">
            반경 {radius >= 1000 ? `${radius / 1000}km` : `${radius}m`} 기준
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="rounded-lg border px-2 py-1 text-sm"
            value={radius}
            onChange={(e) => setRadius(parseInt(e.target.value, 10))}
          >
            {[300, 500, 800, 1000].map((r) => (
              <option key={r} value={r}>
                {r >= 1000 ? `${r / 1000}km` : `${r}m`}
              </option>
            ))}
          </select>
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-1.5 rounded-lg border hover:bg-gray-50 text-sm"
          >
            이전으로
          </button>
        </div>
      </div>

      {/* 좌: 지도 / 우: 리스트 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 지도 카드: 늘어남 방지 위해 self-start */}
        <div className="lg:col-span-2 rounded-2xl border overflow-hidden self-start">
          <div ref={mapElRef} className="h-[520px] w-full bg-white" />

          {/* 선택한 카페 정보 패널 (선택 시에만 노출) */}
          {selected && (
            <div className="px-4 py-3 border-t bg-white">
              <div className="text-sm font-semibold">{selected.name}</div>
              <div className="text-xs text-gray-500 mt-0.5">{selected.address}</div>
              <div className="flex gap-2 mt-2">
                <a
                  target="_blank"
                  href={selected.placeUrl}
                  className="px-3 py-1.5 text-xs rounded-lg bg-indigo-600 text-white"
                >
                  카카오맵 장소상세
                </a>
                <a
                  target="_blank"
                  href={`https://map.kakao.com/link/to/${encodeURIComponent(
                    selected.name
                  )},${selected.pos.lat},${selected.pos.lng}`}
                  className="px-3 py-1.5 text-xs rounded-lg bg-emerald-600 text-white"
                >
                  길찾기
                </a>
              </div>
            </div>
          )}

          {/* 범례 */}
          <MapLegend
            items={[
              { color: "#7C3AED", label: "선택한 역 (보라 핀)" },
              { color: "#0EA5E9", label: "카페 (하늘색 핀)" },
            ]}
          />
        </div>

        {/* 오른쪽 리스트: 높이 고정 + 스크롤 */}
        <div className="rounded-2xl border bg-white p-4 max-h-[560px] overflow-auto">
          <h3 className="font-semibold mb-3">카페 목록</h3>
          {cafes.length === 0 && (
            <div className="text-sm text-gray-500">주변에서 카페를 찾지 못했어요.</div>
          )}
          <ol className="space-y-3">
            {cafes.map((c) => {
              const isSel = selected?.id === c.id;
              return (
                <li
                  key={c.id}
                  onClick={() => selectCafe(c)}
                  className={`rounded-xl border p-3 cursor-pointer hover:border-indigo-400
                              ${isSel ? "border-indigo-500 ring-2 ring-indigo-100" : ""}`}
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
        </div>
      </div>
    </section>
  );
}
