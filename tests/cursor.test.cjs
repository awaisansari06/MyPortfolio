const assert = require('node:assert/strict');
const { test } = require('node:test');
const { loadSource } = require('./helpers.cjs');

function withCursor(run) {
  const previous = Object.fromEntries(['window', 'document', 'Element', 'requestAnimationFrame', 'cancelAnimationFrame'].map(key => [key, global[key]]));
  const eventSource = () => {
    const listeners = new Map();
    return {
      listeners,
      addEventListener: (name, fn) => listeners.set(name, fn),
      removeEventListener: name => listeners.delete(name),
      emit: (name, event = {}) => listeners.get(name)?.(event),
    };
  };
  class Target {
    constructor({ editable = false, action = '', interactive = false } = {}) { Object.assign(this, { editable, action, interactive }); }
    closest(selector) {
      if (selector.startsWith('input')) return this.editable ? this : null;
      if (selector === '[data-cursor]') return this.action ? this : null;
      return this.interactive ? this : null;
    }
    getAttribute() { return this.action; }
  }
  const frames = new Map();
  let id = 0;
  const classes = new Set();
  const media = { ...eventSource(), matches: true };
  const win = { ...eventSource(), innerWidth: 1440, innerHeight: 900, matchMedia: () => media };
  const doc = { ...eventSource(), hidden: false, documentElement: eventSource(), body: { classList: {
    add: name => classes.add(name), remove: name => classes.delete(name), contains: name => classes.has(name),
  } }, elementFromPoint: () => new Target() };
  Object.assign(global, {
    window: win, document: doc, Element: Target,
    requestAnimationFrame: fn => { frames.set(++id, fn); return id; },
    cancelAnimationFrame: key => frames.delete(key),
  });
  const cursor = { dataset: {}, style: {} };
  const label = { textContent: '' };
  const { attachCursor } = loadSource('lib/cursor.ts');
  const cleanup = attachCursor(cursor, label);
  const move = (x, y, target = new Target(), pointerType = 'mouse') => win.emit('pointermove', { clientX: x, clientY: y, target, pointerType });
  const flush = () => { const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(fn => fn()); };
  try { run({ cursor, label, move, flush, frames, classes, win, doc, media, Target, cleanup }); }
  finally {
    cleanup();
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete global[key]; else global[key] = value;
    }
  }
}

test('cursor batches pointer events and uses the latest exact hit point', () => withCursor(({ move, flush, frames, cursor, classes }) => {
  move(100, 80); move(125.5, 94.25); move(160, 110);
  assert.equal(frames.size, 1);
  assert.equal(classes.has('has-custom-cursor'), false);
  flush();
  assert.equal(cursor.style.transform, 'translate3d(160px, 110px, 0)');
  assert.equal(cursor.dataset.visible, 'true');
  assert.ok(classes.has('has-custom-cursor'));
}));

test('hover and action labels preserve the hit point and flip at viewport edges', () => withCursor(({ move, flush, cursor, label, Target }) => {
  move(340, 85, new Target({ interactive: true })); flush();
  assert.equal(cursor.dataset.mode, 'interactive');
  assert.equal(cursor.style.transform, 'translate3d(340px, 85px, 0)');
  move(1430, 890, new Target({ action: 'VIEW' })); flush();
  assert.equal(cursor.dataset.mode, 'action');
  assert.equal(label.textContent, 'VIEW');
  assert.equal(cursor.dataset.flipX, 'true');
  assert.equal(cursor.dataset.flipY, 'true');
  assert.equal(cursor.style.transform, 'translate3d(1430px, 890px, 0)');
}));

test('editing, touch, keyboard and blur restore the native cursor', () => withCursor(({ move, flush, cursor, classes, Target, doc, win, frames }) => {
  const visible = () => { move(100, 100); flush(); assert.ok(classes.has('has-custom-cursor')); };
  visible(); move(101, 100, new Target({ editable: true })); flush();
  assert.equal(cursor.dataset.visible, 'false');
  assert.equal(classes.has('has-custom-cursor'), false);
  visible(); move(100, 100, new Target(), 'touch');
  assert.equal(cursor.dataset.visible, 'false');
  visible(); doc.emit('keydown', { key: 'Tab' });
  assert.equal(cursor.dataset.visible, 'false');
  visible(); move(120, 120); win.emit('blur');
  assert.equal(frames.size, 0);
  assert.equal(classes.has('has-custom-cursor'), false);
}));

test('scrolling updates the hover target and cleanup removes listeners and frames', () => withCursor(({ move, flush, cursor, classes, Target, doc, win, media, frames, cleanup }) => {
  move(200, 200, new Target({ interactive: true })); flush();
  doc.elementFromPoint = () => new Target();
  doc.emit('scroll'); flush();
  assert.equal(cursor.dataset.mode, 'default');
  move(250, 250); cleanup();
  assert.equal(frames.size, 0);
  assert.equal(classes.has('has-custom-cursor'), false);
  assert.equal(win.listeners.size + doc.listeners.size + media.listeners.size + doc.documentElement.listeners.size, 0);
}));
