import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HistoryHeader } from '../components/specific/history/HistoryHeader';
import { StatsSection } from '../components/specific/history/StatsSection';
import { FilterControls } from '../components/specific/history/FilterControls';
import { MeetingList } from '../components/specific/history/MeetingList';
import { compareDates } from '../components/specific/history/dateUtils';
import meetingsJson from '../mock/meetings.json';
import type { Meeting } from '../types/history';

export default function HistoryPage() {
  const navigate = useNavigate();
  const [selectedGroup, setSelectedGroup] = useState('전체');
  const [sortOption, setSortOption] = useState('최신순');

  const handleGoHome = () => navigate('/');

  const DUMMY_MEETINGS = meetingsJson as Meeting[];

  const uniqueGroups = [
    '전체',
    ...new Set(DUMMY_MEETINGS.map((meeting) => meeting.title)),
  ];

  const sortOptions = ['최신순', '오래된순', '완료', '미완료'];

  // 그룹 필터링
  const filteredByGroup = DUMMY_MEETINGS.filter((meeting) =>
    selectedGroup === '전체' ? true : meeting.title === selectedGroup
  );

  // 정렬 필터링
  const filteredMeetings = [...filteredByGroup]
    .filter((meeting) => {
      // 상태 필터링
      if (sortOption === '완료') {
        return meeting.status === '100% 완료';
      }
      if (sortOption === '미완료') {
        return meeting.status !== '100% 완료';
      }
      return true;
    })
    .sort((a, b) => {
      // 날짜 정렬
      if (sortOption === '최신순') {
        return compareDates(a.date, b.date, 'desc');
      }
      if (sortOption === '오래된순') {
        return compareDates(a.date, b.date, 'asc');
      }
      return 0;
    });

  return (
    <section className="bg-gray-50 py-12 min-h-screen">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4">
        <HistoryHeader onGoHome={handleGoHome} />
        <StatsSection meetings={filteredByGroup} />
        <FilterControls
          uniqueGroups={uniqueGroups}
          selectedGroup={selectedGroup}
          onGroupChange={setSelectedGroup}
          sortOptions={sortOptions} 
          sortOption={sortOption}
          onSortChange={setSortOption} 
          filteredCount={filteredMeetings.length}
        />
        <MeetingList meetings={filteredMeetings} />
      </div>
    </section>
  );
}