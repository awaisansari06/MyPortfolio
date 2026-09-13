'use client';

import React, { useEffect, useRef } from 'react';
import { portfolioData } from '@/data/portfolio';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { gsap, isReducedMotion, MOTION_EASE } from '@/lib/motion';
import { RefractiveButton } from '@/components/liquid-glass/LiquidGlass';

export const Hero = () => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: MOTION_EASE.out } });

      tl.fromTo(
        '.hero-grid',
        { opacity: 0 },
        { opacity: 1, duration: 0.8 }
      )
        .fromTo(
          '.hero-pill',
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.45, stagger: 0.06 },
          0.1
        )
        .fromTo(
          '.hero-name-line',
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 },
          0.2
        )
        .fromTo(
          '.hero-desc',
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5 },
          0.45
        )
        .fromTo(
          '.hero-meta-col',
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.45, stagger: 0.07 },
          0.55
        )
        .fromTo(
          '.hero-cta-btn',
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.45, stagger: 0.06 },
          0.65
        )
        .fromTo(
          '.hero-footer-ticker',
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          0.72
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative w-full min-h-0 md:min-h-[clamp(540px,80vh,740px)] pt-[clamp(56px,6vw,82px)] pb-0 flex flex-col justify-between border-b border-neutral-300 dark:border-[#2A2A2A] overflow-hidden"
    >
      {/* Background Architectural Grid */}
      <div className="hero-grid absolute inset-0 bg-grid-pattern pointer-events-none z-0" />

      {/* Vertical scroll indicator (desktop) */}
      <div className="hidden xl:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col items-center space-y-8 z-20 pointer-events-none select-none">
        <div className="w-[1px] h-28 bg-neutral-300 dark:border-[#2A2A2A] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-8 bg-neutral-900 dark:bg-[#F5F3EF] animate-pulse" />
        </div>
        <span className="text-[9px] tracking-[0.45em] font-mono-code font-medium text-neutral-400 dark:text-[#A3A3A3] [writing-mode:vertical-rl] rotate-180 uppercase">
          SCROLL TO EXPLORE
        </span>
      </div>

      {/* Centered Typography-First Hero Composition */}
      <div className="relative max-w-5xl mx-auto px-6 md:px-12 w-full flex flex-col items-center text-center pt-2 sm:pt-3 pb-4 sm:pb-6 z-10">

        {/* Role & Category Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-3 sm:mb-3.5">
          <span className="hero-pill liquid-glass-badge px-3 py-1 text-[9px] sm:text-[10px] tracking-widest uppercase font-mono-code transition-all duration-300 text-neutral-950 dark:text-[#F5F3EF]">
            FULL-STACK DEVELOPER
          </span>
          <span className="hero-pill liquid-glass-badge px-3 py-1 text-[9px] sm:text-[10px] tracking-widest uppercase font-mono-code transition-all duration-300 text-neutral-700 dark:text-[#D4D4D4]">
            AI APPLICATIONS
          </span>
          <span className="hero-pill liquid-glass-badge px-3 py-1 text-[9px] sm:text-[10px] tracking-widest uppercase font-mono-code transition-all duration-300 text-neutral-700 dark:text-[#D4D4D4]">
            M.SC COMPUTER SCIENCE
          </span>
        </div>

        {/* Main Monumental Name Headline */}
        <div className="space-y-0 text-neutral-950 dark:text-[#F5F3EF] leading-[0.84] select-none mb-2 sm:mb-2.5">
          <h1 className="hero-name-line text-[50px] sm:text-[72px] md:text-[84px] lg:text-[96px] xl:text-[106px] font-bold uppercase tracking-tighter">
            MOHAMMAD
          </h1>
          <h1 className="hero-name-line text-[50px] sm:text-[72px] md:text-[84px] lg:text-[96px] xl:text-[106px] font-bold uppercase tracking-tighter text-neutral-900 dark:text-[#F5F3EF]">
            AWAIS
          </h1>
          <h1 className="hero-name-line text-[50px] sm:text-[72px] md:text-[84px] lg:text-[96px] xl:text-[106px] font-bold uppercase tracking-tighter text-stroke-hollow text-neutral-900 dark:text-[#F5F3EF]">
            ANSARI
          </h1>
        </div>

        {/* Description */}
        <p className="hero-desc text-sm sm:text-base md:text-lg text-neutral-600 dark:text-[#A3A3A3] max-w-[580px] leading-relaxed mx-auto mb-4 sm:mb-5 font-normal">
          Building AI-powered full-stack applications and intelligent digital products.
        </p>

        {/* ── METADATA (3 floating glass cards) ─────────────────────────────── */}
        <div className="flex flex-wrap items-start justify-center gap-3 sm:gap-4 mb-5 sm:mb-6">
          {/* Card 1 — Focus */}
          <div className="hero-meta-col liquid-glass-card px-4 sm:px-5 py-3 sm:py-3.5 flex flex-col gap-0.5">
            <span className="text-[9px] tracking-[0.22em] font-mono-code uppercase text-neutral-400 dark:text-[#666666] mb-0.5">
              / FOCUS
            </span>
            <span className="text-xs sm:text-[13px] font-semibold tracking-wider uppercase text-neutral-900 dark:text-[#F5F3EF]">
              Full-Stack & AI
            </span>
          </div>
          {/* Card 2 — Foundation */}
          <div className="hero-meta-col liquid-glass-card px-4 sm:px-5 py-3 sm:py-3.5 flex flex-col gap-0.5">
            <span className="text-[9px] tracking-[0.22em] font-mono-code uppercase text-neutral-400 dark:text-[#666666] mb-0.5">
              / FOUNDATION
            </span>
            <span className="text-xs sm:text-[13px] font-semibold tracking-wider uppercase text-neutral-900 dark:text-[#F5F3EF]">
              M.Sc Computer Science
            </span>
          </div>
          {/* Card 3 — Status badge */}
          <div className="hero-meta-col liquid-glass-badge px-3.5 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
            <span className="text-xs font-semibold tracking-wider uppercase text-neutral-900 dark:text-[#F5F3EF] whitespace-nowrap">
              Open to Opportunities
            </span>
          </div>
        </div>

        {/* ── CTAs ─────────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={() => scrollTo('work')}
            data-cursor="EXPLORE"
            className="hero-cta-btn liquid-glass-btn-primary group inline-flex items-center gap-2.5 px-6 py-3 font-mono-code text-xs tracking-wider font-semibold cursor-pointer bg-neutral-950 dark:bg-[#F5F3EF] text-white dark:text-[#0A0A0A]"
          >
            <span>VIEW ALL WORK</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </button>

          <RefractiveButton
            onClick={() => scrollTo('contact')}
            data-cursor="CONTACT"
            className="hero-cta-btn"
          >
            <span>LET&apos;S CONNECT</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
          </RefractiveButton>

          <RefractiveButton
            href="/AwaisCV.pdf"
            target="_blank"
            data-cursor="RESUME"
            className="hero-cta-btn"
          >
            <span>RESUME</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
          </RefractiveButton>
        </div>
      </div>

      {/* Footer Project Ticker Strip */}
      <footer
        className="hero-footer-ticker relative z-10 w-full border-t border-neutral-300 dark:border-[#2A2A2A] mt-6 sm:mt-8 md:mt-10 mt-auto bg-transparent"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 items-center py-5 gap-4">
          <div
            onClick={() => scrollTo('work')}
            className="flex flex-col group cursor-pointer"
          >
            <span className="text-[9px] text-neutral-400 dark:text-[#666666] font-mono-code uppercase mb-0.5">
              01 / PROJECT
            </span>
            <span className="text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-neutral-800 dark:text-neutral-300 group-hover:text-neutral-950 dark:group-hover:text-[#F5F3EF] transition-colors truncate">
              CareerWise AI
            </span>
          </div>

          <div
            onClick={() => scrollTo('work')}
            className="flex flex-col group cursor-pointer md:border-l md:border-neutral-300 md:dark:border-[#2A2A2A] md:pl-6"
          >
            <span className="text-[9px] text-neutral-400 dark:text-[#666666] font-mono-code uppercase mb-0.5">
              02 / PROJECT
            </span>
            <span className="text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-neutral-800 dark:text-neutral-300 group-hover:text-neutral-950 dark:group-hover:text-[#F5F3EF] transition-colors truncate">
              DevFlow Platform
            </span>
          </div>

          <div
            onClick={() => scrollTo('work')}
            className="flex flex-col group cursor-pointer border-t md:border-t-0 pt-3 md:pt-0 border-neutral-200 dark:border-[#2A2A2A] md:border-l md:border-neutral-300 md:dark:border-[#2A2A2A] md:pl-6"
          >
            <span className="text-[9px] text-neutral-400 dark:text-[#666666] font-mono-code uppercase mb-0.5">
              03 / PROJECT
            </span>
            <span className="text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-neutral-800 dark:text-neutral-300 group-hover:text-neutral-950 dark:group-hover:text-[#F5F3EF] transition-colors truncate">
              SmartJourney V2
            </span>
          </div>

          <div className="flex justify-end items-center space-x-3 border-t md:border-t-0 pt-3 md:pt-0 border-neutral-200 dark:border-[#2A2A2A]">
            <button
              onClick={() => scrollTo('work')}
              aria-label="View all projects"
              className="w-9 h-9 flex items-center justify-center group cursor-pointer transition-colors duration-200 liquid-glass-badge text-neutral-900 dark:text-[#F5F3EF]"
            >
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <span
              onClick={() => scrollTo('work')}
              className="text-[10px] sm:text-[11px] font-mono-code uppercase tracking-widest font-bold cursor-pointer text-neutral-900 dark:text-[#F5F3EF]"
            >
              VIEW ALL WORK
            </span>
          </div>
        </div>
      </footer>
    </section>
  );
};
