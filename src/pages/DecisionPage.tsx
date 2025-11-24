// import React, { useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import { ArrowLeft } from "lucide-react";
// import DecisionTabs from "../components/specific/DecisionTabs";
// import RoulettePanel from "../components/specific/RoulettePanel";
// import VotePanel from "../components/specific/VotePanel";

// type DecisionMode = "roulette" | "vote";

// const DecisionPage: React.FC = () => {
//   const { groupId } = useParams<{ groupId: string }>();
//   const [mode, setMode] = useState<DecisionMode>("roulette");

//   const gid = groupId ?? "g1"; // 안전빵 기본값

//   return (
//     <div className="mx-auto max-w-7xl px-4 pt-12 pb-12">
//       {/* 뒤로가기: 스케줄 페이지 */}
//       <Link
//         to="/groups/schedule"
//         className="flex items-center text-indigo-600 hover:text-indigo-800 transition duration-150 mb-6"
//       >
//         <ArrowLeft className="w-5 h-5 mr-1" />
//         <span className="text-sm font-semibold">시간 입력으로 돌아가기</span>
//       </Link>

//       <h1 className="text-3xl font-bold text-gray-800">
//         {mode === "roulette" ? "타임룰렛" : "투표 결정"}
//       </h1>
//       <p className="text-md text-gray-500 mt-1 mb-8">
//         {mode === "roulette"
//           ? "결정 피로 0%, 재미는 플러스!"
//           : "모두의 의견을 모아 최적의 시간을 찾아요."}
//       </p>

//       <DecisionTabs mode={mode} setMode={setMode} />

//       <div className="mt-8">
//         {mode === "roulette" && (
//           <RoulettePanel
//             groupId={gid}
//             onSwitchToVote={() => setMode("vote")}
//           />
//         )}
//         {mode === "vote" && (
//           <VotePanel
//             groupId={gid}
//             onSwitchToRoulette={() => setMode("roulette")}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default DecisionPage;

import React, { useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import DecisionTabs from "../components/specific/DecisionTabs";
import RoulettePanel from "../components/specific/RoulettePanel";
import VotePanel from "../components/specific/VotePanel";
import { GROUPS, GROUP_TIME_DECISIONS } from "../mock";
import { useMeetingInfoStore } from "../stores/meetingInfoStore";

type DecisionMode = "roulette" | "vote";

const DecisionPage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  
  // URL 쿼리에서 tab 읽기
  const [searchParams, setSearchParams] = useSearchParams();
  const mode: DecisionMode =
    searchParams.get("tab") === "vote" ? "vote" : "roulette";

  //  탭 변경 시 URL 쿼리도 함께 변경
  const changeMode = (next: DecisionMode) => {
    if (next === "roulette") {
      // 기본 탭은 쿼리 제거
      searchParams.delete("tab");
      setSearchParams(searchParams, { replace: true });
    } else {
      setSearchParams({ tab: "vote" }, { replace: true });
    }
  };


  // URL 파라미터가 없을 때 mock에서 첫 그룹을 fallback으로 사용
  const gid = useMemo(() => {
    if (groupId) return groupId;
    if (GROUP_TIME_DECISIONS.length > 0) return GROUP_TIME_DECISIONS[0].groupId;
    if (GROUPS.length > 0) return GROUPS[0].id;
    return "";
  }, [groupId]);

  const group = useMemo(() => GROUPS.find((g) => g.id === gid), [gid]);

  const decision = useMemo(
    () => GROUP_TIME_DECISIONS.find((d) => d.groupId === gid),
    [gid]
  );

  const meetingInfo = useMeetingInfoStore((s) => {
    if (!decision) return undefined;
    return s.getByMeetingId(decision.meetingId);
  });

  if (!gid) {
    return (
      <div className="mx-auto max-w-7xl px-4 pt-12 pb-12">
        <p className="text-red-600 font-semibold">
          그룹 정보를 찾을 수 없습니다. mock 데이터를 확인해 주세요.
        </p>
      </div>
    );
  }

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

      {/*  mock 기반 그룹/모임 정보 표시 */}
      <h1 className="text-3xl font-bold text-gray-800">
        {group?.name ?? "그룹 시간 결정"}
      </h1>

      <p className="text-sm text-gray-500 mt-1">
        {meetingInfo
          ? `${meetingInfo.date} · ${meetingInfo.time} · ${meetingInfo.location}`
          : mode === "roulette"
            ? "결정 피로 0%, 재미는 플러스!"
            : "모두의 의견을 모아 최적의 시간을 찾아요."}
      </p>

      <p className="text-md text-gray-500 mt-1 mb-8">
        {mode === "roulette"
          ? "타임룰렛으로 모임 시간을 랜덤으로 정해 보세요."
          : "투표 결과를 보고 최적의 시간을 결정해요."}
      </p>

      <DecisionTabs mode={mode} setMode={changeMode} />

      <div className="mt-8">
        {mode === "roulette" && (
          <RoulettePanel groupId={gid} onSwitchToVote={() => changeMode("vote")} />
        )}
        {mode === "vote" && (
          <VotePanel
            groupId={gid}
            onSwitchToRoulette={() => changeMode("roulette")}
          />
        )}
      </div>
    </div>
  );
};

export default DecisionPage;
