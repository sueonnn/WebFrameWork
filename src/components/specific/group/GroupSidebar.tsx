import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";

type GroupSidebarProps = {
  groupId: string;
  merged: {
    this: Record<string, number>;
    next: Record<string, number>;
  };
  memberCount: number;
};

export default function GroupSidebar({ groupId, merged, memberCount }: GroupSidebarProps) {
  const activeWeek = "this";
  const weekData = merged[activeWeek] || {};

  const top3 = useMemo(() => {
    const entries = Object.entries(weekData);
    if (entries.length === 0) return [];

    return entries
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([key, count], idx) => {
        const [day, hour] = key.split("-").map(Number);
        const weekdays = ["월", "화", "수", "목", "금", "토", "일"];

        return {
          rank: idx + 1,
          time: `${weekdays[day]}요일 ${hour}:00 - ${hour + 1}:00`,
          percent: Math.round((count / memberCount) * 100),
          members: `${count}/${memberCount}명 가능`,
        };
      });
  }, [weekData, memberCount]);

  const golden = useMemo(() => {
    const entries = Object.entries(weekData);
    if (entries.length === 0) return null;

    const [bestKey, bestCount] = entries.sort((a, b) => b[1] - a[1])[0];
    const [day, hour] = bestKey.split("-").map(Number);
    const weekdays = ["월", "화", "수", "목", "금", "토", "일"];

    return {
      time: `${weekdays[day]}요일 ${hour}:00~${hour + 1}:00`,
      count: bestCount,
      percent: Math.round((bestCount / memberCount) * 100),
    };
  }, [weekData, memberCount]);

  return (
    <aside className="w-[320px] flex flex-col gap-6">
      <Top3Card data={top3} />
      <GoldenTimeCard golden={golden} />
      <SmartPlaceCard groupId={groupId} memberCount={memberCount} />
      <NextStepCard groupId={groupId} />
    </aside>
  );
}

function Top3Card({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 text-sm text-gray-500">
        📌 데이터가 부족해요. 스케줄을 먼저 입력해주세요!
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
      <h3 className="mb-4 text-base font-bold text-gray-900">최적 모임 시간 TOP 3</h3>

      {data.map((item) => (
        <div
          key={item.rank}
          className="group mb-4 last:mb-0 rounded-xl border border-gray-100/70 bg-gray-50/40 p-4 shadow transition hover:bg-gray-50"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full 
                  ${item.rank === 1 ? "bg-amber-400" : item.rank === 2 ? "bg-gray-400" : "bg-orange-400"}
                text-white text-sm font-extrabold`}
              >
                {item.rank}
              </span>
              <div className="text-gray-900 font-semibold">{item.time}</div>
            </div>
            <div className="text-sm font-semibold text-gray-500">{item.percent}%</div>
          </div>

          <div className="mt-2 flex items-center gap-3">
            <div className="relative h-2 w-full rounded-full bg-gray-200">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-indigo-400 to-violet-600"
                style={{ width: `${item.percent}%` }}
              />
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <div className="text-[13px] text-gray-500">{item.members}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function GoldenTimeCard({ golden }: { golden: any | null }) {
  if (!golden) {
    return (
      <div className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-4 text-sm text-indigo-500">
        ⏳ 아직 황금시간을 찾기 부족해요. 스케줄을 입력해주세요!
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-4 shadow-sm">
      <p className="text-[14px] font-semibold text-indigo-700 leading-tight">
        가장 많은 사람이 가능한 <br /> ‘황금 시간’을 찾았어요!
      </p>

      <p className="mt-2 text-[13px] text-indigo-600 font-medium">
        {golden.time} ({golden.count}명 가능)
      </p>
    </div>
  );
}

function SmartPlaceCard({ groupId, memberCount }: { groupId: string; memberCount: number }) {
  const navigate = useNavigate();

  const items =
    memberCount <= 3
      ? [
          { place: "강남역", distance: "평균 이동시간 23분" },
          { place: "홍대입구역", distance: "평균 28분 소요" },
        ]
      : [
          { place: "사당역", distance: "평균 20분 소요" },
          { place: "잠실역", distance: "평균 26분 소요" },
        ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-4">스마트 장소 추천</h3>

      {items.map((p) => (
        <div key={p.place} className="flex flex-col border border-gray-100 rounded-lg p-3 mb-2 bg-[#F9FAFB]">
          <span className="font-medium text-gray-900 text-sm">{p.place}</span>
          <span className="text-xs text-gray-500">{p.distance}</span>
        </div>
      ))}

      <button
        onClick={() => navigate(`/groups/recommend?groupId=${groupId}`)}
        className="w-full mt-3 border border-indigo-200 text-indigo-600 rounded-full py-2 text-sm font-medium hover:bg-indigo-50 transition"
      >
        더 많은 장소 보기
      </button>
    </div>
  );
}

function NextStepCard({ groupId }: { groupId: string }) {
  const navigate = useNavigate();
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
      <h3 className="text-base font-semibold text-gray-900">다음 단계</h3>
      <p className="mt-2 text-xs leading-relaxed text-gray-500">
        가장 많은 사람이 가능한 시간을 기반으로 다음 단계를 선택하세요.
      </p>

      <button
        onClick={() => navigate(`/groups/${groupId}/decide`)}
        className="mt-4 h-11 w-full rounded-full bg-indigo-600 text-white text-sm font-semibold shadow hover:bg-indigo-700 transition"
      >
        타임룰렛으로 결정
      </button>

      <button
        onClick={() => navigate(`/groups/${groupId}/decide`)}
        className="mt-2 h-11 w-full rounded-full border border-indigo-200 text-indigo-600 text-sm font-semibold hover:bg-indigo-50 transition"
      >
        투표로 결정
      </button>
    </div>
  );
}