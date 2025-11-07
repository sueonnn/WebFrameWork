import { useState } from 'react';
import { ShareIcon, CopyIcon } from '../icons';


type Props = {
  name: string;
  inviteCode: string;
  onGoHome: () => void;
  onShare?: () => void;
};

export default function GroupCreateSuccess({name, inviteCode, onGoHome, onShare }: Props) {
    const [showModal, setShowModal] = useState(false);

    const copy = async () => {
        await navigator.clipboard.writeText(inviteCode);
        setShowModal(true);
        // 자동으로 사라지게 하고 싶으면 주석 해제
        // setTimeout(() => setShowModal(false), 1500);
    };


    

    return (
        <>
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-emerald-100">
                    <span className="text-emerald-600 text-2xl">✓</span>
                </div>
                <h2 className="text-xl font-bold mb-1">그룹이 만들어졌어요!</h2>
                <p className="text-gray-500 mb-6">초대코드를 공유해서 멤버들을 초대하세요.</p>

                <div className="rounded-xl border bg-gray-50 p-5 text-sm mb-6">
                    <div className="mb-1 text-gray-500">그룹명</div>
                    <div className="font-semibold mb-4">{name}</div>
                    <div className="mb-1 text-gray-500">초대 코드</div>
                    <div className="text-indigo-600 font-bold tracking-widest text-lg">{inviteCode}</div>
                </div>

                <div className="grid gap-3">
                    <button onClick={copy}  className="h-11 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700
                    flex items-center justify-center gap-2
                    cursor-pointer hover:cursor-copy"           
                    >
                        <CopyIcon className="h-4 w-4" />    
                        초대코드 복사
                    </button>
                    <button onClick={onShare} className="h-11 rounded-xl border border-indigo-200 text-indigo-600 font-semibold hover:bg-indigo-50
                    flex items-center justify-center gap-2
                    cursor-pointer hover:cursor-alias" 
                    >
                        <ShareIcon className="h-4 w-4" />
                        공유하기
                    </button>
                    <button onClick={onGoHome} className="h-11 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer hover:cursor-zoom-in"
                    >
                    메인으로 이동
                    </button>
                </div>

                <p className="mt-5 text-xs text-gray-500">초대코드는 그룹 설정에서 언제든 재발급할 수 있어요.</p>
            </div>

            {/* 모달 */}
            {showModal && (
                <div
                className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
                onClick={() => setShowModal(false)}            // 배경 클릭으로 닫기
                >
                <div
                    className="bg-white rounded-2xl shadow-lg px-6 py-5 w-72 text-center"
                    onClick={(e) => e.stopPropagation()}         // 내용 클릭 시 전파 방지
                >
                    <p className="text-sm text-gray-800">
                    초대코드가 복사되었어요.
                    <br />
                    <span className="font-semibold tracking-widest text-indigo-600">{inviteCode}</span>
                    </p>
                    <button
                    onClick={() => setShowModal(false)}
                    className="mt-4 w-full rounded-lg bg-indigo-600 text-white text-sm py-2 hover:bg-indigo-700"
                    >
                    확인
                    </button>
                </div>
                </div>
            )}
        </>
    );
}