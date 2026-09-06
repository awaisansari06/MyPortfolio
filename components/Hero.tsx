'use client';

import React, { useEffect, useRef } from 'react';
import { portfolioData } from '@/data/portfolio';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { gsap, isReducedMotion, MOTION_EASE } from '@/lib/motion';

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
      {/* Background Architectural Grid (Isolated layer that does not determine document height) */}
      <div className="hero-grid absolute inset-0 bg-grid-pattern pointer-events-none z-0" />

      {/* Vertical editorial scroll indicator (desktop) */}
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
        {/* Editorial Role & Category Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-3 sm:mb-3.5">
          <span className="hero-pill px-3 py-1 border border-neutral-300 dark:border-[#2A2A2A] rounded-full text-[9px] sm:text-[10px] tracking-widest uppercase font-mono-code text-neutral-900 dark:text-[#F5F3EF]">
            FULL-STACK DEVELOPER
          </span>
          <span className="hero-pill px-3 py-1 border border-neutral-300 dark:border-[#2A2A2A] rounded-full text-[9px] sm:text-[10px] tracking-widest uppercase font-mono-code text-neutral-500 dark:text-[#A3A3A3]">
            AI APPLICATIONS
          </span>
          <span className="hero-pill px-3 py-1 border border-neutral-300 dark:border-[#2A2A2A] rounded-full text-[9px] sm:text-[10px] tracking-widest uppercase font-mono-code text-neutral-500 dark:text-[#A3A3A3]">
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
          <h1 className="hero-name-line text-[50px] sm:text-[72px] md:text-[84px] lg:text-[96px] xl:text-[106px] font-bold uppercase tracking-tighter text-stroke-editorial text-neutral-900 dark:text-[#F5F3EF]">
            ANSARI
          </h1>
        </div>

        {/* Editorial Description - Tightened relationship to name (small gap above, medium gap below) */}
        <p className="hero-desc text-sm sm:text-base md:text-lg text-neutral-600 dark:text-[#A3A3A3] max-w-[580px] leading-relaxed mx-auto mb-4 sm:mb-5 font-normal">
          Building AI-powered full-stack applications and intelligent digital products.
        </p>

        {/* Editorial Metadata Columns */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-14 mb-5 sm:mb-6 pb-3.5 sm:pb-4 border-b border-neutral-300 dark:border-[#2A2A2A] w-full max-w-xl mx-auto">
          <div className="hero-meta-col flex flex-col items-center text-center">
            <span className="text-[10px] tracking-[0.2em] text-neutral-400 dark:text-[#666666] mb-1 uppercase font-mono-code">
              / FOCUS
            </span>
            <span className="text-xs uppercase tracking-wider font-semibold text-neutral-900 dark:text-[#F5F3EF]">
              Full-Stack & AI
            </span>
          </div>
          <div className="hero-meta-col flex flex-col items-center text-center">
            <span className="text-[10px] tracking-[0.2em] text-neutral-400 dark:text-[#666666] mb-1 uppercase font-mono-code">
              / FOUNDATION
            </span>
            <span className="text-xs uppercase tracking-wider font-semibold text-neutral-900 dark:text-[#F5F3EF]">
              M.Sc Computer Science
            </span>
          </div>
          <div className="hero-meta-col flex flex-col items-center text-center">
            <span className="text-[10px] tracking-[0.2em] text-neutral-400 dark:text-[#666666] mb-1 uppercase font-mono-code">
              / STATUS
            </span>
            <span className="text-xs uppercase tracking-wider font-semibold text-neutral-900 dark:text-[#F5F3EF] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Open to Opportunities
            </span>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={() => scrollTo('work')}
            data-cursor="EXPLORE"
            className="hero-cta-btn group inline-flex items-center gap-2.5 px-6 py-3 bg-neutral-950 hover:bg-neutral-800 dark:bg-[#F5F3EF] dark:hover:bg-white text-white dark:text-[#0A0A0A] font-mono-code text-xs tracking-wider font-semibold transition-colors duration-200 cursor-pointer"
          >
            <span>VIEW ALL WORK</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => scrollTo('contact')}
            data-cursor="CONTACT"
            className="hero-cta-btn inline-flex items-center gap-2 px-5 py-3 border border-neutral-300 dark:border-[#2A2A2A] bg-transparent hover:bg-neutral-200/50 dark:hover:bg-[#181818] text-neutral-900 dark:text-[#F5F3EF] font-mono-code text-xs tracking-wider transition-colors duration-200 cursor-pointer"
          >
            <span>LET&apos;S CONNECT</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
          </button>

          <a
            href="/AwaisCV.pdf"
            download="Mohammad-Awais-Ansari-Resume.pdf"
            data-cursor="RESUME"
            aria-label="Download resume PDF"
            className="hero-cta-btn inline-flex items-center gap-2 px-5 py-3 border border-neutral-300 dark:border-[#2A2A2A] bg-transparent hover:bg-neutral-200/50 dark:hover:bg-[#181818] text-neutral-900 dark:text-[#F5F3EF] font-mono-code text-xs tracking-wider transition-colors duration-200 cursor-pointer"
          >
            <span>RESUME</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
          </a>
        </div>
      </div>

      {/* Editorial Footer Project Ticker Strip */}
      <footer className="hero-footer-ticker relative z-10 w-full border-t border-neutral-300 dark:border-[#2A2A2A] bg-neutral-100/50 dark:bg-[#0A0A0A] mt-6 sm:mt-8 md:mt-10 mt-auto">
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
              className="w-9 h-9 border border-neutral-900 dark:border-[#F5F3EF] rounded-full flex items-center justify-center group cursor-pointer hover:bg-neutral-900 hover:text-white dark:hover:bg-[#F5F3EF] dark:hover:text-[#0A0A0A] transition-colors duration-200"
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
