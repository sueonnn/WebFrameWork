import React, { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Task } from "../types/Task";
import { MEETING_INFOS, TASKS_BY_MEETING } from "../mock";
import type { MeetingInfo } from "../types/MeetingInfo";

import { useAuth } from "../contexts/AuthContext";
import { useTaskStore } from "../stores/checklist/useTaskStore";
import { useHistoryStore } from "../stores/checklist/useHistoryStore";
import type { Meeting } from "../types/history";

// UI Components
import ChecklistHeader from "../components/specific/checklist/ChecklistHeader";
import ChecklistMeetingCard from "../components/specific/checklist/ChecklistMeetingCard";
import ChecklistAddTask from "../components/specific/checklist/ChecklistAddTask";
import ChecklistItems from "../components/specific/checklist/ChecklistItems";
import ChecklistParticipants from "../components/specific/checklist/ChecklistParticipants";
import ChecklistStatsByMember from "../components/specific/checklist/ChecklistStatsByMember";
import ChecklistFinalCTA from "../components/specific/checklist/ChecklistFinalCTA";

const CheckListPage: React.FC = () => {
  const { meetingId } = useParams<{ meetingId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const userName = user?.name ?? "이름 없음";
  const { updateOrAddHistory } = useHistoryStore();

  if (!meetingId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        잘못된 접근입니다. (meetingId 없음)
      </div>
    );
  }

  // meeting 정보
  const meeting: MeetingInfo | undefined = MEETING_INFOS.find(
    (m) => m.id === meetingId
  );

  if (!meeting) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        존재하지 않는 모임입니다.
      </div>
    );
  }

  const members = meeting.participants;

  // Zustand Task Store
  const {
    tasksByMeeting,
    addTask: storeAddTask,
    deleteTask: storeDeleteTask,
    updateTask,
    setTasks,
  } = useTaskStore();

  // meetingId 최초 접근 시 mock에서 초기 값 로드
  useEffect(() => {
    if (!tasksByMeeting[meetingId]) {
      setTasks(meetingId, TASKS_BY_MEETING[meetingId] ?? []);
    }
  }, [meetingId, tasksByMeeting, setTasks]);

  const tasks = tasksByMeeting[meetingId] ?? [];

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [newTaskText, setNewTaskText] = useState("");

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.done).length;
  const progress =
    totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

  // 체크박스 토글
  const toggleTaskDone = (id: string) => {
    updateTask(meetingId, id, {
      done: !tasks.find((t) => t.id === id)?.done,
    });
  };

  // 담당자 변경
  const changeAssignee = (id: string, name: string | null) => {
    updateTask(meetingId, id, { assignee: name });
  };

  // 신규 할 일 추가
  const addTask = () => {
    if (!newTaskText.trim()) return;

    let assignee: string | null = null;
    const atIndex = newTaskText.indexOf("@");
    let title = newTaskText;

    if (atIndex !== -1) {
      const name = newTaskText.substring(atIndex + 1).trim();
      if (members.includes(name)) {
        assignee = name;
        title = newTaskText.substring(0, atIndex).trim();
      }
    }

    const today = new Date();
    const formattedToday = `${today.getFullYear()}년 ${
      today.getMonth() + 1
    }월 ${today.getDate()}일`;

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      addedBy: userName,
      date: formattedToday,
      done: false,
      assignee,
    };

    storeAddTask(meetingId, newTask);
    setNewTaskText("");
  };

  // 삭제
  const deleteTask = (id: string) => {
    storeDeleteTask(meetingId, id);
  };

  // 멤버별 통계
  const memberStats = useMemo(() => {
    const stats: Record<string, { done: number; total: number }> = {};

    members.forEach((m) => {
      stats[m] = { done: 0, total: 0 };
    });

    tasks.forEach((t) => {
      if (!t.assignee) return;
      stats[t.assignee].total += 1;
      if (t.done) stats[t.assignee].done += 1;
    });

    return stats;
  }, [tasks, members]);

  // 히스토리 저장
  const handleSaveHistory = () => {
    const progressStr = `${progress}% 완료`;

    const today = new Date();
    const formatted = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${
      today.getDate()
    }일`;

    const dataToSave: Meeting = {
      id: meeting.id,
      groupId: meeting.groupId,
      title: meeting.title,
      date: formatted,
      time: meeting.time,
      location: meeting.location,
      participants: `${members.length}명 참석`,
      status: progressStr,
      statusClasses:
        progress === 100
          ? "bg-green-100 text-green-700"
          : progress >= 70
          ? "bg-blue-100 text-blue-700"
          : "bg-yellow-100 text-yellow-800",
    };

    updateOrAddHistory(dataToSave);
    navigate("/history");
  };

  return (
    <div className="min-h-screen bg-[#F7F7FB] flex justify-center py-12">
      <div className="w-full max-w-7xl px-4">
        <ChecklistHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT */}
          <div className="col-span-2 flex flex-col gap-8">
            <ChecklistMeetingCard meeting={meeting} members={members} />

            <ChecklistAddTask
              newTaskText={newTaskText}
              setNewTaskText={setNewTaskText}
              addTask={addTask}
              userName={userName}
            />

            <ChecklistItems
              tasks={tasks}
              doneTasks={doneTasks}
              totalTasks={totalTasks}
              progress={progress}
              toggleTaskDone={toggleTaskDone}
              openDropdownId={openDropdownId}
              setOpenDropdownId={setOpenDropdownId}
              members={members}
              changeAssignee={changeAssignee}
              deleteTask={deleteTask}
            />
          </div>

          {/* RIGHT */}
          <div className="col-span-1 flex flex-col gap-8 self-start">
            <ChecklistParticipants members={members} />
            <ChecklistStatsByMember
              members={members}
              memberStats={memberStats}
            />
            <ChecklistFinalCTA onSave={handleSaveHistory} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckListPage;
