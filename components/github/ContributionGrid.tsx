'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { ContributionCalendar, ContributionDay } from '@/lib/github/types';
import { ContributionCell } from './ContributionCell';
import { ContributionTooltip, TooltipPosition } from './ContributionTooltip';
import { buildProcessedCalendar } from '@/lib/github/calendar';

interface ContributionGridProps {
  calendar: ContributionCalendar;
}

export const ContributionGrid: React.FC<ContributionGridProps> = ({ calendar }) => {
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);
  const [tooltipPos, setTooltipPos] = useState<TooltipPosition | null>(null);
  const [activeDate, setActiveDate] = useState<string | null>(null);

  const handleCellHover = useCallback((day: ContributionDay, target: HTMLElement) => {
    const rect = target.getBoundingClientRect();
    setHoveredDay(day);
    setTooltipPos({
      x: rect.left + rect.width / 2,
      y: rect.top,
      rect: {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
      },
    });
  }, []);

  const handleCellLeave = useCallback(() => {
    setHoveredDay(null);
    setTooltipPos(null);
  }, []);

  const handleScroll = useCallback(() => {
    if (hoveredDay) {
      setHoveredDay(null);
      setTooltipPos(null);
    }
  }, [hoveredDay]);

  // Build authoritative normalized calendar
  const processed = useMemo(() => buildProcessedCalendar(calendar), [calendar]);
  const weeks = processed.weeks;
  const dates = weeks.flatMap(week => week.days.filter((day): day is ContributionDay => Boolean(day)).map(day => day.date));
  const selectedDate = activeDate && dates.includes(activeDate) ? activeDate : dates.at(-1);
  const navigate = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const cell = (event.target as HTMLElement).closest<HTMLElement>('[data-contribution-date]');
    if (!cell) return;
    const current = dates.indexOf(cell.dataset.contributionDate!);
    const offsets: Record<string, number> = { ArrowLeft: -7, ArrowRight: 7, ArrowUp: -1, ArrowDown: 1 };
    let next: number;
    if (event.key in offsets) next = Math.max(0, Math.min(dates.length - 1, current + offsets[event.key]));
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = dates.length - 1;
    else return;
    event.preventDefault();
    const target = event.currentTarget.querySelector<HTMLElement>(`[data-contribution-date="${dates[next]}"]`);
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
  };

  const dayLabels = ['', 'MON', '', 'WED', '', 'FRI', ''];

  return (
    <div className="relative w-full">
      <ContributionTooltip day={hoveredDay} position={tooltipPos} />

      <div
        className="w-full overflow-x-auto pb-3 pt-1 custom-scrollbar overscroll-x-contain touch-pan-x"
        onScroll={handleScroll}
      >
        <div className="inline-flex flex-col min-w-max mx-auto">
          <div className="flex gap-2 items-start">

            <div className="flex flex-col gap-1 sm:gap-1.5 text-[8px] font-mono-code text-neutral-400 dark:text-[#666666] select-none pt-[22px] shrink-0">
              {dayLabels.map((label, idx) => (
                <span
                  key={idx}
                  className="h-3 sm:h-3.5 leading-none flex items-center pr-1 justify-end min-w-[20px]"
                >
                  {label}
                </span>
              ))}
            </div>

            <div className="flex flex-col">

              <div className="flex gap-1 sm:gap-1.5 mb-1.5 h-4 select-none">
                {weeks.map((week) => (
                  <div key={week.weekIndex} className="w-3 sm:w-3.5 relative shrink-0">
                    {week.monthLabel && (
                      <span className="absolute left-0 top-0 text-[9px] font-mono-code font-semibold tracking-wider text-neutral-500 dark:text-[#888888] whitespace-nowrap">
                        {week.monthLabel}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div
                className="flex gap-1 sm:gap-1.5"
                role="grid"
                aria-label="GitHub Contribution Heatmap"
                onKeyDown={navigate}
              >
                {weeks.map((week) => (
                  <div
                    key={week.weekIndex}
                    className="flex flex-col gap-1 sm:gap-1.5 w-3 sm:w-3.5 shrink-0"
                    role="row"
                  >
                    {week.days.map((day, weekdayIdx) =>
                      day ? (
                        <ContributionCell
                          key={day.date}
                          day={day}
                          onHover={handleCellHover}
                          onLeave={handleCellLeave}
                          tabIndex={day.date === selectedDate ? 0 : -1}
                          onSelect={() => setActiveDate(day.date)}
                        />
                      ) : (
                        <div
                          key={`pad-${weekdayIdx}`}
                          className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-0 pointer-events-none"
                          aria-hidden="true"
                        />
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3.5 border-t border-neutral-200 dark:border-[#222222] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono-code text-[11px] text-neutral-500 dark:text-[#888888]">
        <div className="flex items-center gap-1.5">
          <span className="text-neutral-900 dark:text-[#F5F3EF] font-bold">
            {processed.totalContributions}
          </span>
          <span>contributions in the last year</span>
        </div>

        <div className="flex items-center gap-2 text-[10px]">
          <span className="text-neutral-400 dark:text-[#666666]">LESS</span>
          <div className="flex items-center gap-1">
            <span
              title="0 contributions"
              className="w-2.5 h-2.5 rounded-[2px] bg-[#EBEDF0] dark:bg-[#161B22] border border-[#D0D7DE]/70 dark:border-[#21262D]"
            />
            <span
              title="1-2 contributions"
              className="w-2.5 h-2.5 rounded-[2px] bg-[#9BE9A8] dark:bg-[#0E4429] border border-[#85E89D] dark:border-[#0E4429]"
            />
            <span
              title="3-5 contributions"
              className="w-2.5 h-2.5 rounded-[2px] bg-[#40C463] dark:bg-[#006D32] border border-[#34B354] dark:border-[#006D32]"
            />
            <span
              title="6-9 contributions"
              className="w-2.5 h-2.5 rounded-[2px] bg-[#30A14E] dark:bg-[#26A641] border border-[#288F43] dark:border-[#26A641]"
            />
            <span
              title="10+ contributions"
              className="w-2.5 h-2.5 rounded-[2px] bg-[#216E39] dark:bg-[#39D353] border border-[#1A5A2E] dark:border-[#39D353]"
            />
          </div>
          <span className="text-neutral-400 dark:text-[#666666]">MORE</span>
        </div>
      </div>
    </div>
  );
};
