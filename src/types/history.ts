export interface Meeting {
  id: number;
  title: string;
  // groupId: string; // 그룹 ID
  // memberIds: string[]; // 참석한 멤버 ID 배열
  date: string;
  time: string;
  location: string;
  participants: string;
  status: string;
  statusClasses: string;
}

// export interface Group {
//   id: string;
//   name: string;
//   memberIds: string[];  // 그룹의 전체 멤버 ID 배열
// }

export interface HistoryHeaderProps {
  onGoHome: () => void;
}

export interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  colorClasses: string;
}

export interface StatsSectionProps {
  meetings: Meeting[];
}

export interface FilterControlsProps {
  uniqueGroups: string[];
  selectedGroup: string;
  onGroupChange: (group: string) => void;
  filteredCount: number;
}

export interface MeetingCardProps {
  meeting: Meeting;
}

export interface MeetingListProps {
  meetings: Meeting[];
}