import React from 'react';
import { useNavigate } from 'react-router-dom';
import mainImage from '../assets/images/main.png';

/* --- 메인 이미지 URL --- */
const CALENDAR_IMAGE = mainImage;


/* --- SVG 아이콘 --- */
const PlusIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M5 12h14" />
    </svg>
);
const UsersIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="10" cy="7" r="4" />
    </svg>
);
const TimeIcon = () => (
    <svg width="25" height="25" viewBox="-0.2 -0.2 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.56701 2.25528V1.12764H0.652466V2.25528M4.56701 2.25528H0.652466M4.56701 2.25528V4.7361H0.652466V2.25528M1.52236 1.12764V0.45105M3.69711 1.12764V0.45105" stroke="#6059E8" strokeWidth="0.25" strokeLinecap="square"/>
        <path d="M3.37095 2.98828L2.4482 3.9452L1.98694 3.46663" stroke="#6059E8" strokeWidth="0.25" strokeLinecap="square"/>
    </svg>
);
const PlaceIcon = () => (
    <svg width="23" height="23" viewBox="-0.3 -0.2 5 5" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.04003 1.97304C4.04003 3.25552 2.42401 4.3407 2.42401 4.3407C2.42401 4.3407 0.807983 3.25552 0.807983 1.97304C0.807983 1.55441 0.978243 1.15292 1.28131 0.856908C1.58437 0.560892 1.99541 0.394592 2.42401 0.394592C2.8526 0.394592 3.26365 0.560892 3.56671 0.856908C3.86977 1.15292 4.04003 1.55441 4.04003 1.97304Z" stroke="#31C867" strokeWidth="0.416667"/>
        <path d="M3.03001 1.97302C3.03001 2.13001 2.96616 2.28056 2.85252 2.39157C2.73887 2.50257 2.58473 2.56494 2.424 2.56494C2.26328 2.56494 2.10914 2.50257 1.99549 2.39157C1.88184 2.28056 1.81799 2.13001 1.81799 1.97302C1.81799 1.81603 1.88184 1.66548 1.99549 1.55447C2.10914 1.44347 2.26328 1.3811 2.424 1.3811C2.58473 1.3811 2.73887 1.44347 2.85252 1.55447C2.96616 1.66548 3.03001 1.81603 3.03001 1.97302Z" stroke="#31C867" strokeWidth="0.416667"/>
    </svg>
);
const DecisionIcon = () => (
    <svg width="20" height="20" viewBox="-0.5 -0.5 5 5" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.08333 0.416668C1.82707 0.416504 1.57424 0.475509 1.34452 0.589084C1.11481 0.702659 0.914414 0.867738 0.758958 1.07146L1.25 1.5625H0V0.312501L0.462292 0.774793C0.657362 0.532652 0.904259 0.337347 1.1848 0.203259C1.46535 0.0691706 1.77239 -0.000286837 2.08333 8.90288e-07C3.23396 8.90288e-07 4.16667 0.932709 4.16667 2.08333H3.75C3.75 1.64131 3.57441 1.21738 3.26184 0.904823C2.94928 0.592262 2.52536 0.416668 2.08333 0.416668ZM0.416667 2.08333C0.416658 2.43187 0.525919 2.77165 0.729079 3.05485C0.932239 3.33806 1.21907 3.55045 1.54923 3.66214C1.87939 3.77384 2.23626 3.77921 2.56963 3.67752C2.90301 3.57582 3.19611 3.37217 3.40771 3.09521L2.91667 2.60417H4.16667V3.85417L3.70438 3.39188C3.50931 3.63402 3.26241 3.82932 2.98186 3.96341C2.70132 4.0975 2.39427 4.16696 2.08333 4.16667C0.932708 4.16667 0 3.23396 0 2.08333H0.416667Z" fill="#FA7315"/>
    </svg>
);


/* --- 컴포넌트 분리 --- */
interface NoGroupStateProps {
    onCreateGroup: () => void;
    onJoinGroup: () => void;
}

// 1. 그룹 선택 안 된 상태 및 액션 버튼
const NoGroupState: React.FC<NoGroupStateProps> = ({ onCreateGroup, onJoinGroup }) => {
    return (
        <div className="flex flex-col items-center">
            <img
                src={CALENDAR_IMAGE}
                alt="그룹 미선택 이미지"
                className="h-auto w-full max-w-lg rounded-xl object-cover shadow-lg"
            />

            <div className="mt-8 text-center">
                <h2 className="text-xl font-bold text-gray-800">아직 그룹이 선택되지 않았어요</h2>
                <p className="mt-2 text-sm text-gray-500">
                    그룹을 만들거나 참여해서 모임 시간을 조율해보세요.
                </p>
                <p className="text-sm text-gray-500">모두의 황금 시간을 한눈에 찾아드릴게요!</p>
            </div>

            <div className="mt-6 flex gap-4">
                <button
                    onClick={onCreateGroup}
                    className="flex h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white transition hover:bg-indigo-700 shadow-md shadow-indigo-200"
                >
                    <PlusIcon /> 새 그룹 만들기
                </button>
                <button
                    onClick={onJoinGroup}
                    className="flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 shadow-sm"
                >
                    <UsersIcon /> 그룹 참여하기
                </button>
            </div>
        </div>
    );
};

// 2. 기능 소개 카드
const FeatureIntro: React.FC = () => {
    const FEATURE_CONFIG = [
        {
            title: '시간 조율',
            desc: '드래그로 간편하게 가능한 시간을 입력하고 공동 시간을 찾아보세요.',
            IconComponent: TimeIcon,
            color: 'bg-violet-100 text-violet-600',
        },
        {
            title: '장소 추천',
            desc: '멤버들의 위치를 기반으로 가장 가까운 만남의 장소를 추천해드려요.',
            IconComponent: PlaceIcon,
            color: 'bg-lime-100 text-lime-600',
        },
        {
            title: '재미있는 결정',
            desc: '타임룰렛이나 투표로 결정 피로 없이 최종 시간을 정해보세요.',
            IconComponent: DecisionIcon,
            color: 'bg-orange-100 text-orange-600',
        },
    ];

    return (
        <div className="mt-12 grid w-full max-w-6xl gap-6 md:grid-cols-3">
            {FEATURE_CONFIG.map((f) => (
                <div key={f.title} className="flex flex-col items-center text-center">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${f.color}`}>
                        <f.IconComponent />
                    </div>

                    <div className="mt-4 font-semibold text-gray-800">{f.title}</div>
                    <div className="mt-1 text-sm text-gray-500">{f.desc}</div>
                </div>
            ))}
        </div>
    );
};


// --- 메인 페이지 컴포넌트 ---
export default function MainPage() {
    const navigate = useNavigate();

    const handleCreateGroup = () => {
        navigate('/groups/new');
    };

    const handleJoinGroup = () => {
        // navigate(''); // 추후 그룹 참여 페이지 연결 예정
    };

    return (
        <section className="grid place-items-start py-12">
            <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4">
                <NoGroupState
                    onCreateGroup={handleCreateGroup}
                    onJoinGroup={handleJoinGroup}
                />
                <FeatureIntro />
            </div>
        </section>
    );
}