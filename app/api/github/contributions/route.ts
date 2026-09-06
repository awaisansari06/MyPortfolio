import { NextResponse } from 'next/server';
import { fetchGitHubContributions } from '@/lib/github/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await fetchGitHubContributions();

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unable to retrieve GitHub contribution data at this time.',
          data: null,
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err?.message || 'Internal Server Error',
        data: null,
      },
      { status: 500 }
    );
  }
}
