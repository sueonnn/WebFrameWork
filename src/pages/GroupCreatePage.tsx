import { useState } from 'react';
import {
  PlusIcon,
  UsersIcon,
  ClockIcon,
  LocationIcon,
  CheckIcon,
} from '../components/icons';
import GroupCreateForm from '../components/group/GroupCreateForm';
import GroupJoinForm from '../components/group/GroupJoinForm';

type Tab = 'create' | 'join';

export default function GroupCreatePage() {
  const [tab, setTab] = useState<Tab>('create');

  return (
    <section className="grid place-items-start">
      {/* 헤더 */}
      <div className="w-full text-center">
        <h1 className="text-2xl font-bold">그룹으로 시작하는 스마트한 모임</h1>
        <p className="mt-2 text-sm text-gray-500">
          새로운 그룹을 만들거나 기존 그룹에 참여해보세요
        </p>
      </div>

      {/* 메인 카드 */}
      <div className="mx-auto mt-6 w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm min-h-[600px]">
        {/* 탭 버튼 */}
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

        {/* 폼 전환 */}
        {tab === 'create' ? <GroupCreateForm /> : <GroupJoinForm />}
      </div>

      {/* 하단 설명 카드 */}
      <div className="mx-auto mt-10 w-full max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              title: '스마트 시간 조율',
              desc: '모든 멤버의 가능 시간을 자동으로 분석해 최적의 모임 시간을 찾아드려요',
              icon: <ClockIcon />,
            },
            {
              title: '중간 지점 추천',
              desc: '멤버들의 위치를 고려해 가장 접근하기 좋은 만남의 장소를 추천해드려요',
              icon: <LocationIcon />,
            },
            {
              title: '체크리스트',
              desc: '모임 전후 해야 할 일들을 관리해요',
              icon: <CheckIcon />,
            },
          ].map((c, i) => (
            <div
              key={i}
              className="
                flex flex-col items-center text-center
                rounded-2xl border border-gray-200 bg-white 
                px-6 py-8 text-sm min-h-[190px] shadow-sm
                hover:border-indigo-500 hover:shadow-md transition-all duration-300
              "
            >
              {/* 아이콘: 항상 같은 위치 */}
              <div className="flex items-center justify-center rounded-full bg-indigo-100 p-3 mb-4 h-10 w-10 shrink-0">
                {c.icon}
              </div>

              {/* 제목 */}
              <div className="font-semibold text-gray-900 text-base mb-2">{c.title}</div>

              {/* 설명 */}
              <div className="text-gray-500 leading-relaxed flex-1 flex items-center justify-center">
                <p className="max-w-[210px]">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
