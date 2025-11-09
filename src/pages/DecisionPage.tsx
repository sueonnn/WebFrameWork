import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import DecisionTabs from "../components/specific/DecisionTabs";
import RoulettePanel from "../components/specific/RoulettePanel";
import VotePanel from "../components/specific/VotePanel";

// 탭 유형 정의
type DecisionMode = "roulette" | "vote";

const DecisionPage: React.FC = () => {
  // 기본 모드는 룰렛 (스크린샷 기반)
  const [mode, setMode] = useState<DecisionMode>("roulette");

  // Group ID는 실제 라우트 파라미터에서 가져와야 하지만, 예시를 위해 하드코딩
  const groupId = "group-example-123";

  return (
    <div className="mx-auto max-w-7xl px-4 pt-12 pb-12">
      {/* 뒤로가기 링크 */}
      <Link
        to={`/groups/${groupId}`}
        className="flex items-center text-indigo-600 hover:text-indigo-800 transition duration-150 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        <span className="text-sm font-semibold">돌아가기</span>
      </Link>

      {/* 페이지 제목 및 설명 */}
      <h1 className="text-3xl font-bold text-gray-800">
        {mode === "roulette" ? "타임룰렛" : "투표 결정"}
      </h1>
      <p className="text-md text-gray-500 mt-1 mb-8">
        {mode === "roulette"
          ? "결정 피로 0%, 재미는 플러스!"
          : "모두의 의견을 모아 최적의 시간을 찾아요."}
      </p>

      {/* 탭 전환 컴포넌트 */}
      <DecisionTabs mode={mode} setMode={setMode} />

      {/* 실제 패널 렌더링 */}
      <div className="mt-8">
        {mode === "roulette" && <RoulettePanel />}
        {mode === "vote" && <VotePanel />}
      </div>
    </div>
  );
};

export default DecisionPage;
