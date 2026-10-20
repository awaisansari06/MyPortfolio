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
    <div className="contribution-calendar relative w-full">
      <ContributionTooltip day={hoveredDay} position={tooltipPos} />

      <div
        className="contribution-scroll"
        onScroll={handleScroll}
      >
        <div className="contribution-layout">
          <div className="contribution-grid-body">

            <div className="contribution-day-labels">
              {dayLabels.map((label, idx) => (
                <span
                  key={idx}
                  className="contribution-day-label"
                >
                  {label}
                </span>
              ))}
            </div>

            <div className="contribution-weeks-area" style={{ '--week-count': weeks.length, '--calendar-max-width': `${weeks.length * 14 + (weeks.length - 1) * 4}px`, '--calendar-mobile-width': `${weeks.length * 12 + (weeks.length - 1) * 3}px` } as React.CSSProperties}>

              <div className="contribution-months">
                {weeks.map((week) => (
                  <div key={week.weekIndex} className="contribution-month-week">
                    {week.monthLabel && (
                      <span className="contribution-month-label">
                        {week.monthLabel}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div
                className="contribution-weeks"
                role="grid"
                aria-label="GitHub Contribution Heatmap"
                onKeyDown={navigate}
              >
                {weeks.map((week) => (
                  <div
                    key={week.weekIndex}
                    className="contribution-week-column"
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
                          className="contribution-cell opacity-0 pointer-events-none"
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

      <div className="contribution-legend mt-4 pt-3.5 border-t border-neutral-200 dark:border-[#222222] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono-code text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="text-neutral-900 dark:text-[#F5F3EF] font-bold">
            {processed.totalContributions}
          </span>
          <span>contributions in the last year</span>
        </div>

        <div className="flex items-center gap-2 text-[10px]">
          <span>LESS</span>
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
          <span>MORE</span>
        </div>
      </div>
    </div>
  );
};
