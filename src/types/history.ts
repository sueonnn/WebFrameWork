 export interface Group {
  id: string;
  name: string;
  description?: string;
  memberIds: string[];  // 그룹의 전체 멤버 ID 배열
  createdAt?: string;
}

export interface Meeting {
  id: number;
  // meetings.json에 있으니까 optional로 추가
  groupId?: string;      // "g1", "g2" 등
  title: string;
  date: string;
  time: string;
  location: string;
  participants: string;
  status: string;
  statusClasses: string;
}

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
  sortOptions: string[]; 
  sortOption: string; 
  onSortChange: (sort: string) => void;
  filteredCount: number;
}

export interface MeetingCardProps {
  meeting: Meeting;
}

export interface MeetingListProps {
  meetings: Meeting[];
}