import { useNavigate, useParams } from "react-router-dom";
import LocationModal from "./LocationModal";
import { useState, useEffect } from "react";
import { useLocationStore } from "../../../stores/useLocationStore";
import { useAllUserScheduleStore } from "../../../stores/allUserScheduleStore";
import { useMemo } from "react";

type Props = {
  totalHours: number;
  groupId: string;
};

export default function ScheduleSidebar({ totalHours, groupId }: Props) {
  const { memberId } = useParams();
  const [openLocationModal, setOpenLocationModal] = useState(false);

  const { locations, setLocation } = useLocationStore();
  const savedLocation = locations[groupId]?.[memberId!] ?? null;

  const [address, setAddress] = useState("");

  useEffect(() => {
    if (savedLocation) {
      setAddress(savedLocation.address);
    }
  }, [savedLocation]);

  return (
    <aside className="w-[320px] flex flex-col gap-6">
      <LocationCard
        onOpen={() => setOpenLocationModal(true)}
        address={address}
      />

      <MySummaryCard totalHours={totalHours} />
      <OverlapTopCard groupId={groupId} />

      <LocationModal
        isOpen={openLocationModal}
        onClose={() => setOpenLocationModal(false)}
        onSelectAddress={(addr) => {

          setLocation(groupId, memberId!, {
            type: "home",
            address: addr,
          });

          setAddress(addr);
        }}
      />
    </aside>
  );
}

function LocationCard({ onOpen, address }: { onOpen: () => void; address: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">내 위치 정보</h3>
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="#9FA5B1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 5-9 12-9 12S3 15 3 10a9 9 0 1 1 18 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>

        <p className="mb-6 text-sm leading-relaxed text-gray-600">
          {address ? address : "위치를 설정하면 스마트 장소 추천을 받을 수 있어요."}
        </p>

        <button
          onClick={onOpen}
          className="w-full h-11 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-sm font-semibold shadow
                     hover:from-indigo-600/90 hover:to-indigo-700/90 transition"
        >
          <span className="inline-flex items-center gap-2 justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            위치 설정하기
          </span>
        </button>
      </div>
    </div>
  );
}

function MySummaryCard({ totalHours }: { totalHours: number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
      <h3 className="mb-4 text-base font-semibold text-gray-900">내 입력 요약</h3>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">총 가능 시간</span>
        <span className="font-semibold text-indigo-600">{totalHours}시간</span>
      </div>
    </div>
  );
}

function OverlapTopCard({ groupId }: { groupId: string }) {
  const schedules = useAllUserScheduleStore((s) => s.schedules);
  const all = schedules[groupId] || {};
  const memberCount = Object.keys(all).length;

  const merged = useMemo(() => {
    const result: Record<string, number> = {};

    Object.values(all).forEach((user: any) => {
      user.this.forEach((key: string) => {
        result[key] = (result[key] || 0) + 1;
      });
    });

    return result;
  }, [all]);

  const items = useMemo(() => {
    const entries = Object.entries(merged);
    if (entries.length === 0) return [];

    const weekdays = ["월", "화", "수", "목", "금", "토", "일"];

    return entries
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([key, count]) => {
        const [day, hour] = key.split("-").map(Number);
        return {
          time: `${weekdays[day]} ${hour}:00-${hour + 1}:00`,
          members: `${count}/${memberCount}명`,
        };
      });
  }, [merged, memberCount]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
      <h3 className="mb-4 text-base font-semibold text-gray-900">겹침 상위 시간대</h3>

      {items.length === 0 && (
        <p className="text-sm text-gray-500">스케줄 데이터를 입력하면 상위 시간대가 보여요.</p>
      )}

      {items.map((t) => (
        <div
          key={t.time}
          className="mb-3 rounded-xl bg-[#F9FAFB] p-4 flex flex-col shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[15px] text-gray-900 tracking-tight">
              {t.time}
            </span>
            <span className="text-[15px] font-bold text-indigo-600">{t.members}</span>
          </div>
          <span className="mt-1 text-[13px] text-gray-400">가능 인원</span>
        </div>
      ))}
    </div>
  );
}