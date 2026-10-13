const assert = require('node:assert/strict');
const { test } = require('node:test');
const { loadSource, createReactHarness, findElement } = require('./helpers.cjs');

test('nested dialogs lock the mobile scrollport and restore original inline styles', () => {
  const previous = global.document;
  const body = { style: { overflow: 'auto' } };
  const page = { style: { overflow: '' } };
  global.document = { body, getElementById: () => page };
  try {
    const { lockPageScroll } = loadSource('lib/scrollLock.ts');
    const closeFirst = lockPageScroll();
    const closeSecond = lockPageScroll();
    assert.equal(body.style.overflow, 'hidden');
    assert.equal(page.style.overflow, 'hidden');
    closeFirst(); closeFirst();
    assert.equal(page.style.overflow, 'hidden');
    closeSecond();
    assert.equal(body.style.overflow, 'auto');
    assert.equal(page.style.overflow, '');
  } finally { global.document = previous; }
});

test('a stalled chat fetch times out and aborts the network request', async () => {
  const previous = global.fetch;
  let signal;
  global.fetch = async (_url, options) => { signal = options.signal; return new Promise(() => {}); };
  try {
    const { streamChat } = loadSource('lib/ai/stream.ts');
    await assert.rejects(streamChat([{ role: 'user', content: 'Hi' }], () => {}, new AbortController().signal, 15), /took too long/);
    assert.equal(signal.aborted, true);
  } finally { global.fetch = previous; }
});

test('stopping a stalled chat stream cancels and releases its reader', async () => {
  const previous = global.fetch;
  let canceled = false;
  let released = false;
  let start;
  const started = new Promise(resolve => { start = resolve; });
  global.fetch = async () => ({ ok: true, body: { getReader: () => ({
    read: () => { start(); return new Promise(() => {}); },
    cancel: async () => { canceled = true; },
    releaseLock: () => { released = true; },
  }) } });
  try {
    const { streamChat } = loadSource('lib/ai/stream.ts');
    const controller = new AbortController();
    const pending = streamChat([{ role: 'user', content: 'Hi' }], () => {}, controller.signal);
    const assertion = assert.rejects(pending, /Response stopped/);
    await started;
    controller.abort();
    await assertion;
    assert.ok(canceled && released);
  } finally { global.fetch = previous; }
});

test('contribution grid has one Tab stop with arrow, Home and End navigation', () => {
  const harness = createReactHarness();
  const React = { ...harness.React, useMemo: fn => fn() };
  const days = Array.from({ length: 14 }, (_, i) => ({ date: `2026-07-${String(i + 1).padStart(2, '0')}`, contributionCount: 0 }));
  const { ContributionGrid } = loadSource('components/github/ContributionGrid.tsx', {
    react: React, './ContributionCell': { ContributionCell: 'cell' },
    './ContributionTooltip': { ContributionTooltip: 'tooltip' },
    '@/lib/github/calendar': { buildProcessedCalendar: () => ({ weeks: [{ weekIndex: 0, days: days.slice(0, 7) }, { weekIndex: 1, days: days.slice(7) }], totalContributions: 0 }) },
  });
  let tree = harness.render(() => ContributionGrid({ calendar: {} }));
  const collect = node => {
    if (!node || typeof node !== 'object') return [];
    return [...(node.type === 'cell' ? [node] : []), ...(Array.isArray(node) ? node : node.children || []).flatMap(collect)];
  };
  const cells = collect(tree);
  assert.equal(cells.filter(cell => cell.props.tabIndex === 0).length, 1);
  assert.equal(cells.at(-1).props.tabIndex, 0);
  cells[3].props.onSelect();
  tree = harness.render(() => ContributionGrid({ calendar: {} }));
  assert.equal(collect(tree)[3].props.tabIndex, 0);
  const grid = findElement(tree, node => node.props.role === 'grid');
  const navigate = key => {
    let focused;
    let prevented = false;
    grid.props.onKeyDown({ key, preventDefault: () => { prevented = true; },
      target: { closest: () => ({ dataset: { contributionDate: days[3].date } }) },
      currentTarget: { querySelector: selector => ({ focus: () => { focused = selector; }, scrollIntoView() {} }) },
    });
    assert.ok(prevented);
    return focused;
  };
  assert.match(navigate('ArrowRight'), /2026-07-11/);
  assert.match(navigate('ArrowUp'), /2026-07-03/);
  assert.match(navigate('Home'), /2026-07-01/);
  assert.match(navigate('End'), /2026-07-14/);
});
