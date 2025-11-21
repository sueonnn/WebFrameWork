interface Props {
  members: string[];
  memberStats: Record<string, { done: number; total: number }>;
}

export default function ChecklistStatsByMember({ members, memberStats }: Props) {
  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-4 text-sm">담당자별 할 일</h3>

      <div className="space-y-3 text-sm">
        {members.map((m) => {
          const stat = memberStats[m];
          if (!stat?.total) return null;

          return (
            <div
              key={m}
              className="bg-gray-50 px-4 py-2 rounded-xl flex justify-between"
            >
              <span>{m}</span>
              <span className="text-xs text-gray-500">
                {stat.done}/{stat.total}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
