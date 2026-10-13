'use client';

import React, { useEffect, useRef, useState } from 'react';
import { GitHubContributionsData } from '@/lib/github/types';
import { ContributionGrid } from './ContributionGrid';
import { GitHubRepositories } from './GitHubRepositories';
import { ArrowUpRight, Github, GitCommit } from 'lucide-react';
import { gsap, isReducedMotion } from '@/lib/motion';

export const GitHubContributions: React.FC = () => {
  const [data, setData] = useState<GitHubContributionsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadContributions() {
      try {
        setLoading(true);
        const res = await fetch('/api/github/contributions');
        if (!res.ok) throw new Error('API returned non-200');
        const json = await res.json();
        if (json.success && json.data && isMounted) {
          setData(json.data);
          setError(false);
        } else {
          throw new Error(json.error || 'Failed to load');
        }
      } catch (err) {
        console.warn('Could not load live GitHub contributions, using fallback view:', err);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadContributions();

    return () => {
      isMounted = false;
    };
  }, []);

  // GSAP ScrollTrigger entrance
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      const reduced = isReducedMotion();
      if (reduced) return;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      });

      tl.fromTo(
        '.github-header',
        { y: reduced ? 0 : 24, opacity: 1 },
        { y: 0, opacity: 1, duration: 0.65, ease: 'power2.out' }
      )
        .fromTo(
          '.github-metric-card',
          { y: reduced ? 0 : 28, opacity: 1 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power2.out',
          },
          '-=0.3'
        )
        .fromTo(
          '.github-calendar-card',
          { y: reduced ? 0 : 28, opacity: 1 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            clearProps: 'all',
          },
          '-=0.25'
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Dynamic date range formatted as e.g. "OCT 2025 — OCT 2026"
  const getDateRangeLabel = () => {
    if (!data?.calendar?.weeks?.length) return 'OCT 2025 — OCT 2026';
    const weeks = data.calendar.weeks;
    let firstDate = '';
    let lastDate = '';

    for (const w of weeks) {
      for (const d of w.contributionDays || []) {
        if (!firstDate) firstDate = d.date;
        lastDate = d.date;
      }
    }

    if (!firstDate || !lastDate) return 'OCT 2025 — OCT 2026';

    const [y1, m1] = firstDate.split('-').map(Number);
    const [y2, m2] = lastDate.split('-').map(Number);
    const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return `${MONTHS[m1 - 1]} ${y1} — ${MONTHS[m2 - 1]} ${y2}`;
  };

  return (
    <section
      ref={containerRef}
      id="activity"
      className="py-20 md:py-28 border-b border-neutral-300 dark:border-[#2A2A2A] bg-transparent dark:bg-[#0A0A0A] relative"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="github-header flex flex-col md:flex-row md:items-end justify-between pb-6 mb-10 border-b border-neutral-300 dark:border-[#2A2A2A]">
          <div>
            <div className="font-mono-code text-[11px] text-neutral-500 dark:text-[#A3A3A3] tracking-[0.25em] uppercase mb-2">
              06 / OPEN SOURCE & ACTIVITY
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-950 dark:text-[#F5F3EF] uppercase">
              GITHUB CONTRIBUTIONS
            </h2>
          </div>
          <p className="mt-4 md:mt-0 font-mono-code text-xs text-neutral-500 dark:text-[#A3A3A3] max-w-sm leading-relaxed">
            Building consistently, one commit at a time. Demonstrating active development and engineering progress.
          </p>
        </div>

        {/* Top Highlight Metric & Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 items-stretch">
          {/* Left: Total Contributions Highlight */}
          <div className="github-metric-card lg:col-span-4 p-7 flex flex-col justify-between liquid-glass-card rounded-2xl">
            <div>
              <div className="flex items-center justify-between font-mono-code text-[10px] text-neutral-400 dark:text-[#666666] uppercase mb-4">
                <div className="flex items-center gap-1.5">
                  <GitCommit className="w-3.5 h-3.5" />
                  <span>ANNUAL ACTIVITY</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="font-mono-code text-5xl sm:text-6xl font-bold tracking-tight text-neutral-950 dark:text-[#F5F3EF]">
                {loading ? (
                  <span className="inline-block animate-pulse text-neutral-400">···</span>
                ) : data ? (
                  data.calendar.totalContributions
                ) : (
                  '—'
                )}
              </div>

              <div className="font-mono-code text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-[#A3A3A3] mt-2">
                CONTRIBUTIONS
                <span className="block text-[10px] text-neutral-400 dark:text-[#666666] font-normal mt-0.5">
                  IN THE LAST 12 MONTHS
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--glass-rim)] font-mono-code text-[11px] text-neutral-500 dark:text-[#777777]">
              A record of consistent development activity across the past year.
            </div>
          </div>

          {/* Right: GitHub Identity & Action */}
          <div className="github-metric-card lg:col-span-8 p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 liquid-glass-card rounded-2xl">
            <div className="space-y-3 max-w-lg">
              <div className="inline-flex items-center gap-2 px-3 py-1 liquid-glass-chip rounded-md font-mono-code text-[10px] uppercase tracking-wider text-neutral-900 dark:text-[#F5F3EF]">
                <Github className="w-3.5 h-3.5" />
                <span>GITHUB PROFILE · awaisansari06</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-neutral-950 dark:text-[#F5F3EF]">
                BUILDING CONSISTENTLY, ONE PROJECT AT A TIME.
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-[#A3A3A3] leading-relaxed">
                Explore real repositories, commits, and open-source exploration across full-stack development and practical AI systems.
              </p>
            </div>

            <a
              href="https://github.com/awaisansari06"
              target="_blank"
              rel="noreferrer"
              data-cursor="GITHUB"
              className="shrink-0 px-6 py-3.5 liquid-glass-btn-primary bg-neutral-950 dark:bg-[#F5F3EF] text-white dark:text-[#0A0A0A] font-mono-code text-xs font-semibold tracking-widest uppercase transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>VIEW GITHUB</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Contribution Calendar Heatmap Card */}
        <div className="github-calendar-card p-5 sm:p-7 liquid-glass-card-frame rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 mb-3.5 border-b border-[var(--glass-rim)] gap-2">
            <div className="flex items-center gap-3">
              <span className="font-mono-code text-xs font-bold uppercase tracking-wider text-neutral-950 dark:text-[#F5F3EF]">
                CONTRIBUTION CALENDAR
              </span>
              <span className="font-mono-code text-[10px] px-2.5 py-0.5 liquid-glass-chip rounded-md text-neutral-700 dark:text-[#A3A3A3] font-medium">
                {getDateRangeLabel()}
              </span>
            </div>

            <span className="font-mono-code text-[9px] text-neutral-400 dark:text-[#666666] tracking-wider uppercase">
              SOURCE: GITHUB GRAPHQL
            </span>
          </div>

          {loading ? (
            /* Activity heatmap skeleton with green accents */
            <div className="py-4 space-y-3.5 animate-pulse">
              <div className="flex items-center justify-between font-mono-code text-[10px] text-neutral-400 dark:text-[#666666]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>SYNCHRONIZING WITH GITHUB GRAPHQL API...</span>
                </div>
                <span>52 WEEKS</span>
              </div>

              <div className="overflow-x-auto pb-2">
                <div className="flex gap-[3px] min-w-[720px]">
                  {Array.from({ length: 52 }).map((_, col) => (
                    <div key={col} className="flex flex-col gap-[3px]">
                      {Array.from({ length: 7 }).map((_, row) => {
                        const intensity = (col * 3 + row * 7) % 5;
                        const bgClass =
                          intensity === 4
                            ? 'bg-[#216E39] dark:bg-[#39D353]'
                            : intensity === 3
                            ? 'bg-[#30A14E] dark:bg-[#26A641]'
                            : intensity === 2
                            ? 'bg-[#40C463] dark:bg-[#006D32]'
                            : intensity === 1
                            ? 'bg-[#9BE9A8] dark:bg-[#0E4429]'
                            : 'bg-[#EBEDF0] dark:bg-[#161B22]';
                        return <div key={row} className={`w-[11px] h-[11px] rounded-[1px] ${bgClass}`} />;
                      })}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between font-mono-code text-[10px] text-neutral-400 dark:text-[#666666] pt-1">
                <span>LESS</span>
                <div className="flex items-center gap-1">
                  <div className="w-[10px] h-[10px] rounded-[1px] bg-[#EBEDF0] dark:bg-[#161B22]" />
                  <div className="w-[10px] h-[10px] rounded-[1px] bg-[#9BE9A8] dark:bg-[#0E4429]" />
                  <div className="w-[10px] h-[10px] rounded-[1px] bg-[#40C463] dark:bg-[#006D32]" />
                  <div className="w-[10px] h-[10px] rounded-[1px] bg-[#30A14E] dark:bg-[#26A641]" />
                  <div className="w-[10px] h-[10px] rounded-[1px] bg-[#216E39] dark:bg-[#39D353]" />
                </div>
                <span>MORE</span>
              </div>
            </div>
          ) : data && data.calendar ? (
            <div className="transition-opacity duration-500 ease-out opacity-100">
              <ContributionGrid calendar={data.calendar} />
            </div>
          ) : (
            <div className="py-12 text-center font-mono-code text-xs text-neutral-500 dark:text-[#A3A3A3] space-y-2">
              <p>Contribution calendar snapshot currently refreshing.</p>
              <a
                href="https://github.com/awaisansari06"
                target="_blank"
                rel="noreferrer"
                className="underline text-neutral-950 dark:text-[#F5F3EF]"
              >
                View directly on GitHub profile ↗
              </a>
            </div>
          )}
        </div>

        {/* Selected Repositories Grid */}
        <GitHubRepositories repositories={data?.repositories} />
      </div>
    </section>
  );
};
