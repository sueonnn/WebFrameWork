import React from "react";
import UserMiniIcon from "../../icons/UserMiniIcon";
import TrashIcon from "../../icons/TrashIcon";

import { Task } from "../../../types/Task";

interface Props {
  tasks: Task[];
  doneTasks: number;
  totalTasks: number;
  progress: number;

  toggleTaskDone: (id: string) => void;

  openDropdownId: string | null;
  setOpenDropdownId: React.Dispatch<React.SetStateAction<string | null>>;

  members: string[];
  changeAssignee: (id: string, name: string | null) => void;
  deleteTask: (id: string) => void;
}

export default function ChecklistItems({
  tasks,
  doneTasks,
  totalTasks,
  progress,
  toggleTaskDone,
  openDropdownId,
  setOpenDropdownId,
  members,
  changeAssignee,
  deleteTask,
}: Props) {
  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex justify-between mb-4">
        <h3 className="font-semibold text-base">준비 체크리스트</h3>
        <span className="text-xs text-gray-500">
          {doneTasks}/{totalTasks} 완료
        </span>
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
          const rowBase = "flex justify-between rounded-xl px-4 py-3 border";
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
  );
}
