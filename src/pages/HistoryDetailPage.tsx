import React, { useState } from "react";
import UserMiniIcon from "../components/icons/UserMiniIcon";
import TrashIcon from "../components/icons/TrashIcon";

import { MeetingInfo } from "../types/MeetingInfo";
import { Task } from "../types/Task";

import { dummyMeetings } from "../types/dummyMeetings";
import { dummyTasksByMeeting } from "../types/dummyTasksByMeeting";

const HistoryDetailPage: React.FC<{ meetingId?: string }> = ({ meetingId = "m1" }) => {
  // ----------------------------
  // 🔥 meeting 데이터 불러오기
  // ----------------------------
  const meeting = dummyMeetings.find((m) => m.id === meetingId);

  const safeMeeting: MeetingInfo =
    meeting ??
    ({
      id: "default-meeting",
      title: "알 수 없는 모임",
      date: "",
      time: "",
      location: "",
      participants: [],
    } as MeetingInfo);

  const participants = safeMeeting.participants;

  // ----------------------------
  // 🔥 tasks 데이터 불러오기
  // ----------------------------
  const initialTasks: Task[] = dummyTasksByMeeting[meetingId] ?? [];

  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleCheck = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const changePerson = (taskId: string, newPerson: string | null) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, assignee: newPerson } : t
      )
    );
    setOpenDropdown(null);
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const doneCount = tasks.filter((t) => t.done).length;
  const totalCount = tasks.length;
  const percent = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#F7F7FB] flex justify-center py-12">
      <div className="w-full max-w-7xl px-6 space-y-10">

        {/* Header */}
        <header className="space-y-4">
          <button
            onClick={() => window.history.back()}
            className="
              inline-flex items-center gap-2
              px-5 py-2 rounded-full
              bg-[#F4F4F7]
              text-[#5A60FF] font-semibold
              shadow-sm hover:shadow transition
            "
          >
            <span className="text-lg">←</span> 히스토리로
          </button>

          <h1 className="text-3xl font-bold text-gray-900">{safeMeeting.title}</h1>

          <p className="text-sm text-gray-500">
            {safeMeeting.date} · {participants.length}명 참석
          </p>
        </header>

        {/* 모임 정보 카드 */}
        <section className="bg-white rounded-2xl border border-[#BFD8FF] p-8 shadow-sm">
          <div className="flex items-start gap-6">

            <div className="w-14 h-14 bg-[#EEF2FF] rounded-2xl flex items-center justify-center text-3xl text-[#6D75FF]">
              📅
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{safeMeeting.title}</h2>

                <span className="px-4 py-1.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  {percent}% 완료
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-700">
                <div>📆 {safeMeeting.time}</div>
                <div>📍 {safeMeeting.location}</div>
                <div>👥 {participants.length}명 참석</div>
              </div>
            </div>
          </div>
        </section>

        {/* 2컬럼 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT */}
          <div className="col-span-2 space-y-10">

            {/* 체크리스트 */}
            <section className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">준비 체크리스트</h3>
                <span className="text-sm text-gray-500">
                  {doneCount}/{totalCount} 완료
                </span>
              </div>

              {/* 진행률 */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>진행률</span>
                  <span>{percent}%</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#6D75FF] to-[#9D8EFF]"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* checklist items */}
              <div className="space-y-3">
                {tasks.map((item) => (
                  <div
                    key={item.id}
                    className={`px-5 py-3 rounded-xl flex justify-between items-center border
                      ${item.done ? "bg-[#E7F8EC] border-[#C7EED2]" : "bg-white border-gray-200"}`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        className="mt-1 w-4 h-4"
                        checked={item.done}
                        onChange={() => toggleCheck(item.id)}
                      />
                      <div>
                        <p className="font-medium text-sm text-gray-900">{item.title}</p>
                        <p className="text-xs text-gray-500">
                          {item.addedBy}가 추가 · {item.date}
                        </p>
                      </div>
                    </div>

                    <div className="relative flex items-center gap-2">
                      <button
                        onClick={() =>
                          setOpenDropdown(openDropdown === item.id ? null : item.id)
                        }
                        className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-indigo-100 text-[#4E46E5]"
                      >
                        <UserMiniIcon />
                        {item.assignee ?? "담당없음"}
                        <span className="text-[10px]">▼</span>
                      </button>

                      {openDropdown === item.id && (
                        <div className="absolute right-0 mt-2 w-28 bg-white border rounded-lg shadow-lg z-20 text-sm">
                          {participants.map((p) => (
                            <button
                              key={p}
                              onClick={() => changePerson(item.id, p)}
                              className="w-full text-left px-3 py-1.5 hover:bg-indigo-50"
                            >
                              {p}
                            </button>
                          ))}
                          <button
                            onClick={() => changePerson(item.id, null)}
                            className="w-full px-3 py-1.5 text-left text-gray-500 hover:bg-indigo-50 border-t border-gray-100"
                          >
                            담당없음
                          </button>
                        </div>
                      )}

                      <button
                        onClick={() => deleteTask(item.id)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 모임 메모 */}
            <section className="bg-white rounded-2xl border border-gray-200 p-7 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">모임 메모</h3>
              <div className="bg-[#FFF9D9] border border-[#F3E7A0] text-sm p-4 rounded-xl leading-relaxed">
                정말 유익한 시간이었어요! 다음에도 이런 모임 자주 가져요.
              </div>
            </section>

            <button className="px-6 py-3 bg-[#6D75FF] hover:bg-[#5a60ff] text-white rounded-xl shadow-md font-medium">
              체크리스트 바로가기
            </button>
          </div>

          {/* RIGHT */}
          <div className="space-y-8">

            {/* 참석자 */}
            <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                참석자 ({participants.length})
              </h3>

              <div className="space-y-3">
                {participants.map((m) => (
                  <div key={m} className="bg-gray-50 px-4 py-2 rounded-xl flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold text-xs">
                      {m[0]}
                    </div>
                    <p className="text-sm text-gray-800">{m}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 담당자별 할 일 */}
            <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">담당자별 할 일</h3>

              <div className="space-y-3 text-sm">
                {participants.map((p) => {
                  const assigned = tasks.filter((t) => t.assignee === p);
                  const done = assigned.filter((t) => t.done).length;

                  if (assigned.length === 0) return null;

                  return (
                    <div key={p} className="bg-gray-50 px-4 py-2 rounded-xl flex justify-between">
                      <span>{p}</span>
                      <span className="text-xs text-gray-500">
                        {done}/{assigned.length}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 모임 통계 */}
            <section className="bg-[#E9FDEF] border border-[#C6ECCF] rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">모임통계</h3>

              <div className="text-sm space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>완료된 할 일</span>
                  <span>{doneCount}개</span>
                </div>

                <div className="flex justify-between">
                  <span>전체 할 일</span>
                  <span>{totalCount}개</span>
                </div>

                <div className="flex justify-between text-green-600 font-semibold mt-2">
                  <span>완료율</span>
                  <span>{percent}%</span>
                </div>
              </div>
            </section>

          </div>
        </div>

      </div>
    </div>
  );
};

export default HistoryDetailPage;
