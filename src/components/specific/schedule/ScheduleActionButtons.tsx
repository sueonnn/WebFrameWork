interface Props {
  autoSave: boolean;
  onClear: () => void;
  onSave: () => void;
}

export default function ScheduleActionButtons({ autoSave, onClear, onSave }: Props) {
  return (
    <div className="flex justify-end gap-3">

      <button
        onClick={onClear}
        className="h-10 px-5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-full hover:bg-gray-50 transition"
      >
        전체 삭제
      </button>

      {!autoSave && (
        <button
          onClick={onSave}
          className="h-10 px-5 text-sm font-semibold text-white bg-indigo-600 rounded-full shadow hover:bg-indigo-700 transition"
        >
          저장하기
        </button>
      )}
    </div>
  );
}
