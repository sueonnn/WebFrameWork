import React, { useState } from "react";
import TimeRoulette from "./TimeRoulette";
import FinalDecisionModal from "./FinalDecisionModal"; // 모달 컴포넌트 import

// 임시 데이터를 위한 참가자 이름 목록
const mockParticipants = [
  "김철수",
  "이영희",
  "박민수",
  "최지영",
  "정다은",
  "한상우",
];

// 임시 시간 후보 컴포넌트
const TimeSlotCard: React.FC<{
  time: string;
  available: string;
  percentage: number;
  color: string;
}> = ({ time, available, percentage, color }) => (
  <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-lg font-bold text-gray-800">{time}</h3>
      <span className={`text-sm font-semibold ${color}`}>{available} 가능</span>
    </div>
    <p className="text-xs text-gray-500 mb-3">{mockParticipants.join(", ")}</p>

    <div className="flex justify-between items-center mt-2">
      <span className="text-sm text-gray-600">{percentage}%</span>
      <span className="text-sm text-indigo-600 font-medium">단장님 우선</span>
    </div>
  </div>
);

const RoulettePanel: React.FC = () => {
  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [winnerTime, setWinnerTime] = useState("");

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

  // 룰렛 데이터 (TimeRoulette.tsx의 MOCK_SEGMENTS와 일치)
  const rouletteSegments = [
    { label: "목요일 19:00", color: "#EF4444", weight: 25 },
    { label: "금요일 18:30", color: "#F59E0B", weight: 25 },
    { label: "토요일 14:00", color: "#10B981", weight: 25 },
    { label: "일요일 16:00", color: "#3B82F6", weight: 25 },
  ];

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
            <span className="text-3xl font-bold text-yellow-700">6</span>
            <button className="px-4 py-2 text-sm font-semibold text-indigo-600 border border-indigo-300 rounded-md hover:bg-indigo-50 transition duration-150">
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
          <TimeSlotCard
            time="목요일 19:00-20:00"
            available="6/6"
            percentage={100}
            color="text-green-600"
          />
          <TimeSlotCard
            time="금요일 18:30-19:30"
            available="5/6"
            percentage={83}
            color="text-blue-600"
          />
          <TimeSlotCard
            time="토요일 14:00-15:00"
            available="4/6"
            percentage={67}
            color="text-yellow-600"
          />
          <TimeSlotCard
            time="일요일 16:00-17:00"
            available="5/6"
            percentage={83}
            color="text-blue-600"
          />
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
