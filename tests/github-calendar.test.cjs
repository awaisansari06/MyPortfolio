const assert = require('node:assert/strict');
const { test } = require('node:test');
const { loadSource, createReactHarness, findElement } = require('./helpers.cjs');

// Load calendar logic
const calendarModule = loadSource('lib/github/calendar.ts');
const {
  parseISODate,
  getUTCDayOfWeek,
  formatContributionDate,
  formatContributionCount,
  getIntensityLevel,
  getCellColorClasses,
  buildProcessedCalendar,
} = calendarModule;

// Helper to generate a mock year of contribution weeks
function generateMockWeeks(startDateStr, totalDays = 365) {
  const weeks = [];
  const [startY, startM, startD] = startDateStr.split('-').map(Number);
  let currentDate = new Date(Date.UTC(startY, startM - 1, startD));

  let currentWeek = { contributionDays: [] };

  for (let i = 0; i < totalDays; i++) {
    const y = currentDate.getUTCFullYear();
    const m = String(currentDate.getUTCMonth() + 1).padStart(2, '0');
    const d = String(currentDate.getUTCDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;

    currentWeek.contributionDays.push({
      date: dateStr,
      contributionCount: (i % 7 === 0) ? 3 : (i % 13 === 0) ? 12 : 0,
      contributionLevel: (i % 7 === 0) ? 'SECOND_QUARTILE' : (i % 13 === 0) ? 'FOURTH_QUARTILE' : 'NONE',
    });

    if (currentDate.getUTCDay() === 6) {
      weeks.push(currentWeek);
      currentWeek = { contributionDays: [] };
    }

    currentDate = new Date(currentDate.getTime() + 86400000);
  }

  if (currentWeek.contributionDays.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks;
}

test('1. A contribution on a given ISO date renders in the correct calendar cell and weekday row', () => {
  // Test June 28, 2026 (Sunday -> row 0) and July 1, 2026 (Wednesday -> row 3)
  const weeks = [
    {
      contributionDays: [
        { date: '2026-06-28', contributionCount: 0, contributionLevel: 'NONE' },
        { date: '2026-06-29', contributionCount: 1, contributionLevel: 'FIRST_QUARTILE' },
        { date: '2026-06-30', contributionCount: 0, contributionLevel: 'NONE' },
        { date: '2026-07-01', contributionCount: 5, contributionLevel: 'THIRD_QUARTILE' },
        { date: '2026-07-02', contributionCount: 2, contributionLevel: 'SECOND_QUARTILE' },
        { date: '2026-07-03', contributionCount: 0, contributionLevel: 'NONE' },
        { date: '2026-07-04', contributionCount: 10, contributionLevel: 'FOURTH_QUARTILE' },
      ],
    },
  ];

  const processed = buildProcessedCalendar({ totalContributions: 18, weeks });
  assert.equal(processed.weeks.length, 1);
  const week0 = processed.weeks[0];

  assert.equal(week0.days[0].date, '2026-06-28');
  assert.equal(getUTCDayOfWeek('2026-06-28'), 0); // Sunday

  assert.equal(week0.days[3].date, '2026-07-01');
  assert.equal(getUTCDayOfWeek('2026-07-01'), 3); // Wednesday
  assert.equal(week0.days[3].contributionCount, 5);

  assert.equal(week0.days[6].date, '2026-07-04');
  assert.equal(getUTCDayOfWeek('2026-07-04'), 6); // Saturday
});

test('2. Tooltip date equals the exact underlying cell date and displays accurate text', () => {
  const harness = createReactHarness();
  const { ContributionTooltip } = loadSource('components/github/ContributionTooltip.tsx', { react: harness.React });

  // Test zero contributions day
  const tree1 = ContributionTooltip({
    day: { date: '2026-06-28', contributionCount: 0, contributionLevel: 'NONE' },
    position: { x: 100, y: 100 },
  });
  assert.ok(findElement(tree1, node => node.children && node.children.includes('Jun 28, 2026')));
  assert.ok(findElement(tree1, node => node.children && node.children.includes('No contributions')));

  // Test active contributions day
  const tree2 = ContributionTooltip({
    day: { date: '2026-09-15', contributionCount: 5, contributionLevel: 'THIRD_QUARTILE' },
    position: { x: 150, y: 150 },
  });
  assert.ok(findElement(tree2, node => node.children && node.children.includes('Sep 15, 2026')));
  assert.ok(findElement(tree2, node => node.children && node.children.includes('5 contributions')));
});

test('3. January-to-December month transitions render correctly across calendar boundaries', () => {
  // Calendar from 2025-10-12 to 2026-10-11
  const weeks = generateMockWeeks('2025-10-12', 365);
  const processed = buildProcessedCalendar({ totalContributions: 100, weeks });

  const placedMonthLabels = processed.weeks
    .filter(w => w.monthLabel !== null)
    .map(w => ({ weekIndex: w.weekIndex, label: w.monthLabel }));

  const labels = placedMonthLabels.map(p => p.label);
  // Must include sequential months
  assert.ok(labels.includes('NOV'));
  assert.ok(labels.includes('DEC'));
  assert.ok(labels.includes('JAN'));
  assert.ok(labels.includes('FEB'));
  assert.ok(labels.includes('MAR'));
  assert.ok(labels.includes('APR'));
  assert.ok(labels.includes('MAY'));
  assert.ok(labels.includes('JUN'));
  assert.ok(labels.includes('JUL'));
  assert.ok(labels.includes('AUG'));
  assert.ok(labels.includes('SEP'));
  assert.ok(labels.includes('OCT'));
});

test('4. Month labels align with their actual week columns containing the 1st of each month', () => {
  // Start on 2026-01-01 (Thursday, day 4 of week starting 2025-12-28)
  const weeks = generateMockWeeks('2025-12-28', 220);
  const processed = buildProcessedCalendar({ totalContributions: 50, weeks });

  for (const week of processed.weeks) {
    if (week.monthLabel) {
      // Either week 0 contains the month or this week contains day 1 of the month
      const hasDayOne = week.days.some(d => d && d.date.endsWith('-01'));
      const isWeekZero = week.weekIndex === 0;
      assert.ok(hasDayOne || isWeekZero, `Week ${week.weekIndex} with label ${week.monthLabel} must contain day 1`);
    }
  }
});

test('5. Leap-year February is handled correctly with 29 days', () => {
  // Leap year 2028: Feb starts on Tuesday (2028-02-01) and has 29 days (2028-02-29 is Tuesday)
  const weeks = generateMockWeeks('2028-02-01', 35);
  const processed = buildProcessedCalendar({ totalContributions: 20, weeks });

  const allDays = processed.weeks.flatMap(w => w.days.filter(Boolean));
  const feb29 = allDays.find(d => d.date === '2028-02-29');
  const mar01 = allDays.find(d => d.date === '2028-03-01');

  assert.ok(feb29, '2028-02-29 must exist in leap year');
  assert.ok(mar01, '2028-03-01 must exist immediately following Feb 29');
  assert.equal(getUTCDayOfWeek('2028-02-29'), 2); // Tuesday
  assert.equal(getUTCDayOfWeek('2028-03-01'), 3); // Wednesday
});

test('6. Weekday offsets are correct when range starts mid-week', () => {
  // Week starting on Wednesday 2026-07-01: days 0, 1, 2 must be null spacers
  const partialWeek = {
    contributionDays: [
      { date: '2026-07-01', contributionCount: 3, contributionLevel: 'SECOND_QUARTILE' }, // Wednesday (3)
      { date: '2026-07-02', contributionCount: 0, contributionLevel: 'NONE' },            // Thursday (4)
      { date: '2026-07-03', contributionCount: 1, contributionLevel: 'FIRST_QUARTILE' },  // Friday (5)
      { date: '2026-07-04', contributionCount: 0, contributionLevel: 'NONE' },            // Saturday (6)
    ],
  };

  const processed = buildProcessedCalendar({ totalContributions: 4, weeks: [partialWeek] });
  const week0 = processed.weeks[0];

  assert.equal(week0.days[0], null, 'Sunday before start must be padded null');
  assert.equal(week0.days[1], null, 'Monday before start must be padded null');
  assert.equal(week0.days[2], null, 'Tuesday before start must be padded null');
  assert.equal(week0.days[3].date, '2026-07-01', 'Wednesday must be at row index 3');
  assert.equal(week0.days[6].date, '2026-07-04', 'Saturday must be at row index 6');
});

test('7. The start and end of annual range is accurate and reflected in date range label', () => {
  const weeks = [
    { contributionDays: [{ date: '2025-10-12', contributionCount: 0 }] },
    { contributionDays: [{ date: '2026-10-11', contributionCount: 0 }] },
  ];

  const processed = buildProcessedCalendar({ totalContributions: 0, weeks });
  assert.equal(processed.startDate, '2025-10-12');
  assert.equal(processed.endDate, '2026-10-11');
  assert.equal(processed.dateRangeLabel, 'OCT 2025 — OCT 2026');
});

test('8. Timezone differences do not shift dates in formatContributionDate', () => {
  const previousTZ = process.env.TZ;
  const timezones = ['America/Los_Angeles', 'Pacific/Honolulu', 'Asia/Tokyo', 'Europe/London'];

  try {
    for (const tz of timezones) {
      process.env.TZ = tz;
      const formattedJune28 = formatContributionDate('2026-06-28');
      const formattedJuly01 = formatContributionDate('2026-07-01');
      assert.equal(formattedJune28, 'Jun 28, 2026', `Failed in ${tz}`);
      assert.equal(formattedJuly01, 'Jul 01, 2026', `Failed in ${tz}`);
    }
  } finally {
    if (previousTZ === undefined) delete process.env.TZ;
    else process.env.TZ = previousTZ;
  }
});

test('9. Contribution intensity corresponds accurately to contribution counts and quartiles', () => {
  assert.equal(getIntensityLevel(0), 0);
  assert.equal(getIntensityLevel(1), 1);
  assert.equal(getIntensityLevel(2), 1);
  assert.equal(getIntensityLevel(3), 2);
  assert.equal(getIntensityLevel(5), 2);
  assert.equal(getIntensityLevel(6), 3);
  assert.equal(getIntensityLevel(9), 3);
  assert.equal(getIntensityLevel(10), 4);
  assert.equal(getIntensityLevel(25), 4);

  // GitHub quartile overrides
  assert.equal(getIntensityLevel(1, 'NONE'), 0);
  assert.equal(getIntensityLevel(0, 'FIRST_QUARTILE'), 0);
  assert.equal(getIntensityLevel(3, 'FIRST_QUARTILE'), 1);
  assert.equal(getIntensityLevel(3, 'SECOND_QUARTILE'), 2);
  assert.equal(getIntensityLevel(3, 'THIRD_QUARTILE'), 3);
  assert.equal(getIntensityLevel(3, 'FOURTH_QUARTILE'), 4);
});

test('10. Zero-contribution days receive neutral color tokens and active days receive green shades', () => {
  const neutralClass = getCellColorClasses(0);
  assert.ok(neutralClass.includes('bg-[#EBEDF0]'), 'Light mode zero activity must be #EBEDF0');
  assert.ok(neutralClass.includes('dark:bg-[#161B22]'), 'Dark mode zero activity must be #161B22');

  const level1 = getCellColorClasses(1);
  assert.ok(level1.includes('bg-[#9BE9A8]') && level1.includes('dark:bg-[#0E4429]'));

  const level2 = getCellColorClasses(2);
  assert.ok(level2.includes('bg-[#40C463]') && level2.includes('dark:bg-[#006D32]'));

  const level3 = getCellColorClasses(3);
  assert.ok(level3.includes('bg-[#30A14E]') && level3.includes('dark:bg-[#26A641]'));

  const level4 = getCellColorClasses(4);
  assert.ok(level4.includes('bg-[#216E39]') && level4.includes('dark:bg-[#39D353]'));
});

test('11. June and July transition alignment: week 37 contains June 28-30 and July 1-4 with exact dates', () => {
  const juneJulyWeek = {
    contributionDays: [
      { date: '2026-06-28', contributionCount: 0, contributionLevel: 'NONE' },
      { date: '2026-06-29', contributionCount: 0, contributionLevel: 'NONE' },
      { date: '2026-06-30', contributionCount: 0, contributionLevel: 'NONE' },
      { date: '2026-07-01', contributionCount: 3, contributionLevel: 'SECOND_QUARTILE' },
      { date: '2026-07-02', contributionCount: 1, contributionLevel: 'FIRST_QUARTILE' },
      { date: '2026-07-03', contributionCount: 0, contributionLevel: 'NONE' },
      { date: '2026-07-04', contributionCount: 0, contributionLevel: 'NONE' },
    ],
  };

  const processed = buildProcessedCalendar({ totalContributions: 4, weeks: [juneJulyWeek] });
  const week = processed.weeks[0];

  // The week contains July 1st, so it receives the 'JUL' label
  assert.equal(week.monthLabel, 'JUL');

  // Verify that June days retain their exact June dates
  assert.equal(formatContributionDate(week.days[0].date), 'Jun 28, 2026');
  assert.equal(formatContributionDate(week.days[1].date), 'Jun 29, 2026');
  assert.equal(formatContributionDate(week.days[2].date), 'Jun 30, 2026');

  // Verify that July days retain their exact July dates
  assert.equal(formatContributionDate(week.days[3].date), 'Jul 01, 2026');
  assert.equal(formatContributionDate(week.days[4].date), 'Jul 02, 2026');
  assert.equal(formatContributionDate(week.days[5].date), 'Jul 03, 2026');
  assert.equal(formatContributionDate(week.days[6].date), 'Jul 04, 2026');
});

test('12. Tooltip rendering and accessibility props', () => {
  const harness = createReactHarness();
  harness.React.memo = fn => fn;
  const { ContributionCellComponent } = loadSource('components/github/ContributionCell.tsx', { react: harness.React });

  const cellTree = ContributionCellComponent({
    day: { date: '2026-07-01', contributionCount: 5, contributionLevel: 'THIRD_QUARTILE' },
    onHover: () => {},
    onLeave: () => {},
  });

  assert.equal(cellTree.props.role, 'gridcell');
  assert.equal(cellTree.props.tabIndex, 0);
  assert.ok(cellTree.props['aria-label'].includes('Jul 01, 2026: 5 contributions'));
});
