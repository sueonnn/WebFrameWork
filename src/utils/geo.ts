// 위경도 좌표 타입 정의
export type LatLng = { lat: number; lng: number };

/**
 * 여러 좌표의 중심점(centroid)을 계산
 * - lat, lng 각각의 평균값
 */
export function centroid(points: LatLng[]): LatLng {
  const n = points.length || 1;
  const s = points.reduce((a, p) => ({ lat: a.lat + p.lat, lng: a.lng + p.lng }), { lat: 0, lng: 0 });
  return { lat: s.lat / n, lng: s.lng / n };
}

/**
 * 두 위경도 간 거리(미터 단위)를 계산 (Haversine 공식)
 */
export function distanceMeters(a: LatLng, b: LatLng) {
  const R = 6371_000; // 지구 반지름 (m)
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat), lat2 = toRad(b.lat);
  const h = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLng/2)**2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// degree → radian 변환
const toRad = (x: number) => (x * Math.PI) / 180;