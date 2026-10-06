import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { buildSystemInstruction } from '@/lib/ai/systemPrompt';
import { MAX_CHAT_BODY_BYTES, validateChatMessages } from '@/lib/ai/messages';

export const dynamic = 'force-dynamic';

// In-memory rate limiting map: IP -> timestamp array
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 15;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimitMap.set(ip, validTimestamps);
    return true;
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'anonymous';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          error:
            'Rate limit reached (15 queries per minute). Please wait a moment before asking another question.',
        },
        { status: 429 }
      );
    }

    const reader = req.body?.getReader();
    if (!reader) {
      return NextResponse.json({ error: 'A JSON request body is required.' }, { status: 400 });
    }
    const decoder = new TextDecoder();
    let bodyText = '';
    let bodyBytes = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        bodyBytes += value.byteLength;
        if (bodyBytes > MAX_CHAT_BODY_BYTES) {
          await reader.cancel();
          return NextResponse.json({ error: 'Request body is too large.' }, { status: 413 });
        }
        bodyText += decoder.decode(value, { stream: true });
      }
      bodyText += decoder.decode();
    } finally {
      reader.releaseLock();
    }

    let body: unknown;
    try {
      body = JSON.parse(bodyText);
    } catch {
      return NextResponse.json({ error: 'Request body must contain valid JSON.' }, { status: 400 });
    }
    const validation = validateChatMessages(body);
    if ('error' in validation) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Portfolio AI service is temporarily unavailable. Please connect via email or LinkedIn.' },
        { status: 503 }
      );
    }

    // Format messages for Google Gen AI
    const contents = validation.messages.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const ai = new GoogleGenAI({ apiKey });
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3.5-flash-lite',
      contents,
      config: {
        systemInstruction: buildSystemInstruction(),
        temperature: 0.2,
        maxOutputTokens: 1024,
      },
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            const text = chunk.text;
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (err: any) {
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error: any) {
    console.error('Ask Awais AI route error:', error);
    return NextResponse.json(
      {
        error:
          error?.message ||
          'Failed to process your request. Please try again or reach out directly to Awais.',
      },
      { status: 500 }
    );
  }
}
