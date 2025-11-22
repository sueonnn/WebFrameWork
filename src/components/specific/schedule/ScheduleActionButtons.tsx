interface Props {
  autoSave: boolean;
  onClear: () => void;
  onSave: () => void;
}

export default function ScheduleActionButtons({ autoSave, onClear, onSave }: Props) {
  return (
    <div className="mt-6 flex justify-end gap-3">

      <button
        onClick={onClear}
        className="px-5 py-2 text-sm font-semibold text-gray-600 border border-gray-200 rounded-full hover:bg-gray-50 transition"
      >
        전체 삭제
      </button>

      {!autoSave && (
        <button
          onClick={onSave}
          className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-full shadow hover:bg-indigo-700 transition"
        >
          저장하기
        </button>
      )}
    </div>
  );
}
