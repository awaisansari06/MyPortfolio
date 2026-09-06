'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { ContributionCalendar, ContributionDay } from '@/lib/github/types';
import { ContributionCell } from './ContributionCell';
import { ContributionTooltip } from './ContributionTooltip';

interface ContributionGridProps {
  calendar: ContributionCalendar;
}

export const ContributionGrid: React.FC<ContributionGridProps> = ({ calendar }) => {
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const handleCellHover = useCallback((day: ContributionDay, event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setHoveredDay(day);
    setTooltipPos({
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  }, []);

  const handleCellLeave = useCallback(() => {
    setHoveredDay(null);
    setTooltipPos(null);
  }, []);

  // Extract month labels based on actual dates inside each week column
  const monthLabels = useMemo(() => {
    const labels: { label: string; weekIndex: number }[] = [];
    if (!calendar?.weeks?.length) return labels;

    let currentMonth = -1;

    calendar.weeks.forEach((week, weekIndex) => {
      for (const day of week.contributionDays) {
        // Parse YYYY-MM-DD parts to avoid any local timezone skew
        const parts = day.date.split('-');
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // 0-indexed month
        const dayOfMonth = parseInt(parts[2], 10);

        // Always register the initial month on week 0
        if (weekIndex === 0 && currentMonth === -1) {
          currentMonth = month;
          const d = new Date(Date.UTC(year, month, dayOfMonth));
          labels.push({
            label: d.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }).toUpperCase(),
            weekIndex: 0,
          });
          break;
        }

        // When a new month is encountered in this week (including mid-week starts)
        if (month !== currentMonth) {
          currentMonth = month;
          const d = new Date(Date.UTC(year, month, dayOfMonth));
          labels.push({
            label: d.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }).toUpperCase(),
            weekIndex,
          });
          break; // Register at most once per week
        }
      }
    });

    return labels;
  }, [calendar]);

  const dayLabels = ['', 'MON', '', 'WED', '', 'FRI', ''];
  const totalWeeks = calendar?.weeks?.length || 53;

  return (
    <div className="relative w-full">
      <ContributionTooltip day={hoveredDay} position={tooltipPos} />

      {/* Scrollable Container for Heatmap */}
      <div className="w-full overflow-x-auto pb-4 pt-2 custom-scrollbar">
        <div className="inline-block min-w-max">
          <div className="flex gap-2 items-start">
            {/* Day of Week Labels (Left Column, offset by pt-6 to align with contribution rows) */}
            <div className="flex flex-col justify-between text-[8px] font-mono-code text-neutral-400 dark:text-[#666666] pr-1 select-none h-[108px] sm:h-[134px] pt-6 shrink-0">
              {dayLabels.map((d, i) => (
                <span key={i} className="h-3 sm:h-3.5 leading-3 sm:leading-3.5 flex items-center">
                  {d}
                </span>
              ))}
            </div>

            {/* Calendar Content (Month Header and Contribution Grid sharing identical week-column geometry) */}
            <div className="flex flex-col">
              {/* Month Labels Row (CSS Grid with exact column count and gaps) */}
              <div
                className="grid gap-1 sm:gap-1.5 mb-2 h-4 select-none"
                style={{
                  gridTemplateColumns: `repeat(${totalWeeks}, minmax(0, 1fr))`,
                }}
              >
                {monthLabels.map((m) => (
                  <div
                    key={`${m.label}-${m.weekIndex}`}
                    style={{ gridColumnStart: m.weekIndex + 1 }}
                    className="relative h-4"
                  >
                    <span className="absolute left-0 top-0 text-[9px] font-mono-code text-neutral-400 dark:text-[#777777] whitespace-nowrap">
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Weeks Columns (CSS Grid with identical column count and gaps) */}
              <div
                className="grid gap-1 sm:gap-1.5"
                role="grid"
                aria-label="GitHub Contribution Heatmap"
                style={{
                  gridTemplateColumns: `repeat(${totalWeeks}, minmax(0, 1fr))`,
                }}
              >
                {calendar.weeks.map((week, weekIdx) => (
                  <div key={weekIdx} className="flex flex-col gap-1 sm:gap-1.5" role="row">
                    {week.contributionDays.map((day) => (
                      <ContributionCell
                        key={day.date}
                        day={day}
                        onHover={handleCellHover}
                        onLeave={handleCellLeave}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Controls & Legend */}
      <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-[#222222] flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono-code text-[11px] text-neutral-500 dark:text-[#888888]">
        <div className="flex items-center gap-1.5">
          <span className="text-neutral-700 dark:text-[#C5C3BF] font-medium">
            {calendar.totalContributions}
          </span>
          <span>contributions</span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-[10px]">
          <span>LESS</span>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-[1px] bg-[#E8E6E1] dark:bg-[#1A1A1A] border border-[#DCDAD5] dark:border-[#222222]" />
            <span className="w-2.5 h-2.5 rounded-[1px] bg-[#D0CECA] dark:bg-[#303030] border border-[#C4C2BE] dark:border-[#383838]" />
            <span className="w-2.5 h-2.5 rounded-[1px] bg-[#A8A6A2] dark:bg-[#555555] border border-[#9C9A96] dark:border-[#5E5E5E]" />
            <span className="w-2.5 h-2.5 rounded-[1px] bg-[#686664] dark:bg-[#888888] border border-[#5E5C5A] dark:border-[#919191]" />
            <span className="w-2.5 h-2.5 rounded-[1px] bg-[#161616] dark:bg-[#E8E6E1] border border-[#0A0A0A] dark:border-[#F0EEEA]" />
          </div>
          <span>MORE</span>
        </div>
      </div>
    </div>
  );
};
