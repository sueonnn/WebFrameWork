// import { useState, useMemo, useEffect } from "react";
// import dayjs from "dayjs";
// import { useNavigate, useParams } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";

// import { useGroupScheduleStore } from "../stores/groupScheduleStore";
// import { useUserSettingStore } from "../stores/userScheduleSettingStore";
// import { useAllUserScheduleStore } from "../stores/allUserScheduleStore";

// import { computeGroupSchedule } from "../stores/services/groupScheduleService";
// import GroupSidebar from "../components/specific/group/GroupSidebar";

// // 분리한 컴포넌트
// import TimelineHeader from "../components/specific/group/timeline/TimelineHeader";
// import TimelineHeatmapLegend from "../components/specific/group/timeline/TimelineHeatmapLegend.tsx";
// import TimelineWeekTabs from "../components/specific/group/timeline/TimelineWeekTabs";
// import TimelineHeatmapTable from "../components/specific/group/timeline/TimelineHeatmapTable";

// import { GROUPS, mapMemberIdsToUserIds } from "../mock";
// import { useMeetingInfoStore } from "../stores/meetingInfoStore";

// export default function GroupTimelinePage() {
//   const navigate = useNavigate();
//   const { groupId: routeGroupId } = useParams<{ groupId: string }>();
//   const { user } = useAuth();


//   const [activeTab, setActiveTab] = useState<"this" | "next">("this");

//   // 전체 사용자 스케줄
//   const { schedules: allSchedules } = useAllUserScheduleStore();

//   // 그룹 정보 + 스케줄 setter
//   const { memberIds, groupName, memberCount, groupSchedules, setGroupSchedules } =
//     useGroupScheduleStore();


//   // 현재 그룹 결정 (route 우선, 없으면 첫 그룹) 
//   const currentGroupId = routeGroupId ?? GROUPS[0].id;
//   const mockGroup = useMemo(() => {
//     return GROUPS.find((g) => g.id === currentGroupId) ?? GROUPS[0];
//   }, [currentGroupId]);

//   // 헤더 정보 fallback 
//   const isDefaultGroupName = !groupName || groupName === "우리 팀";
//   const headerGroupName = isDefaultGroupName ? mockGroup.name : groupName;
//   const headerMemberCount = memberCount || mockGroup.memberIds.length;

//   const meetingInfo = useMeetingInfoStore((s) => s.getByGroupId(currentGroupId));
//   const confirmedLocation = meetingInfo?.location ?? "아직 장소 미정";

//   console.log("Timeline header group:", headerGroupName, headerMemberCount);

//   // 사용자 설정
//   const { showWorkingHoursOnly, setShowWorkingHoursOnly } = useUserSettingStore();

//   // memberIds가 store에 아직 없을 수 있으니 mockGroup.memberIds로 fallback
//   const effectiveMemberIds = useMemo(() => {
//     return memberIds?.length ? memberIds : mockGroup.memberIds;
//   }, [memberIds, mockGroup.memberIds]);

//   // memberIds(m1..) -> userIds(user1..)
//   const effectiveUserIds = useMemo(() => {
//     const mapped = mapMemberIdsToUserIds(effectiveMemberIds);
//     return mapped.length ? mapped : effectiveMemberIds; 
//   }, [effectiveMemberIds]);

//   const members = mockGroup.memberIds;  
//   useEffect(() => {
//     const result = computeGroupSchedule(allSchedules, effectiveUserIds);
//     setGroupSchedules(result);
//   }, [allSchedules, effectiveUserIds, setGroupSchedules]);

//   // 스케줄 입력 페이지 이동: /groups/:groupId/schedule/:userId
//   const currentUserId = (user as any)?.id ?? null;
//   const handleClickSchedule = () => {
//     if (!currentUserId) {
//       navigate("/login");
//       return;
//     }
//     navigate(`/groups/${currentGroupId}/schedule/${currentUserId}`, {
//       state: { from: `/groups/${currentGroupId}/timeline` },
//     });
//   };


//   // 날짜 계산
//   const startOfWeek = useMemo(() => {
//     const base = dayjs().startOf("week").add(1, "day");
//     return activeTab === "next" ? base.add(7, "day") : base;
//   }, [activeTab]);

//   const days = useMemo(
//     () =>
//       Array.from({ length: 7 }).map((_, i) => ({
//         label: ["월", "화", "수", "목", "금", "토", "일"][i],
//         dateText: startOfWeek.add(i, "day").format("MM/DD"),
//       })),
//     [startOfWeek]
//   );

//   // 근무시간만 또는 24시간
//   const hours = useMemo(
//     () =>
//       showWorkingHoursOnly
//         ? Array.from({ length: 9 }, (_, i) => i + 9)
//         : Array.from({ length: 24 }, (_, i) => i),
//     [showWorkingHoursOnly]
//   );

//   const schedules = groupSchedules[activeTab] || {};

//   const getColor = (value: number) => {
//     if (!value) return "#ffffff";
//     const ratio = value / headerMemberCount;
//     return `rgba(79,70,229,${ratio * 0.9 + 0.1})`;
//   };

//   return (
//     <section className="min-h-screen bg-[#F9FAFB] py-10">
//       <div className="mx-auto w-[1200px] flex flex-col gap-8">
//         {/* 상단 헤더 컴포넌트 */}
//         <TimelineHeader
//           groupName={headerGroupName}
//           memberCount={headerMemberCount}
//           onClickSchedule={handleClickSchedule}
//         />

//         {/* 안내 배너 */}
//         <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 font-medium">
//           💚 현재 겹칠 수 있는 시간대 업데이트 완료했어요.
//         </div>

//         <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-6">
//           <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-8">

//             {/* 범례 */}
//             <TimelineHeatmapLegend />

//             {/* 이번주/다음주 + 근무시간 옵션 */}
//             <TimelineWeekTabs
//               activeTab={activeTab}
//               setActiveTab={setActiveTab}
//               showWorkingHoursOnly={showWorkingHoursOnly}
//               setShowWorkingHoursOnly={setShowWorkingHoursOnly}
//             />

//             {/* 히트맵 테이블 */}
//             <TimelineHeatmapTable
//               days={days}
//               hours={hours}
//               schedules={schedules}
//               getColor={getColor}
//             />
//           </div>

//           {/* 우측 패널 */}
//           <GroupSidebar
//             groupId={currentGroupId}
//             confirmedLocation={confirmedLocation}
//           />
//         </div>
//       </div>
//     </section>
//   );
// }


import { useState, useMemo, useEffect } from "react";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import { useGroupScheduleStore } from "../stores/groupScheduleStore";
import { useUserSettingStore } from "../stores/userScheduleSettingStore";
import { useAllUserScheduleStore } from "../stores/allUserScheduleStore";

import GroupSidebar from "../components/specific/group/GroupSidebar";

import TimelineHeader from "../components/specific/group/timeline/TimelineHeader";
import TimelineHeatmapLegend from "../components/specific/group/timeline/TimelineHeatmapLegend.tsx";
import TimelineWeekTabs from "../components/specific/group/timeline/TimelineWeekTabs";
import TimelineHeatmapTable from "../components/specific/group/timeline/TimelineHeatmapTable";

import { GROUPS } from "../mock";
import { useMeetingInfoStore } from "../stores/meetingInfoStore";

import type { MySchedule } from "../stores/schedule";

type WeekKey = "this" | "next";

/** 여러 멤버 스케줄 합치는 함수 (기존 그대로) */
function computeGroupSchedule(
  memberSchedules: Record<string, MySchedule>,
  memberIds: string[]
) {
  const result: { this: Record<string, number>; next: Record<string, number> } = {
    this: {},
    next: {},
  };

  for (const memberId of memberIds) {
    const schedule = memberSchedules[memberId];
    if (!schedule) continue;

    (["this", "next"] as const).forEach((week) => {
      schedule[week].forEach((cellKey) => {
        result[week][cellKey] = (result[week][cellKey] || 0) + 1;
      });
    });
  }

  return result;
}

/** m1 / user1 같은 key 꼬임 보정 */
function normalizeSchedulesToMemberIds(
  allSchedules: Record<string, MySchedule>,
  memberIds: string[]
) {
  const normalized: Record<string, MySchedule> = {};

  for (const mid of memberIds) {
    if (allSchedules[mid]) {
      normalized[mid] = allSchedules[mid];
      continue;
    }

    const m = /^m(\d+)$/.exec(mid);
    if (m) {
      const userId = `user${m[1]}`;
      if (allSchedules[userId]) {
        normalized[mid] = allSchedules[userId];
        continue;
      }
    }
  }

  return normalized;
}

export default function GroupTimelinePage() {
  const navigate = useNavigate();
  const { groupId: routeGroupId } = useParams<{ groupId: string }>();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<WeekKey>("this");

  // ✅ 전체 사용자 스케줄 + hydration 여부
  const { schedules: allSchedulesRaw, hasHydrated } = useAllUserScheduleStore();

  // 그룹 집계 스토어
  const { groupSchedules, setGroupSchedules } = useGroupScheduleStore();

  const { showWorkingHoursOnly, setShowWorkingHoursOnly } = useUserSettingStore();

  const currentGroupId = routeGroupId ?? GROUPS[0].id;
  const mockGroup = useMemo(
    () => GROUPS.find((g) => g.id === currentGroupId) ?? GROUPS[0],
    [currentGroupId]
  );

  const memberIds = mockGroup.memberIds;
  const headerGroupName = mockGroup.name;
  const headerMemberCount = memberIds.length || 1;

  const meetingInfo = useMeetingInfoStore((s) => s.getByGroupId(currentGroupId));
  const confirmedLocation = meetingInfo?.location ?? "아직 장소 미정";

  // ✅ hydration 끝나기 전엔 비어있는 {}만 쓴다
  const normalizedSchedules = useMemo(() => {
    if (!hasHydrated) return {};
    return normalizeSchedulesToMemberIds(allSchedulesRaw ?? {}, memberIds);
  }, [allSchedulesRaw, memberIds, hasHydrated]);

  // ✅ hydration 후에만 집계
  useEffect(() => {
    if (!hasHydrated) return;

    const result = computeGroupSchedule(normalizedSchedules, memberIds);
    setGroupSchedules(result);

    console.log("[Timeline] hydrated =", hasHydrated);
    console.log("[Timeline] memberIds =", memberIds);
    console.log("[Timeline] normalized keys =", Object.keys(normalizedSchedules));
    console.log(
      "[Timeline] aggregated(this) size =",
      Object.keys(result.this).length
    );
  }, [normalizedSchedules, memberIds, setGroupSchedules, hasHydrated]);

  // 스케줄 입력 페이지 이동
  const currentMemberId =
    (user as any)?.memberId ?? (user as any)?.id ?? memberIds[0] ?? null;

  const handleClickSchedule = () => {
    if (!currentMemberId) return navigate("/login");
    navigate(`/groups/${currentGroupId}/schedule/${currentMemberId}`, {
      state: { from: `/groups/${currentGroupId}/timeline` },
    });
  };

  // 날짜/시간 계산 (기존 그대로)
  const startOfWeek = useMemo(() => {
    const base = dayjs().startOf("week").add(1, "day");
    return activeTab === "next" ? base.add(7, "day") : base;
  }, [activeTab]);

  const days = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, i) => ({
        label: ["월", "화", "수", "목", "금", "토", "일"][i],
        dateText: startOfWeek.add(i, "day").format("MM/DD"),
        dayIndex: i,
      })),
    [startOfWeek]
  );

  const hours = useMemo(
    () =>
      showWorkingHoursOnly
        ? Array.from({ length: 9 }, (_, i) => i + 9)
        : Array.from({ length: 24 }, (_, i) => i),
    [showWorkingHoursOnly]
  );

  const schedules = groupSchedules[activeTab] || {};

  // 🔵 겹칠수록 진하게
  const getColor = (value: number) => {
    if (!value) return "#ffffff";
    const ratio = Math.min(1, Math.max(0, value / headerMemberCount));
    const alpha = 0.12 + ratio * 0.88;
    return `rgba(79,70,229,${alpha})`;
  };

  return (
    <section className="min-h-screen bg-[#F9FAFB] py-10">
      <div className="mx-auto w-[1200px] flex flex-col gap-8">
        <TimelineHeader
          groupName={headerGroupName}
          memberCount={headerMemberCount}
          onClickSchedule={handleClickSchedule}
        />

        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 font-medium">
          💚 현재 겹칠 수 있는 시간대 업데이트 완료했어요.
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-6">
          <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-8">
            <TimelineHeatmapLegend />

            <TimelineWeekTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              showWorkingHoursOnly={showWorkingHoursOnly}
              setShowWorkingHoursOnly={setShowWorkingHoursOnly}
            />

            {/* hasHydrated 되기 전에는 빈 히트맵만 보여줌 */}
            <TimelineHeatmapTable
              days={days}
              hours={hours}
              schedules={schedules}
              getColor={getColor}
            />
          </div>

          <GroupSidebar
            groupId={currentGroupId}
            confirmedLocation={confirmedLocation}
            memberCount={headerMemberCount}
            activeWeek={activeTab}
          />
        </div>
      </div>
    </section>
  );
}