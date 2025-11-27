// src/components/specific/RoulettePanel.tsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TimeRoulette from "./TimeRoulette";
import FinalDecisionModal from "./FinalDecisionModal";
import { useMeetingInfoStore } from "../../stores/meetingInfoStore";
import { useTimeDecisionStore } from "../../stores/timeDecisionStore";

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

  // 모임 정보 (참가자 수 표시용)
  const meeting = useMeetingInfoStore((s) => s.getByGroupId(groupId));
  const participants = meeting?.participants ?? [];

  // 시간 후보 데이터는 이제 전역 store에서 가져옴
  const { candidates } = useTimeDecisionStore();

  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [winnerTime, setWinnerTime] = useState("");

  const [winnerAvailableCount, setWinnerAvailableCount] = useState(0);
  const [winnerAvailableNames, setWinnerAvailableNames] = useState<string[]>(
    []
  );

  // 가중치 on/off 상태
  const [useWeighted, setUseWeighted] = useState(true);

  // 룰렛 세그먼트 생성 (체크박스로 가중치 on/off)
  const rouletteSegments = useMemo(() => {
    if (!candidates || candidates.length === 0) return [];

    return candidates.map((c, idx) => ({
      label: c.timeLabel,
      color: COLORS[idx % COLORS.length],
      weight: useWeighted ? c.availableCount || 1 : 1,
    }));
  }, [candidates, useWeighted]);

  const totalParticipants = participants.length || 1;

  // 룰렛 회전 완료 시 호출될 콜백 함수
  const handleRouletteFinish = (result: string) => {
    setWinnerTime(result);

    const winnerCandidate = candidates.find((c) => c.timeLabel === result);

    if (winnerCandidate) {
      const count = winnerCandidate.availableCount ?? 0;
      setWinnerAvailableCount(count);
      setWinnerAvailableNames(winnerCandidate.availableNames ?? []);
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

  // 확정하기 → 체크리스트 상세 페이지로 이동 + store에 확정된 시간 반영
  const handleConfirmFinalDecision = () => {
    setIsModalOpen(false);

    if (!meeting || !winnerTime) return;

    // 시간 확정 값을 store에 업데이트
    updateTimeByMeetingId(meeting.id, winnerTime);

    // 해당 모임의 체크리스트 상세 페이지로 이동
    navigate(`/groups/checkstory/${meeting.id}`);
  };

  if (!candidates || rouletteSegments.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-white border border-gray-200">
        이 그룹에 대한 시간 후보 데이터가 없습니다. (groupId: {groupId})
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-1 p-6 bg-white rounded-lg shadow-xl border border-gray-100 flex flex-col items-center h-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">운명의 룰렛</h2>

        <TimeRoulette
          segments={rouletteSegments}
          onFinish={handleRouletteFinish}
        />

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

      {/* 우측 후보 시간 영역 (기존 UI) */}
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">후보 시간들</h2>
        <div className="space-y-4">
          {candidates.map((c) => {
            const availCount = c.availableCount ?? 0;
            const percentage = Math.round(
              (availCount / totalParticipants) * 100
            );
            const availableNames = (c.availableNames ?? []).join(", ");

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
        totalParticipants={participants.length || 1}
        availableMemberNames={winnerAvailableNames}
      />
    </div>
  );
};

export default RoulettePanel;
