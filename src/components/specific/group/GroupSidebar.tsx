import React from "react";

export default function GroupSidebar() {
  return (
    <aside className="w-[320px] flex flex-col gap-6">
      <Top3Card />
      <GoldenTimeCard />
      <SmartPlaceCard />
      <NextStepCard />
    </aside>
  );
}

/** ===== 내부 카드들 ===== */

function Top3Card() {
  const data = [
    { rank: 1, time: '목요일 19:00 - 20:00', percent: 100, members: '6/6명 가능', trust: '신뢰도 높음', rankColor: 'bg-amber-400', trustTone: 'good' },
    { rank: 2, time: '금요일 18:30 - 19:30', percent: 83,  members: '5/6명 가능', trust: '신뢰도 높음', trustTone: 'good', rankColor: 'bg-gray-400' },
    { rank: 3, time: '화요일 20:00 - 21:00', percent: 67,  members: '4/6명 가능', trust: '신뢰도 보통', trustTone: 'warn',  rankColor: 'bg-orange-400' },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
      <h3 className="mb-4 text-base font-bold text-gray-900">최적 모임 시간 TOP 3</h3>

      {data.map(({ rank, time, percent, members, trust, rankColor, trustTone }) => (
        <div
          key={rank}
          className="group mb-4 last:mb-0 rounded-xl border border-gray-100/70 bg-gray-50/40 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:bg-gray-50 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${rankColor} text-white text-sm font-extrabold`}>
                {rank}
              </span>
              <div className="text-gray-900 font-semibold">{time}</div>
            </div>
            <div className="text-sm font-semibold text-gray-500">{percent}%</div>
          </div>

          <div className="mt-2 flex items-center gap-3">
            <div className="relative h-2 w-full rounded-full bg-gray-200">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-indigo-400 to-violet-600"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <div className="text-[13px] text-gray-500">{members}</div>
            <span
              className={`px-3 py-1 rounded-full text-[12px] font-semibold ${
                trustTone === "good"
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                  : "bg-orange-50 text-orange-600 border border-orange-200"
              }`}
            >
              {trust}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function GoldenTimeCard() {
  return (
    <div className="mt-1 rounded-2xl border border-indigo-200 bg-indigo-50/40 p-4 shadow-sm hover:bg-indigo-50 transition">
      <div className="flex items-start gap-3">
        <svg
          className="w-[20px] h-[20px] text-indigo-600 translate-y-[1px] flex-shrink-0"
          viewBox="0 0 1 2"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.532281 1.13281C0.559666 1.13002 0.584068 1.15035 0.586968 1.17773C0.589829 1.20505 0.570251 1.22932 0.543023 1.23242C0.485541 1.23844 0.426676 1.23844 0.369195 1.23242C0.341995 1.2293 0.322391 1.20503 0.325249 1.17773C0.328145 1.15036 0.352571 1.13006 0.379937 1.13281C0.430493 1.13811 0.481725 1.13811 0.532281 1.13281ZM0.343804 1.00488C0.418012 1.01889 0.494205 1.01889 0.568414 1.00488C0.595546 0.999748 0.621872 1.01779 0.627007 1.04492C0.631968 1.07195 0.614008 1.0984 0.586968 1.10352C0.500542 1.11982 0.411675 1.11982 0.325249 1.10352C0.298213 1.0984 0.280256 1.07195 0.28521 1.04492C0.290345 1.01779 0.316672 0.999748 0.343804 1.00488ZM0.406304 0.943359V0.702148C0.391703 0.700184 0.376656 0.700942 0.362359 0.697266C0.335777 0.690389 0.31959 0.663324 0.326226 0.636719C0.333102 0.609974 0.361005 0.59371 0.387749 0.600586C0.410075 0.606288 0.433065 0.609398 0.456109 0.609375L0.524468 0.600586C0.551213 0.59371 0.579115 0.609974 0.585992 0.636719C0.592641 0.663345 0.576475 0.690409 0.549859 0.697266C0.535544 0.700946 0.520533 0.700184 0.505914 0.702148V0.943359C0.505914 0.970974 0.483723 0.993164 0.456109 0.993164C0.428507 0.993149 0.406304 0.970964 0.406304 0.943359ZM0.528374 0.943359V0.932617C0.52857 0.856111 0.579068 0.796985 0.63482 0.764648C0.702648 0.725368 0.755286 0.664241 0.78521 0.591797C0.815073 0.519395 0.82018 0.438921 0.799859 0.363281C0.779499 0.287843 0.734872 0.221429 0.672906 0.173828C0.610705 0.126132 0.534492 0.0996094 0.456109 0.0996094C0.377726 0.0996094 0.301513 0.126132 0.239312 0.173828C0.177345 0.221429 0.132718 0.287843 0.112359 0.363281C0.0920381 0.438921 0.0971443 0.519395 0.127007 0.591797C0.156931 0.664241 0.20957 0.725368 0.277398 0.764648C0.333118 0.796966 0.383647 0.856083 0.383843 0.932617V0.943359C0.383843 0.970974 0.361653 0.993164 0.334039 0.993164C0.306527 0.993043 0.284234 0.970899 0.284234 0.943359V0.932617C0.28403 0.903006 0.263668 0.871509 0.227593 0.850586C0.140739 0.800279 0.0725537 0.722653 0.0342339 0.629883C-0.00393638 0.537245 -0.010285 0.434666 0.0156792 0.337891C0.0417242 0.240943 0.0991043 0.154835 0.178765 0.09375C0.258371 0.0328116 0.355849 0 0.456109 0C0.556369 0 0.653847 0.0328116 0.733453 0.09375C0.813113 0.154835 0.870494 0.240943 0.896539 0.337891C0.922503 0.434666 0.916154 0.537245 0.877984 0.629883C0.839664 0.722653 0.771479 0.800279 0.684624 0.850586C0.648581 0.871491 0.628187 0.902978 0.627984 0.932617V0.943359C0.627984 0.970917 0.605716 0.993073 0.578179 0.993164C0.550565 0.993164 0.528374 0.970974 0.528374 0.943359Z"
            fill="#4F47E6"
          />
        </svg>

        <div className="flex flex-col">
          <p className="text-[14px] font-semibold text-indigo-700 leading-tight">
            가장 많은 사람이 가능한 <br />
            ‘황금 시간’을 찾았어요!
          </p>
          <p className="mt-1 text-[13px] text-indigo-500">
            목요일 19:00~20:00에 모든 멤버가 참여 가능합니다.
          </p>
        </div>
      </div>
    </div>
  );
}

function SmartPlaceCard() {
  const items = [
    { place: "강남역",    distance: "평균 이동시간 23분" },
    { place: "홍대입구역", distance: "평균 28분 소요"    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-4">스마트 장소 추천</h3>
      {items.map((p) => (
        <div key={p.place} className="flex flex-col border border-gray-100 rounded-lg p-3 mb-2 bg-[#F9FAFB]">
          <span className="font-medium text-gray-900 text-sm">{p.place}</span>
          <span className="text-xs text-gray-500">{p.distance}</span>
        </div>
      ))}
      <button className="w-full mt-3 border border-indigo-200 text-indigo-600 rounded-full py-2 text-sm font-medium hover:bg-indigo-50 transition">
        더 많은 장소 보기
      </button>
    </div>
  );
}

function NextStepCard() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
      <h3 className="text-base font-semibold text-gray-900">황금 시간 발견!</h3>
      <p className="mt-2 text-xs leading-relaxed text-gray-500">
        가장 많은 사람이 가능한 시간을 찾았어요.
      </p>

      <button className="mt-4 h-11 w-full rounded-full bg-indigo-600 text-white text-sm font-semibold shadow hover:bg-indigo-700 transition">
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

      <button className="mt-2 h-11 w-full rounded-full border border-indigo-200 text-indigo-600 text-sm font-semibold hover:bg-indigo-50 transition">
        투표로 결정
      </button>
    </div>
  );
}
