interface Props {
  showWorkingHoursOnly: boolean;
  setShowWorkingHoursOnly: (v: boolean) => void;

  autoSave: boolean;
  setAutoSave: (v: boolean) => void;
}

export default function ScheduleToggles({
  showWorkingHoursOnly,
  setShowWorkingHoursOnly,
  autoSave,
  setAutoSave,
}: Props) {
  return (
    <div className="flex items-center gap-6 text-gray-600">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          className="accent-indigo-500"
          checked={showWorkingHoursOnly}
          onChange={(e) => setShowWorkingHoursOnly(e.target.checked)}
        />
        근무시간만 보기
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          className="accent-indigo-500"
          checked={autoSave}
          onChange={(e) => setAutoSave(e.target.checked)}
        />
        자동저장
      </label>
    </div>
  );
}
