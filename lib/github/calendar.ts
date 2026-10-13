import { ContributionCalendar, ContributionDay } from './types';

export interface NormalizedWeek {
  weekIndex: number;
  days: (ContributionDay | null)[]; // Exactly 7 slots: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  monthLabel: string | null;
}

export interface ProcessedCalendar {
  weeks: NormalizedWeek[];
  totalContributions: number;
  startDate: string;
  endDate: string;
  dateRangeLabel: string;
}

export const MONTH_NAMES_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export const MONTH_NAMES_UPPER = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
];

export function parseISODate(dateStr: string): { year: number; month: number; day: number } {
  const parts = dateStr.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // 0-indexed
  const day = parseInt(parts[2], 10);
  return { year, month, day };
}

export function getUTCDayOfWeek(dateStr: string): number {
  const { year, month, day } = parseISODate(dateStr);
  return new Date(Date.UTC(year, month, day)).getUTCDay();
}

/**
 * Format ISO date string into readable calendar date, e.g. "Jun 28, 2026" or "Sep 15, 2026".
 * Uses explicit UTC date construction to remain completely unaffected by system or browser timezone.
 */
export function formatContributionDate(dateStr: string): string {
  const { year, month, day } = parseISODate(dateStr);
  const d = new Date(Date.UTC(year, month, day));
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function formatContributionCount(count: number): string {
  if (count === 0) return 'No contributions';
  if (count === 1) return '1 contribution';
  return `${count} contributions`;
}

/**
 * Maps contribution counts and GitHub quartiles to 5 activity intensity levels (0 to 4).
 * Level 0 = No activity
 * Level 1 = Low activity
 * Level 2 = Moderate activity
 * Level 3 = High activity
 * Level 4 = Very high activity
 */
export function getIntensityLevel(
  count: number,
  contributionLevel?: string
): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;

  if (contributionLevel === 'FOURTH_QUARTILE') return 4;
  if (contributionLevel === 'THIRD_QUARTILE') return 3;
  if (contributionLevel === 'SECOND_QUARTILE') return 2;
  if (contributionLevel === 'FIRST_QUARTILE') return 1;
  if (contributionLevel === 'NONE') return 0;

  // Fallback thresholds based on counts
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

/**
 * Returns theme-aware CSS classes for a given contribution level.
 * Uses dedicated GitHub-style green tokens.
 */
export function getCellColorClasses(level: 0 | 1 | 2 | 3 | 4): string {
  switch (level) {
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
}

/**
 * Build a normalized 52/53-week calendar structure where:
 * - Every week has exactly 7 slots (Sunday = index 0 through Saturday = index 6).
 * - Partial weeks (e.g. starting mid-week or ending mid-week) have null for days outside range.
 * - Month headings are placed at the horizontal position corresponding to the week containing that month's first day.
 * - Weekday rows align perfectly with Monday, Wednesday, Friday labels.
 */
export function buildProcessedCalendar(calendar: ContributionCalendar): ProcessedCalendar {
  const rawWeeks = calendar?.weeks || [];
  if (!rawWeeks.length) {
    return {
      weeks: [],
      totalContributions: 0,
      startDate: '',
      endDate: '',
      dateRangeLabel: '',
    };
  }

  // Collect all days chronologically
  const allDays: ContributionDay[] = [];
  rawWeeks.forEach((w) => {
    (w.contributionDays || []).forEach((d) => {
      if (d && d.date) allDays.push(d);
    });
  });

  const startDate = allDays[0]?.date || '';
  const endDate = allDays[allDays.length - 1]?.date || '';

  // Calculate authoritative total: prefer calendar.totalContributions if provided, else sum
  const computedTotal = allDays.reduce((acc, d) => acc + (d.contributionCount || 0), 0);
  const totalContributions =
    typeof calendar.totalContributions === 'number'
      ? calendar.totalContributions
      : computedTotal;

  // Normalize each week to 7 slots (Sunday 0 to Saturday 6)
  const normalizedWeeks: NormalizedWeek[] = rawWeeks.map((week, weekIndex) => {
    const days: (ContributionDay | null)[] = [
      null, null, null, null, null, null, null,
    ];
    let monthLabel: string | null = null;

    for (const day of week.contributionDays || []) {
      const weekday = getUTCDayOfWeek(day.date);
      days[weekday] = day;

      const { month, day: dayOfMonth } = parseISODate(day.date);
      // If this week contains the 1st of the month, mark this week with that month label
      if (dayOfMonth === 1) {
        monthLabel = MONTH_NAMES_UPPER[month];
      }
    }

    return {
      weekIndex,
      days,
      monthLabel,
    };
  });

  // Week 0 label check: if week 0 did not contain the 1st of a month, check if there are >= 3 weeks
  // before the first day-1 label. If so, display the initial month label without risk of overlapping.
  const firstDayOneWeekIndex = normalizedWeeks.findIndex((w) => w.monthLabel !== null);
  if (firstDayOneWeekIndex >= 3 && allDays[0]) {
    const { month } = parseISODate(allDays[0].date);
    normalizedWeeks[0].monthLabel = MONTH_NAMES_UPPER[month];
  }

  // Prevent any adjacent month labels closer than 2 weeks to eliminate collision
  let lastPlacedIndex = -999;
  for (let i = 0; i < normalizedWeeks.length; i++) {
    if (normalizedWeeks[i].monthLabel) {
      if (i - lastPlacedIndex < 2) {
        normalizedWeeks[i].monthLabel = null;
      } else {
        lastPlacedIndex = i;
      }
    }
  }

  // Format date range label (e.g. "OCT 2025 — OCT 2026")
  let dateRangeLabel = '';
  if (startDate && endDate) {
    const startParts = parseISODate(startDate);
    const endParts = parseISODate(endDate);
    const startMonth = MONTH_NAMES_UPPER[startParts.month];
    const endMonth = MONTH_NAMES_UPPER[endParts.month];
    dateRangeLabel = `${startMonth} ${startParts.year} — ${endMonth} ${endParts.year}`;
  }

  return {
    weeks: normalizedWeeks,
    totalContributions,
    startDate,
    endDate,
    dateRangeLabel,
  };
}
