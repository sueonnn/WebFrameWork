// import React, { useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import TimeRoulette from "./TimeRoulette";
// import FinalDecisionModal from "./FinalDecisionModal";
// import { GROUP_TIME_DECISIONS, MEMBERS, MEETING_INFOS } from "../../mock";
// import type { GroupTimeDecision, TimeDecisionCandidate } from "../../mock";

// type RoulettePanelProps = {
//   groupId: string;
//   onSwitchToVote: () => void;
// };

// const COLORS = ["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6"];

// const RoulettePanel: React.FC<RoulettePanelProps> = ({
//   groupId,
//   onSwitchToVote,
// }) => {
//   const navigate = useNavigate();

//   // 모달 상태 관리
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [winnerTime, setWinnerTime] = useState("");

//   const [winnerAvailableCount, setWinnerAvailableCount] = useState(0);
//   const [winnerAvailableNames, setWinnerAvailableNames] = useState<string[]>(
//     []
//   );

//   //  가중치 on/off 상태
//   const [useWeighted, setUseWeighted] = useState(true);

//   const decision: GroupTimeDecision | undefined = useMemo(
//     () => GROUP_TIME_DECISIONS.find((d) => d.groupId === groupId),
//     [groupId]
//   );

//   // 모임 정보 (참가자 이름용)
//   const meeting = useMemo(
//     () =>
//       decision
//         ? MEETING_INFOS.find((m) => m.id === decision.meetingId)
//         : undefined,
//     [decision]
//   );

//   const participants = meeting?.participants ?? [];

//   // 멤버 ID -> 이름 매핑
//   const memberMap = useMemo(() => {
//     const map: Record<string, string> = {};
//     MEMBERS.forEach((m) => {
//       map[m.id] = m.name;
//     });
//     return map;
//   }, []);

//   // ✅ 룰렛 세그먼트 생성 (체크박스로 가중치 on/off)
//   const rouletteSegments = useMemo(
//     () =>
//       decision
//         ? decision.candidates.map((c, idx) => ({
//             label: c.timeLabel,
//             color: COLORS[idx % COLORS.length],
//             weight: useWeighted ? c.availableMemberIds.length || 1 : 1,
//           }))
//         : [],
//     [decision, useWeighted]
//   );

//   const totalParticipants = participants.length || 1;

//   // 룰렛 회전 완료 시 호출될 콜백 함수
//   const handleRouletteFinish = (result: string) => {
//     setWinnerTime(result);

//     const winnerCandidate = decision?.candidates.find(
//       (c) => c.timeLabel === result
//     );

//     if (winnerCandidate) {
//       setWinnerAvailableCount(winnerCandidate.availableMemberIds.length);
//       setWinnerAvailableNames(
//         winnerCandidate.availableMemberIds.map((id) => memberMap[id] ?? id)
//       );
//     } else {
//       setWinnerAvailableCount(0);
//       setWinnerAvailableNames([]);
//     }

//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   const handleSpinAgain = () => {
//     setIsModalOpen(false);
//     setWinnerTime("");
//   };

//   // 확정하기 → history 페이지 이동
//   const handleConfirmFinalDecision = () => {
//     setIsModalOpen(false);
//     navigate("/history");
//   };

//   if (!decision || rouletteSegments.length === 0) {
//     return (
//       <div className="p-6 rounded-xl bg-white border border-gray-200">
//         이 그룹에 대한 시간 후보 데이터가 없습니다. (groupId: {groupId})
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
//       {/* 좌측: 룰렛 */}
//       <div className="lg:col-span-1 p-6 bg-white rounded-lg shadow-xl border border-gray-100 flex flex-col items-center h-full">
//         <h2 className="text-2xl font-bold mb-6 text-gray-700">운명의 룰렛</h2>

//         <TimeRoulette
//           segments={rouletteSegments}
//           onFinish={handleRouletteFinish}
//         />

//         {/* 가중치 체크박스 실제 동작 */}
//         <div className="flex items-center my-6">
//           <input
//             id="ratio-checkbox"
//             type="checkbox"
//             checked={useWeighted}
//             onChange={(e) => setUseWeighted(e.target.checked)}
//             className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//           />
//           <label
//             htmlFor="ratio-checkbox"
//             className="ml-2 text-sm text-gray-600"
//           >
//             가능 인원 비율로 가중
//           </label>
//         </div>

//         <div className="w-full mt-auto">
//           <div className="flex items-center justify-between bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500 mb-2">
//             <span className="text-3xl font-bold text-yellow-700">
//               {participants.length}
//             </span>
//             <button
//               className="px-4 py-2 text-sm font-semibold text-indigo-600 border border-indigo-300 rounded-md hover:bg-indigo-50 transition duration-150"
//               onClick={onSwitchToVote}
//             >
//               투표로 전환
//             </button>
//           </div>
//           <p className="text-xs text-gray-500 mt-2 text-center">
//             룰렛이 부담된다면 투표로 전환하세요.
//           </p>
//         </div>
//       </div>

//       {/* 우측 후보 시간 영역 (기존 그대로) */}
//       <div className="lg:col-span-2">
//         <h2 className="text-2xl font-bold mb-6 text-gray-700">후보 시간들</h2>
//         <div className="space-y-4">
//           {decision.candidates.map((c: TimeDecisionCandidate) => {
//             const availCount = c.availableMemberIds.length;
//             const percentage = Math.round(
//               (availCount / totalParticipants) * 100
//             );
//             const availableNames = c.availableMemberIds
//               .map((id) => memberMap[id] ?? id)
//               .join(", ");

//             const colorClass =
//               percentage === 100
//                 ? "text-green-600"
//                 : percentage >= 75
//                   ? "text-blue-600"
//                   : "text-yellow-600";

//             return (
//               <div
//                 key={c.id}
//                 className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition"
//               >
//                 <div className="flex justify-between items-center mb-2">
//                   <h3 className="text-lg font-bold text-gray-800">
//                     {c.timeLabel}
//                   </h3>
//                   <span className={`text-sm font-semibold ${colorClass}`}>
//                     {availCount}/{totalParticipants} 가능
//                   </span>
//                 </div>
//                 <p className="text-xs text-gray-500 mb-3">{availableNames}</p>

//                 <div className="flex justify-between items-center mt-2">
//                   <span className="text-sm text-gray-600">
//                     {percentage}% 가능
//                   </span>
//                   <span className="text-sm text-indigo-600 font-medium">
//                     단장님 우선
//                   </span>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* 최종 결정 모달 */}
//       <FinalDecisionModal
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         onSpinAgain={handleSpinAgain}
//         onConfirm={handleConfirmFinalDecision}
//         resultTime={winnerTime}
//         availableCount={winnerAvailableCount}
//         totalParticipants={totalParticipants}
//         availableMemberNames={winnerAvailableNames}
//       />
//     </div>
//   );
// };

// export default RoulettePanel;

// components/specific/RoulettePanel.tsx
// import React, { useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import TimeRoulette from "./TimeRoulette";
// import FinalDecisionModal from "./FinalDecisionModal";
// import { GROUP_TIME_DECISIONS, MEMBERS, MEETING_INFOS } from "../../mock";
// import type { GroupTimeDecision, TimeDecisionCandidate } from "../../mock";
// import { useMeetingInfoStore } from "../../stores/meetingInfoStore";

// type RoulettePanelProps = {
//   groupId: string;
//   onSwitchToVote: () => void;
// };

// const COLORS = ["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6"];

// const RoulettePanel: React.FC<RoulettePanelProps> = ({
//   groupId,
//   onSwitchToVote,
// }) => {
//   const navigate = useNavigate();

//   // 모달 상태 관리
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [winnerTime, setWinnerTime] = useState("");

//   const [winnerAvailableCount, setWinnerAvailableCount] = useState(0);
//   const [winnerAvailableNames, setWinnerAvailableNames] = useState<string[]>(
//     []
//   );

//   // 가중치 on/off 상태
//   const [useWeighted, setUseWeighted] = useState(true);

//   const decision: GroupTimeDecision | undefined = useMemo(
//     () => GROUP_TIME_DECISIONS.find((d) => d.groupId === groupId),
//     [groupId]
//   );

//   // 모임 정보 (참가자 이름용)
//   const meeting = useMemo(
//     () =>
//       decision
//         ? MEETING_INFOS.find((m) => m.id === decision.meetingId)
//         : undefined,
//     [decision]
//   );

//   const participants = meeting?.participants ?? [];

//   // 멤버 ID -> 이름 매핑
//   const memberMap = useMemo(() => {
//     const map: Record<string, string> = {};
//     MEMBERS.forEach((m) => {
//       map[m.id] = m.name;
//     });
//     return map;
//   }, []);

//   // 룰렛 세그먼트 생성 (체크박스로 가중치 on/off)
//   const rouletteSegments = useMemo(
//     () =>
//       decision
//         ? decision.candidates.map((c, idx) => ({
//             label: c.timeLabel,
//             color: COLORS[idx % COLORS.length],
//             weight: useWeighted ? c.availableMemberIds.length || 1 : 1,
//           }))
//         : [],
//     [decision, useWeighted]
//   );

//   const totalParticipants = participants.length || 1;

//   // 룰렛 회전 완료 시 호출될 콜백 함수
//   const handleRouletteFinish = (result: string) => {
//     setWinnerTime(result);

//     const winnerCandidate = decision?.candidates.find(
//       (c) => c.timeLabel === result
//     );

//     if (winnerCandidate) {
//       setWinnerAvailableCount(winnerCandidate.availableMemberIds.length);
//       setWinnerAvailableNames(
//         winnerCandidate.availableMemberIds.map((id) => memberMap[id] ?? id)
//       );
//     } else {
//       setWinnerAvailableCount(0);
//       setWinnerAvailableNames([]);
//     }

//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   const handleSpinAgain = () => {
//     setIsModalOpen(false);
//     setWinnerTime("");
//   };

//   // ✅ 확정하기 → 체크리스트 상세 페이지로 이동 + mock에 확정된 시간 반영 (5번·6번 흐름)
//   const handleConfirmFinalDecision = () => {
//     setIsModalOpen(false);

//     // winnerTime 이 정해져 있다면 그 값을 확정 시간으로 사용
//     const confirmedTime = winnerTime;

//     if (decision) {
//       // 현재 그룹에 해당하는 meeting 찾기
//       const meetingIndex = MEETING_INFOS.findIndex(
//         (m) => m.id === decision.meetingId
//       );

//       // mock 데이터에 확정된 시간 반영 (time 필드 사용)
//       if (meetingIndex !== -1 && confirmedTime) {
//         MEETING_INFOS[meetingIndex] = {
//           ...MEETING_INFOS[meetingIndex],
//           time: confirmedTime,
//         };
//       }

//       // 해당 모임의 체크리스트 상세 페이지로 이동
//       navigate(`/groups/checklist/${decision.meetingId}`);
//     } else {
//       // 혹시 decision 이 없을 때를 위한 fallback (g1 → m1 기준)
//       if (confirmedTime) {
//         const fallbackIndex = MEETING_INFOS.findIndex((m) => m.id === "m1");
//         if (fallbackIndex !== -1) {
//           MEETING_INFOS[fallbackIndex] = {
//             ...MEETING_INFOS[fallbackIndex],
//             time: confirmedTime,
//           };
//         }
//       }
//       navigate("/groups/checklist/m1");
//     }
//   };

//   if (!decision || rouletteSegments.length === 0) {
//     return (
//       <div className="p-6 rounded-xl bg-white border border-gray-200">
//         이 그룹에 대한 시간 후보 데이터가 없습니다. (groupId: {groupId})
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
//       {/* 좌측: 룰렛 */}
//       <div className="lg:col-span-1 p-6 bg-white rounded-lg shadow-xl border border-gray-100 flex flex-col items-center h-full">
//         <h2 className="text-2xl font-bold mb-6 text-gray-700">운명의 룰렛</h2>

//         <TimeRoulette
//           segments={rouletteSegments}
//           onFinish={handleRouletteFinish}
//         />

//         {/* 가중치 체크박스 */}
//         <div className="flex items-center my-6">
//           <input
//             id="ratio-checkbox"
//             type="checkbox"
//             checked={useWeighted}
//             onChange={(e) => setUseWeighted(e.target.checked)}
//             className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//           />
//           <label
//             htmlFor="ratio-checkbox"
//             className="ml-2 text-sm text-gray-600"
//           >
//             가능 인원 비율로 가중
//           </label>
//         </div>

//         <div className="w-full mt-auto">
//           <div className="flex items-center justify-between bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500 mb-2">
//             <span className="text-3xl font-bold text-yellow-700">
//               {participants.length}
//             </span>
//             <button
//               className="px-4 py-2 text-sm font-semibold text-indigo-600 border border-indigo-300 rounded-md hover:bg-indigo-50 transition duration-150"
//               onClick={onSwitchToVote}
//             >
//               투표로 전환
//             </button>
//           </div>
//           <p className="text-xs text-gray-500 mt-2 text-center">
//             룰렛이 부담된다면 투표로 전환하세요.
//           </p>
//         </div>
//       </div>

//       {/* 우측 후보 시간 영역 */}
//       <div className="lg:col-span-2">
//         <h2 className="text-2xl font-bold mb-6 text-gray-700">후보 시간들</h2>
//         <div className="space-y-4">
//           {decision.candidates.map((c: TimeDecisionCandidate) => {
//             const availCount = c.availableMemberIds.length;
//             const percentage = Math.round(
//               (availCount / totalParticipants) * 100
//             );
//             const availableNames = c.availableMemberIds
//               .map((id) => memberMap[id] ?? id)
//               .join(", ");

//             const colorClass =
//               percentage === 100
//                 ? "text-green-600"
//                 : percentage >= 75
//                   ? "text-blue-600"
//                   : "text-yellow-600";

//             return (
//               <div
//                 key={c.id}
//                 className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition"
//               >
//                 <div className="flex justify-between items-center mb-2">
//                   <h3 className="text-lg font-bold text-gray-800">
//                     {c.timeLabel}
//                   </h3>
//                   <span className={`text-sm font-semibold ${colorClass}`}>
//                     {availCount}/{totalParticipants} 가능
//                   </span>
//                 </div>
//                 <p className="text-xs text-gray-500 mb-3">{availableNames}</p>

//                 <div className="flex justify-between items-center mt-2">
//                   <span className="text-sm text-gray-600">
//                     {percentage}% 가능
//                   </span>
//                   <span className="text-sm text-indigo-600 font-medium">
//                     단장님 우선
//                   </span>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* 최종 결정 모달 */}
//       <FinalDecisionModal
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         onSpinAgain={handleSpinAgain}
//         onConfirm={handleConfirmFinalDecision}
//         resultTime={winnerTime}
//         availableCount={winnerAvailableCount}
//         totalParticipants={totalParticipants}
//         availableMemberNames={winnerAvailableNames}
//       />
//     </div>
//   );
// };

// export default RoulettePanel;

import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TimeRoulette from "./TimeRoulette";
import FinalDecisionModal from "./FinalDecisionModal";
import { GROUP_TIME_DECISIONS, MEMBERS } from "../../mock";
import type { GroupTimeDecision, TimeDecisionCandidate } from "../../mock";
import { useMeetingInfoStore } from "../../stores/meetingInfoStore";

type RoulettePanelProps = {
  groupId: string;
  onSwitchToVote: () => void;
};

const COLORS = ["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6"];

const RoulettePanel: React.FC<RoulettePanelProps> = ({
  groupId,
  onSwitchToVote,
}) => {
  const navigate = useNavigate();

  // 시간 업데이트 액션 (store)
  const updateTimeByMeetingId = useMeetingInfoStore(
    (s) => s.updateTimeByMeetingId
  );

  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [winnerTime, setWinnerTime] = useState("");

  const [winnerAvailableCount, setWinnerAvailableCount] = useState(0);
  const [winnerAvailableNames, setWinnerAvailableNames] = useState<string[]>(
    []
  );

  // 가중치 on/off 상태
  const [useWeighted, setUseWeighted] = useState(true);

  const decision: GroupTimeDecision | undefined = useMemo(
    () => GROUP_TIME_DECISIONS.find((d) => d.groupId === groupId),
    [groupId]
  );

  // 모임 정보 (참가자 이름용) - store에서 읽기
  const meeting = useMeetingInfoStore((s) =>
    decision ? s.getByMeetingId(decision.meetingId) : undefined
  );

  const participants = meeting?.participants ?? [];

  // 멤버 ID -> 이름 매핑
  const memberMap = useMemo(() => {
    const map: Record<string, string> = {};
    MEMBERS.forEach((m) => {
      map[m.id] = m.name;
    });
    return map;
  }, []);

  // 룰렛 세그먼트 생성 (체크박스로 가중치 on/off)
  const rouletteSegments = useMemo(
    () =>
      decision
        ? decision.candidates.map((c, idx) => ({
            label: c.timeLabel,
            color: COLORS[idx % COLORS.length],
            weight: useWeighted ? c.availableMemberIds.length || 1 : 1,
          }))
        : [],
    [decision, useWeighted]
  );

  const totalParticipants = participants.length || 1;

  // 룰렛 회전 완료 시 호출될 콜백 함수
  const handleRouletteFinish = (result: string) => {
    setWinnerTime(result);

    const winnerCandidate = decision?.candidates.find(
      (c) => c.timeLabel === result
    );

    if (winnerCandidate) {
      setWinnerAvailableCount(winnerCandidate.availableMemberIds.length);
      setWinnerAvailableNames(
        winnerCandidate.availableMemberIds.map((id) => memberMap[id] ?? id)
      );
    } else {
      setWinnerAvailableCount(0);
      setWinnerAvailableNames([]);
    }

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSpinAgain = () => {
    setIsModalOpen(false);
    setWinnerTime("");
  };

  // 확정하기 → 체크리스트 상세 페이지로 이동 + mock에 확정된 시간 반영 (5번·6번 흐름)
  const handleConfirmFinalDecision = () => {
    setIsModalOpen(false);

    if (!decision || !winnerTime) return;

    // 시간 확정 값을 store에 업데이트
    updateTimeByMeetingId(decision.meetingId, winnerTime);

    // 해당 모임의 체크리스트 상세 페이지로 이동
    navigate(`/groups/checklist/${decision.meetingId}`);
  };

  if (!decision || rouletteSegments.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-white border border-gray-200">
        이 그룹에 대한 시간 후보 데이터가 없습니다. (groupId: {groupId})
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* 좌측: 룰렛 */}
      <div className="lg:col-span-1 p-6 bg-white rounded-lg shadow-xl border border-gray-100 flex flex-col items-center h-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">운명의 룰렛</h2>

        <TimeRoulette
          segments={rouletteSegments}
          onFinish={handleRouletteFinish}
        />

        {/* 가중치 체크박스 */}
        <div className="flex items-center my-6">
          <input
            id="ratio-checkbox"
            type="checkbox"
            checked={useWeighted}
            onChange={(e) => setUseWeighted(e.target.checked)}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label
            htmlFor="ratio-checkbox"
            className="ml-2 text-sm text-gray-600"
          >
            가능 인원 비율로 가중
          </label>
        </div>

        <div className="w-full mt-auto">
          <div className="flex items-center justify-between bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500 mb-2">
            <span className="text-3xl font-bold text-yellow-700">
              {participants.length}
            </span>
            <button
              className="px-4 py-2 text-sm font-semibold text-indigo-600 border border-indigo-300 rounded-md hover:bg-indigo-50 transition duration-150"
              onClick={onSwitchToVote}
            >
              투표로 전환
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            룰렛이 부담된다면 투표로 전환하세요.
          </p>
        </div>
      </div>

      {/* 우측 후보 시간 영역 */}
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">후보 시간들</h2>
        <div className="space-y-4">
          {decision.candidates.map((c: TimeDecisionCandidate) => {
            const availCount = c.availableMemberIds.length;
            const percentage = Math.round(
              (availCount / totalParticipants) * 100
            );
            const availableNames = c.availableMemberIds
              .map((id) => memberMap[id] ?? id)
              .join(", ");

            const colorClass =
              percentage === 100
                ? "text-green-600"
                : percentage >= 75
                  ? "text-blue-600"
                  : "text-yellow-600";

            return (
              <div
                key={c.id}
                className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold text-gray-800">
                    {c.timeLabel}
                  </h3>
                  <span className={`text-sm font-semibold ${colorClass}`}>
                    {availCount}/{totalParticipants} 가능
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-3">{availableNames}</p>

                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-600">
                    {percentage}% 가능
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 최종 결정 모달 */}
      <FinalDecisionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSpinAgain={handleSpinAgain}
        onConfirm={handleConfirmFinalDecision}
        resultTime={winnerTime}
        availableCount={winnerAvailableCount}
        totalParticipants={totalParticipants}
        availableMemberNames={winnerAvailableNames}
      />
    </div>
  );
};

export default RoulettePanel;
