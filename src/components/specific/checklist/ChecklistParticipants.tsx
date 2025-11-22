interface Props {
  members: string[];
}

export default function ChecklistParticipants({ members }: Props) {
  return (
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
  );
}
