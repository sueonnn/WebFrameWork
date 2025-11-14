import React from 'react';
import { TimeIcon } from '../../icons/TimeIcon';
import { PlaceIcon } from '../../icons/PlaceIcon';
import { DecisionIcon } from '../../icons/DecisionIcon';

export const FeatureIntro: React.FC = () => {
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