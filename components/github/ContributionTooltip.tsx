'use client';

import React from 'react';
import { ContributionDay } from '@/lib/github/types';

interface ContributionTooltipProps {
  day: ContributionDay | null;
  position: { x: number; y: number } | null;
}

export const ContributionTooltip: React.FC<ContributionTooltipProps> = ({ day, position }) => {
  if (!day || !position) return null;

  // Format date: e.g. "Sep 06, 2026"
  const dateObj = new Date(day.date);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });

  const countText =
    day.contributionCount === 0
      ? 'No contributions'
      : day.contributionCount === 1
      ? '1 contribution'
      : `${day.contributionCount} contributions`;

  return (
    <div
      className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full mb-2.5 px-3 py-2 border border-neutral-300 dark:border-[#333333] bg-white/95 dark:bg-[#141414]/95 backdrop-blur-md shadow-xl text-left whitespace-nowrap min-w-[120px] transition-opacity duration-100"
      style={{
        left: `${position.x}px`,
        top: `${position.y - 6}px`,
      }}
    >
      <div className="font-mono-code text-[11px] text-neutral-500 dark:text-[#A3A3A3]">
        {formattedDate}
      </div>
      <div className="font-mono-code text-xs font-semibold text-neutral-950 dark:text-[#F5F3EF] mt-0.5">
        {countText}
      </div>
    </div>
  );
};
