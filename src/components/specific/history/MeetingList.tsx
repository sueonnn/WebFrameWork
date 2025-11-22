import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { MeetingListProps, MeetingCardProps } from '../../../types/history';
import { CalendarIcon } from '../../icons/CalendarIcon';
import { TimeClockIcon } from '../../icons/TimeClockIcon';
import { MapPinIcon } from '../../icons/MapPinIcon';
import { SmallUsersIcon } from '../../icons/SmallUsersIcon';
import { ChevronDownIcon } from '../../icons/ChevronDownIcon';

// MeetingCard 컴포넌트 (MeetingList 내부에서만 사용)
const MeetingCard: React.FC<MeetingCardProps> = ({ meeting }) => {
  const navigate = useNavigate(); 

  const handleClick = () => {
    // 여기서 네가 원한 코드가 실행됨
    navigate(`/groups/checklist/${meeting.id}`);
    // 만약 히스토리 상세로 가고 싶으면:
    // navigate(`/groups/checkstory/${meeting.id}`);
  };
  return (
    <li className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
    onClick={handleClick}>
      {/* 카드 상단: 아이콘, 제목, 날짜, 상태, 드롭다운 버튼 */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
            <CalendarIcon />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{meeting.title}</h3>
            <p className="text-sm text-gray-500">{meeting.date}</p>
          </div>
        </div>
        <div className="flex flex-shrink-0 items-center gap-4 pl-16 sm:pl-0">
          <span
            className={`mt-1 inline-block rounded-full px-3 py-0.5 text-sm font-semibold ${meeting.statusClasses}`}
          >
            {meeting.status}
          </span>
          <button className="text-gray-400 hover:text-gray-600"
          onClick={(e) => e.stopPropagation()}>
            <ChevronDownIcon />
          </button>
        </div>
      </div>
      
      {/* 카드 하단: 시간, 장소, 인원 정보 */}
      <div className="mt-5 flex flex-wrap items-center justify-between pl-16">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <TimeClockIcon />
          <span>{meeting.time}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <MapPinIcon />
          <span>{meeting.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <SmallUsersIcon />
          <span>{meeting.participants}</span>
        </div>
      </div>
    </li>
  );
};

// MeetingList 컴포넌트
export const MeetingList: React.FC<MeetingListProps> = ({ meetings }) => {
  return (
    <ul className="mt-6 w-full space-y-4">
      {meetings.map((meeting) => (
        <MeetingCard key={meeting.id} meeting={meeting} />
      ))}
    </ul>
  );
};