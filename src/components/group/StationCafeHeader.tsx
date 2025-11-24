  // 상단 컨트롤 컴포넌트
  import { FC } from "react";

  type StationCafeHeaderProps = {
    stationName: string;
    cafeCount: number;
    onBack: () => void;
    onConfirm: () => void;   
    canConfirm: boolean;     
  };

  const StationCafeHeader: FC<StationCafeHeaderProps> = ({
    stationName,
    cafeCount,
    onBack,
    onConfirm,
    canConfirm,
  }) => {
    return (
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{stationName} 주변 카페</h2>
          <p className="text-sm text-gray-500">
            역 기준 가장 가까운 카페 {cafeCount}곳을 보여드려요.
          </p>
        </div>
        <button
          onClick={onBack}
          className="px-3 py-1.5 rounded-lg border hover:bg-gray-50 text-sm"
        >
          이전으로
        </button>
        <button
          onClick={onConfirm}
          disabled={!canConfirm}
          className={
            "px-3 py-1.5 rounded-lg text-sm font-semibold " +
            (canConfirm
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-gray-200 text-gray-500 cursor-not-allowed")
          }
        >
          확정하기
        </button>
      </div>
    );
  };

  export default StationCafeHeader;