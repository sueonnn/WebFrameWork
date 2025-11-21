export default function HistoryParticipants({ participants }: { participants: string[] }) {
  return (
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
  );
}
