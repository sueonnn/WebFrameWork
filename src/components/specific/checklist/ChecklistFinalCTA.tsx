import { useNavigate } from "react-router-dom";
import { useTaskStore } from "../../../stores/checklist/useTaskStore";
import { useMeetingInfoStore } from "../../../stores/meetingInfoStore";
import { useHistoryStore } from "../../../stores/checklist/useHistoryStore";

export default function ChecklistFinalCTA({ meetingId }: { meetingId: string }) {
  const navigate = useNavigate();

  const meeting = useMeetingInfoStore((s) => s.getByMeetingId(meetingId));
  const tasks = useTaskStore((s) => s.tasksByMeeting[meetingId] ?? []);
  const updateOrAddHistory = useHistoryStore((s) => s.updateOrAddHistory);

  const done = tasks.filter((t) => t.done).length;
  const total = tasks.length;
  const percent = total ? Math.round((done / total) * 100) : 0;

  const handleSave = () => {
    if (!meeting) return;

    const item = {
      id: meetingId,
      groupId: meeting.groupId,
      title: meeting.title,
      date: meeting.date,
      time: meeting.time,
      location: meeting.location,
      participants: `${meeting.participants.length}명 참석`,
      status: `${percent}% 완료`,
      statusClasses:
        percent === 100
          ? "bg-green-100 text-green-700"
          : "bg-yellow-100 text-yellow-700",
    };

    updateOrAddHistory(item);

    navigate("/history");
  };

  return (
    <section className="bg-[#F2EEFF] rounded-2xl border border-[#CFC8FF] p-6 shadow-sm">
      <h3 className="text-sm font-bold text-[#4A3FE3] mb-2">모임 최종 확정</h3>
      <p className="text-xs text-gray-600 mb-4">
        체크리스트와 함께 모임을 히스토리에 저장하고 추억을 남겨보세요.
      </p>

      <button
        onClick={handleSave}
        className="w-full bg-gradient-to-r from-[#6D74FF] to-[#9587FF] text-white py-2.5 rounded-xl text-sm font-semibold shadow"
      >
        🗂 히스토리에 저장하기
      </button>

      <p className="text-[11px] text-gray-500 mt-2">
        저장 후 히스토리 페이지로 이동합니다.
      </p>
    </section>
  );
}
