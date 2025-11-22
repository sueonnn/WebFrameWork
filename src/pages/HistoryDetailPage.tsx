import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MeetingInfo } from "../types/MeetingInfo";
import { Task } from "../types/Task";

import { MEETING_INFOS, TASKS_BY_MEETING } from "../mock";

// 분리한 컴포넌트들
import HistoryHeader from "../components/specific/group/history/HistoryHeader";
import HistoryMeetingCard from "../components/specific/group/history/HistoryMeetingCard";
import HistoryChecklist from "../components/specific/group/history/HistoryChecklist";
import HistoryMemo from "../components/specific/group/history/HistoryMemo";
import HistoryParticipants from "../components/specific/group/history/HistoryParticipants";
import HistoryTaskByPerson from "../components/specific/group/history/HistoryTaskByPerson";
import HistoryStats from "../components/specific/group/history/HistoryStats";

const HistoryDetailPage: React.FC= () => {
  const { meetingId } = useParams<{ meetingId?: string }>();
  const navigate = useNavigate();

  const targetId = meetingId ?? "m1";

  const meeting = MEETING_INFOS.find((m) => m.id === targetId);

  const safeMeeting: MeetingInfo =
    meeting ?? {
      id: "default-meeting",
      title: "알 수 없는 모임",
      date: "",
      time: "",
      location: "",
      participants: [],
    };

  const participants = safeMeeting.participants;

  const initialTasks: Task[] = TASKS_BY_MEETING[targetId] ?? [];
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

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
              setTasks={setTasks}
              participants={participants}
            />

            <HistoryMemo />

            <button className="px-6 py-3 bg-[#6D75FF] hover:bg-[#5a60ff] text-white rounded-xl shadow-md font-medium">
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
