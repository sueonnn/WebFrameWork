import { useState, useMemo, useEffect } from "react";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import { useGroupScheduleStore } from "../stores/groupScheduleStore";
import { useUserSettingStore } from "../stores/userScheduleSettingStore";
import { useAllUserScheduleStore } from "../stores/allUserScheduleStore";

import { computeGroupSchedule } from "../stores/services/groupScheduleService";
import GroupSidebar from "../components/specific/group/GroupSidebar";

// 분리한 컴포넌트
import TimelineHeader from "../components/specific/group/timeline/TimelineHeader";
import TimelineHeatmapLegend from "../components/specific/group/timeline/TimelineHeatmapLegend.tsx";
import TimelineWeekTabs from "../components/specific/group/timeline/TimelineWeekTabs";
import TimelineHeatmapTable from "../components/specific/group/timeline/TimelineHeatmapTable";

import { GROUPS } from "../mock"; 
import { useMeetingInfoStore } from "../stores/meetingInfoStore";

export default function GroupTimelinePage() {
  const navigate = useNavigate();
  const { groupId: routeGroupId } = useParams<{ groupId: string }>();

  // 로그인 유저 확인 
  const { user } = useAuth();
  const currentUserId = user?.id;
  if (!currentUserId) {
    return <div>로그인 정보를 불러오는 중...</div>;
  }

  const [activeTab, setActiveTab] = useState<"this" | "next">("this");

  // 전체 사용자 스케줄
  const allSchedules = useAllUserScheduleStore((s) => s.schedules);


  // 그룹 정보 + 스케줄 setter
  const { memberIds, groupName, memberCount, groupSchedules, setGroupSchedules } =
    useGroupScheduleStore();


  // Mock 데이터로 기본 그룹 정보 세팅
  // 일단 예시로 첫 번째 그룹(g1)을 기준으로 사용
  const mockGroup = GROUPS[0];
  const currentGroupId = routeGroupId ?? mockGroup.id;
  const fallbackGroup =
    GROUPS.find((g) => g.id === currentGroupId) ?? mockGroup;
  const isDefaultGroupName = !groupName || groupName === "우리 팀";
  const headerGroupName = isDefaultGroupName ? mockGroup.name : groupName;
  const headerMemberCount =
    memberCount || fallbackGroup.memberIds.length || 1; // 0 나눗셈 방지용 1

  const meetingInfo = useMeetingInfoStore((s) =>
    s.getByGroupId(currentGroupId)
  );
  const confirmedLocation = meetingInfo?.location ?? "아직 장소 미정";

  console.log("Timeline header group:", headerGroupName, headerMemberCount);

  // 사용자 설정
  const { showWorkingHoursOnly, setShowWorkingHoursOnly } = useUserSettingStore();

  // 그룹 스케줄 자동 계산
  useEffect(() => {
    const result = computeGroupSchedule(allSchedules, memberIds);
    setGroupSchedules(result);
  }, [allSchedules, memberIds]);

  // 날짜 계산
  useEffect(() => {
    // computeGroupSchedule 시그니처가 (allSchedules, memberIds) 기준이라고 가정
    const result = computeGroupSchedule(allSchedules, memberIds);
    setGroupSchedules(result);
  }, [allSchedules, memberIds, setGroupSchedules]);

   // 날짜 계산
  const startOfWeek = useMemo(() => {
    const base = dayjs().startOf("week").add(1, "day");
    return activeTab === "next" ? base.add(7, "day") : base;
  }, [activeTab]);

  const days = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, i) => ({
        label: ["월", "화", "수", "목", "금", "토", "일"][i],
        dateText: startOfWeek.add(i, "day").format("MM/DD"),
      })),
    [startOfWeek]
  );

  // 근무시간만 또는 24시간
  const hours = useMemo(
    () =>
      showWorkingHoursOnly
        ? Array.from({ length: 9 }, (_, i) => i + 9)
        : Array.from({ length: 24 }, (_, i) => i),
    [showWorkingHoursOnly]
  );

  const schedules = groupSchedules[activeTab] || {};

  const getColor = (value: number) => {
    if (!value) return "#ffffff";
    const ratio = value / headerMemberCount;
    return `rgba(79,70,229,${ratio * 0.9 + 0.1})`;
  };

  return (
    <section className="min-h-screen bg-[#F9FAFB] py-10">
      <div className="mx-auto w-[1200px] flex flex-col gap-8">
        {/* 상단 헤더 컴포넌트 */}
        <TimelineHeader
          groupName={headerGroupName}
          memberCount={headerMemberCount}
          onClickSchedule={() =>
            navigate(`/groups/${currentGroupId}/schedule/${currentUserId}`)
          }
        />

        {/* 안내 배너 */}
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 font-medium">
          💚 현재 겹칠 수 있는 시간대 업데이트 완료했어요.
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-6">
          <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-8">

            {/* 범례 */}
            <TimelineHeatmapLegend />

            {/* 이번주/다음주 + 근무시간 옵션 */}
            <TimelineWeekTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              showWorkingHoursOnly={showWorkingHoursOnly}
              setShowWorkingHoursOnly={setShowWorkingHoursOnly}
            />

            {/* 히트맵 테이블 */}
            <TimelineHeatmapTable
              days={days}
              hours={hours}
              schedules={schedules}
              getColor={getColor}
            />
          </div>

          {/* 우측 패널 */}
          <GroupSidebar
            groupId={currentGroupId}
            confirmedLocation={confirmedLocation}
          />
        </div>
      </div>
    </section>
  );
}
