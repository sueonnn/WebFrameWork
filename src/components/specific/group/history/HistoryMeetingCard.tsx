import React, { useMemo } from "react";
import type { MeetingInfo } from "../../../../types/MeetingInfo";
import { useHistoryStore } from "../../../../stores/checklist/useHistoryStore";
import { useMeetingInfoStore } from "../../../../stores/meetingInfoStore";

interface Props {
  meeting: MeetingInfo;
  percent: number;
}

export default function HistoryMeetingCard({ meeting, percent }: Props) {
  const fromHistory = useHistoryStore((s) => s.history.find((m) => m.id === meeting.id));
  const fromMeetingStore = useMeetingInfoStore((s) => s.getByMeetingId(meeting.id));

  // 우선순위: meetingInfoStore(최신) > historyStore > props
  const view = useMemo<MeetingInfo>(() => {
    return {
      ...meeting,
      ...(fromHistory ?? {}),
      ...(fromMeetingStore ?? {}), // 마지막에 덮어써서 time/location 최신 반영
    } as MeetingInfo;
  }, [meeting, fromHistory, fromMeetingStore]);

  return (
    <section className="bg-white rounded-2xl border border-[#BFD8FF] p-8 shadow-sm">
      <div className="flex items-start gap-6">
        <div className="w-14 h-14 bg-[#EEF2FF] rounded-2xl flex items-center justify-center text-3xl text-[#6D75FF]">
          📅
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">{view.title}</h2>
            <span className="px-4 py-1.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
              {percent}% 완료
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-700">
            <div>📆 {view.time}</div>
            <div>📍 {view.location}</div>
            <div>👥 {view.participants.length}명 참석</div>
          </div>
        </div>
      </div>
    </section>
  );
}
