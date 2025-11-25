interface Props {
  newTaskText: string;
  setNewTaskText: React.Dispatch<React.SetStateAction<string>>;
  addTask: () => void;
  userName: string;
}

export default function ChecklistAddTask({
  newTaskText,
  setNewTaskText,
  addTask,
}: Props) {
  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-base font-semibold mb-1">새 할일 추가</h2>
      <p className="text-xs text-gray-500 mb-4">할 일을 입력하고 @로 담당자를 지정하세요.</p>

      <div className="w-full h-11 rounded-xl border border-gray-300 px-3 flex items-center justify-between bg-white">
        <input
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="예: 회의실 예약하기 @김철수"
          className="w-full bg-transparent text-sm outline-none"
        />
        <button
          onClick={addTask}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#6D74FF] text-white text-xl"
        >
          +
        </button>
      </div>

      <p className="text-[11px] text-gray-400 mt-3">
        ※ 기록을 입력하면 멤버별 선택할 수 있어요.
      </p>
    </section>
  );
}
