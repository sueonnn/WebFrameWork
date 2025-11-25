import React from "react";
import { Check, RefreshCcw, Coffee } from "lucide-react";

interface FinalDecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSpinAgain: () => void;
  onConfirm: () => void; // 확정 버튼 콜백 추가
  resultTime: string; // 당첨된 시간 (예: "금요일 18:30-19:30")
  availableCount: number; // 이 시간에 가능한 인원 수
  totalParticipants: number; // 전체 인원 수
  availableMemberNames: string[]; // 가능한 멤버 이름 리스트
}

const FinalDecisionModal: React.FC<FinalDecisionModalProps> = ({
  isOpen,
  onClose,
  onSpinAgain,
  onConfirm,
  resultTime,
  availableCount,
  totalParticipants,
  availableMemberNames,
}) => {
  if (!isOpen) return null;

  const participationInfo = `${availableCount}/${totalParticipants}명 참여 가능`;

  const displayTime = resultTime;

  return (
    <div
      className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 border border-indigo-300">
            <Coffee className="w-8 h-8 text-indigo-600" />
          </div>

          <h2 className="text-2xl font-extrabold text-gray-800 mb-1">
            최종 시간 확정!
          </h2>
          <p className="text-md text-gray-600">운명이 선택한 황금 시간이에요</p>
        </div>

        {/* 당첨 시간 + 인원 정보 */}
        <div className="bg-indigo-50 p-6 rounded-xl mb-6 border border-indigo-200 text-center">
          <p className="text-2xl font-bold text-indigo-700">{displayTime}</p>
          <p className="text-sm text-indigo-500 mt-1">{participationInfo}</p>

          {availableMemberNames.length > 0 && (
            <p className="text-xs text-gray-600 mt-2">
              참여 가능: {availableMemberNames.join(", ")}
            </p>
          )}
        </div>

        {/* 1. 확정하기 버튼 → /history 로 이동하는 콜백 호출 */}
        <button
          onClick={onConfirm}
          className="w-full py-3 mb-3 text-md font-semibold text-white bg-indigo-600 rounded-xl shadow-md hover:bg-indigo-700 transition duration-150 flex items-center justify-center"
        >
          <Check className="w-5 h-5 mr-2" />
          확정하기
        </button>

        {/* 2. 다시 돌리기 버튼 */}
        <button
          onClick={onSpinAgain}
          className="w-full py-3 text-md font-semibold text-indigo-600 border border-indigo-300 rounded-xl hover:bg-indigo-50 transition duration-150 flex items-center justify-center"
        >
          <RefreshCcw className="w-5 h-5 mr-2" />
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