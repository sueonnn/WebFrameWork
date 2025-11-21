import { Task } from "../../../../types/Task";

export default function HistoryTaskByPerson({
  tasks,
  participants,
}: {
  tasks: Task[];
  participants: string[];
}) {
  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        담당자별 할 일
      </h3>

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
  );
}
