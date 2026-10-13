'use client';

import React from 'react';
import { ContributionDay } from '@/lib/github/types';

interface ContributionCellProps {
  day: ContributionDay;
  onHover: (day: ContributionDay, target: HTMLElement) => void;
  onLeave: () => void;
}

export const getIntensityLevel = (count: number, level?: string): 0 | 1 | 2 | 3 | 4 => {
  if (count === 0) return 0;
  if (level === 'FOURTH_QUARTILE') return 4;
  if (level === 'THIRD_QUARTILE') return 3;
  if (level === 'SECOND_QUARTILE') return 2;
  if (level === 'FIRST_QUARTILE') return 1;
  if (level === 'NONE') return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
};

export const getCellColorClass = (count: number, level?: string): string => {
  const intensity = getIntensityLevel(count, level);
  switch (intensity) {
    case 1:
      return 'bg-[#9BE9A8] dark:bg-[#0E4429] border-[#85E89D] dark:border-[#0E4429]';
    case 2:
      return 'bg-[#40C463] dark:bg-[#006D32] border-[#34B354] dark:border-[#006D32]';
    case 3:
      return 'bg-[#30A14E] dark:bg-[#26A641] border-[#288F43] dark:border-[#26A641]';
    case 4:
      return 'bg-[#216E39] dark:bg-[#39D353] border-[#1A5A2E] dark:border-[#39D353]';
    case 0:
    default:
      return 'bg-[#EBEDF0] dark:bg-[#161B22] border-[#D0D7DE]/70 dark:border-[#21262D]';
  }
};

const ContributionCellComponent: React.FC<ContributionCellProps> = ({ day, onHover, onLeave }) => {
  const dateParts = day.date.split('-');
  const year = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1;
  const dayOfMonth = parseInt(dateParts[2], 10);
  const dateObj = new Date(Date.UTC(year, month, dayOfMonth));

  const formattedDate = dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  });

  const countText =
    day.contributionCount === 0
      ? 'No contributions'
      : day.contributionCount === 1
      ? '1 contribution'
      : `${day.contributionCount} contributions`;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onHover(day, e.currentTarget);
    } else if (e.key === 'Escape') {
      onLeave();
    }
  };

  return (
    <div
      tabIndex={0}
      role="gridcell"
      aria-label={`${formattedDate}: ${countText}`}
      onMouseEnter={(e) => onHover(day, e.currentTarget)}
      onMouseLeave={onLeave}
      onFocus={(e) => onHover(day, e.currentTarget)}
      onBlur={onLeave}
      onClick={(e) => onHover(day, e.currentTarget)}
      onKeyDown={handleKeyDown}
      className="w-3 h-3 sm:w-3.5 sm:h-3.5 relative flex items-center justify-center cursor-pointer outline-none group/cell focus:z-20 shrink-0"
    >
      <div
        className={`w-full h-full rounded-[2px] border transition-transform duration-100 ease-out pointer-events-none group-hover/cell:scale-115 group-focus/cell:ring-1.5 group-focus/cell:ring-emerald-500 group-hover/cell:z-10 ${getCellColorClass(
          day.contributionCount,
          day.contributionLevel
        )}`}
      />
    </div>
  );
};

export const ContributionCell = React.memo(ContributionCellComponent);
export { ContributionCellComponent };
