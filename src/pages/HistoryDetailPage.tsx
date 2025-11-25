import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MEETING_INFOS, TASKS_BY_MEETING } from "../mock";
import { useTaskStore } from "../stores/checklist/useTaskStore";
import { Task } from "../types/Task";

import HistoryHeader from "../components/specific/group/history/HistoryHeader";
import HistoryMeetingCard from "../components/specific/group/history/HistoryMeetingCard";
import HistoryChecklist from "../components/specific/group/history/HistoryChecklist";
import HistoryMemo from "../components/specific/group/history/HistoryMemo";
import HistoryParticipants from "../components/specific/group/history/HistoryParticipants";
import HistoryTaskByPerson from "../components/specific/group/history/HistoryTaskByPerson";
import HistoryStats from "../components/specific/group/history/HistoryStats";

const HistoryDetailPage: React.FC = () => {
  const { meetingId } = useParams<{ meetingId?: string }>();
  const navigate = useNavigate();

  if (!meetingId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        잘못된 접근입니다. (meetingId 없음)
      </div>
    );
  }

  const meeting = MEETING_INFOS.find((m) => m.id === meetingId);

<<<<<<< HEAD
  if (!meeting) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        존재하지 않는 모임입니다.
      </div>
    );
  }

  const participants = meeting.participants;
=======
  const safeMeeting: MeetingInfo =
    meeting ?? {
      id: "default-meeting",
      groupId : "m1",
      title: "알 수 없는 모임",
      date: "",
      time: "",
      location: "",
      participants: [],
    };


  const participants = safeMeeting.participants;
>>>>>>> 24e5f22d5a5486299272f347a15ca3cb7eea715b

  // Zustand Store
  const { tasksByMeeting, setTasks } = useTaskStore();

  useEffect(() => {
    if (!tasksByMeeting[meetingId]) {
      setTasks(meetingId, TASKS_BY_MEETING[meetingId] ?? []);
    }
  }, [meetingId, tasksByMeeting]);

  const tasks: Task[] = tasksByMeeting[meetingId] ?? [];

  const doneCount = tasks.filter((t) => t.done).length;
  const totalCount = tasks.length;
  const percent = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#F7F7FB] flex justify-center py-12">
      <div className="w-full max-w-7xl px-6 space-y-10">
        <HistoryHeader
          title={meeting.title}
          date={meeting.date}
          participantCount={participants.length}
        />

        <HistoryMeetingCard meeting={meeting} percent={percent} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT */}
          <div className="col-span-2 space-y-10">
            <HistoryChecklist
              tasks={tasks}
              setTasks={(updateFn) => {
                const nextTasks =
                  typeof updateFn === "function"
                    ? updateFn(tasks)
                    : updateFn;

                setTasks(meetingId, nextTasks);
              }}
              participants={participants}
            />

            {/*<HistoryMemo />*/}

            <button
              onClick={() =>navigate(`/groups/checklist/${meetingId}`)}
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
