import React from 'react';
import mainImage from '../../../assets/images/main.png';
import { PlusIcon } from '../../icons/PlusIcon';
import { UsersIcon } from '../../icons/UsersIcon';

interface NoGroupStateProps {
    onCreateGroup: () => void;
    onJoinGroup: () => void;
}

export const NoGroupState: React.FC<NoGroupStateProps> = ({ onCreateGroup, onJoinGroup }) => {
    return (
        <div className="flex flex-col items-center">
            <img
                src={mainImage}
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