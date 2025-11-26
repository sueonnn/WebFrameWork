// src/components/specific/VotePanel.tsx
import React, { useMemo, useState } from "react";
import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMeetingInfoStore } from "../../stores/meetingInfoStore";
import { useTimeDecisionStore } from "../../stores/timeDecisionStore";

type VotePanelProps = {
  groupId: string;
  onSwitchToRoulette: () => void;
};

type VoteCardProps = {
  timeLabel: string;
  agreeNames: string[];
  pendingNames: string[];
  totalParticipants: number;
  myVote: "agree" | "pending" | null;
  onClickAgree: () => void;
  onClickPending: () => void;
  onConfirmTime: () => void;
};

// ✅ 기존 UI 그대로 사용
const VoteCard: React.FC<VoteCardProps> = ({
  timeLabel,
  agreeNames,
  pendingNames,
  totalParticipants,
  myVote,
  onClickAgree,
  onClickPending,
  onConfirmTime,
}) => {
  const agreeCount = agreeNames.length;
  const pendingCount = pendingNames.length;
  const participated = agreeCount + pendingCount;
  const percentage = Math.round((participated / totalParticipants) * 100);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      {/* 시간 및 마감 임박 표시 */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-bold text-gray-800">{timeLabel}</h3>
        <span className="text-xs text-green-600 font-semibold">확정 임박</span>
      </div>

      {/* 참여 인원 정보 */}
      <p className="text-sm text-gray-500 mb-4">
        참여 가능: {participated}/{totalParticipants}명
      </p>

      {/* 투표 현황: 찬성/보류 */}
      <div className="space-y-3 mb-6">
        {/* 찬성 라인 */}
        <div className="flex justify-between items-start">
          <div className="flex flex-wrap w-2/3">
            <span className="text-sm font-semibold mr-3">
              찬성 ({agreeCount})
            </span>
            {agreeNames.slice(0, 3).map((name, idx) => (
              <span
                key={idx}
                className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full mr-2 mb-1"
              >
                {name}
              </span>
            ))}
            {agreeNames.length > 3 && (
              <span className="text-xs text-gray-500 px-2 py-1 mb-1">
                +{agreeNames.length - 3}
              </span>
            )}
          </div>
          {/* 사용자 투표 버튼 */}
          <div className="flex space-x-2 flex-shrink-0">
            <button
              className="text-xs px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-full hover:bg-indigo-100"
              onClick={onClickAgree}
            >
              찬성
            </button>
            <button
              className="text-xs px-3 py-1 bg-gray-50 border border-gray-200 text-gray-600 rounded-full hover:bg-gray-100"
              onClick={onClickPending}
            >
              보류
            </button>
          </div>
        </div>

        {/* 보류 라인 */}
        {pendingCount > 0 && (
          <div className="flex justify-between items-start">
            <div className="flex flex-wrap w-2/3">
              <span className="text-sm font-semibold mr-3 text-yellow-600">
                보류 ({pendingCount})
              </span>
              {pendingNames.map((name, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full mr-2 mb-1"
                >
                  {name}
                </span>
              ))}
            </div>
            {/* 이 시간으로 확정 버튼 */}
            <button
              className="text-xs text-white bg-indigo-600 px-3 py-1 rounded-full shadow-md hover:bg-indigo-700 flex-shrink-0"
              onClick={onConfirmTime}
            >
              이 시간으로 확정
            </button>
          </div>
        )}
      </div>

      {/* 투표 진행률 바 */}
      <div className="mt-4">
        <p className="text-xs text-gray-500 mb-1">투표 진행률</p>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{ width: `${percentage}%`, backgroundColor: "#4f46e5" }}
          ></div>
        </div>
      </div>

      <hr className="my-6" />

      {/* 현재 내 투표 현황 */}
      <div className="flex justify-between items-center text-sm">
        <span className="font-semibold">나의 투표</span>
        <span className="text-indigo-600">
          {myVote === "agree"
            ? "찬성으로 투표했어요"
            : myVote === "pending"
              ? "보류로 투표했어요"
              : "아직 투표하지 않았어요"}
        </span>
      </div>
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
  const participants = meeting?.participants ?? [];
  const totalParticipants = participants.length || 1;

  // 시간 후보 데이터 (전역 store)
  const { candidates } = useTimeDecisionStore();

  // 후보별 나의 투표 상태 저장
  const [myVotes, setMyVotes] = useState<
    Record<string, "agree" | "pending" | null>
  >({});

  const handleVote = (candidateId: string, vote: "agree" | "pending") => {
    setMyVotes((prev) => {
      const current = prev[candidateId] ?? null;
      // 같은 버튼 다시 누르면 취소
      const next = current === vote ? null : vote;
      return { ...prev, [candidateId]: next };
    });
  };

  // 공통: 확정된 시간 store에 반영 + 체크리스트 페이지로 이동
  const updateMeetingTimeAndGoChecklist = (confirmedTime: string) => {
    if (!confirmedTime || !meeting) return;

    updateTimeByMeetingId(meeting.id, confirmedTime);
    navigate(`/groups/checkstory/${meeting.id}`);
  };

  // 확대 투표로 확정 → 가장 많은 인원이 가능한 후보를 확정 시간으로
  const handleConfirmExpand = () => {
    if (!meeting || candidates.length === 0) return;

    const best = candidates.reduce((prev, cur) =>
      (cur.availableCount ?? 0) > (prev.availableCount ?? 0) ? cur : prev
    );

    updateMeetingTimeAndGoChecklist(best.timeLabel);
  };

  // 개별 시간 카드에서 "이 시간으로 확정"
  const handleConfirmTime = (candidateId: string) => {
    if (!meeting) return;

    const candidate = candidates.find((c) => c.id === candidateId);
    if (!candidate) return;

    updateMeetingTimeAndGoChecklist(candidate.timeLabel);
  };

  // 나 포함, 투표한 사람 수 (단순히 myVotes 기준)
  const votedCount = useMemo(
    () =>
      Object.values(myVotes).filter((v) => v === "agree" || v === "pending")
        .length,
    [myVotes]
  );

  if (!candidates || candidates.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-white border border-gray-200">
        이 그룹에 대한 투표 데이터가 없습니다. (groupId: {groupId})
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 상단 마감 및 확정 버튼 영역 (기존 UI) */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-lg border border-gray-200">
        <div className="flex items-center text-gray-700">
          <Clock className="w-5 h-5 mr-2 text-indigo-600" />
          <span className="font-semibold">투표 마감까지</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-xl font-extrabold text-indigo-600">
            23시간 59분 44초
          </span>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 transition duration-150"
            onClick={handleConfirmExpand}
          >
            확대 투표로 확정
          </button>
        </div>
      </div>

      {/* 각 투표 항목 렌더링 */}
      <div className="space-y-6">
        {candidates.map((c) => {
          const agreeNames = c.availableNames ?? [];
          const pendingNames: string[] = []; // 실제 보류 데이터는 없으니 비워둠
          const myVote = myVotes[c.id] ?? null;

          return (
            <VoteCard
              key={c.id}
              timeLabel={c.timeLabel}
              agreeNames={agreeNames}
              pendingNames={pendingNames}
              totalParticipants={totalParticipants}
              myVote={myVote}
              onClickAgree={() => handleVote(c.id, "agree")}
              onClickPending={() => handleVote(c.id, "pending")}
              onConfirmTime={() => handleConfirmTime(c.id)}
            />
          );
        })}
      </div>

      {/* 하단 룰렛 전환 버튼 (기존 UI) */}
      <div className="flex justify-between items-center bg-yellow-50 p-6 rounded-xl border-l-4 border-yellow-500 shadow-lg">
        <p className="text-sm text-yellow-800">
          <span className="text-2xl font-bold mr-2">{participants.length}</span>
          명이 아직 투표하지 않았다면 룰렛으로 결정해 보세요!
        </p>
        <button
          className="px-4 py-2 text-sm font-semibold text-indigo-600 border border-indigo-300 rounded-md hover:bg-indigo-50 transition duration-150"
          onClick={onSwitchToRoulette}
        >
          타임룰렛으로 전환
        </button>
      </div>
    </div>
  );
};

export default VotePanel;

// 2번 ui src/components/specific/VotePanel.tsx

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

//ui가 예뻐서 ..
// import React, { useMemo, useState } from "react";
// import { ArrowLeftRight, Crown, Users, CheckCircle2 } from "lucide-react";
// import { useTimeDecisionStore } from "../../stores/timeDecisionStore";
// import { useMeetingInfoStore } from "../../stores/meetingInfoStore";

// type VotePanelProps = {
//   groupId: string;
//   onSwitchToRoulette: () => void;
// };

// const VotePanel: React.FC<VotePanelProps> = ({
//   groupId,
//   onSwitchToRoulette,
// }) => {
//   const { candidates, participants, top3, meetingId } = useTimeDecisionStore();
//   const [selectedId, setSelectedId] = useState<string | null>(null);
//   const [hasVoted, setHasVoted] = useState(false);

//   const totalParticipants = participants.length || 1;

//   const meetingInfo = useMeetingInfoStore((s) => {
//     if (!meetingId) return undefined;
//     return s.getByMeetingId(meetingId);
//   });

//   // TOP3 정보: timeLabel -> rank 매핑
//   const topRankMap = useMemo(() => {
//     const map: Record<string, number> = {};
//     top3.forEach((item) => {
//       map[item.time] = item.rank;
//     });
//     return map;
//   }, [top3]);

//   const handleVote = () => {
//     if (!selectedId) return;
//     setHasVoted(true);
//     // 실제 서버 전송/집계는 과제 범위 밖이므로 여기서는 UI 상태만 처리
//   };

//   if (candidates.length === 0) {
//     return (
//       <div className="p-6 rounded-xl bg-white border border-gray-200">
//         이 그룹에 대한 시간 후보 데이터가 없습니다. (groupId: {groupId})
//         <p className="mt-2 text-sm text-gray-500">
//           그룹 타임라인에서 최적 모임 시간 TOP 3를 먼저 계산해 주세요.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
//       {/* 왼쪽: 요약 / 전환 */}
//       <section className="xl:col-span-1 space-y-4">
//         <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
//           <div className="flex items-center gap-3 mb-4">
//             <Users className="w-6 h-6 text-indigo-600" />
//             <div>
//               <h2 className="text-lg font-bold text-gray-800">참여 현황</h2>
//               <p className="text-xs text-gray-500">
//                 모임 시간 투표로 모두의 의견을 모아요.
//               </p>
//             </div>
//           </div>

//           <div className="flex items-baseline justify-between mb-4">
//             <div>
//               <p className="text-xs text-gray-500 mb-1">참여 인원</p>
//               <p className="text-3xl font-extrabold text-gray-800">
//                 {participants.length}
//                 <span className="ml-1 text-sm font-semibold text-gray-500">
//                   명
//                 </span>
//               </p>
//             </div>
//             <div className="text-right">
//               <p className="text-xs text-gray-500 mb-1">후보 시간</p>
//               <p className="text-xl font-bold text-indigo-600">
//                 {candidates.length}
//                 <span className="ml-1 text-xs font-medium text-gray-500">
//                   개
//                 </span>
//               </p>
//             </div>
//           </div>

//           {meetingInfo && (
//             <div className="mt-2 rounded-xl bg-indigo-50 px-4 py-3 text-xs text-indigo-900">
//               <p className="font-semibold mb-1">현재 모임 정보</p>
//               <p className="truncate">
//                 {meetingInfo.date} · {meetingInfo.time} · {meetingInfo.location}
//               </p>
//             </div>
//           )}

//           <button
//             type="button"
//             onClick={onSwitchToRoulette}
//             className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition"
//           >
//             <ArrowLeftRight className="w-4 h-4" />
//             타임룰렛으로 전환
//           </button>
//         </div>

//         {/* TOP3 카드 */}
//         <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
//           <div className="flex items-center gap-2 mb-4">
//             <Crown className="w-5 h-5 text-yellow-500" />
//             <h3 className="text-sm font-bold text-gray-800">
//               최적 모임 시간 TOP 3
//             </h3>
//           </div>

//           {top3.length === 0 && (
//             <p className="text-xs text-gray-500">
//               타임라인 데이터가 없어서 TOP3를 계산할 수 없습니다.
//             </p>
//           )}

//           <ol className="space-y-3">
//             {top3.map((item) => (
//               <li
//                 key={item.rank}
//                 className="flex items-start justify-between gap-2"
//               >
//                 <div className="flex items-center gap-2">
//                   <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 text-[11px] font-bold text-indigo-600">
//                     {item.rank}
//                   </span>
//                   <div>
//                     <p className="text-xs font-semibold text-gray-800">
//                       {item.time}
//                     </p>
//                     <p className="text-[11px] text-gray-500 truncate max-w-[180px]">
//                       {item.members}
//                     </p>
//                   </div>
//                 </div>
//                 <span className="text-[11px] font-semibold text-indigo-600">
//                   {item.percent}%
//                 </span>
//               </li>
//             ))}
//           </ol>
//         </div>
//       </section>

//       {/* 오른쪽: 투표 리스트 */}
//       <section className="xl:col-span-2">
//         <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <h2 className="text-lg font-bold text-gray-800">
//                 후보 시간 투표
//               </h2>
//               <p className="text-xs text-gray-500 mt-1">
//                 한 가지 시간을 선택해서 투표해 주세요.
//               </p>
//             </div>
//             {hasVoted && (
//               <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1">
//                 <CheckCircle2 className="w-4 h-4 text-emerald-500" />
//                 <span className="text-[11px] font-semibold text-emerald-700">
//                   투표 완료
//                 </span>
//               </div>
//             )}
//           </div>

//           <div className="space-y-3">
//             {candidates.map((c) => {
//               const percentage = Math.round(
//                 (c.availableCount / totalParticipants) * 100
//               );
//               const rank = topRankMap[c.timeLabel]; // 1,2,3 | undefined
//               const isSelected = selectedId === c.id;

//               const badgeColor =
//                 rank === 1
//                   ? "bg-yellow-100 text-yellow-700 border-yellow-200"
//                   : rank === 2
//                     ? "bg-gray-100 text-gray-700 border-gray-200"
//                     : rank === 3
//                       ? "bg-amber-50 text-amber-700 border-amber-200"
//                       : "bg-gray-50 text-gray-500 border-gray-200";

//               return (
//                 <button
//                   type="button"
//                   key={c.id}
//                   onClick={() => setSelectedId(c.id)}
//                   className={[
//                     "w-full text-left rounded-xl border px-4 py-3 transition flex flex-col gap-2",
//                     isSelected
//                       ? "border-indigo-500 ring-2 ring-indigo-200 bg-indigo-50/60"
//                       : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/40",
//                   ].join(" ")}
//                 >
//                   <div className="flex items-center justify-between gap-2">
//                     <div className="flex items-center gap-2">
//                       <div
//                         className={[
//                           "h-4 w-4 rounded-full border flex items-center justify-center",
//                           isSelected
//                             ? "border-indigo-600 bg-indigo-600"
//                             : "border-gray-400",
//                         ].join(" ")}
//                       >
//                         {isSelected && (
//                           <div className="h-1.5 w-1.5 rounded-full bg-white" />
//                         )}
//                       </div>
//                       <span className="text-sm font-semibold text-gray-800">
//                         {c.timeLabel}
//                       </span>
//                     </div>

//                     <div
//                       className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${badgeColor}`}
//                     >
//                       {rank ? (
//                         <>
//                           <Crown className="w-3 h-3" />
//                           <span>{rank}위</span>
//                         </>
//                       ) : (
//                         <span>후보</span>
//                       )}
//                     </div>
//                   </div>

//                   {c.availableNames && c.availableNames.length > 0 && (
//                     <p className="text-[11px] text-gray-500">
//                       가능 인원: {c.availableNames.join(", ")}
//                     </p>
//                   )}

//                   <div className="flex items-center justify-between text-[11px] text-gray-500">
//                     <span>
//                       {c.availableCount}/{totalParticipants} 명 가능
//                     </span>
//                     <span className="font-semibold text-indigo-600">
//                       {percentage}%
//                     </span>
//                   </div>

//                   <div className="mt-1 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
//                     <div
//                       className="h-full rounded-full bg-indigo-500"
//                       style={{ width: `${percentage}%` }}
//                     />
//                   </div>
//                 </button>
//               );
//             })}
//           </div>

//           <div className="mt-5 flex items-center justify-between">
//             <p className="text-[11px] text-gray-500">
//               * 실제 투표 집계 서버 연동 전에는 화면에만 반영됩니다.
//             </p>
//             <button
//               type="button"
//               onClick={handleVote}
//               disabled={!selectedId || hasVoted}
//               className={[
//                 "inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold transition",
//                 !selectedId || hasVoted
//                   ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                   : "bg-indigo-600 text-white hover:bg-indigo-700",
//               ].join(" ")}
//             >
//               {hasVoted ? "투표 완료" : "이 시간으로 투표하기"}
//             </button>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default VotePanel;
