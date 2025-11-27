// // src/components/specific/VotePanel.tsx

// import React, { useState, useMemo } from "react";
// import { Clock } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useMeetingInfoStore } from "../../stores/meetingInfoStore";
// import { useTimeDecisionStore } from "../../stores/timeDecisionStore";

// type VotePanelProps = {
//   groupId: string;
//   onSwitchToRoulette: () => void;
// };

// type VoteStatus = "agree" | "pending" | null;

// type VoteCardProps = {
//   timeLabel: string;
//   availableCount: number;
//   availableNames?: string[];
//   totalParticipants: number;
//   myVote: VoteStatus;
//   onClickAgree: () => void;
//   onClickPending: () => void;
//   onConfirmTime: () => void;
// };

// const VoteCard: React.FC<VoteCardProps> = ({
//   timeLabel,
//   availableCount,
//   availableNames,
//   totalParticipants,
//   myVote,
//   onClickAgree,
//   onClickPending,
//   onConfirmTime,
// }) => {
//   const availablePercent = Math.round(
//     (availableCount / (totalParticipants || 1)) * 100
//   );

//   const percentColor =
//     availablePercent === 100
//       ? "text-green-600"
//       : availablePercent >= 75
//         ? "text-blue-600"
//         : "text-yellow-600";

//   const myVoteLabel =
//     myVote === "agree"
//       ? "찬성이에요"
//       : myVote === "pending"
//         ? "보류할래요"
//         : "아직 선택 안 함";

//   return (
//     <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
//       <div className="flex items-center justify-between">
//         <p className="text-lg font-semibold text-gray-800">{timeLabel}</p>
//         <div className="flex items-center text-xs text-gray-500">
//           <Clock className="w-3 h-3 mr-1" />
//           <span>시간 후보</span>
//         </div>
//       </div>

//       <div className="flex items-center justify-between text-sm">
//         <p className={percentColor}>
//           {availablePercent}% ({availableCount}/{totalParticipants}) 참석 가능
//         </p>
//       </div>

//       <p className="text-[11px] text-gray-500">
//         가능 멤버:{" "}
//         {availableNames && availableNames.length
//           ? availableNames.join(", ")
//           : "정보 없음"}
//       </p>

//       <div className="flex items-center gap-2 text-xs">
//         <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">
//           나의 선택: <strong>{myVoteLabel}</strong>
//         </span>
//       </div>

//       <div className="flex gap-2 mt-2">
//         <button
//           type="button"
//           onClick={onClickAgree}
//           className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition ${
//             myVote === "agree"
//               ? "bg-green-600 text-white border-green-600"
//               : "border-green-300 text-green-700 hover:bg-green-50"
//           }`}
//         >
//           찬성이에요
//         </button>
//         <button
//           type="button"
//           onClick={onClickPending}
//           className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition ${
//             myVote === "pending"
//               ? "bg-orange-500 text-white border-orange-500"
//               : "border-orange-300 text-orange-700 hover:bg-orange-50"
//           }`}
//         >
//           보류할래요
//         </button>
//       </div>

//       <button
//         type="button"
//         onClick={onConfirmTime}
//         className="w-full mt-2 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
//       >
//         이 시간으로 확정
//       </button>
//     </div>
//   );
// };

// const VotePanel: React.FC<VotePanelProps> = ({
//   groupId,
//   onSwitchToRoulette,
// }) => {
//   const navigate = useNavigate();

//   const updateTimeByMeetingId = useMeetingInfoStore(
//     (s) => s.updateTimeByMeetingId
//   );
//   const meeting = useMeetingInfoStore((s) => s.getByGroupId(groupId));

//   const { candidates, participants } = useTimeDecisionStore();

//   const [myVotes, setMyVotes] = useState<Record<string, VoteStatus>>({});

//   const totalParticipants = participants.length || 1;

//   const handleVote = (candidateId: string, status: VoteStatus) => {
//     setMyVotes((prev) => {
//       const current = prev[candidateId] ?? null;
//       return {
//         ...prev,
//         [candidateId]: current === status ? null : status,
//       };
//     });
//   };

//   const handleConfirmTime = (candidateId: string) => {
//     if (!meeting) return;
//     const candidate = candidates.find((c) => c.id === candidateId);
//     if (!candidate) return;

//     updateTimeByMeetingId(meeting.id, candidate.timeLabel);
//     navigate(`/groups/checkstory/${meeting.id}`);
//   };

//   const handleConfirmByExpandVote = () => {
//     if (!meeting || candidates.length === 0) return;

//     const best = candidates.reduce((prev, cur) =>
//       (cur.availableCount ?? 0) > (prev.availableCount ?? 0) ? cur : prev
//     );

//     updateTimeByMeetingId(meeting.id, best.timeLabel);
//     navigate(`/groups/checkstory/${meeting.id}`);
//   };

//   const votedCount = useMemo(
//     () =>
//       Object.values(myVotes).filter((v) => v === "agree" || v === "pending")
//         .length,
//     [myVotes]
//   );

//   if (!candidates || candidates.length === 0) {
//     return (
//       <div className="p-6 rounded-xl bg-white border border-gray-200">
//         <p className="text-sm text-gray-600">
//           이 그룹에 대한 시간 후보 데이터가 없습니다.
//           <br />
//           먼저 그룹 타임라인에서 시간 후보를 만든 뒤 와주세요.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* 상단 배너 */}
//       <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 flex items-center justify-between gap-4">
//         <div className="space-y-1">
//           <p className="text-sm font-semibold text-blue-800">
//             투표로 시간 정하기
//           </p>
//           <p className="text-xs text-blue-700">
//             각 시간 후보에 대해 &ldquo;찬성&rdquo; 또는 &ldquo;보류&rdquo;를
//             선택해 주세요.
//           </p>
//           <p className="text-[11px] text-blue-500">
//             아직 투표한 사람 수: {votedCount}명 / 참여 인원 {totalParticipants}
//             명
//           </p>
//         </div>
//         <button
//           type="button"
//           onClick={onSwitchToRoulette}
//           className="px-3 py-2 text-xs font-semibold text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition"
//         >
//           룰렛으로 전환
//         </button>
//       </div>

//       {/* 후보 리스트 + 내 투표 */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {candidates.map((c) => (
//           <VoteCard
//             key={c.id}
//             timeLabel={c.timeLabel}
//             availableCount={c.availableCount ?? 0}
//             availableNames={c.availableNames}
//             totalParticipants={totalParticipants}
//             myVote={myVotes[c.id] ?? null}
//             onClickAgree={() => handleVote(c.id, "agree")}
//             onClickPending={() => handleVote(c.id, "pending")}
//             onConfirmTime={() => handleConfirmTime(c.id)}
//           />
//         ))}
//       </div>

//       {/* 하단 확정 버튼 */}
//       <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 flex flex-col md:flex-row items-center justify-between gap-3">
//         <div className="text-xs text-gray-600">
//           <p className="font-semibold text-gray-800 mb-1">
//             확대 투표 결과로 자동 확정
//           </p>
//           <p>
//             가장 많은 인원이 가능한 시간 한 개를 자동으로 선택해서
//             <br />
//             체크스토리 페이지에 확정할 수 있어요.
//           </p>
//         </div>
//         <button
//           type="button"
//           onClick={handleConfirmByExpandVote}
//           className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
//         >
//           가장 인기 많은 시간으로 확정하기
//         </button>
//       </div>
//     </div>
//   );
// };

// export default VotePanel;

// src/components/specific/VotePanel.tsx

import React, { useMemo } from "react";
import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMeetingInfoStore } from "../../stores/meetingInfoStore";
import { useTimeDecisionStore } from "../../stores/timeDecisionStore";
import { useTimeVoteStore, type VoteStatus } from "../../stores/timeVoteStore";

type VotePanelProps = {
  groupId: string;
  onSwitchToRoulette: () => void;
};

type VoteCardProps = {
  timeLabel: string;
  availableCount: number;
  availableNames?: string[];
  totalParticipants: number;
  myVote: VoteStatus;
  onClickAgree: () => void;
  onClickPending: () => void;
  onConfirmTime: () => void;
};

const VoteCard: React.FC<VoteCardProps> = ({
  timeLabel,
  availableCount,
  availableNames,
  totalParticipants,
  myVote,
  onClickAgree,
  onClickPending,
  onConfirmTime,
}) => {
  const availablePercent = Math.round(
    (availableCount / (totalParticipants || 1)) * 100
  );

  const percentColor =
    availablePercent === 100
      ? "text-green-600"
      : availablePercent >= 75
        ? "text-blue-600"
        : "text-yellow-600";

  const myVoteLabel =
    myVote === "agree"
      ? "찬성이에요"
      : myVote === "pending"
        ? "보류할래요"
        : "아직 선택 안 함";

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold text-gray-800">{timeLabel}</p>
        <div className="flex items-center text-xs text-gray-500">
          <Clock className="w-3 h-3 mr-1" />
          <span>시간 후보</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <p className={percentColor}>
          {availablePercent}% ({availableCount}/{totalParticipants}) 참석 가능
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">
          나의 선택: <strong>{myVoteLabel}</strong>
        </span>
      </div>

      <div className="flex gap-2 mt-2">
        <button
          type="button"
          onClick={onClickAgree}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition ${
            myVote === "agree"
              ? "bg-green-600 text-white border-green-600"
              : "border-green-300 text-green-700 hover:bg-green-50"
          }`}
        >
          찬성이에요
        </button>
        <button
          type="button"
          onClick={onClickPending}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition ${
            myVote === "pending"
              ? "bg-orange-500 text-white border-orange-500"
              : "border-orange-300 text-orange-700 hover:bg-orange-50"
          }`}
        >
          보류할래요
        </button>
      </div>

      <button
        type="button"
        onClick={onConfirmTime}
        className="w-full mt-2 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
      >
        이 시간으로 확정
      </button>
    </div>
  );
};

const VotePanel: React.FC<VotePanelProps> = ({
  groupId,
  onSwitchToRoulette,
}) => {
  const navigate = useNavigate();

  const updateTimeByMeetingId = useMeetingInfoStore(
    (s) => s.updateTimeByMeetingId
  );
  const meeting = useMeetingInfoStore((s) => s.getByGroupId(groupId));

  // 후보 시간은 timeDecisionStore에서
  const { candidates } = useTimeDecisionStore();

  // 내 투표는 timeVoteStore에 그룹 단위로 저장
  const { myVotesByGroup, setMyVote } = useTimeVoteStore();
  const myVotes = myVotesByGroup[groupId] ?? {};

  // 참가자 수는 meeting에서
  const totalParticipants = meeting?.participants?.length || 1;

  const handleVote = (candidateId: string, status: VoteStatus) => {
    const current = myVotes[candidateId] ?? null;
    const next: VoteStatus = current === status ? null : status;
    setMyVote(groupId, candidateId, next);
  };

  const handleConfirmTime = (candidateId: string) => {
    if (!meeting) return;
    const candidate = candidates.find((c) => c.id === candidateId);
    if (!candidate) return;

    updateTimeByMeetingId(meeting.id, candidate.timeLabel);
    navigate(`/groups/checkstory/${meeting.id}`);
  };

  // 🔥 가장 인기 많은 시간으로 확정하기 버튼 플로우
  const handleConfirmByExpandVote = () => {
    if (!meeting || candidates.length === 0) return;

    // 후보별 agree 개수 집계 (현재 이 브라우저 기준)
    const agreeCountByCandidate: Record<string, number> = {};
    candidates.forEach((c) => {
      const v = myVotes[c.id];
      agreeCountByCandidate[c.id] = v === "agree" ? 1 : 0;
    });

    let best = candidates[0];
    let bestAgree = agreeCountByCandidate[best.id] ?? 0;

    for (const c of candidates) {
      const curAgree = agreeCountByCandidate[c.id] ?? 0;

      if (curAgree > bestAgree) {
        best = c;
        bestAgree = curAgree;
        continue;
      }

      // agree 수가 같으면 스케줄 기반 가능 인원으로 tie-break
      if (curAgree === bestAgree) {
        const bestAvail = best.availableCount ?? 0;
        const curAvail = c.availableCount ?? 0;
        if (curAvail > bestAvail) {
          best = c;
        }
      }
    }

    // ✅ 룰렛 확정하기와 같은 루트:
    // updateTimeByMeetingId → /groups/checkstory/{meetingId}
    updateTimeByMeetingId(meeting.id, best.timeLabel);
    navigate(`/groups/checkstory/${meeting.id}`);
  };

  const votedCount = useMemo(
    () =>
      Object.values(myVotes).filter((v) => v === "agree" || v === "pending")
        .length,
    [myVotes]
  );

  if (!candidates || candidates.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-white border border-gray-200">
        <p className="text-sm text-gray-600">
          이 그룹에 대한 시간 후보 데이터가 없습니다.
          <br />
          먼저 그룹 타임라인에서 시간 후보를 만든 뒤 와주세요.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 상단 배너 */}
      <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 flex items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-blue-800">
            투표로 시간 정하기
          </p>
          <p className="text-xs text-blue-700">
            각 시간 후보에 대해 &ldquo;찬성&rdquo; 또는 &ldquo;보류&rdquo;를
            선택해 주세요.
          </p>
          <p className="text-[11px] text-blue-500">
            아직 투표한 사람 수: {votedCount}명 / 참여 인원 {totalParticipants}
            명
          </p>
        </div>
        <button
          type="button"
          onClick={onSwitchToRoulette}
          className="px-3 py-2 text-xs font-semibold text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition"
        >
          룰렛으로 전환
        </button>
      </div>

      {/* 후보 리스트 + 내 투표 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {candidates.map((c) => (
          <VoteCard
            key={c.id}
            timeLabel={c.timeLabel}
            availableCount={c.availableCount ?? 0}
            availableNames={c.availableNames}
            totalParticipants={totalParticipants}
            myVote={myVotes[c.id] ?? null}
            onClickAgree={() => handleVote(c.id, "agree")}
            onClickPending={() => handleVote(c.id, "pending")}
            onConfirmTime={() => handleConfirmTime(c.id)}
          />
        ))}
      </div>

      {/* 하단 확정 버튼 */}
      <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="text-xs text-gray-600">
          <p className="font-semibold text-gray-800 mb-1">
            확대 투표 결과로 자동 확정
          </p>
          <p>
            가장 많은 인원이 가능한 시간 한 개를 자동으로 선택해서
            <br />
            체크스토리 페이지에 확정할 수 있어요.
          </p>
        </div>
        <button
          type="button"
          onClick={handleConfirmByExpandVote}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          가장 인기 많은 시간으로 확정하기
        </button>
      </div>
    </div>
  );
};

export default VotePanel;
