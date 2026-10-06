const assert = require('node:assert/strict');
const { test } = require('node:test');
const { loadSource, createReactHarness, findElement, icons } = require('./helpers.cjs');

test('clipboard denial displays an error and never reports COPIED', async () => {
  const harness = createReactHarness();
  const { Contact } = loadSource('components/Contact.tsx', {
    react: harness.React,
    'lucide-react': icons,
    '@/data/portfolio': { portfolioData: { email: 'test@example.com', socials: {} } },
    '@/lib/motion': { gsap: {}, isReducedMotion: () => true },
    '@/lib/scroll': { getScrollBehavior: () => 'instant' },
  });
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: {
    clipboard: { writeText: async () => { throw new Error('Clipboard permission denied'); } },
  } });
  try {
    let tree = harness.render(Contact);
    const copy = findElement(tree, node => node.type === 'button' &&
      findElement(node, child => child.type === 'span' && child.children.includes('COPY EMAIL')));
    await copy.props.onClick();
    tree = harness.render(Contact);
    assert.equal(findElement(tree, node => node.type === 'span' && node.children.includes('COPIED')), null);
    assert.ok(findElement(tree, node => node.props.role === 'status'));
  } finally {
    if (descriptor) Object.defineProperty(globalThis, 'navigator', descriptor);
    else delete globalThis.navigator;
  }
});

test('scroll controls use instant movement when reduced motion is requested', () => {
  const previousWindow = global.window;
  const { getScrollBehavior } = loadSource('lib/scroll.ts');
  try {
    global.window = { matchMedia: () => ({ matches: true }) };
    assert.equal(getScrollBehavior(), 'instant');
    global.window = { matchMedia: () => ({ matches: false }) };
    assert.equal(getScrollBehavior(), 'smooth');
  } finally {
    if (previousWindow === undefined) delete global.window;
    else global.window = previousWindow;
  }
});

test('contribution tooltip keeps date-only values unchanged in western time zones', () => {
  const previousTZ = process.env.TZ;
  process.env.TZ = 'America/Los_Angeles';
  try {
    const harness = createReactHarness();
    const { ContributionTooltip } = loadSource('components/github/ContributionTooltip.tsx', { react: harness.React });
    const tree = ContributionTooltip({
      day: { date: '2026-10-06', contributionCount: 1 }, position: { x: 20, y: 20 },
    });
    assert.ok(findElement(tree, node => node.children.includes('Oct 06, 2026')));
  } finally {
    if (previousTZ === undefined) delete process.env.TZ;
    else process.env.TZ = previousTZ;
  }
});
