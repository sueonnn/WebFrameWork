import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useHistoryStore } from '../stores/checklist/useHistoryStore';

import { HistoryHeader } from '../components/specific/history/HistoryHeader';
import { StatsSection } from '../components/specific/history/StatsSection';
import { FilterControls } from '../components/specific/history/FilterControls';
import { MeetingList } from '../components/specific/history/MeetingList';
import { compareDates } from '../components/specific/history/dateUtils';

import { GROUPS, MEETINGS } from '../mock';
import type { Meeting } from '../types/history';

export default function HistoryPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const history = useHistoryStore((state) => state.history);


  const [selectedGroup, setSelectedGroup] = useState("전체");
  const [sortOption, setSortOption] = useState("최신순");

  const handleGoHome = () => navigate("/");


  if (!user) {
    return (
      <section className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <p className="mb-4 text-gray-700">히스토리는 로그인 후 확인할 수 있어요.</p>
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow"
          onClick={() => navigate("/login?mode=login")}
        >
          로그인 하러가기
        </button>
      </section>
    );
  }

  const myGroupIds = useMemo(
    () =>
      GROUPS.filter((g) => g.memberIds.includes(user.id)).map((g) => g.id),
    [user.id]
  );

  const combinedMeetings = useMemo(() => {
    const mockList = MEETINGS.filter((m: any) => myGroupIds.includes(m.groupId));

    const merged = [...mockList];

    history.forEach((h: any) => {
      const idx = merged.findIndex((m: any) => m.id === h.id);
      if (idx >= 0) merged[idx] = h;
      else merged.push(h);
    });

    return merged;
  }, [myGroupIds, history]);



  const filteredByGroup = combinedMeetings.filter((meeting) =>
    selectedGroup === "전체" ? true : meeting.title === selectedGroup
  );


  const filteredMeetings = [...filteredByGroup]
    .filter((meeting) => {
      if (sortOption === "완료") return meeting.status === "100% 완료";
      if (sortOption === "미완료") return meeting.status !== "100% 완료";
      return true;
    })
    .sort((a, b) => {
      if (sortOption === "최신순") return compareDates(a.date, b.date, "desc");
      if (sortOption === "오래된순") return compareDates(a.date, b.date, "asc");
      return 0;
    });


  const uniqueGroups = [
    "전체",
    ...new Set(combinedMeetings.map((m) => m.title)),
  ];

  return (
    <section className="bg-gray-50 py-12 min-h-screen">
      <div className="mx-auto max-w-7xl flex flex-col items-center px-4">
        <HistoryHeader onGoHome={handleGoHome} />

        <StatsSection meetings={filteredByGroup} />

        <FilterControls
          uniqueGroups={uniqueGroups}
          selectedGroup={selectedGroup}
          onGroupChange={setSelectedGroup}
          sortOptions={["최신순", "오래된순", "완료", "미완료"]}
          sortOption={sortOption}
          onSortChange={setSortOption}
          filteredCount={filteredMeetings.length}
        />

        <MeetingList meetings={filteredMeetings} />
      </div>
    </section>
  );
}
