import React, { useMemo, useState } from "react";
import UserMiniIcon from "../components/icons/UserMiniIcon";
import TrashIcon from "../components/icons/TrashIcon";

import { dummyMeetings } from "../types/dummyMeetings";
import { dummyTasksByMeeting } from "../types/dummyTasksByMeeting";
import { Task } from "../types/Task";

const CheckListPage: React.FC<{ meetingId?: string }> = ({ meetingId = "m1" }) => {
  //  meeting 데이터 불러오기
  const meeting = dummyMeetings.find((m) => m.id === meetingId);

  if (!meeting) return <div>Meeting not found</div>;

  //  participants (기존 members 대신)
  const members = meeting.participants;

  //  tasks 불러오기
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
      id: Date.now().toString(), // string id
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

  // 담당자별 통계
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

        {/* HEADER */}
        <header className="space-y-3 mb-10">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full 
                       bg-[#F4F4F7] text-[#5A60FF] font-semibold shadow-sm hover:shadow transition"
          >
            <span className="text-lg">←</span> 돌아가기
          </button>

          <h1 className="text-3xl font-bold text-gray-900">모임 준비 체크리스트</h1>
          <p className="text-sm text-gray-500">실행력을 높이는 할 일 관리</p>
        </header>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT */}
          <div className="col-span-2 flex flex-col gap-8">

            {/* 모임 확정 카드 */}
            <section className="bg-[#E7F8EC] rounded-2xl border border-[#C6E8CE] p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-white text-green-500 text-2xl flex items-center justify-center">
                  ✓
                </div>
                <div>
                  <h2 className="text-lg font-semibold">모임 확정!</h2>
                  <p className="text-sm text-gray-600 mt-1">이제 준비할 일들을 정리해보세요.</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 mt-6 text-sm">
                <div className="flex items-center gap-2">📅 {meeting.time}</div>
                <div className="flex items-center gap-2">📍 {meeting.location}</div>
                <div className="flex items-center gap-2">👥 {members.length}명 참석</div>
              </div>
            </section>

            {/* ⭐ 새 할 일 추가 */}
            <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-base font-semibold mb-1">새 할일 추가</h2>
              <p className="text-xs text-gray-500 mb-4">할 일을 입력하고 @로 담당자를 지정하세요.</p>

              <div className="w-full h-11 rounded-xl border border-gray-300 px-3 flex items-center justify-between bg-white">
                <input
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder="예: 회의실 예약하기 @김철수"
                  className="w-full bg-transparent text-sm outline-none"
                />
                <button
                  onClick={addTask}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#6D74FF] text-white text-xl"
                >
                  +
                </button>
              </div>

              <p className="text-[11px] text-gray-400 mt-3">
                ※ 기록을 입력하면 멤버별 선택할 수 있어요.
              </p>
            </section>

            {/* 체크리스트 */}
            <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex justify-between mb-4">
                <h3 className="font-semibold text-base">준비 체크리스트</h3>
                <span className="text-xs text-gray-500">{doneTasks}/{totalTasks} 완료</span>
              </div>

              {/* 진행률 */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>진행률</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#656BFF] to-[#9D8EFF]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* 항목 */}
              <div className="space-y-3">
                {tasks.map((task) => {
                  const rowBase =
                    "flex justify-between rounded-xl px-4 py-3 border";
                  const rowClass = task.done
                    ? `${rowBase} bg-[#F0FFF4] border-[#CAEED2]`
                    : `${rowBase} bg-white border-gray-100`;

                  return (
                    <div key={task.id} className={rowClass}>

                      {/* 왼쪽 */}
                      <div className="flex gap-3">
                        <input
                          type="checkbox"
                          checked={task.done}
                          onChange={() => toggleTaskDone(task.id)}
                          className="mt-1 w-4 h-4"
                        />
                        <div>
                          <p className="font-medium text-sm">{task.title}</p>
                          <p className="text-xs text-gray-500">
                            {task.addedBy}가 추가 · {task.date}
                          </p>
                        </div>
                      </div>

                      {/* 오른쪽 */}
                      <div className="flex items-center gap-2 relative">

                        {/* 담당자 버튼 */}
                        <button
                          type="button"
                          onClick={() =>
                            setOpenDropdownId(
                              openDropdownId === task.id ? null : task.id
                            )
                          }
                          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-indigo-100 text-[#4E46E5]"
                        >
                          <UserMiniIcon />
                          <span>{task.assignee ?? "담당없음"}</span>
                          <span className="text-[10px]">▼</span>
                        </button>

                        {/* 드롭다운 */}
                        {openDropdownId === task.id && (
                          <div className="absolute right-0 top-9 w-28 bg-white border border-gray-200 rounded-lg shadow-lg text-xs z-20">
                            {members.map((name) => (
                              <button
                                key={name}
                                type="button"
                                onClick={() => {
                                  changeAssignee(task.id, name);
                                  setOpenDropdownId(null);
                                }}
                                className="w-full px-3 py-1.5 text-left hover:bg-indigo-50"
                              >
                                {name}
                              </button>
                            ))}
                            <button
                              type="button"
                              onClick={() => {
                                changeAssignee(task.id, null);
                                setOpenDropdownId(null);
                              }}
                              className="w-full px-3 py-1.5 text-left text-gray-500 hover:bg-indigo-50 border-t border-gray-100"
                            >
                              담당없음
                            </button>
                          </div>
                        )}

                        {/* 삭제 버튼 */}
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-1 rounded hover:bg-gray-100"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* RIGHT */}
          <div className="col-span-1 flex flex-col gap-8 self-start">

            {/* 참석자 */}
            <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4 text-sm">
                참석자 ({members.length})
              </h3>

              <div className="space-y-3">
                {members.map((m) => (
                  <div key={m} className="bg-gray-50 px-4 py-2 rounded-xl flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold text-xs">
                      {m[0]}
                    </div>
                    <p className="text-sm">{m}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 담당자별 할 일 */}
            <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4 text-sm">담당자별 할 일</h3>

              <div className="space-y-3 text-sm">
                {members.map((m) => {
                  const stat = memberStats[m];
                  if (!stat.total) return null;

                  return (
                    <div key={m} className="bg-gray-50 px-4 py-2 rounded-xl flex justify-between">
                      <span>{m}</span>
                      <span className="text-xs text-gray-500">
                        {stat.done}/{stat.total}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* CTA */}
            <section className="bg-[#F2EEFF] rounded-2xl border border-[#CFC8FF] p-6 shadow-sm">
              <h3 className="text-sm font-bold text-[#4A3FE3] mb-2">모임 최종 확정</h3>
              <p className="text-xs text-gray-600 mb-4">체크리스트와 함께 모임을 히스토리에 저장하고 추억을 남겨보세요.</p>

              <button className="w-full bg-gradient-to-r from-[#6D74FF] to-[#9587FF] text-white py-2.5 rounded-xl text-sm font-semibold shadow">
                🗂 히스토리에 저장하기
              </button>

              <p className="text-[11px] text-gray-500 mt-2">저장 후 히스토리 페이지로 이동합니다.</p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckListPage;
