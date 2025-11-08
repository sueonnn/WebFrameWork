import React from "react";
import { Check, RefreshCcw, Coffee } from "lucide-react";

interface FinalDecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSpinAgain: () => void;
  resultTime: string; // 당첨된 시간 (예: "금요일 18:30")
}

const FinalDecisionModal: React.FC<FinalDecisionModalProps> = ({
  isOpen,
  onClose,
  onSpinAgain,
  resultTime,
}) => {
  if (!isOpen) return null;

  // 임시 참여 인원 데이터
  const participationInfo = "5/6명 참여 가능";

  // 당첨된 요일과 시간을 분리 (예: "금요일", "18:30")
  const [day, time] = resultTime.split(" ");
  const displayTime = `${day} ${time}`;

  return (
    // 모달 배경 (전체 화면을 덮음) - backdrop-blur-md 적용 및 투명도 조정
    <div
      className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose} // 배경 클릭 시 닫기
    >
      {/* 모달 내용 컨테이너 */}
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 배경 닫힘 방지
      >
        <div className="text-center mb-6">
          {/* 이미지에 있는 아이콘 (트로피 모양을 Coffee 아이콘으로 대체) */}
          <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 border border-indigo-300">
            <Coffee className="w-8 h-8 text-indigo-600" />
          </div>

          <h2 className="text-2xl font-extrabold text-gray-800 mb-1">
            최종 시간 확정!
          </h2>
          <p className="text-md text-gray-600">운명이 선택한 황금 시간이에요</p>
        </div>

        {/* 당첨 시간 표시 */}
        <div className="bg-indigo-50 p-6 rounded-xl mb-6 border border-indigo-200 text-center">
          <p className="text-2xl font-bold text-indigo-700">{displayTime}</p>
          <p className="text-sm text-indigo-500 mt-1">{participationInfo}</p>
        </div>

        {/* 1. 확정하기 버튼 */}
        <button className="w-full py-3 mb-3 text-md font-semibold text-white bg-indigo-600 rounded-xl shadow-md hover:bg-indigo-700 transition duration-150 flex items-center justify-center">
          <Check className="w-5 h-5 mr-2" />
          확정하기
        </button>

        {/* 2. 다시 돌리기 버튼 */}
        <button
          onClick={onSpinAgain}
          className="w-full py-3 text-md font-semibold text-indigo-600 border border-indigo-300 rounded-xl hover:bg-indigo-50 transition duration-150 flex items-center justify-center"
        >
          다시 돌리기
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          다음으로 장소를 정해볼까요?
        </p>
      </div>
    </div>
  );
};

export default FinalDecisionModal;
