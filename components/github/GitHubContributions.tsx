'use client';
import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { GitHubContributionsData } from '@/lib/github/types';
import { ContributionGrid } from './ContributionGrid';
import { portfolioData } from '@/data/portfolio';
export const GitHubContributions = () => {
 const [data, setData] = useState<GitHubContributionsData | null>(null);
 const [loading, setLoading] = useState(true);
 useEffect(() => {
 const controller = new AbortController();
 fetch('/api/github/contributions', { signal: controller.signal }).then(response => response.json()).then(result => { if(result.success && result.data) setData(result.data); }).catch(() => {}).finally(() => { if(!controller.signal.aborted) setLoading(false); });
 return () => controller.abort();
 }, []);
 return <div id="activity" className="activity-compact"><div className="activity-heading"><h2>Always building.</h2><a href={portfolioData.socials.github} target="_blank" rel="noreferrer">Follow on GitHub <ArrowUpRight size={15}/></a></div>{loading ? <p className="activity-status" role="status">Loading contribution activity…</p> : data?.calendar ? <div className="activity-calendar"><p>{data.calendar.totalContributions.toLocaleString()} contributions in the last 12 months</p><ContributionGrid calendar={data.calendar}/></div> : <p className="activity-status">Explore my latest commits and projects on GitHub.</p>}</div>;
};