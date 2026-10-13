import type { ChatMessage } from './messages';

export async function streamChat(
  messages: ChatMessage[],
  onText: (text: string) => void,
  signal: AbortSignal,
  timeoutMs = 45000,
) {
  const controller = new AbortController();
  let timedOut = false;
  let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
  const cancel = () => controller.abort();
  signal.addEventListener('abort', cancel, { once: true });
  const timer = setTimeout(() => { timedOut = true; controller.abort(); }, timeoutMs);
  let rejectAbort: () => void = () => {};
  const aborted = new Promise<never>((_, reject) => {
    rejectAbort = () => reject(new Error(timedOut
      ? 'The response took too long. Please retry your question.'
      : 'Response stopped. You can retry your question.'));
    controller.signal.addEventListener('abort', rejectAbort, { once: true });
  });
  if (signal.aborted) cancel();

  try {
    const response = await Promise.race([fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
      signal: controller.signal,
    }), aborted]);
    if (!response.ok) {
      const error = await Promise.race([response.json().catch(() => ({})), aborted]);
      throw new Error(error.error || `Request failed with status ${response.status}`);
    }
    if (!response.body) throw new Error('Streaming is unavailable. Please retry.');
    reader = response.body.getReader();
    const decoder = new TextDecoder();
    let text = '';
    while (true) {
      const { done, value } = await Promise.race([reader.read(), aborted]);
      text += done ? decoder.decode() : decoder.decode(value, { stream: true });
      onText(text);
      if (done) break;
    }
  } finally {
    clearTimeout(timer);
    signal.removeEventListener('abort', cancel);
    controller.signal.removeEventListener('abort', rejectAbort);
    if (reader && controller.signal.aborted) void reader.cancel?.().catch(() => {});
    reader?.releaseLock?.();
  }
}
