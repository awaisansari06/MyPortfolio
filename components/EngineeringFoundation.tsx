'use client';

import React, { useEffect, useRef } from 'react';
import { portfolioData } from '@/data/portfolio';
import { TechIcon } from './TechIcon';
import { BookOpen, Cpu, Database, Binary, ShieldCheck } from 'lucide-react';
import { gsap, isReducedMotion, MOTION_EASE } from '@/lib/motion';

const FOUNDATION_TOOLS: Record<string, string> = {
  'Data Structures & Algorithms': 'C++',
  'Object-Oriented Programming': 'Java',
  'Database Management': 'SQL',
  'Operating Systems': 'PowerShell',
  'Software Engineering': 'VS Code',
};

export const EngineeringFoundation = () => {
  const containerRef = useRef<HTMLElement>(null);
  const icons = [Binary, ShieldCheck, Database, Cpu, BookOpen];

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Header reveal
      gsap.fromTo(
        '.eng-header',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: MOTION_EASE.out,
          scrollTrigger: {
            trigger: '.eng-header',
            start: 'top 85%',
            once: true,
          },
        }
      );

      // Staggered cards reveal
      gsap.fromTo(
        '.eng-card',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.06,
          ease: MOTION_EASE.out,
          scrollTrigger: {
            trigger: '.eng-grid',
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
      id="engineering"
      className="py-24 md:py-36 border-b border-neutral-300 dark:border-[#2A2A2A] relative"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="eng-header flex flex-col md:flex-row md:items-end justify-between pb-8 mb-16 border-b border-neutral-300 dark:border-[#2A2A2A]">
          <div>
            <div className="font-mono-code text-[11px] text-neutral-500 dark:text-[#A3A3A3] tracking-[0.25em] uppercase mb-2">
              04 / CORE COMPUTER SCIENCE
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-950 dark:text-[#F5F3EF] uppercase">
              ENGINEERING FOUNDATION
            </h2>
          </div>
          <p className="mt-4 md:mt-0 font-mono-code text-xs text-neutral-500 dark:text-[#A3A3A3] max-w-sm leading-relaxed">
            Core computer science principles, algorithmic problem solving, and software engineering practices.
          </p>
        </div>

        {/* Foundations Grid */}
        <div className="eng-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioData.engineeringFoundations.map((foundation, index) => {
            const Icon = icons[index % icons.length];
            const associatedTool = foundation.tool || FOUNDATION_TOOLS[foundation.name];

            return (
              <div
                key={foundation.name}
                className="eng-card p-8 flex flex-col justify-between transition-colors duration-200 group liquid-glass-card"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10 dark:border-white/10">
                    <span className="font-mono-code text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                      FOUNDATION 0{index + 1}
                    </span>
                    <div className="flex items-center gap-2.5">
                      {associatedTool && (
                        <span className="font-mono-code text-[10px] px-2 py-0.5 inline-flex items-center gap-1.5 shadow-2xs liquid-glass-chip text-neutral-800 dark:text-neutral-200">
                          <TechIcon name={associatedTool} className="w-3 h-3 shrink-0" />
                          <span>{associatedTool}</span>
                        </span>
                      )}
                      <Icon className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-neutral-950 dark:text-[#F5F3EF] uppercase tracking-tight">
                    {foundation.name}
                  </h3>

                  <p className="mt-4 text-xs sm:text-sm text-neutral-600 dark:text-[#A3A3A3] leading-relaxed font-normal">
                    {foundation.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
