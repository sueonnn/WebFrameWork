export default function ChecklistHeader() {
  return (
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
  );
}
