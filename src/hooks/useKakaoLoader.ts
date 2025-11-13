import { useEffect, useState } from 'react';

// 전역 Window 객체에 kakao 타입 추가 (TS 에러 방지용)
declare global {
  interface Window { kakao: any }
}

/**
 * useKakaoLoader()
 * - Kakao 지도 SDK를 동적으로 로드하고, 로딩 완료 시 ready=true 반환하는 커스텀 훅
 */
export default function useKakaoLoader() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // 이미 SDK가 로드되어 있으면 즉시 true 설정
    const exist = (window as any).kakao?.maps;
    if (exist) { setReady(true); return; }

    const appkey = import.meta.env.VITE_KAKAO_JS_KEY;
    const url = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appkey}&libraries=services&autoload=false`;

    const s = document.createElement('script');
    s.src = url; s.async = true;
    // SDK 로드 후 kakao.maps.load() 실행 → 지도 API 활성화
    s.onload = () => window.kakao.maps.load(() => setReady(true));
    document.head.appendChild(s);

    // 컴포넌트 언마운트 시 script 제거 (메모리 정리)
    return () => { document.head.removeChild(s); };
  }, []);

  return ready;
}
