export default function HistoryStats({
  done,
  total,
  percent,
}: {
  done: number;
  total: number;
  percent: number;
}) {
  return (
    <section className="bg-[#E9FDEF] border border-[#C6ECCF] rounded-2xl p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">모임통계</h3>

      <div className="text-sm space-y-2 text-gray-700">
        <div className="flex justify-between">
          <span>완료된 할 일</span>
          <span>{done}개</span>
        </div>

        <div className="flex justify-between">
          <span>전체 할 일</span>
          <span>{total}개</span>
        </div>

        <div className="flex justify-between text-green-600 font-semibold mt-2">
          <span>완료율</span>
          <span>{percent}%</span>
        </div>
      </div>
    </section>
  );
}
