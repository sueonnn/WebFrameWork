import React, { useRef, useEffect, useState, useCallback } from "react";

// 룰렛 조각 데이터 타입 정의
interface RouletteSegment {
  label: string;
  color: string;
  weight: number; // 가중치
}

// 회전 완료 시 결과를 전달하기 위한 콜백 함수 타입 정의
interface TimeRouletteProps {
  segments?: RouletteSegment[];
  onFinish: (result: string) => void;
}

// 임시 룰렛 데이터
const MOCK_SEGMENTS: RouletteSegment[] = [
  { label: "목요일 19:00", color: "#EF4444", weight: 25 },
  { label: "금요일 18:30", color: "#F59E0B", weight: 25 },
  { label: "토요일 14:00", color: "#10B981", weight: 25 },
  { label: "일요일 16:00", color: "#3B82F6", weight: 25 },
];

const TimeRoulette: React.FC<TimeRouletteProps> = ({
  segments = MOCK_SEGMENTS,
  onFinish,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);

  // 1. 캔버스에 룰렛을 그리는 함수
  const drawRoulette = useCallback(
    (ctx: CanvasRenderingContext2D, currentRotation: number) => {
      const canvas = ctx.canvas;
      const size = 300; // CSS 크기 기준
      const center = size / 2;
      const radius = size * 0.45;

      ctx.clearRect(0, 0, size, size); // 배경 지우기
      ctx.save();

      // 현재 회전 각도 적용
      ctx.translate(center, center);
      ctx.rotate((currentRotation * Math.PI) / 180);
      ctx.translate(-center, -center);

      let startAngle = 0;
      const totalWeight = segments.reduce((sum, seg) => sum + seg.weight, 0);

      segments.forEach((segment) => {
        const angle = (segment.weight / totalWeight) * 2 * Math.PI;
        const endAngle = startAngle + angle;

        // 조각 그리기
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = segment.color;
        ctx.fill();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();

        // 텍스트(요일) 그리기
        const textAngle = startAngle + angle / 2;
        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(textAngle);

        ctx.fillStyle = "white";
        ctx.font = '16px "Inter", sans-serif';
        ctx.textAlign = "center"; // 중앙 정렬

        // 텍스트 위치를 중앙에서 조금 안쪽 (radius * 0.55)으로 조정하여 잘림 방지
        ctx.fillText(segment.label.split(" ")[0], radius * 0.65, -5); // 요일
        ctx.font = '14px "Inter", sans-serif';
        ctx.fillText(segment.label.split(" ")[1], radius * 0.65, 15); // 시간

        ctx.restore();
        startAngle = endAngle;
      });

      // 중앙 버튼 영역 (배경)
      ctx.beginPath();
      ctx.arc(center, center, radius * 0.35, 0, 2 * Math.PI);
      ctx.fillStyle = "white";
      ctx.fill();

      ctx.restore();

      // 포인터
      ctx.beginPath();
      ctx.lineTo(center - 10, 10);
      ctx.lineTo(center + 10, 10);
      ctx.lineTo(center, 30);
      ctx.closePath();
      ctx.fillStyle = "#DC2626";
      ctx.fill();
    },
    [segments]
  );

  // 2. 룰렛 회전 애니메이션
  const spinRoulette = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setResult(null);

    // 최소 5바퀴 (1800도) 이상 회전 + 최종 당첨 각도 (랜덤)
    const extraDegrees = Math.random() * 360;
    const finalAngle = 360 * 5 + extraDegrees;

    const duration = 4000; // 4초 동안 회전
    const startTime = performance.now();
    let prevRotation = rotation;

    const animate = (time: DOMHighResTimeStamp) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out 함수 적용 (점점 느려지게)
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      const currentRotation = prevRotation + finalAngle * easedProgress;
      setRotation(currentRotation % 360);

      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) {
        drawRoulette(ctx, currentRotation);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // 애니메이션 종료: 결과 확정
        setIsSpinning(false);
        const finalDeg = finalAngle % 360;
        setRotation(finalDeg);
        const winner = determineWinner(finalDeg);
        setResult(winner);
        onFinish(winner); // 모달을 띄우기 위해 콜백 호출
      }
    };

    requestAnimationFrame(animate);
  };

  // 3. 당첨 조각 결정
  const determineWinner = (finalRotation: number): string => {
    const pointerAngle = 270; // 상단 중앙 포인터 각도

    const angle = (pointerAngle - (finalRotation % 360) + 360) % 360;

    let startAngle = 0;
    const totalWeight = segments.reduce((sum, seg) => sum + seg.weight, 0);

    for (const segment of segments) {
      const segmentAngle = (segment.weight / totalWeight) * 360;
      const endAngle = startAngle + segmentAngle;

      if (angle >= startAngle && angle < endAngle) {
        return segment.label;
      }
      startAngle = endAngle;
    }
    return segments[0]?.label || "결과 없음";
  };

  // 캔버스 초기 설정 및 그리기
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // HiDPI (Retina) 디스플레이 지원: 캔버스 크기 설정
    const scale = window.devicePixelRatio;
    const canvasDisplaySize = 300;

    canvas.width = canvasDisplaySize * scale;
    canvas.height = canvasDisplaySize * scale;
    canvas.style.width = `${canvasDisplaySize}px`;
    canvas.style.height = `${canvasDisplaySize}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(scale, scale);
      drawRoulette(ctx, rotation);
    }
  }, [drawRoulette, rotation]);

  // 룰렛 중앙 버튼 클릭 핸들러
  const handleCentralButtonClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // 룰렛 영역 전체 클릭 방지
    spinRoulette();
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      <canvas
        ref={canvasRef}
        className="w-[300px] h-[300px] rounded-full shadow-2xl bg-white"
      />

      {/* 룰렛 중앙의 "돌리기" 버튼 텍스트 (캔버스 위에 겹쳐서 배치) */}
      <div
        className="absolute w-[100px] h-[100px] rounded-full flex flex-col items-center justify-center cursor-pointer select-none"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "transparent",
        }}
        onClick={handleCentralButtonClick}
      >
        <span
          className={`text-indigo-600 font-extrabold text-lg transition duration-200 ${isSpinning ? "opacity-50" : "hover:scale-105"}`}
        >
          {isSpinning ? "회전 중..." : "돌리기"}
        </span>
        <span className="text-sm text-gray-500">운명의 룰렛</span>
      </div>
    </div>
  );
};

export default TimeRoulette;
