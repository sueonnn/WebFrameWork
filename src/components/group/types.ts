import { LatLng } from '../../utils/geo';

// 멤버 타입 (집, 학교, 회사, 기타)
export type MemberType = 'HOME' | 'SCHOOL' | 'COMPANY' | 'ETC';

// 그룹 멤버 정보
export type Member = {
  id: string;
  name: string;
  type: MemberType;
  pos: LatLng; // 위도/경도
};

// 지하철역 및 추천 후보 정보
export type Station = {
  name: string;          // 역 이름
  pos: LatLng;          // 역 좌표
  address?: string;     // 도로명/지번 주소
  distance: number;     // 중심 지점까지 거리 (m)
  avgDistance: number;  // 멤버들의 평균 이동 거리 (m)
};
