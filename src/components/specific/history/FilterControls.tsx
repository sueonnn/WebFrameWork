import React, { useState, useEffect, useRef } from 'react';
import { FilterControlsProps } from '../../../types/history';
import { ChevronDownIcon } from '../../icons/ChevronDownIcon';
import { SelectCheckIcon } from '../../icons/SelectCheckIcon';

export const FilterControls: React.FC<FilterControlsProps> = ({
  uniqueGroups,
  selectedGroup,
  onGroupChange,
  sortOptions, // 추가
  sortOption, // 추가
  onSortChange, // 추가
  filteredCount,
}) => {
  const [isGroupOpen, setIsGroupOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false); // 추가
  
  const groupDropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null); // 추가

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        groupDropdownRef.current &&
        !groupDropdownRef.current.contains(event.target as Node)
      ) {
        setIsGroupOpen(false);
      }
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [groupDropdownRef, sortDropdownRef]);

  const handleGroupSelect = (group: string) => {
    onGroupChange(group);
    setIsGroupOpen(false);
  };

  const handleSortSelect = (sort: string) => {
    onSortChange(sort);
    setIsSortOpen(false);
  };

  return (
    <div className="mt-10 flex w-full flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {/* --- 그룹 필터 (드롭다운) --- */}
        <div className="relative" ref={groupDropdownRef}>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">그룹:</span>
            <button
              onClick={() => setIsGroupOpen(!isGroupOpen)}
              className="flex w-36 items-center justify-between gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <span>{selectedGroup}</span>
              <ChevronDownIcon />
            </button>
          </div>

          {/* 드롭다운 메뉴 */}
          {isGroupOpen && (
            <div className="absolute z-10 mt-2 w-full rounded-lg bg-gray-800 p-2 shadow-lg">
              {uniqueGroups.map((group) => (
                <button
                  key={group}
                  onClick={() => handleGroupSelect(group)}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium ${
                    selectedGroup === group
                      ? 'text-white'
                      : 'text-gray-300'
                  } hover:bg-indigo-500 hover:text-white`}
                >
                  <div className="w-5">
                    {selectedGroup === group && <SelectCheckIcon />}
                  </div>
                  <span>{group}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* --- 정렬 필터 (드롭다운) --- */}
        <div className="relative" ref={sortDropdownRef}>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">정렬:</span>
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex w-28 items-center justify-between gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <span>{sortOption}</span>
              <ChevronDownIcon />
            </button>
          </div>

          {/* 드롭다운 메뉴 */}
          {isSortOpen && (
            <div className="absolute z-10 mt-2 w-full rounded-lg bg-gray-800 p-2 shadow-lg">
              {sortOptions.map((sort) => (
                <button
                  key={sort}
                  onClick={() => handleSortSelect(sort)}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium ${
                    sortOption === sort
                      ? 'text-white'
                      : 'text-gray-300'
                  } hover:bg-indigo-500 hover:text-white`}
                >
                  <div className="w-5">
                    {sortOption === sort && <SelectCheckIcon />}
                  </div>
                  <span>{sort}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="text-sm text-gray-500">
        총 {filteredCount}개의 모임 기록
      </div>
    </div>
  );
};