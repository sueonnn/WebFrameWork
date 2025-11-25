// mock/index.ts
import usersJson from './users.json';
import membersJson from './members.json';
import groupsJson from './groups.json';
import meetingsJson from './meetings.json';
import meetingInfosJson from './meetingInfos.json';
import tasksByMeetingJson from './tasksByMeeting.json';
import timeDecisionsJson from './timeDecisions.json';

import type { User, Member } from '../components/group/types';
import type { Group, Meeting } from '../types/history';
import type { MeetingInfo } from '../types/MeetingInfo';
import type { Task } from '../types/Task';


export type TimeDecisionCandidate = {
  id: string;
  timeLabel: string;
  availableMemberIds: string[];
  voteAgreeIds: string[];
  votePendingIds: string[];
};

export type GroupTimeDecision = {
  groupId: string;
  meetingId: string;
  candidates: TimeDecisionCandidate[];
};

// 기본 리스트들
export const USERS: User[] = usersJson as User[];
export const MEMBERS: Member[] = membersJson as Member[];
export const GROUPS: Group[] = groupsJson as Group[];
export const MEETINGS: Meeting[] = meetingsJson as Meeting[];

export const CURRENT_USER: User = USERS[0];

// 모임 상세 정보
export const MEETING_INFOS: MeetingInfo[] = meetingInfosJson as MeetingInfo[];

// 회의별 할 일 (Record<string, Task[]>)
export const TASKS_BY_MEETING: Record<string, Task[]> =
  tasksByMeetingJson as Record<string, Task[]>;

export const GROUP_TIME_DECISIONS: GroupTimeDecision[] =
timeDecisionsJson as GroupTimeDecision[];
