import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { MeetingInfo } from "../types/MeetingInfo";
import { useTaskStore } from "../stores/checklist/useTaskStore";
import { useMeetingInfoStore } from "../stores/meetingInfoStore";
import { MEETING_INFOS } from "../mock";

// 분리한 컴포넌트들
import HistoryHeader from "../components/specific/group/history/HistoryHeader";
import HistoryMeetingCard from "../components/specific/group/history/HistoryMeetingCard";
import HistoryChecklist from "../components/specific/group/history/HistoryChecklist";
import HistoryParticipants from "../components/specific/group/history/HistoryParticipants";
import HistoryTaskByPerson from "../components/specific/group/history/HistoryTaskByPerson";
import HistoryStats from "../components/specific/group/history/HistoryStats";

const HistoryDetailPage: React.FC = () => {
  const { meetingId } = useParams<{ meetingId?: string }>();
  const navigate = useNavigate();

  const targetId = meetingId ?? "m1";

  // store에서 먼저 가져오기 (룰렛/장소선정에서 업데이트한 값이 여기에 있음)
  const storeMeeting = useMeetingInfoStore((s) => s.getByMeetingId(targetId));

  // mock은 fallback
  const mockMeeting = MEETING_INFOS.find((m) => m.id === targetId);

  // mock + store를 merge (store에 time/location만 있어도 덮어쓰기됨)
  const safeMeeting: MeetingInfo = {
    id: targetId,
    groupId: mockMeeting?.groupId ?? storeMeeting?.groupId ?? "g1",
    title: mockMeeting?.title ?? storeMeeting?.title ?? "알 수 없는 모임",
    date: mockMeeting?.date ?? storeMeeting?.date ?? "",
    time: storeMeeting?.time ?? mockMeeting?.time ?? "",
    location: storeMeeting?.location ?? mockMeeting?.location ?? "",
    participants: storeMeeting?.participants ?? mockMeeting?.participants ?? [],
  };


  const participants = safeMeeting.participants;

  const tasks = useTaskStore((s) => s.tasksByMeeting[targetId] ?? []);
  const storeUpdateTask = useTaskStore((s) => s.updateTask);
  const storeDeleteTask = useTaskStore((s) => s.deleteTask);

  const doneCount = tasks.filter((t) => t.done).length;
  const totalCount = tasks.length;
  const percent = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#F7F7FB] flex justify-center py-12">
      <div className="w-full max-w-7xl px-6 space-y-10">

        <HistoryHeader
          title={safeMeeting.title}
          date={safeMeeting.date}
          participantCount={participants.length}
        />

        <HistoryMeetingCard
          meeting={safeMeeting}
          percent={percent}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT */}
          <div className="col-span-2 space-y-10">
            <HistoryChecklist
              tasks={tasks}
              updateTask={storeUpdateTask}
              deleteTask={storeDeleteTask}
              participants={participants}
              meetingId={targetId}
            />

            <button
              onClick={() => navigate(`/groups/checklist/${meetingId}`)}
              className="px-6 py-3 bg-[#6D75FF] hover:bg-[#5a60ff] text-white rounded-xl shadow-md font-medium"
            >
              체크리스트 바로가기
            </button>
          </div>

          {/* RIGHT */}
          <div className="space-y-8">
            <HistoryParticipants participants={participants} />

            <HistoryTaskByPerson
              tasks={tasks}
              participants={participants}
            />

            <HistoryStats
              done={doneCount}
              total={totalCount}
              percent={percent}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default HistoryDetailPage;
