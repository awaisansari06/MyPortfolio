'use client';

import React, { useEffect, useRef } from 'react';
import { portfolioData } from '@/data/portfolio';
import { TechIcon } from './TechIcon';
import { ArrowUpRight, Layers, Cpu, Globe, Sparkles } from 'lucide-react';
import { gsap, isReducedMotion, MOTION_EASE } from '@/lib/motion';

export const WhatIBuild = () => {
  const containerRef = useRef<HTMLElement>(null);
  const icons = [Layers, Cpu, Globe, Sparkles];

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Header reveal
      gsap.fromTo(
        '.wib-header',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: MOTION_EASE.out,
          scrollTrigger: {
            trigger: '.wib-header',
            start: 'top 85%',
            once: true,
          },
        }
      );

      // Staggered cards reveal
      gsap.fromTo(
        '.wib-card',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.07,
          ease: MOTION_EASE.out,
          scrollTrigger: {
            trigger: '.wib-grid',
            start: 'top 80%',
            once: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="what-i-build"
      className="py-24 md:py-32 border-b border-neutral-300 dark:border-[#2A2A2A] relative bg-transparent dark:bg-[#0A0A0A]"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="wib-header flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-neutral-300 dark:border-[#2A2A2A]">
          <div>
            <div className="font-mono-code text-[11px] text-neutral-500 dark:text-[#A3A3A3] tracking-[0.25em] uppercase mb-2">
              01 / DOMAIN OF EXPERTISE
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-950 dark:text-[#F5F3EF] uppercase">
              WHAT I BUILD
            </h2>
          </div>
          <p className="mt-4 md:mt-0 font-mono-code text-xs text-neutral-500 dark:text-[#A3A3A3] max-w-sm leading-relaxed">
            Building production-ready web applications, generative AI workflows, and modern digital interfaces.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="wib-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {portfolioData.whatIBuild.map((item, index) => {
            const Icon = icons[index % icons.length];

            return (
              <div
                key={item.number}
                className="wib-card group relative p-8 flex flex-col justify-between min-h-[360px] transition-all duration-300 liquid-glass-card"
              >
                <div>
                  {/* Category Number & Icon */}
                  <div className="flex items-center justify-between pb-6 border-b border-neutral-300/60 dark:border-white/10">
                    <span className="font-mono-code text-xs font-semibold tracking-wider text-neutral-400 dark:text-[#666666]">
                      {item.number}
                    </span>
                    <Icon className="w-5 h-5 transition-colors duration-200 text-neutral-400 dark:text-[#666666] group-hover:text-neutral-950 dark:group-hover:text-[#F5F3EF]" />
                  </div>

                  {/* Title */}
                  <div className="mt-8">
                    <h3 className="text-xl font-bold uppercase tracking-tight text-neutral-950 dark:text-[#F5F3EF] leading-tight">
                      {item.title}
                    </h3>
                    <h4 className="text-xl font-bold uppercase tracking-tight text-neutral-400 dark:text-neutral-500 leading-tight">
                      {item.subtitle}
                    </h4>
                  </div>

                  {/* Description */}
                  <p className="mt-6 text-sm text-neutral-600 dark:text-[#A3A3A3] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Tech Tags */}
                <div className="mt-8 pt-6 border-t border-neutral-300/60 dark:border-white/10">
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] font-mono-code px-2 py-0.5 inline-flex items-center gap-1 liquid-glass-chip text-neutral-700 dark:text-[#A3A3A3]"
                      >
                        <TechIcon name={tag} className="w-2.5 h-2.5 shrink-0" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Corner indicator */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Development Philosophy Footnote */}
        <div className="mt-12 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono-code text-neutral-500 dark:text-[#A3A3A3] liquid-glass-node">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-[#F5F3EF]" />
            <span>DEVELOPMENT APPROACH: CLEAN CODE & PRACTICAL SYSTEMS</span>
          </div>
          <div className="flex flex-wrap gap-6 text-[11px] text-neutral-500 dark:text-[#888888]">
            <span>TYPE-SAFE</span>
            <span>ACCESSIBLE</span>
            <span>TESTED</span>
          </div>
        </div>
      </div>
    </section>
  );
};
