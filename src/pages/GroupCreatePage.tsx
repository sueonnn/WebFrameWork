import { useState } from 'react';
import { PlusIcon, UsersIcon } from '../components/icons';
import GroupCreateForm from '../components/group/GroupCreateForm';
import GroupJoinForm from '../components/group/GroupJoinForm';

type Tab = 'create' | 'join';

export default function GroupCreatePage() {
  const [tab, setTab] = useState<Tab>('create');

  return (
    <section className="grid place-items-start">
      <div className="w-full text-center">
        <h1 className="text-2xl font-bold">그룹으로 시작하는 스마트한 모임</h1>
        <p className="mt-2 text-sm text-gray-500">
          새로운 그룹을 만들거나 기존 그룹에 참여해보세요
        </p>
      </div>

      {/* 카드 */}
      <div className="mx-auto mt-6 w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm min-h-[600px]">
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

        {/* 폼 전환 */}
        {tab === 'create' ? <GroupCreateForm /> : <GroupJoinForm />}
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
