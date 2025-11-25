import { useEffect, useState } from "react";
import LocationTypeSelector from "./LocationTypeSelector";
import { searchPlaces } from "../../../apis/kakao";

type LocationType = "home" | "company" | "school" | "etc";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelectAddress: (addr: string) => void;
};

export default function LocationModal({ isOpen, onClose, onSelectAddress }: Props) {

  const [type, setType] = useState<LocationType>("home");
  const [addr, setAddr] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  const visibleStyle = isOpen ? "flex" : "hidden";

  useEffect(() => {
    if (!isOpen) return;

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
  }, [addr, isSelecting, isOpen]);

  const handleSelectPlace = (place: any) => {
    setIsSelecting(true);

    setAddr(place.place_name);
    setResults([]);
    setShowDropdown(false);

    setTimeout(() => {
      setIsSelecting(false);
    }, 300);
  };

  const handleSave = () => {
    if (!addr.trim()) {
      alert("주소를 입력 또는 선택해주세요.");
      return;
    }
    onSelectAddress(addr);
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-[200] items-center justify-center bg-black/40 ${visibleStyle}`}>
      <div className="w-[520px] rounded-2xl bg-white shadow-xl p-8 relative">

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

          {isOpen && showDropdown && results.length > 0 && (
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
        </div>

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
