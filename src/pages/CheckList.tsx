import React, { useMemo, useState } from "react";
import { Task } from "../types/Task";
import { dummyMeetings } from "../types/dummyMeetings";
import { dummyTasksByMeeting } from "../types/dummyTasksByMeeting";

// 분리한 컴포넌트들
import ChecklistHeader from "../components/specific/checklist/ChecklistHeader";
import ChecklistMeetingCard from "../components/specific/checklist/ChecklistMeetingCard";
import ChecklistAddTask from "../components/specific/checklist/ChecklistAddTask";
import ChecklistItems from "../components/specific/checklist/ChecklistItems";
import ChecklistParticipants from "../components/specific/checklist/ChecklistParticipants";
import ChecklistStatsByMember from "../components/specific/checklist/ChecklistStatsByMember";
import ChecklistFinalCTA from "../components/specific/checklist/ChecklistFinalCTA";

const CheckListPage: React.FC<{ meetingId?: string }> = ({ meetingId = "m1" }) => {
  const meeting = dummyMeetings.find((m) => m.id === meetingId);
  if (!meeting) return <div>Meeting not found</div>;

  const members = meeting.participants;
  const initialTasks = dummyTasksByMeeting[meetingId] ?? [];

  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [newTaskText, setNewTaskText] = useState("");

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.done).length;
  const progress = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

  // 체크박스 토글
  const toggleTaskDone = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const changeAssignee = (id: string, name: string | null) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, assignee: name } : t))
    );
  };

  // ⭐ 신규 할 일 추가
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

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      addedBy: "나",
      date: meeting.date,
      done: false,
      assignee,
    };

    setTasks((prev) => [...prev, newTask]);
    setNewTaskText("");
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
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
            <ChecklistFinalCTA />
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckListPage;
