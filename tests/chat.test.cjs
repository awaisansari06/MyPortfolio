const assert = require('node:assert/strict');
const { test } = require('node:test');
const { loadSource, createReactHarness, findElement, icons } = require('./helpers.cjs');
const limits = loadSource('lib/ai/messages.ts');
const requests = [];
let providerFailure = null;
const { POST } = loadSource('app/api/chat/route.ts', {
  '@/lib/ai/messages': limits,
  '@/lib/ai/systemPrompt': { buildSystemInstruction: () => 'Test portfolio instruction' },
  '@google/genai': {
    GoogleGenAI: class {
      models = {
        generateContentStream: async request => {
          if (providerFailure) throw providerFailure;
          requests.push(request);
          return (async function* () { yield { text: 'Test answer' }; })();
        },
      };
    },
  },
});

let requestId = 0;
async function send(payload, raw = false) {
  return POST(new Request('http://localhost/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': `test-${requestId++}` },
    body: raw ? payload : JSON.stringify(payload),
  }));
}

test('chat accepts valid history and streams the provider response', async () => {
  const previousKey = process.env.GEMINI_API_KEY;
  process.env.GEMINI_API_KEY = 'local-test-key';
  try {
    const response = await send({ messages: [
      { role: 'user', content: 'Previous question' },
      { role: 'assistant', content: 'Previous answer' },
      { role: 'user', content: 'Current question' },
    ] });
    assert.equal(response.status, 200);
    assert.equal(await response.text(), 'Test answer');
    assert.equal(requests.at(-1).contents[1].role, 'model');
  } finally {
    if (previousKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = previousKey;
  }
});

test('chat rejects oversized earlier user messages before contacting Gemini', async () => {
  const before = requests.length;
  const response = await send({ messages: [
    { role: 'user', content: 'x'.repeat(501) },
    { role: 'assistant', content: 'Answer' },
    { role: 'user', content: 'Hi' },
  ] });
  assert.equal(response.status, 400);
  assert.equal(requests.length, before);
});

test('chat bounds assistant history, total history, and message count', async () => {
  const histories = [
    [{ role: 'assistant', content: 'x'.repeat(8001) }, { role: 'user', content: 'Hi' }],
    [...Array.from({ length: 3 }, () => ({ role: 'assistant', content: 'x'.repeat(8000) })), { role: 'user', content: 'Hi' }],
    Array.from({ length: 11 }, () => ({ role: 'user', content: 'Hi' })),
  ];
  for (const messages of histories) {
    assert.equal((await send({ messages })).status, 400);
  }
});

test('chat rejects malformed messages, null payloads, invalid JSON, and non-user endings', async () => {
  const payloads = [null, {}, { messages: [null] },
    { messages: [{ role: 'system', content: 'Instruction' }, { role: 'user', content: 'Hi' }] },
    { messages: [{ role: 'user', content: '   ' }] },
    { messages: [{ role: 'assistant', content: 'Answer' }] },
  ];
  for (const payload of payloads) assert.equal((await send(payload)).status, 400);
  assert.equal((await send('{broken json', true)).status, 400);
});

test('chat rejects oversized HTTP bodies even without a Content-Length header', async () => {
  const before = requests.length;
  assert.equal((await send('x'.repeat(limits.MAX_CHAT_BODY_BYTES + 1), true)).status, 413);
  assert.equal(requests.length, before);
});

test('retry replaces a partial answer and reuses the original question', async () => {
  const harness = createReactHarness();
  const effects = [];
  const { AskAwaisChat } = loadSource('components/ai/AskAwaisChat.tsx', {
    react: { ...harness.React, useEffect: effect => effects.push(effect) },
    'lucide-react': icons,
    '@/components/liquid-glass/LiquidGlassSurface': { LiquidGlassSurface: 'surface' },
    '@/hooks/useDialogFocus': { useDialogFocus() {} },
    '@/hooks/useChatViewport': { useChatViewport: () => ({ compact: false, viewportStyle: {} }) },
    './MobileAiLauncher': { MobileAiLauncher: 'mobile-launcher' },
    '@/lib/ai/stream': loadSource('lib/ai/stream.ts'),
    '@/lib/scroll': { getScrollBehavior: () => 'instant' },
    '@/lib/ai/messages': limits,
  });
  const previousFetch = global.fetch;
  const previousWindow = global.window;
  global.window = new EventTarget();
  const previousError = console.error;
  const payloads = [];
  global.fetch = async (_url, options) => {
    payloads.push(JSON.parse(options.body));
    let reads = 0;
    const attempt = payloads.length;
    return { ok: true, body: { getReader: () => ({ read: async () => {
      if (reads++ === 0) return { done: false, value: new TextEncoder().encode(attempt === 1 ? 'Partial answer' : 'Complete answer') };
      if (attempt === 1) throw new Error('Simulated disconnection');
      return { done: true };
    } }) } };
  };
  console.error = () => {};
  try {
    let tree = harness.render(AskAwaisChat);
    effects.splice(0).forEach(effect => effect());
    global.window.dispatchEvent(new Event('open-ask-ai'));
    tree = harness.render(AskAwaisChat);
    findElement(tree, node => node.type === 'textarea').props.onChange({ target: { value: 'Tell me about CareerWise' } });
    tree = harness.render(AskAwaisChat);
    findElement(tree, node => node.type === 'form').props.onSubmit({ preventDefault() {} });
    await new Promise(resolve => setImmediate(resolve));
    tree = harness.render(AskAwaisChat);
    const retry = findElement(tree, node => node.type === 'button' &&
      findElement(node, child => child.type === 'span' && child.children.includes('Retry')));
    await retry.props.onClick();
    assert.deepEqual(payloads[1].messages, payloads[0].messages);
    assert.equal(payloads[1].messages.at(-1).content, 'Tell me about CareerWise');
    tree = harness.render(AskAwaisChat);
    assert.ok(findElement(tree, node => node.props.content === 'Complete answer'));
    assert.equal(findElement(tree, node => node.props.content === 'Partial answer'), null);
  } finally {
    global.fetch = previousFetch;
    if (previousWindow === undefined) delete global.window;
    else global.window = previousWindow;
    console.error = previousError;
  }
});

test('provider overload is reported as temporary unavailability without exposing provider details', async () => {
  const previousKey = process.env.GEMINI_API_KEY;
  const previousError = console.error;
  process.env.GEMINI_API_KEY = 'local-test-key';
  console.error = () => {};
  providerFailure = Object.assign(new Error('Private provider diagnostics'), { status: 503 });
  try {
    const response = await send({ messages: [{ role: 'user', content: 'Hi' }] });
    assert.equal(response.status, 503);
    const body = await response.json();
    assert.match(body.error, /temporarily unavailable/);
    assert.equal(body.error.includes('Private provider diagnostics'), false);
  } finally {
    providerFailure = null;
    console.error = previousError;
    if (previousKey === undefined) delete process.env.GEMINI_API_KEY; else process.env.GEMINI_API_KEY = previousKey;
  }
});
