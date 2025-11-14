import React from 'react';
import { StatsSectionProps, StatCardProps } from '../../../types/history';
import { CalendarIcon } from '../../icons/CalendarIcon';
import { UsersIcon } from '../../icons/UsersIcon';
import { CalendarCheckIcon } from '../../icons/CalendarCheckIcon';
import { PercentIcon } from '../../icons/PercentIcon';

// StatCard 컴포넌트 (StatsSection 내부에서만 사용)
const StatCard: React.FC<StatCardProps> = ({ icon, label, value, colorClasses }) => {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div
        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${colorClasses}`}
      >
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
    </div>
  );
};

// StatsSection 컴포넌트
export const StatsSection: React.FC<StatsSectionProps> = ({ meetings }) => {
  const totalMeetings = meetings.length;

  const completedMeetings = meetings.filter(
    (m) => m.status === '100% 완료'
  ).length;

  const completionRate =
    totalMeetings > 0
      ? Math.round((completedMeetings / totalMeetings) * 100)
      : 0;

  // 임시로 '6'으로 설정, 추후 멤버 수 받아 계산하도록 수정할 예정.
  const totalUniqueMembers = 6;

  const stats = [
    {
      id: 1,
      label: '총 모임',
      value: `${totalMeetings}`,
      icon: <CalendarIcon />,
      colorClasses: 'bg-violet-100 text-violet-600',
    },
    {
      id: 2,
      label: '참여 멤버',
      value: `${totalUniqueMembers}`,
      icon: <UsersIcon />,
      colorClasses: 'bg-lime-100 text-lime-600',
    },
    {
      id: 3,
      label: '완료된 모임',
      value: `${completedMeetings}`,
      icon: <CalendarCheckIcon />,
      colorClasses: 'bg-violet-100 text-violet-600',
    },
    {
      id: 4,
      label: '완료율',
      value: `${completionRate}%`,
      icon: <PercentIcon />,
      colorClasses: 'bg-orange-100 text-orange-600',
    },
  ];

  return (
    <div className="mt-8 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.id}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          colorClasses={stat.colorClasses}
        />
      ))}
    </div>
  );
};