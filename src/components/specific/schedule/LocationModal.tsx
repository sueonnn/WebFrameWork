import { useEffect, useState } from "react";
import LocationTypeSelector from "./LocationTypeSelector";
import CurrentLocationIcon from "../../../components/icons/CurrentLocationIcon";
import { searchPlaces } from "../../../apis/kakao";

type LocationType = "home" | "company" | "school" | "etc";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelectAddress: (addr: string) => void;
};

export default function LocationModal({
  isOpen,
  onClose,
  onSelectAddress,
}: Props) {
  if (!isOpen) return null;

  const [type, setType] = useState<LocationType>("home");


  const [addr, setAddr] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [results, setResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  async function reverseGeocode(lat: number, lng: number) {
    try {

      const res = await fetch(
        `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lng}&y=${lat}`,
        {
          headers: {
            Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}`,
          },
        }
      );
      const data = await res.json();

      const addr1 =
        data.documents?.[0]?.road_address?.address_name ||
        data.documents?.[0]?.address?.address_name;

      if (addr1) return addr1;

      const fallbackRes = await fetch(
        `https://dapi.kakao.com/v2/local/search/keyword.json?query=.&y=${lat}&x=${lng}&radius=50`,
        {
          headers: {
            Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}`,
          },
        }
      );

      const fallbackData = await fallbackRes.json();


      const nearest = fallbackData.documents?.[0];
      if (nearest) {
        return (
          nearest.road_address_name ||
          nearest.address_name ||
          nearest.place_name ||
          ""
        );
      }

      return "";
    } catch (e) {
      console.error("reverseGeocode error:", e);
      return "";
    }
  }


  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("브라우저가 위치 정보를 지원하지 않습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        setCoords({ lat: latitude, lng: longitude });

        const addressName = await reverseGeocode(latitude, longitude);
        if (!addressName) {
          alert("현재 위치의 주소를 찾을 수 없습니다.");
          return;
        }

        setAddr(addressName);
        setShowDropdown(false);
      },
      (err) => {
        alert("현재 위치를 가져올 수 없습니다.");
        console.error(err);
      }
    );
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (isSelecting) return;

      if (addr.trim().length > 1) {
        const data = await searchPlaces(addr);
        setResults(data);
        setShowDropdown(true);
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [addr]);

  const handleSelectPlace = (place: any) => {
    setIsSelecting(true);
    setAddr(place.place_name);
    setCoords({ lat: parseFloat(place.y), lng: parseFloat(place.x) });
    setResults([]);
    setShowDropdown(false);

    setTimeout(() => setIsSelecting(false), 400);
  };

  const handleSave = () => {
    if (!addr.trim()) {
      alert("주소를 선택해주세요.");
      return;
    }

    onSelectAddress(addr);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40">
      <div className="w-[520px] rounded-2xl bg-white shadow-xl p-8 relative">
        {/* 닫기 */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">위치 설정</h2>

        <div className="mb-4">
          <div className="mb-2 text-sm font-medium text-gray-800">위치 유형</div>
          <LocationTypeSelector value={type} onChange={setType} />
        </div>

        <div className="relative mb-6">
          <div className="mb-2 text-sm font-medium text-gray-800">주소</div>

          <input
            value={addr}
            onChange={(e) => setAddr(e.target.value)}
            placeholder="예: 서울시 성북구 삼선동"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500"
          />

          {showDropdown && results.length > 0 && (
            <ul className="absolute z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
              {results.map((place) => (
                <li
                  key={place.id}
                  onClick={() => handleSelectPlace(place)}
                  className="cursor-pointer px-4 py-2 text-sm hover:bg-indigo-50"
                >
                  {place.place_name}
                </li>
              ))}
            </ul>
          )}

          {coords && (
            <p className="mt-2 text-xs text-gray-500">
              선택된 좌표: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
            </p>
          )}
        </div>

        <button
          onClick={handleUseCurrentLocation}
          className="w-full h-12 mb-6 rounded-lg border text-indigo-600 font-medium flex items-center justify-center gap-2"
        >
          <CurrentLocationIcon />
          현재 위치 사용하기
        </button>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="w-1/2 h-12 rounded-full border font-medium"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="w-1/2 h-12 rounded-full bg-indigo-600 text-white font-medium"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
