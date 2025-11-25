import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Task } from "../types/Task";
import { MEETING_INFOS, TASKS_BY_MEETING, CURRENT_USER } from "../mock";
import type { MeetingInfo } from "../types/MeetingInfo";
import { useMeetingInfoStore } from "../stores/meetingInfoStore";
import { useAuth } from "../contexts/AuthContext";
import { useTaskStore } from "../stores/checklist/useTaskStore";


// 분리한 컴포넌트들
import ChecklistHeader from "../components/specific/checklist/ChecklistHeader";
import ChecklistMeetingCard from "../components/specific/checklist/ChecklistMeetingCard";
import ChecklistAddTask from "../components/specific/checklist/ChecklistAddTask";
import ChecklistItems from "../components/specific/checklist/ChecklistItems";
import ChecklistParticipants from "../components/specific/checklist/ChecklistParticipants";
import ChecklistStatsByMember from "../components/specific/checklist/ChecklistStatsByMember";
import ChecklistFinalCTA from "../components/specific/checklist/ChecklistFinalCTA";

const CheckListPage: React.FC = () => {
  const { meetingId } = useParams<{ meetingId?: string }>();

  const targetId = meetingId ?? "m1"; // 없으면 기본값 m1

  const meetingFromStore = useMeetingInfoStore((s) =>
    s.getByMeetingId(targetId)
  );

  const meeting: MeetingInfo | undefined =
    meetingFromStore ?? MEETING_INFOS.find((m) => m.id === targetId);

  if (!meeting) return <div>Meeting not found</div>;

  const members = meeting.participants;
  const {
    tasksByMeeting,
    addTask: storeAddTask,
    updateTask: storeUpdateTask,
    deleteTask: storeDeleteTask,
    setTasks: storeSetTasks,
  } = useTaskStore();

  const tasks = tasksByMeeting[targetId] ?? [];

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [newTaskText, setNewTaskText] = useState("");

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.done).length;
  const progress = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

  const { user } = useAuth();

  // 체크박스 토글
  const toggleTaskDone = (id: string) => {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  storeUpdateTask(targetId, id, { done: !task.done });
};

  const changeAssignee = (id: string, name: string | null) => {
  storeUpdateTask(targetId, id, { assignee: name });
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

    const addedBy = user?.name ?? "나";

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      addedBy,
      date: meeting.date,
      done: false,
      assignee,
    };

    storeAddTask(targetId, newTask);

    setNewTaskText("");
  };

  const deleteTask = (id: string) => {
    storeDeleteTask(targetId, id);

  };

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
            <ChecklistStatsByMember members={members} memberStats={memberStats} />
            <ChecklistFinalCTA meetingId={targetId} />

          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckListPage;
