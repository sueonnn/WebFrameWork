// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { HistoryHeader } from '../components/specific/history/HistoryHeader';
// import { StatsSection } from '../components/specific/history/StatsSection';
// import { FilterControls } from '../components/specific/history/FilterControls';
// import { MeetingList } from '../components/specific/history/MeetingList';
// import { compareDates } from '../components/specific/history/dateUtils';
// import { MEETINGS } from '../mock'; 
// import type { Meeting } from '../types/history';

// export default function HistoryPage() {
//   const navigate = useNavigate();
//   const [selectedGroup, setSelectedGroup] = useState('전체');
//   const [sortOption, setSortOption] = useState('최신순');

//   const handleGoHome = () => navigate('/');

//   const allMeetings: Meeting[] = MEETINGS;

//   const uniqueGroups = [
//     '전체',
//     ...new Set(allMeetings.map((meeting) => meeting.title)),
//   ];

//   const sortOptions = ['최신순', '오래된순', '완료', '미완료'];

//   // 그룹 필터링
//   const filteredByGroup = allMeetings.filter((meeting) =>
//     selectedGroup === '전체' ? true : meeting.title === selectedGroup
//   );

//   // 정렬 필터링
//   const filteredMeetings = [...filteredByGroup]
//     .filter((meeting) => {
//       // 상태 필터링
//       if (sortOption === '완료') {
//         return meeting.status === '100% 완료';
//       }
//       if (sortOption === '미완료') {
//         return meeting.status !== '100% 완료';
//       }
//       return true;
//     })
//     .sort((a, b) => {
//       // 날짜 정렬
//       if (sortOption === '최신순') {
//         return compareDates(a.date, b.date, 'desc');
//       }
//       if (sortOption === '오래된순') {
//         return compareDates(a.date, b.date, 'asc');
//       }
//       return 0;
//     });

//   return (
//     <section className="bg-gray-50 py-12 min-h-screen">
//       <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4">
//         <HistoryHeader onGoHome={handleGoHome} />
//         <StatsSection meetings={filteredByGroup} />
//         <FilterControls
//           uniqueGroups={uniqueGroups}
//           selectedGroup={selectedGroup}
//           onGroupChange={setSelectedGroup}
//           sortOptions={sortOptions} 
//           sortOption={sortOption}
//           onSortChange={setSortOption} 
//           filteredCount={filteredMeetings.length}
//         />
//         <MeetingList meetings={filteredMeetings} />
//       </div>
//     </section>
//   );
// }

// import { useState, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { HistoryHeader } from '../components/specific/history/HistoryHeader';
// import { StatsSection } from '../components/specific/history/StatsSection';
// import { FilterControls } from '../components/specific/history/FilterControls';
// import { MeetingList } from '../components/specific/history/MeetingList';
// import { compareDates } from '../components/specific/history/dateUtils';
// import { GROUPS, MEETINGS } from '../mock';
// import { useAuth } from '../contexts/AuthContext';
// import { useHistoryStore } from '../stores/checklist/useHistoryStore';
// import type { Meeting } from '../types/history';

// export default function HistoryPage() {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [selectedGroup, setSelectedGroup] = useState('전체');
//   const [sortOption, setSortOption] = useState('최신순');

//   const handleGoHome = () => navigate('/');

//   // 로그인 안 되어 있으면 접근 차단
//   if (!user) {
//     return (
//       <section className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
//         <p className="mb-4 text-gray-700 text-center">
//           히스토리는 로그인 후에 확인할 수 있어요.
//         </p>
//         <button
//           className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 transition"
//           onClick={() => navigate('/login?mode=login')}
//         >
//           로그인 하러가기
//         </button>
//       </section>
//     );
//   }

//   // 내가 속한 그룹 id 목록
//   const myGroupIds = useMemo(
//     () =>
//       GROUPS
//         .filter((g: any) => g.memberIds.includes(user.id))
//         .map((g: any) => g.id),
//     [user.id]
//   );

//   // 내가 속한 그룹에 속한 미팅만
//   const historyMeetings = useHistoryStore((s) => s.history);
//   const allMeetings: Meeting[] = useMemo(
//     () => historyMeetings.filter((m) => myGroupIds.includes(m.groupId)),
//     [historyMeetings, myGroupIds]
//   );

//   // 드롭다운에 표시할 "그룹" 목록 
//   const uniqueGroups = [
//     '전체',
//     ...new Set(allMeetings.map((meeting) => meeting.title)),
//   ];

//   const sortOptions = ['최신순', '오래된순', '완료', '미완료'];

//   // 그룹 필터링
//   const filteredByGroup = allMeetings.filter((meeting) =>
//     selectedGroup === '전체' ? true : meeting.title === selectedGroup
//   );

//   // 정렬 + 상태 필터링
//   const filteredMeetings = [...filteredByGroup]
//     .filter((meeting) => {
//       if (sortOption === '완료') {
//         return meeting.status === '100% 완료';
//       }
//       if (sortOption === '미완료') {
//         return meeting.status !== '100% 완료';
//       }
//       return true;
//     })
//     .sort((a, b) => {
//       if (sortOption === '최신순') {
//         return compareDates(a.date, b.date, 'desc');
//       }
//       if (sortOption === '오래된순') {
//         return compareDates(a.date, b.date, 'asc');
//       }
//       return 0;
//     });

//   return (
//     <section className="bg-gray-50 py-12 min-h-screen">
//       <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4">
//         <HistoryHeader onGoHome={handleGoHome} />
//         {/* "내가 속한 그룹의 미팅" 기준으로 계산 */}
//         <StatsSection meetings={filteredByGroup} />
//         <FilterControls
//           uniqueGroups={uniqueGroups}
//           selectedGroup={selectedGroup}
//           onGroupChange={setSelectedGroup}
//           sortOptions={sortOptions}
//           sortOption={sortOption}
//           onSortChange={setSortOption}
//           filteredCount={filteredMeetings.length}
//         />
//         <MeetingList meetings={filteredMeetings} />
//       </div>
//     </section>
//   );
// }


import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { HistoryHeader } from "../components/specific/history/HistoryHeader";
import { StatsSection } from "../components/specific/history/StatsSection";
import { FilterControls } from "../components/specific/history/FilterControls";
import { MeetingList } from "../components/specific/history/MeetingList";
import { compareDates } from "../components/specific/history/dateUtils";

import { GROUPS, MEETINGS } from "../mock";
import { useAuth } from "../contexts/AuthContext";
import { useHistoryStore } from "../stores/checklist/useHistoryStore";
import { useMeetingInfoStore } from "../stores/meetingInfoStore";

import type { Meeting } from "../types/history";

export default function HistoryPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [selectedGroup, setSelectedGroup] = useState("전체");
  const [sortOption, setSortOption] = useState("최신순");

  const handleGoHome = () => navigate("/");

  if (!user) {
    return (
      <section className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <p className="mb-4 text-gray-700 text-center">
          히스토리는 로그인 후에 확인할 수 있어요.
        </p>
        <button
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 transition"
          onClick={() => navigate("/login?mode=login")}
        >
          로그인 하러가기
        </button>
      </section>
    );
  }

  // groupId -> groupName
  const groupNameById = useMemo(() => {
    const map: Record<string, string> = {};
    GROUPS.forEach((g: any) => {
      map[g.id] = g.name;
    });
    return map;
  }, []);

  // Meeting.groupId 타입가드 (undefined 제거)
  const hasGroupId = (m: Meeting): m is Meeting & { groupId: string } =>
    typeof m.groupId === "string" && m.groupId.length > 0;

  // 내가 속한 그룹 id 목록
  const myGroupIds = useMemo(() => {
    return GROUPS.filter((g: any) => g.memberIds.includes(user.id)).map(
      (g: any) => g.id
    );
  }, [user.id]);

  // 기본 데이터: 목데이터(MEETINGS)에서 내 그룹 것만 (groupId 존재 보장)
  const baseMeetings = useMemo(() => {
    return (MEETINGS as Meeting[])
      .filter(hasGroupId)
      .filter((m) => myGroupIds.includes(m.groupId));
  }, [myGroupIds]);

  // 수정/저장된 값: historyStore (있으면 id로 덮어쓰기)
  const historyMeetings = useHistoryStore((s) => s.history);
  const historyMap = useMemo(() => {
    return new Map(historyMeetings.map((m) => [m.id, m]));
  }, [historyMeetings]);

  // 확정 time/location: meetingInfoStore (있으면 time/location만 덮어쓰기)
  const getByMeetingId = useMeetingInfoStore((s) => s.getByMeetingId);

  // 최종 미팅 리스트
  const allMeetings: Meeting[] = useMemo(() => {
    return baseMeetings.map((m) => {
      const fromHistory = historyMap.get(m.id);
      const fromMeetingInfo = getByMeetingId?.(m.id);

      return {
        ...m,
        ...(fromHistory ?? {}),
        ...(fromMeetingInfo
          ? {
              time: fromMeetingInfo.time ?? (fromHistory?.time ?? m.time),
              location:
                fromMeetingInfo.location ?? (fromHistory?.location ?? m.location),
            }
          : {}),
      };
    });
  }, [baseMeetings, historyMap, getByMeetingId]);

  // 드롭다운 "그룹" 목록 (groupName 기준)
  const uniqueGroups = useMemo(() => {
    const names = Array.from(
      new Set(
        allMeetings
          .filter(hasGroupId)
          .map((m) => groupNameById[m.groupId])
          .filter(Boolean)
      )
    );
    return ["전체", ...names];
  }, [allMeetings, groupNameById]);

  const sortOptions = ["최신순", "오래된순", "완료", "미완료"];

  // 그룹 필터링 (groupName 기준)
  const filteredByGroup = useMemo(() => {
    if (selectedGroup === "전체") return allMeetings;

    return allMeetings.filter((m) => {
      if (!hasGroupId(m)) return false;
      return groupNameById[m.groupId] === selectedGroup;
    });
  }, [allMeetings, groupNameById, selectedGroup]);

  // 정렬 + 상태 필터링
  const filteredMeetings = useMemo(() => {
    return [...filteredByGroup]
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
  }, [filteredByGroup, sortOption]);

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
