// import React, { useMemo } from "react";
// import { useGroupScheduleStore } from "../../../stores/groupScheduleStore";
// import { useNavigate } from "react-router-dom";
// import { useMeetingInfoStore } from "../../../stores/meetingInfoStore";

// type GroupSidebarProps = {
//   groupId: string;
//   confirmedLocation: string;
// };

// export default function GroupSidebar({ groupId }: GroupSidebarProps) {
//   const { groupSchedules, memberCount } = useGroupScheduleStore();

//   const activeWeek = "this"; // 필요 시 부모 페이지에서 prop으로 받을 수도 있음
//   const weekData = groupSchedules[activeWeek] || {};

//   const top3 = useMemo(() => {
//     const entries = Object.entries(weekData); // [ ["2-14", 3], ... ]
//     if (entries.length === 0) return [];

//     // value(가능 인원수) 기준 내림차순 + 3개 슬라이싱
//     return entries
//       .sort((a, b) => b[1] - a[1])
//       .slice(0, 3)
//       .map(([key, count], idx) => {
//         const [day, hour] = key.split("-").map(Number);
//         const weekdays = ["월", "화", "수", "목", "금", "토", "일"];

//         return {
//           rank: idx + 1,
//           time: `${weekdays[day]}요일 ${hour}:00 - ${hour + 1}:00`,
//           percent: Math.round((count / memberCount) * 100),
//           members: `${count}/${memberCount}명 가능`,
//           trust: count === memberCount ? "신뢰도 높음" : "신뢰도 보통",
//         };
//       });
//   }, [weekData, memberCount]);

//   const golden = useMemo(() => {
//     const entries = Object.entries(weekData);
//     if (entries.length === 0) return null;

//     const [bestKey, bestCount] = entries.sort((a, b) => b[1] - a[1])[0];
//     const [day, hour] = bestKey.split("-").map(Number);
//     const weekdays = ["월", "화", "수", "목", "금", "토", "일"];

//     return {
//       time: `${weekdays[day]}요일 ${hour}:00~${hour + 1}:00`,
//       count: bestCount,
//       percent: Math.round((bestCount / memberCount) * 100),
//     };
//   }, [weekData, memberCount]);

//   return (
//     <aside className="w-[320px] flex flex-col gap-6">
//       <Top3Card data={top3} />
//       <GoldenTimeCard golden={golden} />
//       <SmartPlaceCard groupId={groupId} />
//       <NextStepCard groupId={groupId} />
//     </aside>
//   );
// }

// function Top3Card({ data }: { data: any[] }) {
//   if (!data || data.length === 0) {
//     return (
//       <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 text-sm text-gray-500">
//         📌 데이터가 부족해요. 스케줄을 먼저 입력해주세요!
//       </div>
//     );
//   }

//   return (
//     <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
//       <h3 className="mb-4 text-base font-bold text-gray-900">최적 모임 시간 TOP 3</h3>

//       {data.map((item) => (
//         <div
//           key={item.rank}
//           className="group mb-4 last:mb-0 rounded-xl border border-gray-100/70 bg-gray-50/40 p-4 shadow transition hover:bg-gray-50"
//         >
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full
//                   ${item.rank === 1 ? "bg-amber-400" : item.rank === 2 ? "bg-gray-400" : "bg-orange-400"}
//                 text-white text-sm font-extrabold`}
//               >
//                 {item.rank}
//               </span>
//               <div className="text-gray-900 font-semibold">{item.time}</div>
//             </div>
//             <div className="text-sm font-semibold text-gray-500">{item.percent}%</div>
//           </div>

//           <div className="mt-2 flex items-center gap-3">
//             <div className="relative h-2 w-full rounded-full bg-gray-200">
//               <div
//                 className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-indigo-400 to-violet-600"
//                 style={{ width: `${item.percent}%` }}
//               />
//             </div>
//           </div>

//           <div className="mt-2 flex items-center justify-between">
//             <div className="text-[13px] text-gray-500">{item.members}</div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// function GoldenTimeCard({ golden }: { golden: any | null }) {
//   if (!golden) {
//     return (
//       <div className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-4 text-sm text-indigo-500">
//         ⏳ 아직 황금시간을 찾기 부족해요. 스케줄을 입력해주세요!
//       </div>
//     );
//   }

//   return (
//     <div className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-4 shadow-sm">
//       <p className="text-[14px] font-semibold text-indigo-700 leading-tight">
//         가장 많은 사람이 가능한 <br /> ‘황금 시간’을 찾았어요!
//       </p>

//       <p className="mt-2 text-[13px] text-indigo-600 font-medium">
//         {golden.time} ({golden.count}명 가능)
//       </p>
//     </div>
//   );
// }

// function SmartPlaceCard({ groupId }: { groupId: string }) {
//   const { memberCount } = useGroupScheduleStore();
//   const navigate = useNavigate();
//   const meetingInfo = useMeetingInfoStore((s) => s.getByGroupId(groupId));
//   const confirmedLocation = meetingInfo?.location;

//   const items =
//     confirmedLocation
//       ? [
//           {
//             place: confirmedLocation,
//             distance: "확정된 모임 장소",
//           },
//         ]
//       : memberCount <= 3
//       ? [
//           { place: "강남역", distance: "평균 이동시간 23분" },
//           { place: "홍대입구역", distance: "평균 28분 소요" },
//         ]
//       : [
//           { place: "사당역", distance: "평균 20분 소요" },
//           { place: "잠실역", distance: "평균 26분 소요" },
//         ];

//   return (
//     <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
//       <h3 className="text-base font-semibold text-gray-900 mb-4">스마트 장소 추천</h3>

//       {items.map((p) => (
//         <div key={p.place} className="flex flex-col border border-gray-100 rounded-lg p-3 mb-2 bg-[#F9FAFB]">
//           <span className="font-medium text-gray-900 text-sm">{p.place}</span>
//           <span className="text-xs text-gray-500">{p.distance}</span>
//         </div>
//       ))}

//       <button
//       onClick={() => navigate(`/groups/${groupId}/recommend`)}
//       className="w-full mt-3 border border-indigo-200 text-indigo-600 rounded-full py-2 text-sm font-medium hover:bg-indigo-50 transition">
//         더 많은 장소 보기
//       </button>
//     </div>
//   );
// }

// function NextStepCard({ groupId }: { groupId: string }) {

//   const goRoulette = () => {
//     // 타임룰렛 탭
//     navigate(`/groups/${groupId}/decide?tab=roulette`);
//   };

//   const goVote = () => {
//     // 투표 탭
//     navigate(`/groups/${groupId}/decide?tab=vote`);
//   };

//   const navigate = useNavigate();
//   return (
//     <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
//       <h3 className="text-base font-semibold text-gray-900">다음 단계</h3>
//       <p className="mt-2 text-xs leading-relaxed text-gray-500">
//         가장 많은 사람이 가능한 시간을 기반으로 다음 단계를 선택하세요.
//       </p>

//       <button className="mt-4 h-11 w-full rounded-full bg-indigo-600 text-white text-sm font-semibold shadow hover:bg-indigo-700 transition"
//       onClick={goRoulette}>
//         타임룰렛으로 결정
//       </button>

//       <button className="mt-2 h-11 w-full rounded-full border border-indigo-200 text-indigo-600 text-sm font-semibold hover:bg-indigo-50 transition"
//       onClick={goVote}>
//         투표로 결정
//       </button>
//     </div>
//   );
// }

//기존;
// import React, { useMemo, useEffect } from "react";
// import { useTimeDecisionStore } from "../../../stores/timeDecisionStore";
// import { useGroupScheduleStore } from "../../../stores/groupScheduleStore";
// import { useNavigate } from "react-router-dom";

// type CandidateItem = {
//   id: string;
//   timeLabel: string;
//   availableCount: number;
// };

// type TopItem = {
//   rank: number;
//   time: string;
//   percent: number;
//   members: string;
// };

// type GroupSidebarProps = {
//   groupId: string;
//   confirmedLocation: string;
//   memberCount: number;
//   activeWeek: "this" | "next";
//   onComputedCandidates?: (data: {
//     top3: TopItem[];
//     candidates: CandidateItem[];
//   }) => void;
// };

// export default function GroupSidebar({
//   groupId,
//   confirmedLocation,
//   memberCount,
//   activeWeek,
//   onComputedCandidates,
// }: GroupSidebarProps) {
//   const navigate = useNavigate();
//   const { groupSchedules } = useGroupScheduleStore();

//   const weekData = groupSchedules?.[activeWeek] || {};
//   const weekdays = ["월", "화", "수", "목", "금", "토", "일"];

//   const candidates = useMemo(() => {
//     const majority = Math.ceil(memberCount / 2);

//     return Object.entries(weekData)
//       .filter(([_, count]) => count >= majority)
//       .map(([key, count]) => {
//         const [day, hour] = key.split("-").map(Number);
//         return {
//           id: key,
//           timeLabel: `${weekdays[day]}요일 ${hour}:00~${hour + 1}:00`,
//           availableCount: count,
//         };
//       });
//   }, [weekData, memberCount]);

//   const top3 = useMemo(() => {
//     const entries = Object.entries(weekData);
//     if (entries.length === 0 || memberCount <= 0) return [];

//     return entries
//       .sort((a, b) => b[1] - a[1])
//       .slice(0, 3)
//       .map(([key, count], idx) => {
//         const [day, hour] = key.split("-").map(Number);
//         const safeCount = Math.max(0, Math.min(memberCount, count));
//         const percent = Math.round((safeCount / memberCount) * 100);

//         return {
//           rank: idx + 1,
//           time: `${weekdays[day]}요일 ${hour}:00 - ${hour + 1}:00`,
//           percent,
//           members: `${safeCount}/${memberCount}명 가능`,
//         };
//       });
//   }, [weekData, memberCount]);

//   const golden = useMemo(() => {
//     const entries = Object.entries(weekData);
//     if (entries.length === 0 || memberCount <= 0) return null;

//     const [bestKey, bestCount] = entries.sort((a, b) => b[1] - a[1])[0];
//     const [day, hour] = bestKey.split("-").map(Number);
//     const safeCount = Math.max(0, Math.min(memberCount, bestCount));

//     return {
//       time: `${weekdays[day]}요일 ${hour}:00~${hour + 1}:00`,
//       count: safeCount,
//       percent: Math.round((safeCount / memberCount) * 100),
//     };
//   }, [weekData, memberCount]);

//   useEffect(() => {
//     useTimeDecisionStore.getState().setDecisionData({
//       top3,
//       candidates,
//       participants: [],
//     });

//     if (onComputedCandidates) {
//       onComputedCandidates({ top3, candidates });
//     }
//   }, [top3, candidates]);

//   const goRoulette = () => navigate(`/groups/${groupId}/decide?tab=roulette`);
//   const goVote = () => navigate(`/groups/${groupId}/decide?tab=vote`);
//   const goRecommend = () => navigate(`/groups/${groupId}/recommend`);

//   return (
//     <aside className="w-[320px] flex flex-col gap-6">
//       <Top3Card data={top3} />
//       <GoldenTimeCard golden={golden} />
//       <SmartPlaceCard
//         confirmedLocation={confirmedLocation}
//         onMore={goRecommend}
//       />
//       <NextStepCard onRoulette={goRoulette} onVote={goVote} />
//     </aside>
//   );
// }

// function Top3Card({ data }: { data: any[] }) {
//   if (!data || data.length === 0) {
//     return (
//       <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 text-sm text-gray-500">
//         📌 데이터가 부족해요. 스케줄을 먼저 입력해주세요!
//       </div>
//     );
//   }

//   return (
//     <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
//       <h3 className="mb-4 text-base font-bold text-gray-900">
//         최적 모임 시간 TOP 3
//       </h3>

//       {data.map((item) => (
//         <div
//           key={item.rank}
//           className="group mb-4 last:mb-0 rounded-xl border border-gray-100/70 bg-gray-50/40 p-4 shadow transition hover:bg-gray-50"
//         >
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <span
//                 className={`inline-flex h-7 w-7 items-center justify-center rounded-full
//                 ${item.rank === 1 ? "bg-amber-400" : item.rank === 2 ? "bg-gray-400" : "bg-orange-400"}
//                 text-white text-sm font-extrabold`}
//               >
//                 {item.rank}
//               </span>
//               <div className="text-gray-900 font-semibold">{item.time}</div>
//             </div>
//             <div className="text-sm font-semibold text-gray-500">
//               {item.percent}%
//             </div>
//           </div>

//           <div className="mt-2">
//             <div className="relative h-2 w-full rounded-full bg-gray-200">
//               <div
//                 className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-indigo-400 to-violet-600"
//                 style={{ width: `${item.percent}%` }}
//               />
//             </div>
//           </div>

//           <div className="mt-2 text-[13px] text-gray-500">{item.members}</div>
//         </div>
//       ))}
//     </div>
//   );
// }

// function GoldenTimeCard({ golden }: { golden: any | null }) {
//   if (!golden) {
//     return (
//       <div className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-4 text-sm text-indigo-500">
//         ⏳ 아직 황금시간을 찾기 부족해요. 스케줄을 입력해주세요!
//       </div>
//     );
//   }

//   return (
//     <div className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-4 shadow-sm">
//       <p className="text-[14px] font-semibold text-indigo-700 leading-tight">
//         가장 많은 사람이 가능한 <br /> ‘황금 시간’을 찾았어요!
//       </p>

//       <p className="mt-2 text-[13px] text-indigo-600 font-medium">
//         {golden.time} ({golden.count}명 가능)
//       </p>
//     </div>
//   );
// }

// function SmartPlaceCard({
//   confirmedLocation,
//   onMore,
// }: {
//   confirmedLocation: string;
//   onMore: () => void;
// }) {
//   const items = confirmedLocation
//     ? [{ place: confirmedLocation, distance: "확정된 모임 장소" }]
//     : [
//         { place: "사당역", distance: "평균 20분 소요" },
//         { place: "잠실역", distance: "평균 26분 소요" },
//       ];

//   return (
//     <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
//       <h3 className="text-base font-semibold text-gray-900 mb-4">
//         스마트 장소 추천
//       </h3>

//       {items.map((p) => (
//         <div
//           key={p.place}
//           className="flex flex-col border border-gray-100 rounded-lg p-3 mb-2 bg-[#F9FAFB]"
//         >
//           <span className="font-medium text-gray-900 text-sm">{p.place}</span>
//           <span className="text-xs text-gray-500">{p.distance}</span>
//         </div>
//       ))}

//       <button
//         onClick={onMore}
//         className="w-full mt-3 border border-indigo-200 text-indigo-600 rounded-full py-2 text-sm font-medium hover:bg-indigo-50 transition"
//       >
//         더 많은 장소 보기
//       </button>
//     </div>
//   );
// }

// function NextStepCard({
//   onRoulette,
//   onVote,
// }: {
//   onRoulette: () => void;
//   onVote: () => void;
// }) {
//   return (
//     <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
//       <h3 className="text-base font-semibold text-gray-900">다음 단계</h3>
//       <p className="mt-2 text-xs leading-relaxed text-gray-500">
//         가장 많은 사람이 가능한 시간을 기반으로 다음 단계를 선택하세요.
//       </p>

//       <button
//         className="mt-4 h-11 w-full rounded-full bg-indigo-600 text-white text-sm font-semibold shadow hover:bg-indigo-700 transition"
//         onClick={onRoulette}
//       >
//         타임룰렛으로 결정
//       </button>

//       <button
//         className="mt-2 h-11 w-full rounded-full border border-indigo-200 text-indigo-600 text-sm font-semibold hover:bg-indigo-50 transition"
//         onClick={onVote}
//       >
//         투표로 결정
//       </button>
//     </div>
//   );
// }

// src/components/specific/group/GroupSidebar.tsx

import React, { useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useTimeDecisionStore } from "../../../stores/timeDecisionStore";
import { useGroupScheduleStore } from "../../../stores/groupScheduleStore";
import type { CandidateItem, TopItem } from "../../../stores/timeDecisionStore";

type GroupSidebarProps = {
  groupId: string;
  confirmedLocation: string;
  memberCount: number;
  activeWeek: "this" | "next";
  onComputedCandidates?: (data: {
    top3: TopItem[];
    candidates: CandidateItem[];
  }) => void;
};

const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"];

export default function GroupSidebar({
  groupId,
  confirmedLocation,
  memberCount,
  activeWeek,
  onComputedCandidates,
}: GroupSidebarProps) {
  const navigate = useNavigate();
  const { groupSchedules } = useGroupScheduleStore();

  const weekData = groupSchedules?.[activeWeek] || {};

  // 1) 시간 후보 리스트 (룰렛/투표에서 쓸 후보들)
  const candidates: CandidateItem[] = useMemo(() => {
    if (!memberCount) return [];

    const majority = Math.ceil(memberCount / 2);

    return Object.entries(weekData)
      .filter(([_, count]) => (count as number) >= majority)
      .map(([key, count]) => {
        const [day, hour] = key.split("-").map(Number);

        return {
          id: key,
          timeLabel: `${WEEKDAYS[day]}요일 ${hour}:00~${hour + 1}:00`,
          availableCount: count as number,
        };
      });
  }, [weekData, memberCount]);

  // 2) TOP3 집계 (스토어의 TopItem 타입에 맞게)
  const top3: TopItem[] = useMemo(() => {
    const entries = Object.entries(weekData);
    if (entries.length === 0 || memberCount <= 0) return [];

    return entries
      .sort((a, b) => (b[1] as number) - (a[1] as number))
      .slice(0, 3)
      .map(([key, count], idx) => {
        const [day, hour] = key.split("-").map(Number);
        const safeCount = Math.max(0, Math.min(memberCount, count as number));
        const percent = Math.round((safeCount / memberCount) * 100);

        return {
          rank: idx + 1,
          time: `${WEEKDAYS[day]}요일 ${hour}:00 - ${hour + 1}:00`,
          percent,
          members: `${safeCount}/${memberCount}명 가능`,
        };
      });
  }, [weekData, memberCount]);

  // 3) 황금 시간(가장 많은 인원) 카드용 데이터
  const golden = useMemo(() => {
    const entries = Object.entries(weekData);
    if (entries.length === 0 || memberCount <= 0) return null;

    const [bestKey, bestCount] = entries.sort(
      (a, b) => (b[1] as number) - (a[1] as number)
    )[0];
    const [day, hour] = bestKey.split("-").map(Number);
    const safeCount = Math.max(0, Math.min(memberCount, bestCount as number));

    return {
      time: `${WEEKDAYS[day]}요일 ${hour}:00~${hour + 1}:00`,
      count: safeCount,
      percent: Math.round((safeCount / memberCount) * 100),
    };
  }, [weekData, memberCount]);

  // 4) 시간 후보/Top3를 전역 스토어(zustand)에 저장 → 룰렛·투표에서 사용
  useEffect(() => {
    useTimeDecisionStore.getState().setDecisionData({
      top3,
      candidates,
      // 지금은 참여자 이름 리스트는 따로 안 쓰므로 비워둠
      participants: [],
    });

    if (onComputedCandidates) {
      onComputedCandidates({ top3, candidates });
    }
  }, [top3, candidates, onComputedCandidates]);

  // 5) 다음 단계 이동 버튼들
  const goRoulette = () => navigate(`/groups/${groupId}/decide?tab=roulette`);
  const goVote = () => navigate(`/groups/${groupId}/decide?tab=vote`);
  const goRecommend = () => navigate(`/groups/${groupId}/recommend`);

  return (
    <aside className="w-[320px] flex flex-col gap-6">
      <Top3Card data={top3} />
      <GoldenTimeCard golden={golden} />
      <SmartPlaceCard
        confirmedLocation={confirmedLocation}
        onMore={goRecommend}
      />
      <NextStepCard onRoulette={goRoulette} onVote={goVote} />
    </aside>
  );
}

/* ====== 아래 카드 컴포넌트들은 기존 UI 그대로 유지 ====== */

function Top3Card({ data }: { data: TopItem[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 text-sm text-gray-500">
        📌 데이터가 부족해요. 스케줄을 먼저 입력해주세요!
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
      <h3 className="mb-4 text-base font-bold text-gray-900">
        최적 모임 시간 TOP 3
      </h3>

      {data.map((item) => (
        <div
          key={item.rank}
          className="group mb-4 last:mb-0 rounded-xl border border-gray-100/70 bg-gray-50/40 p-4 shadow transition hover:bg-gray-50"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex h-7 w-7 items-center justify-center rounded-full 
                ${
                  item.rank === 1
                    ? "bg-amber-400"
                    : item.rank === 2
                      ? "bg-gray-400"
                      : "bg-orange-400"
                }
                text-white text-sm font-extrabold`}
              >
                {item.rank}
              </span>
              <div className="text-gray-900 font-semibold">{item.time}</div>
            </div>
            <div className="text-sm font-semibold text-gray-500">
              {item.percent}%
            </div>
          </div>

          <div className="mt-2">
            <div className="relative h-2 w-full rounded-full bg-gray-200">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-indigo-400 to-violet-600"
                style={{ width: `${item.percent}%` }}
              />
            </div>
          </div>

          <div className="mt-2 text-[13px] text-gray-500">{item.members}</div>
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

function SmartPlaceCard({
  confirmedLocation,
  onMore,
}: {
  confirmedLocation: string;
  onMore: () => void;
}) {
  const items = confirmedLocation
    ? [{ place: confirmedLocation, distance: "확정된 모임 장소" }]
    : [
        { place: "사당역", distance: "평균 20분 소요" },
        { place: "잠실역", distance: "평균 26분 소요" },
      ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-4">
        스마트 장소 추천
      </h3>

      {items.map((p) => (
        <div
          key={p.place}
          className="flex flex-col border border-gray-100 rounded-lg p-3 mb-2 bg-[#F9FAFB]"
        >
          <span className="font-medium text-gray-900 text-sm">{p.place}</span>
          <span className="text-xs text-gray-500">{p.distance}</span>
        </div>
      ))}

      <button
        onClick={onMore}
        className="w-full mt-3 border border-indigo-200 text-indigo-600 rounded-full py-2 text-sm font-medium hover:bg-indigo-50 transition"
      >
        더 많은 장소 보기
      </button>
    </div>
  );
}

function NextStepCard({
  onRoulette,
  onVote,
}: {
  onRoulette: () => void;
  onVote: () => void;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
      <h3 className="text-base font-semibold text-gray-900">다음 단계</h3>
      <p className="mt-2 text-xs leading-relaxed text-gray-500">
        가장 많은 사람이 가능한 시간을 기반으로 다음 단계를 선택하세요.
      </p>

      <button
        className="mt-4 h-11 w-full rounded-full bg-indigo-600 text-white text-sm font-semibold shadow hover:bg-indigo-700 transition"
        onClick={onRoulette}
      >
        타임룰렛으로 결정
      </button>

      <button
        className="mt-2 h-11 w-full rounded-full border border-indigo-200 text-indigo-600 text-sm font-semibold hover:bg-indigo-50 transition"
        onClick={onVote}
      >
        투표로 결정
      </button>
    </div>
  );
}
