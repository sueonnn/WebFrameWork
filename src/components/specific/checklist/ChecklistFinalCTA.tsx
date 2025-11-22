export default function ChecklistFinalCTA() {
  return (
    <section className="bg-[#F2EEFF] rounded-2xl border border-[#CFC8FF] p-6 shadow-sm">
      <h3 className="text-sm font-bold text-[#4A3FE3] mb-2">모임 최종 확정</h3>
      <p className="text-xs text-gray-600 mb-4">
        체크리스트와 함께 모임을 히스토리에 저장하고 추억을 남겨보세요.
      </p>

      <button className="w-full bg-gradient-to-r from-[#6D74FF] to-[#9587FF] text-white py-2.5 rounded-xl text-sm font-semibold shadow">
        🗂 히스토리에 저장하기
      </button>

      <p className="text-[11px] text-gray-500 mt-2">
        저장 후 히스토리 페이지로 이동합니다.
      </p>
    </section>
  );
}
