// import React, { useState, useEffect } from "react";
// import { Link, useParams, useSearchParams } from "react-router-dom";
// import { ArrowLeft } from "lucide-react";
// import DecisionTabs from "../components/specific/DecisionTabs";
// import RoulettePanel from "../components/specific/RoulettePanel";
// import VotePanel from "../components/specific/VotePanel";

// // 탭 유형 정의
// type DecisionMode = "roulette" | "vote";

// const DecisionPage: React.FC = () => {
//   const { groupId } = useParams<{ groupId: string }>();
//   const [searchParams] = useSearchParams();


//   const queryMode = searchParams.get("mode");
//   const initialMode: DecisionMode =
//   queryMode === "vote" ? "vote" : "roulette";

//   const [mode, setMode] = useState<DecisionMode>(initialMode);

//   // URL 쿼리가 바뀌면 모드도 동기화
//   useEffect(() => {
//     if (queryMode === "vote" || queryMode === "roulette") {
//       setMode(queryMode);
//     }
//   }, [queryMode]);

//   const gid = groupId ?? "unknown-group";

//   return (
//     <div className="mx-auto max-w-7xl px-4 pt-12 pb-12">
//       {/* 뒤로가기 링크 */}
//       <Link
//         to="/groups/schedule"
//         className="flex items-center text-indigo-600 hover:text-indigo-800 transition duration-150 mb-6"
//       >
//         <ArrowLeft className="w-5 h-5 mr-1" />
//         <span className="text-sm font-semibold">시간 입력으로 돌아가기</span>
//       </Link>

//       {/* 페이지 제목 및 설명 */}
//       <h1 className="text-3xl font-bold text-gray-800">
//         {mode === "roulette" ? "타임룰렛" : "투표 결정"}
//       </h1>
//       <p className="text-md text-gray-500 mt-1 mb-8">
//         {mode === "roulette"
//           ? "결정 피로 0%, 재미는 플러스!"
//           : "모두의 의견을 모아 최적의 시간을 찾아요."}
//       </p>

//       {/* 탭 전환 컴포넌트 */}
//       <DecisionTabs mode={mode} setMode={setMode} />

//       {/* 실제 패널 렌더링 */}
//       <div className="mt-8">
//         {mode === "roulette" && <RoulettePanel groupId={gid} />}
//         {mode === "vote" && <VotePanel groupId={gid} />}
//       </div>
//     </div>
//   );
// };

// export default DecisionPage;


import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import DecisionTabs from "../components/specific/DecisionTabs";
import RoulettePanel from "../components/specific/RoulettePanel";
import VotePanel from "../components/specific/VotePanel";

type DecisionMode = "roulette" | "vote";

const DecisionPage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [mode, setMode] = useState<DecisionMode>("roulette");

  const gid = groupId ?? "g1"; // 안전빵 기본값

  return (
    <div className="mx-auto max-w-7xl px-4 pt-12 pb-12">
      {/* 뒤로가기: 스케줄 페이지 */}
      <Link
        to="/groups/schedule"
        className="flex items-center text-indigo-600 hover:text-indigo-800 transition duration-150 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        <span className="text-sm font-semibold">시간 입력으로 돌아가기</span>
      </Link>

      <h1 className="text-3xl font-bold text-gray-800">
        {mode === "roulette" ? "타임룰렛" : "투표 결정"}
      </h1>
      <p className="text-md text-gray-500 mt-1 mb-8">
        {mode === "roulette"
          ? "결정 피로 0%, 재미는 플러스!"
          : "모두의 의견을 모아 최적의 시간을 찾아요."}
      </p>

      <DecisionTabs mode={mode} setMode={setMode} />

      <div className="mt-8">
        {mode === "roulette" && (
          <RoulettePanel
            groupId={gid}
            onSwitchToVote={() => setMode("vote")}
          />
        )}
        {mode === "vote" && (
          <VotePanel
            groupId={gid}
            onSwitchToRoulette={() => setMode("roulette")}
          />
        )}
      </div>
    </div>
  );
};

export default DecisionPage;
