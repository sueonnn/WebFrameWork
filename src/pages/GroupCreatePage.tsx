import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { BasePlaceType, CreateGroupDTO } from '../types/group';
import { useGroupStore } from '../stores/groupStore';

type Tab = 'create' | 'join';

const placeLabel = { SCHOOL: '학교', COMPANY: '회사', HOME: '집' } as const;

/* --- SVG 아이콘 --- */
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const SchoolIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M3 10l9-5 9 5-9 5-9-5z" stroke="currentColor" strokeWidth="2" />
    <path d="M21 10v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M3 10v6l9 5 9-5" stroke="currentColor" strokeWidth="2" />
  </svg>
);
const BuildingIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M3 21h18M6 21V5a2 2 0 0 1 2-2h8v18M10 7h2M14 7h2M10 11h2M14 11h2M10 15h2M14 15h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const HomeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M3 11l9-7 9 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M5 10v10h14V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M9 20v-6h6v6" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

export default function GroupCreatePage() {
  const navigate = useNavigate();
  const { createGroup, creating } = useGroupStore();

  const [tab, setTab] = useState<Tab>('create');
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [baseType, setBaseType] = useState<BasePlaceType | null>('SCHOOL');
  const [baseAddr, setBaseAddr] = useState('');

  const disabled = !name.trim() || !baseType;

  const onSubmit = async () => {
    if (tab === 'join') {
      alert('그룹 참가 플로우는 추후 연결 예정입니다.');
      return;
    }
    const payload: CreateGroupDTO = {
      name: name.trim(),
      description: desc.trim() || undefined,
      basePlaceType: baseType,
      baseAddress: baseAddr.trim() || undefined,
    };
    const id = await createGroup(payload);
    navigate(`/groups/${id}`);
  };

  return (
    <section className="grid place-items-start">
      {/* 제목 */}
      <div className="w-full text-center">
        <h1 className="text-2xl font-bold">그룹으로 시작하는 스마트한 모임</h1>
        <p className="mt-2 text-sm text-gray-500">새로운 그룹을 만들거나 기존 그룹에 참여해보세요</p>
      </div>

      {/* 카드 */}
      <div className="mx-auto mt-6 w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        {/* 탭 */}
        <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-gray-100 p-1">
          <button
            onClick={() => setTab('create')}
            className={`flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-medium transition
            ${tab === 'create' ? 'bg-white text-indigo-600 shadow' : 'text-gray-600'}`}
          >
            <PlusIcon /> <span>그룹 만들기</span>
          </button>
          <button
            onClick={() => setTab('join')}
            className={`flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-medium transition
            ${tab === 'join' ? 'bg-white text-indigo-600 shadow' : 'text-gray-600'}`}
          >
            <UsersIcon /> <span>그룹 참여하기</span>
          </button>
        </div>

        {/* 폼 */}
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">그룹명</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예) 알고리즘 스터디 7조"
              className="w-full rounded-xl border border-gray-300 px-3 py-3 text-sm outline-none focus:border-indigo-500"
            />
          </div>

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
                const common =
                  'flex h-20 flex-col items-center justify-center gap-2 rounded-xl border text-sm';
                const activeCls =
                  'border-indigo-500 bg-indigo-50 text-indigo-600';
                const idleCls = 'border-gray-300 text-gray-700 hover:bg-gray-50';
                const Icon =
                  t === 'SCHOOL' ? SchoolIcon : t === 'COMPANY' ? BuildingIcon : HomeIcon;

                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setBaseType(t)}
                    className={`${common} ${active ? activeCls : idleCls}`}
                  >
                    <Icon />
                    <span>{placeLabel[t]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 기본 위치 */}
          <div>
            <label className="mb-2 block text-sm font-medium">기본 위치</label>
            <input
              value={baseAddr}
              onChange={(e) => setBaseAddr(e.target.value)}
              placeholder="예) 한성대학교 공학관, 성북구…"
              className="w-full rounded-xl border border-gray-300 px-3 py-3 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          {/* 제출 */}
          <button
            onClick={onSubmit}
            disabled={creating || disabled}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
          >
            <PlusIcon />
            {tab === 'create' ? (creating ? '만드는 중…' : '그룹 만들기') : '그룹 참여하기'}
          </button>

          <div className="rounded-lg bg-indigo-50 px-3 py-2 text-xs text-indigo-600">
            그룹을 만들면 자동으로 초대코드가 생성되어 멤버들을 초대할 수 있어요.
          </div>
        </div>
      </div>

      {/* 하단 설명 카드 */}
      <div className="mx-auto mt-8 grid w-full max-w-5xl gap-4 md:grid-cols-3">
        {[
          { title: '스마트 시간 조율', desc: '모든 멤버의 가능 시간을 분석해 최적의 모임 시간을 찾아드려요' },
          { title: '중간 지점 추천', desc: '멤버들의 위치를 고려해 공평한 만남 장소를 추천해드려요' },
          { title: '체크리스트', desc: '모임 전후 해야 할 일들을 관리해요' },
        ].map((c) => (
          <div key={c.title} className="rounded-2xl border border-gray-200 bg-white p-5 text-sm">
            <div className="font-semibold">{c.title}</div>
            <div className="mt-1 text-gray-500">{c.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}