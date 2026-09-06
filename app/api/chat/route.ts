import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { buildSystemInstruction } from '@/lib/ai/systemPrompt';

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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            'Portfolio AI service is temporarily unavailable. Please connect via email or LinkedIn.',
        },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid message payload. An array of messages is required.' },
        { status: 400 }
      );
    }

    // Protect against oversized message lists
    const recentMessages = messages.slice(-10);
    const lastUserMessage = recentMessages[recentMessages.length - 1];

    if (!lastUserMessage || lastUserMessage.role !== 'user' || typeof lastUserMessage.content !== 'string') {
      return NextResponse.json(
        { error: 'Latest message must be from user with text content.' },
        { status: 400 }
      );
    }

    // Limit individual message length to prevent prompt stuffing
    if (lastUserMessage.content.length > 500) {
      return NextResponse.json(
        { error: 'Query is too long. Please keep questions under 500 characters.' },
        { status: 400 }
      );
    }

    // Format messages for Google Gen AI
    const contents = recentMessages.map((msg: { role: string; content: string }) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const ai = new GoogleGenAI({ apiKey });
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3.6-flash',
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
