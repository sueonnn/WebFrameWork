
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { BasePlaceType, CreateGroupDTO } from '../../types/group';
import { useGroupStore } from '../../stores/groupStore';
import { PlusIcon, SchoolIcon, BuildingIcon, HomeIcon } from '../icons';
import { searchPlaces } from '../../apis/kakao';

const placeLabel = { SCHOOL: '학교', COMPANY: '회사', HOME: '집' } as const;

export default function GroupCreateForm() {
  const navigate = useNavigate();
  const { createGroup, creating } = useGroupStore();

  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [baseType, setBaseType] = useState<BasePlaceType>('SCHOOL');
  const [baseAddr, setBaseAddr] = useState('');
  const [baseCoords, setBaseCoords] = useState<{ lat: number; lng: number } | null>(null);

  const [results, setResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  const disabled = !name.trim() || !baseType || !baseAddr.trim();

  // 검색 자동완성 (디바운스 적용)
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (isSelecting) return; // 선택 중일 때는 검색 안 함

      if(baseAddr.trim().length > 1) {
        const data = await searchPlaces(baseAddr);
        setResults(data);
        setShowDropdown(true);
      }else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [baseAddr]);

  const handleSelectPlace = (place: any) => {
    setIsSelecting(true); 
    setBaseAddr(place.place_name);
    setBaseCoords({ lat: parseFloat(place.y), lng: parseFloat(place.x) });
    setResults([]);
    setShowDropdown(false);

    // 약간의 지연 후 다시 검색 허용
    setTimeout(() => setIsSelecting(false), 400);
  };

  const onSubmit = async () => {
    if (!baseAddr.trim() || !baseCoords) {
      alert('기본 위치를 선택해주세요.');
      return;
    }

    const payload: CreateGroupDTO = {
      name: name.trim(),
      description: desc.trim() || undefined,
      basePlaceType: baseType,
      baseAddress: baseAddr.trim(),
      baseLatitude: baseCoords.lat,
      baseLongitude: baseCoords.lng,
    };

    const id = await createGroup(payload);
    navigate(`/groups/${id}`);
  };

  return (
    <div className="space-y-5">
      {/* 그룹명 */}
      <div>
        <label className="mb-2 block text-sm font-medium">그룹명</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예) 알고리즘 스터디 7조"
          className="w-full rounded-xl border border-gray-300 px-3 py-3 text-sm outline-none focus:border-indigo-500"
        />
      </div>

      {/* 그룹 설명 */}
      <div>
        <div className="flex items-center justify-between">
          <label className="mb-2 block text-sm font-medium">그룹 설명 (선택)</label>
          <span className="text-xs text-gray-400">{desc.length}/200</span>
        </div>
        <textarea
          maxLength={200}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="간단한 소개를 적어주세요"
          className="h-28 w-full resize-none rounded-xl border border-gray-300 px-3 py-3 text-sm outline-none focus:border-indigo-500"
        />
      </div>

      {/* 기본 위치 유형 */}
      <div>
        <label className="mb-2 block text-sm font-medium">기본 위치 유형</label>
        <div className="grid grid-cols-3 gap-3">
          {(['SCHOOL', 'COMPANY', 'HOME'] as BasePlaceType[]).map((t) => {
            const active = baseType === t;
            const Icon = t === 'SCHOOL' ? SchoolIcon : t === 'COMPANY' ? BuildingIcon : HomeIcon;
            const cls = active
              ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50';
            return (
              <button
                key={t}
                onClick={() => setBaseType(t)}
                className={`flex h-20 flex-col items-center justify-center gap-2 rounded-xl border text-sm ${cls}`}
              >
                <Icon />
                <span>{placeLabel[t]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 기본 위치 자동완성 입력 */}
      <div className="relative">
        <label className="mb-2 block text-sm font-medium">기본 위치</label>
        <input
          value={baseAddr}
          onChange={(e) => setBaseAddr(e.target.value)}
          placeholder="예) 한성대학교 공학관, 성북구…"
          className="w-full rounded-xl border border-gray-300 px-3 py-3 text-sm outline-none focus:border-indigo-500"
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
        {baseCoords && (
          <p className="mt-2 text-xs text-gray-500">
            선택된 좌표: {baseCoords.lat.toFixed(5)}, {baseCoords.lng.toFixed(5)}
          </p>
        )}
      </div>

      {/* 버튼 */}
      <button
        onClick={onSubmit}
        disabled={creating || disabled}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
      >
        <PlusIcon />
        {creating ? '만드는 중…' : '그룹 만들기'}
      </button>

      <div className="rounded-lg bg-indigo-50 px-3 py-2 text-xs text-indigo-600">
        그룹을 만들면 자동으로 초대코드가 생성되어 멤버들을 초대할 수 있어요.
      </div>
    </div>
  );
}
