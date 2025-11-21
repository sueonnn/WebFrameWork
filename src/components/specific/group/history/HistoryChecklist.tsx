import React, { useState } from "react";
import { Task } from "../../../../types/Task";
import UserMiniIcon from "../../../icons/UserMiniIcon";
import TrashIcon from "../../../icons/TrashIcon";

interface Props {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  participants: string[];
}

export default function HistoryChecklist({ tasks, setTasks, participants }: Props) {
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
  const percent = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">준비 체크리스트</h3>
        <span className="text-sm text-gray-500">
          {doneCount}/{tasks.length} 완료
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
              {/* 담당자 변경 버튼 */}
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
  );
}
