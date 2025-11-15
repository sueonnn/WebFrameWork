import React from 'react';
import { HistoryHeaderProps } from '../../../types/history';
import { HomeIcon } from '../../icons/HomeIcon';

export const HistoryHeader: React.FC<HistoryHeaderProps> = ({ onGoHome }) => {
  return (
    <div className="flex w-full items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">우리의 추억 보관함</h1>
        <p className="mt-2 text-md text-gray-500">함께한 소중한 시간들을 돌아보세요</p>
      </div>
      <button
        onClick={onGoHome}
        className="flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 shadow-sm"
      >
        <HomeIcon /> 홈으로
      </button>
    </div>
  );
};