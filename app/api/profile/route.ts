import { NextResponse } from 'next/server';
import { portfolioData } from '@/data/portfolio';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      data: {
        name: portfolioData.name,
        role: portfolioData.role,
        subRole: portfolioData.subRole,
        statement: portfolioData.statement,
        bio: portfolioData.bio,
        location: portfolioData.location,
        email: portfolioData.email,
        socials: portfolioData.socials,
        education: portfolioData.education,
        techCategories: portfolioData.techCategories,
        certifications: portfolioData.certifications,
      },
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    }
  );
}
