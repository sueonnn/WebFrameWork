import { useNavigate } from "react-router-dom";

type Props = {
  totalHours: number;
  groupId: string;   
};


export default function ScheduleSidebar({ totalHours, groupId }: Props) {
  return (
    <aside className="w-[320px] flex flex-col gap-6">
      <LocationCard />
      <MySummaryCard totalHours={totalHours} />
      <OverlapTopCard />
      <NextStepCard groupId={groupId} /> 
    </aside>
  );
}

/** ===== 내부 카드들 (과분리 방지: 한 파일에 캡슐화) ===== */

function LocationCard() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">내 위치 정보</h3>
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="#9FA5B1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 5-9 12-9 12S3 15 3 10a9 9 0 1 1 18 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>

        <p className="mb-6 text-sm leading-relaxed text-gray-600">
          위치를 설정하면 스마트 장소<br />추천을 받을 수 있어요.
        </p>

        <button
          className="w-full h-11 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-sm font-semibold shadow
                     hover:from-indigo-600/90 hover:to-indigo-700/90 transition">
          <span className="inline-flex items-center gap-2 justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            위치 설정하기
          </span>
        </button>
      </div>
    </div>
  );
}

function MySummaryCard({ totalHours }: { totalHours: number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
      <h3 className="mb-4 text-base font-semibold text-gray-900">내 입력 요약</h3>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">총 가능 시간</span>
        <span className="font-semibold text-indigo-600">{totalHours}시간</span>
      </div>
    </div>
  );
}

function OverlapTopCard() {
  const items = [
    { time: "목 19:00-20:00", members: "5/6명" },
    { time: "금 18:00-19:00", members: "4/6명" },
    { time: "토 14:00-15:00", members: "4/6명" },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
      <h3 className="mb-4 text-base font-semibold text-gray-900">겹침 상위 시간대</h3>
      {items.map((t) => (
        <div
          key={t.time}
          className="mb-3 rounded-xl bg-[#F9FAFB] p-4 flex flex-col shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[15px] text-gray-900 tracking-tight">
              {t.time}
            </span>
            <span className="text-[15px] font-bold text-indigo-600">{t.members}</span>
          </div>
          <span className="mt-1 text-[13px] text-gray-400">가능 인원</span>
        </div>
      ))}
    </div>
  );
}

function NextStepCard({ groupId }: { groupId: string }) {
  const navigate = useNavigate();

   const goRoulette = () => {
    // 기본: 타임룰렛 탭
    navigate(`/groups/${groupId}/decide`);
    // 혹시 쿼리로 모드까지 보내고 싶으면:
    // navigate(`/groups/${groupId}/decide?mode=roulette`);
  };

  const goVote = () => {
    // 같은 페이지로 가되, 나중에 vote 모드를 쓰고 싶으면 쿼리 사용 가능
    navigate(`/groups/${groupId}/decide`);
    // 또는:
    // navigate(`/groups/${groupId}/decide?mode=vote`);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
      <h3 className="text-base font-semibold text-gray-900">다음 단계</h3>
      <p className="mt-2 text-xs leading-relaxed text-gray-500">
        시간 입력이 완료되면 결정 단계로 넘어가세요.
      </p>

      <button
        onClick={goRoulette}  
        className="mt-4 h-11 w-full rounded-full bg-indigo-600 text-white text-sm font-semibold shadow hover:bg-indigo-700 transition"
      >
        <span className="inline-flex items-center gap-2 justify-center">
          <svg
            className="h-[1.25em] w-[1.25em] flex-shrink-0 translate-y-[0.5px]"
            viewBox="0 0 2 2"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.799922 0.0941124V0.377785H0.3C0.134297 0.377785 0 0.568342 0 0.803461C0 0.874961 0.0135937 0.94114 0.035625 1.00034L0.159375 0.875294C0.15375 0.85268 0.15 0.829068 0.15 0.803794C0.15 0.686068 0.217266 0.590956 0.3 0.590956H0.799922V0.874629L1.2 0.48687L0.799922 0.0941124ZM1.04063 0.873963C1.04625 0.896577 1.05 0.920189 1.05 0.945464C1.05 1.06319 0.982969 1.1583 0.9 1.1583H0.400078V0.874629L0.035625 1.27171L0.400078 1.65514V1.37147H0.9C1.0657 1.37147 1.2 1.18092 1.2 0.945796C1.2 0.874296 1.18641 0.808117 1.16438 0.748921L1.04063 0.873963Z"
              fill="white"
            />
          </svg>
          타임룰렛으로 결정
        </span>
      </button>

      <button
       onClick={goVote}
       className="mt-2 h-11 w-full rounded-full border border-indigo-200 text-indigo-600 text-sm font-semibold hover:bg-indigo-50 transition">
        투표로 결정
      </button>
    </div>
  );
}
