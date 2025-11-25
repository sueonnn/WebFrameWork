import type { MeetingInfo } from "../../../types/MeetingInfo";

interface Props {
  meeting: MeetingInfo;
  members: string[];
}

export default function ChecklistMeetingCard({ meeting, members }: Props) {
  return (
    <section className="bg-[#E7F8EC] rounded-2xl border border-[#C6E8CE] p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-white text-green-500 text-2xl flex items-center justify-center">
          ✓
        </div>
        <div>
          <h2 className="text-lg font-semibold">모임 확정!</h2>
          <p className="text-sm text-gray-600 mt-1">이제 준비할 일들을 정리해보세요.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-6 mt-6 text-sm">
        <div className="flex items-center gap-2">📅 {meeting.time}</div>
        <div className="flex items-center gap-2">📍 {meeting.location}</div>
        <div className="flex items-center gap-2">👥 {members.length}명 참석</div>
      </div>
    </section>
  );
}
