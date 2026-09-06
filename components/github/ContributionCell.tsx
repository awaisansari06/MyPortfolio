'use client';

import React from 'react';
import { ContributionDay } from '@/lib/github/types';

interface ContributionCellProps {
  day: ContributionDay;
  onHover: (day: ContributionDay, event: React.MouseEvent<HTMLDivElement>) => void;
  onLeave: () => void;
}

const ContributionCellComponent: React.FC<ContributionCellProps> = ({ day, onHover, onLeave }) => {
  const getCellColorClass = (count: number) => {
    if (count === 0) {
      return 'bg-[#E8E6E1] dark:bg-[#1A1A1A] border-[#DCDAD5] dark:border-[#222222]';
    }
    if (count <= 2) {
      return 'bg-[#D0CECA] dark:bg-[#303030] border-[#C4C2BE] dark:border-[#383838]';
    }
    if (count <= 5) {
      return 'bg-[#A8A6A2] dark:bg-[#555555] border-[#9C9A96] dark:border-[#5E5E5E]';
    }
    if (count <= 9) {
      return 'bg-[#686664] dark:bg-[#888888] border-[#5E5C5A] dark:border-[#919191]';
    }
    return 'bg-[#161616] dark:bg-[#E8E6E1] border-[#0A0A0A] dark:border-[#F0EEEA]';
  };

  return (
    <div
      tabIndex={0}
      role="gridcell"
      aria-label={`${day.date}: ${day.contributionCount} contributions`}
      onMouseEnter={(e) => onHover(day, e)}
      onMouseLeave={onLeave}
      onFocus={(e) => onHover(day, e as unknown as React.MouseEvent<HTMLDivElement>)}
      onBlur={onLeave}
      className="w-3 h-3 sm:w-3.5 sm:h-3.5 relative flex items-center justify-center cursor-pointer outline-none group/cell focus:z-20"
    >
      <div
        className={`w-full h-full rounded-[1px] border transition-transform duration-150 ease-out pointer-events-none group-hover/cell:scale-125 group-focus/cell:ring-1 group-focus/cell:ring-neutral-900 dark:group-focus/cell:ring-white group-hover/cell:z-10 ${getCellColorClass(
          day.contributionCount
        )}`}
      />
    </div>
  );
};

export const ContributionCell = React.memo(ContributionCellComponent);
