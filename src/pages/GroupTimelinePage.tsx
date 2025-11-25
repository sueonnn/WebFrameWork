import { useState, useMemo, useEffect } from "react";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";

import { useUserSettingStore } from "../stores/userScheduleSettingStore";
import { useAllUserScheduleStore } from "../stores/allUserScheduleStore";
import { useAuth } from "../contexts/AuthContext";
import { computeGroupSchedule } from "../stores/services/groupScheduleService";
import { useMeetingInfoStore } from "../stores/meetingInfoStore";

import GroupSidebar from "../components/specific/group/GroupSidebar";

// 분리 컴포넌트
import TimelineHeader from "../components/specific/group/timeline/TimelineHeader";
import TimelineHeatmapLegend from "../components/specific/group/timeline/TimelineHeatmapLegend.tsx";
import TimelineWeekTabs from "../components/specific/group/timeline/TimelineWeekTabs";
import TimelineHeatmapTable from "../components/specific/group/timeline/TimelineHeatmapTable";

import { GROUPS } from "../mock";

type WeekKey = "this" | "next";

type MergedSchedule = {
  this: Record<string, number>;
  next: Record<string, number>;
};

export default function GroupTimelinePage() {
  const navigate = useNavigate();
  const { groupId: routeGroupId } = useParams<{ groupId: string }>();

  const { user } = useAuth();
  const currentUserId = user?.id;

  if (!currentUserId) {
    return <div>로그인 정보를 불러오는 중...</div>;
  }

  const [activeTab, setActiveTab] = useState<WeekKey>("this");

  const [mergedSchedule, setMergedSchedule] = useState<MergedSchedule>({
    this: {},
    next: {},
  });

  // 1) 현재 그룹 (URL 없으면 첫 그룹)
  const group = GROUPS.find((g) => g.id === routeGroupId) ?? GROUPS[0];
  const headerGroupName = group.name;
  const headerMemberCount = group.memberIds.length;

  // 2) 미팅 정보 → 확정 장소
  const meetingInfo = useMeetingInfoStore((s) => s.getByGroupId(group.id));
  const confirmedLocation = meetingInfo?.location ?? "아직 장소 미정";

  // 3) 유저 설정 (근무시간만 보기)
  const { showWorkingHoursOnly, setShowWorkingHoursOnly } =
    useUserSettingStore();

  // ✅ 4) "이 그룹"의 memberId -> MySchedule 만 꺼내기 (1중 맵)
  const groupSchedules = useAllUserScheduleStore(
    (s) => s.schedules[group.id] ?? {}
  );
  // 타입: Record<string, MySchedule>

  // ✅ 5) 그룹 히트맵 합산
  useEffect(() => {
    const merged = computeGroupSchedule(groupSchedules, group.memberIds);
    setMergedSchedule(merged);
  }, [groupSchedules, group.memberIds]);

  // 6) 이번주/다음주 기준 날짜
  const startOfWeek = useMemo(() => {
    const base = dayjs().startOf("week").add(1, "day"); // 월요일
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

  // 7) 시간대
  const hours = useMemo(
    () =>
      showWorkingHoursOnly
        ? Array.from({ length: 9 }, (_, i) => i + 9) // 9~17시
        : Array.from({ length: 24 }, (_, i) => i),
    [showWorkingHoursOnly]
  );

  const schedules = mergedSchedule[activeTab] || {};

  const getColor = (value: number) => {
    if (!value) return "#ffffff";
    const ratio = value / headerMemberCount;
    return `rgba(79,70,229,${ratio * 0.9 + 0.1})`;
  };

  return (
    <section className="min-h-screen bg-[#F9FAFB] py-10">
      <div className="mx-auto w-[1200px] flex flex-col gap-8">
        <TimelineHeader
          groupName={headerGroupName}
          memberCount={headerMemberCount}
          onClickSchedule={() =>
            navigate(`/groups/${group.id}/schedule/${currentUserId}`)
          }
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

            <TimelineHeatmapTable
              days={days}
              hours={hours}
              schedules={schedules}
              getColor={getColor}
            />
          </div>

          <GroupSidebar
            groupId={group.id}
            merged={mergedSchedule}
            memberCount={headerMemberCount}
            confirmedLocation={confirmedLocation}
          />
        </div>
      </div>
    </section>
  );
}
