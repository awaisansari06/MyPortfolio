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
    if (isReducedMotion()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      });

      tl.from('.github-header', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
      })
        .from(
          '.github-metric-card',
          {
            y: 24,
            opacity: 0,
            duration: 0.55,
            stagger: 0.1,
            ease: 'power2.out',
          },
          '-=0.3'
        )
        .from(
          '.github-calendar-card',
          {
            y: 20,
            opacity: 0,
            duration: 0.55,
            ease: 'power2.out',
            clearProps: 'all',
          },
          '-=0.25'
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Dynamic date range formatted as "SEP 2025 — SEP 2026"
  const getDateRangeLabel = () => {
    if (!data?.calendar?.weeks?.length) return 'SEP 2025 — SEP 2026';
    const weeks = data.calendar.weeks;
    const firstWeek = weeks[0];
    const lastWeek = weeks[weeks.length - 1];
    const firstDay = firstWeek?.contributionDays?.[0];
    const lastDay = lastWeek?.contributionDays?.[lastWeek.contributionDays.length - 1];

    if (!firstDay || !lastDay) return 'SEP 2025 — SEP 2026';

    const start = new Date(firstDay.date);
    const end = new Date(lastDay.date);
    const startStr = start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();
    const endStr = end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();
    return `${startStr} — ${endStr}`;
  };

  return (
    <section
      ref={containerRef}
      id="activity"
      className="py-24 md:py-36 border-b border-neutral-300 dark:border-[#2A2A2A] bg-[#F7F6F3]/50 dark:bg-[#0A0A0A] relative"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="github-header flex flex-col md:flex-row md:items-end justify-between pb-8 mb-16 border-b border-neutral-300 dark:border-[#2A2A2A]">
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-stretch">
          {/* Left: Total Contributions Highlight */}
          <div className="github-metric-card lg:col-span-4 p-8 border border-neutral-300 dark:border-[#2A2A2A] bg-white dark:bg-[#111111] flex flex-col justify-between">
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

            <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-[#222222] font-mono-code text-[11px] text-neutral-500 dark:text-[#777777]">
              A record of consistent development activity across the past year.
            </div>
          </div>

          {/* Right: GitHub Identity & Action */}
          <div className="github-metric-card lg:col-span-8 p-8 border border-neutral-300 dark:border-[#2A2A2A] bg-white dark:bg-[#111111] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-3 max-w-lg">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 border border-neutral-300 dark:border-[#2A2A2A] bg-neutral-50 dark:bg-[#181818] font-mono-code text-[10px] uppercase tracking-wider text-neutral-900 dark:text-[#F5F3EF]">
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
              className="shrink-0 px-6 py-3.5 bg-neutral-950 hover:bg-neutral-800 dark:bg-[#F5F3EF] dark:hover:bg-white text-white dark:text-[#0A0A0A] font-mono-code text-xs font-semibold tracking-widest uppercase transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>VIEW GITHUB</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Contribution Calendar Heatmap Card */}
        <div className="github-calendar-card p-6 sm:p-8 border border-neutral-300 dark:border-[#2A2A2A] bg-white dark:bg-[#111111]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-neutral-200 dark:border-[#222222] gap-2">
            <div className="flex items-center gap-3">
              <span className="font-mono-code text-xs font-bold uppercase tracking-wider text-neutral-950 dark:text-[#F5F3EF]">
                CONTRIBUTION CALENDAR
              </span>
              <span className="font-mono-code text-[10px] px-2.5 py-0.5 border border-neutral-300 dark:border-[#2A2A2A] bg-neutral-100 dark:bg-[#181818] text-neutral-700 dark:text-[#A3A3A3] font-medium">
                {getDateRangeLabel()}
              </span>
            </div>

            <span className="font-mono-code text-[9px] text-neutral-400 dark:text-[#666666] tracking-wider uppercase">
              SOURCE: GITHUB GRAPHQL
            </span>
          </div>

          {loading ? (
            /* Genuine editorial monochrome heatmap skeleton */
            <div className="py-6 space-y-4 animate-pulse">
              <div className="flex items-center justify-between font-mono-code text-[10px] text-neutral-400 dark:text-[#666666]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-neutral-400 dark:bg-[#444444] animate-ping" />
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
                            ? 'bg-neutral-400 dark:bg-[#555555]'
                            : intensity === 3
                            ? 'bg-neutral-300 dark:bg-[#383838]'
                            : intensity === 2
                            ? 'bg-neutral-200 dark:bg-[#252525]'
                            : 'bg-neutral-100 dark:bg-[#181818]';
                        return <div key={row} className={`w-[10px] h-[10px] ${bgClass}`} />;
                      })}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between font-mono-code text-[10px] text-neutral-400 dark:text-[#666666] pt-1">
                <span>LESS</span>
                <div className="flex items-center gap-1">
                  <div className="w-[10px] h-[10px] bg-neutral-100 dark:bg-[#181818]" />
                  <div className="w-[10px] h-[10px] bg-neutral-200 dark:bg-[#252525]" />
                  <div className="w-[10px] h-[10px] bg-neutral-300 dark:bg-[#383838]" />
                  <div className="w-[10px] h-[10px] bg-neutral-400 dark:bg-[#555555]" />
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
