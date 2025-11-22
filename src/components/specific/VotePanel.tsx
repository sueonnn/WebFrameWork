import React, { useMemo } from "react";
import { Clock } from "lucide-react";
import { GROUP_TIME_DECISIONS, MEMBERS, MEETING_INFOS } from "../../mock";
import type { GroupTimeDecision, TimeDecisionCandidate } from "../../mock";

type VotePanelProps = {
  groupId: string;
  onSwitchToRoulette: () => void;
};

type VoteCardProps = {
  timeLabel: string;
  agreeNames: string[];
  pendingNames: string[];
  totalParticipants: number;
};

// 투표 항목 카드 컴포넌트
const VoteCard: React.FC<VoteCardProps> = ({   timeLabel,
  agreeNames,
  pendingNames,
  totalParticipants,
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
          {/* 사용자 투표 버튼 (임시) */}
          <div className="flex space-x-2 flex-shrink-0">
            <button className="text-xs px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-full hover:bg-indigo-100">
              찬성
            </button>
            <button className="text-xs px-3 py-1 bg-gray-50 border border-gray-200 text-gray-600 rounded-full hover:bg-gray-100">
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
            {/* 이 시간으로 확정 버튼 (임시) */}
            <button className="text-xs text-white bg-indigo-600 px-3 py-1 rounded-full shadow-md hover:bg-indigo-700 flex-shrink-0">
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
        <span className="text-indigo-600">찬성 (1표)</span>
      </div>
    </div>
  );
};

const VotePanel: React.FC<VotePanelProps> =  ({
  groupId,
  onSwitchToRoulette,
}) => {
  const decision: GroupTimeDecision | undefined = useMemo(
    () => GROUP_TIME_DECISIONS.find((d) => d.groupId === groupId),
    [groupId]
  );

  const meeting = useMemo(
    () =>
      decision
        ? MEETING_INFOS.find((m) => m.id === decision.meetingId)
        : undefined,
    [decision]
  );

  const participants = meeting?.participants ?? [];
  const totalParticipants = participants.length || 1;

  const memberMap = useMemo(() => {
    const map: Record<string, string> = {};
    MEMBERS.forEach((m) => (map[m.id] = m.name));
    return map;
  }, []);

  if (!decision) {
    return (
      <div className="p-6 rounded-xl bg-white border border-gray-200">
        이 그룹에 대한 투표 데이터가 없습니다. (groupId: {groupId})
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 상단 마감 및 확정 버튼 영역 */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-lg border border-gray-200">
        <div className="flex items-center text-gray-700">
          <Clock className="w-5 h-5 mr-2 text-indigo-600" />
          <span className="font-semibold">투표 마감까지</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-xl font-extrabold text-indigo-600">
            23시간 59분 44초
          </span>
          <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 transition duration-150">
            확대 투표로 확정
          </button>
        </div>
      </div>

      {/* 각 투표 항목 렌더링 */}
      <div className="space-y-6">
        {decision.candidates.map((c: TimeDecisionCandidate) => {
          const agreeNames = c.voteAgreeIds.map(
            (id) => memberMap[id] ?? id
          );
          const pendingNames = c.votePendingIds.map(
            (id) => memberMap[id] ?? id
          );

          return (
            <VoteCard
              key={c.id}
              timeLabel={c.timeLabel}
              agreeNames={agreeNames}
              pendingNames={pendingNames}
              totalParticipants={totalParticipants}
            />
          );
        })}
      </div>

      {/* 하단 룰렛 전환 버튼 */}
      <div className="flex justify-between items-center bg-yellow-50 p-6 rounded-xl border-l-4 border-yellow-500 shadow-lg">
        <p className="text-sm text-yellow-800">
          <span className="text-2xl font-bold mr-2">{participants.length}</span>명이 아직 투표하지
          않았다면 룰렛으로 결정해 보세요!
        </p>
        <button className="px-4 py-2 text-sm font-semibold text-indigo-600 border border-indigo-300 rounded-md hover:bg-indigo-50 transition duration-150"
        onClick={onSwitchToRoulette}>
          타임룰렛으로 전환
        </button>
      </div>
    </div>
  );
};

export default VotePanel;
