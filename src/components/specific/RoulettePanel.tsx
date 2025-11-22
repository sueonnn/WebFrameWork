import React, { useMemo, useState } from "react";
import TimeRoulette from "./TimeRoulette";
import FinalDecisionModal from "./FinalDecisionModal";
import { GROUP_TIME_DECISIONS, MEMBERS, MEETING_INFOS } from "../../mock";
import type { GroupTimeDecision, TimeDecisionCandidate } from "../../mock";

type RoulettePanelProps = {
  groupId: string;
  onSwitchToVote: () => void;
};

const COLORS = ["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6"];

const RoulettePanel: React.FC<RoulettePanelProps> = ({
  groupId,
  onSwitchToVote,
})  => {
  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [winnerTime, setWinnerTime] = useState("");

  const decision: GroupTimeDecision | undefined = useMemo(
    () => GROUP_TIME_DECISIONS.find((d) => d.groupId === groupId),
    [groupId]
  );

  // 모임 정보 (참가자 이름용)
  const meeting = useMemo(
    () =>
      decision
        ? MEETING_INFOS.find((m) => m.id === decision.meetingId)
        : undefined,
    [decision]
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

  //  룰렛 세그먼트 생성 (가능 인원 수로 가중치)
  const rouletteSegments =
    decision?.candidates.map((c, idx) => ({
      label: c.timeLabel,
      color: COLORS[idx % COLORS.length],
      weight: c.availableMemberIds.length || 1,
    })) ?? [];

  // 룰렛 회전 완료 시 호출될 콜백 함수
  const handleRouletteFinish = (result: string) => {
    setWinnerTime(result);
    setIsModalOpen(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // 다시 돌리기 버튼 클릭 핸들러 (모달 닫고, 룰렛 상태 초기화)
  const handleSpinAgain = () => {
    setIsModalOpen(false);
    setWinnerTime("");
    // NOTE: 룰렛을 다시 돌리려면 TimeRoulette 내부의 상태를 초기화해야 하지만,
    // 현재는 모달만 닫고 다시 돌릴 수 있는 환경을 제공합니다.
  };

  if (!decision || rouletteSegments.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-white border border-gray-200">
        이 그룹에 대한 시간 후보 데이터가 없습니다. (groupId: {groupId})
      </div>
    );
  }

  const totalParticipants = participants.length || 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* 1. 좌측 룰렛 및 전환 버튼 영역 (W-1/3) */}
      {/* h-full을 사용하여 부모 flex-1 영역 내에서 높이를 채우도록 보장 */}
      <div className="lg:col-span-1 p-6 bg-white rounded-lg shadow-xl border border-gray-100 flex flex-col items-center h-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">운명의 룰렛</h2>

        {/* 실제 룰렛 캔버스 컴포넌트 */}
        {/* onFinish prop을 통해 회전 완료 결과를 받습니다. */}
        <TimeRoulette
          segments={rouletteSegments}
          onFinish={handleRouletteFinish}
        />

        {/* 가능 인원 비율 체크박스 */}
        <div className="flex items-center my-6">
          <input
            id="ratio-checkbox"
            type="checkbox"
            defaultChecked
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label
            htmlFor="ratio-checkbox"
            className="ml-2 text-sm text-gray-600"
          >
            가능 인원 비율로 가중
          </label>
        </div>

        {/* 투표 전환 버튼 */}
        <div className="w-full mt-auto">
          {" "}
          {/* mt-auto로 아래로 밀어냄 */}
          <div className="flex items-center justify-between bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500 mb-2">
            <span className="text-3xl font-bold text-yellow-700">{participants.length}</span>
            <button className="px-4 py-2 text-sm font-semibold text-indigo-600 border border-indigo-300 rounded-md hover:bg-indigo-50 transition duration-150"
            onClick={onSwitchToVote}>
              투표로 전환
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            룰렛이 부담된다면 투표로 전환하세요.
          </p>
        </div>
      </div>

      {/* 2. 우측 후보 시간 영역 (W-2/3) */}
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

            // 색상 클래스는 간단히 퍼센트 기준으로
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
                  <span className="text-sm text-indigo-600 font-medium">
                    단장님 우선
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
        resultTime={winnerTime}
      />
    </div>
  );
};

export default RoulettePanel;
