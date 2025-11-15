import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HistoryHeader } from '../components/specific/history/HistoryHeader';
import { StatsSection } from '../components/specific/history/StatsSection';
import { FilterControls } from '../components/specific/history/FilterControls';
import { MeetingList } from '../components/specific/history/MeetingList';
import { DUMMY_MEETINGS } from '../constants/mockData';

export default function HistoryPage() {
  const navigate = useNavigate();
  const [selectedGroup, setSelectedGroup] = useState('전체');

  const handleGoHome = () => navigate('/');

  const uniqueGroups = [
    '전체',
    ...new Set(DUMMY_MEETINGS.map((meeting) => meeting.title)),
  ];

  const filteredMeetings = DUMMY_MEETINGS.filter((meeting) =>
    selectedGroup === '전체' ? true : meeting.title === selectedGroup
  );

  return (
    <section className="bg-gray-50 py-12 min-h-screen">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4">
        <HistoryHeader onGoHome={handleGoHome} />
        <StatsSection meetings={filteredMeetings} />
        <FilterControls
          uniqueGroups={uniqueGroups}
          selectedGroup={selectedGroup}
          onGroupChange={setSelectedGroup}
          filteredCount={filteredMeetings.length}
        />
        <MeetingList meetings={filteredMeetings} />
      </div>
    </section>
  );
}