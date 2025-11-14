export interface Meeting {
  id: number;
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
  filteredCount: number;
}

export interface MeetingCardProps {
  meeting: Meeting;
}

export interface MeetingListProps {
  meetings: Meeting[];
}