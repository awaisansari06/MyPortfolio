'use client';

import React, { useState, useEffect, useRef } from 'react';
import { portfolioData, ProjectCaseStudy } from '@/data/portfolio';
import { ProjectModal } from './ProjectModal';
import { TechIcon } from './TechIcon';
import { ArrowUpRight, ArrowRight, ExternalLink, Sparkles, Check, Database, Server, Layers, MapPin, FileText, Code2, Terminal } from 'lucide-react';
import { gsap, isReducedMotion, MOTION_EASE } from '@/lib/motion';

export const SelectedWork = () => {
  const containerRef = useRef<HTMLElement>(null);
  const [activeModalProject, setActiveModalProject] = useState<ProjectCaseStudy | null>(null);

  const careerwise = portfolioData.projects[0];
  const devflow = portfolioData.projects[1];
  const smartjourney = portfolioData.projects[2];

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Header reveal
      gsap.fromTo(
        '.work-header',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: MOTION_EASE.out,
          scrollTrigger: {
            trigger: '.work-header',
            start: 'top 85%',
            once: true,
          },
        }
      );

      // Project blocks reveal
      const projectBlocks = gsap.utils.toArray<HTMLElement>('.project-block');
      projectBlocks.forEach((block) => {
        const info = block.querySelector('.project-info');
        const visual = block.querySelector('.project-visual');

        if (info) {
          gsap.fromTo(
            info,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.65,
              ease: MOTION_EASE.out,
              scrollTrigger: {
                trigger: block,
                start: 'top 78%',
                once: true,
              },
            }
          );
        }

        if (visual) {
          gsap.fromTo(
            visual,
            { opacity: 0, y: 24, scale: 0.985 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              delay: 0.08,
              ease: MOTION_EASE.out,
              scrollTrigger: {
                trigger: block,
                start: 'top 78%',
                once: true,
              },
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="work"
      className="py-24 md:py-36 border-b border-neutral-300 dark:border-[#2A2A2A] relative"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="work-header flex flex-col md:flex-row md:items-end justify-between pb-8 mb-20 border-b border-neutral-300 dark:border-[#2A2A2A]">
          <div>
            <div className="font-mono-code text-[11px] text-neutral-500 dark:text-[#A3A3A3] tracking-[0.25em] uppercase mb-2">
              02 / PRODUCTION PORTFOLIO
            </div>
            <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-neutral-950 dark:text-[#F5F3EF] uppercase">
              SELECTED WORK
            </h2>
          </div>
          <p className="mt-4 md:mt-0 font-mono-code text-xs text-neutral-500 dark:text-[#A3A3A3] max-w-md leading-relaxed">
            Three production-grade full-stack and AI applications engineered with Next.js, PostgreSQL, Google Gemini, and modern cloud sandboxes.
          </p>
        </div>

        {/* ---------------- PROJECT 01: CAREERWISE ---------------- */}
        <div className="project-block mb-32 pb-24 border-b border-neutral-300 dark:border-[#2A2A2A]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            {/* Left: Project Editorial Details */}
            <div className="project-info lg:col-span-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 font-mono-code text-xs text-neutral-400 dark:text-[#666666] mb-3">
                  <span className="font-semibold text-neutral-900 dark:text-[#F5F3EF]">01</span>
                  <span>/</span>
                  <span className="uppercase">{careerwise.category}</span>
                </div>

                <h3 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight text-neutral-950 dark:text-[#F5F3EF]">
                  {careerwise.title}
                </h3>
                <p className="font-mono-code text-xs text-neutral-500 dark:text-[#A3A3A3] mt-2 uppercase tracking-wider">
                  {careerwise.tagline}
                </p>

                <p className="mt-5 text-base text-neutral-700 dark:text-[#A3A3A3] leading-relaxed font-normal">
                  {careerwise.shortDescription || careerwise.description}
                </p>

                {/* High-Level Architecture Pipeline */}
                <div className="mt-6 p-4 border border-neutral-300 dark:border-[#2A2A2A] bg-neutral-100/60 dark:bg-[#111111]">
                  <div className="font-mono-code text-[10px] text-neutral-400 dark:text-[#666666] uppercase tracking-wider mb-2.5">
                    PROCESSING ARCHITECTURE
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono-code">
                    {careerwise.flowSteps.map((step, idx) => (
                      <React.Fragment key={step}>
                        <span className="px-2.5 py-1 bg-white dark:bg-[#181818] border border-neutral-300 dark:border-[#2A2A2A] text-neutral-900 dark:text-[#F5F3EF] font-medium">
                          {step}
                        </span>
                        {idx < careerwise.flowSteps.length - 1 && (
                          <span className="text-neutral-400 dark:text-[#666666]">➔</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Concise Core Capabilities */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono-code text-xs">
                  {(careerwise.conciseFeatures || careerwise.features.slice(0, 4)).map((feat, i) => (
                    <div
                      key={i}
                      className="px-3 py-2 border border-neutral-200 dark:border-[#222222] bg-white dark:bg-[#111111] flex items-center gap-2 text-neutral-700 dark:text-[#A3A3A3]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-950 dark:bg-[#F5F3EF] shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Compact Tech Badges */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {(careerwise.compactTechnologies || careerwise.technologies.slice(0, 8)).map((t) => (
                    <span
                      key={t}
                      className="font-mono-code text-[10px] px-2.5 py-1 border border-neutral-300 dark:border-[#2A2A2A] bg-neutral-100/40 dark:bg-[#111111] text-neutral-700 dark:text-[#A3A3A3] inline-flex items-center gap-1.5 hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors"
                    >
                      <TechIcon name={t} className="w-3 h-3 shrink-0" />
                      <span>{t}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href={careerwise.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="OPEN"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-950 hover:bg-neutral-800 dark:bg-[#F5F3EF] dark:hover:bg-white text-white dark:text-[#0A0A0A] font-mono-code text-xs font-semibold tracking-wider transition-colors duration-200 cursor-pointer"
                >
                  <span>VISIT CAREERWISE</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => setActiveModalProject(careerwise)}
                  data-cursor="VIEW"
                  className="inline-flex items-center gap-2 px-5 py-3 border border-neutral-300 dark:border-[#2A2A2A] hover:bg-neutral-200/60 dark:hover:bg-[#181818] text-neutral-900 dark:text-[#F5F3EF] font-mono-code text-xs tracking-wider transition-colors cursor-pointer"
                >
                  <span>CASE STUDY & SPECS</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-70" />
                </button>
              </div>
            </div>

            {/* Right: Actual Product Interface & Editorial Frame */}
            <div className="project-visual lg:col-span-6">
              <div className="relative rounded-2xl border border-neutral-300 dark:border-[#2A2A2A] bg-neutral-100/50 dark:bg-[#111111]/60 p-4 sm:p-6 backdrop-blur-xs overflow-hidden group">
                <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-neutral-400 dark:border-[#3A3A3A] pointer-events-none z-10" />
                <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-neutral-400 dark:border-[#3A3A3A] pointer-events-none z-10" />

                {/* Editorial Browser Chrome Bar */}
                <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-neutral-300 dark:border-[#2A2A2A] font-mono-code text-[11px] text-neutral-500 dark:text-[#888888]">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]/80" />
                    </div>
                    <span className="ml-1.5 text-neutral-700 dark:text-[#C5C3BF] font-medium">careerwise-v1.vercel.app</span>
                  </div>
                  <a
                    href={careerwise.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="OPEN"
                    className="inline-flex items-center gap-1.5 text-neutral-500 dark:text-[#888888] hover:text-neutral-950 dark:hover:text-[#F5F3EF] transition-colors"
                  >
                    <span className="text-[10px] uppercase tracking-wider hidden sm:inline">LIVE</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Actual Product Screenshot in Editorial Frame */}
                <div
                  onClick={() => setActiveModalProject(careerwise)}
                  data-cursor="VIEW"
                  className="relative rounded-lg border border-neutral-300/80 dark:border-[#2A2A2A] overflow-hidden bg-neutral-950/5 dark:bg-black/40 cursor-pointer shadow-sm group/frame"
                >
                  <img
                    src="/ProjectImage/CareerWise-Dark.png"
                    alt="CareerWise AI Career Intelligence Platform Live Interface"
                    className="w-full h-auto object-cover hidden dark:block transition-transform duration-500 group-hover/frame:scale-[1.015]"
                    loading="eager"
                  />
                  <img
                    src="/ProjectImage/CareerWise-Light.png"
                    alt="CareerWise AI Career Intelligence Platform Live Interface"
                    className="w-full h-auto object-cover block dark:hidden transition-transform duration-500 group-hover/frame:scale-[1.015]"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-neutral-950/0 group-hover/frame:bg-neutral-950/5 dark:group-hover/frame:bg-white/5 transition-colors pointer-events-none" />
                </div>

                {/* Editorial Metadata Footer */}
                <div className="mt-4 pt-3 border-t border-neutral-300 dark:border-[#2A2A2A] flex justify-between items-center font-mono-code text-[10px] text-neutral-500 dark:text-[#777777]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="uppercase tracking-wider font-semibold text-neutral-800 dark:text-[#CCCCCC]">CAREERWISE PLATFORM</span>
                  </div>
                  <div className="flex items-center gap-3 tracking-wide">
                    <span>NEXT.JS 15.5</span>
                    <span>•</span>
                    <span>GEMINI AI</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- PROJECT 02: DEVFLOW ---------------- */}
        <div className="project-block mb-32 pb-24 border-b border-neutral-300 dark:border-[#2A2A2A]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            {/* Left: Product Interface & Editorial Frame */}
            <div className="project-visual lg:col-span-6 order-2 lg:order-1 relative rounded-2xl border border-neutral-300 dark:border-[#2A2A2A] bg-neutral-100/50 dark:bg-[#111111]/60 p-4 sm:p-6 overflow-hidden group">
              <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-neutral-400 dark:border-[#3A3A3A] pointer-events-none z-10" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-neutral-400 dark:border-[#3A3A3A] pointer-events-none z-10" />

              {/* Editorial Browser Chrome Bar */}
              <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-neutral-300 dark:border-[#2A2A2A] font-mono-code text-[11px] text-neutral-500 dark:text-[#888888]">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]/80" />
                  </div>
                  <span className="ml-1.5 text-neutral-700 dark:text-[#C5C3BF] font-medium">devflow-project.vercel.app</span>
                </div>
                <a
                  href={devflow.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="OPEN"
                  className="inline-flex items-center gap-1.5 text-neutral-500 dark:text-[#888888] hover:text-neutral-950 dark:hover:text-[#F5F3EF] transition-colors"
                >
                  <span className="text-[10px] uppercase tracking-wider hidden sm:inline">LIVE</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Actual Product Screenshot in Editorial Frame */}
              <div
                onClick={() => setActiveModalProject(devflow)}
                data-cursor="VIEW"
                className="relative rounded-lg border border-neutral-300/80 dark:border-[#2A2A2A] overflow-hidden bg-neutral-950/5 dark:bg-black/40 cursor-pointer shadow-sm group/frame"
              >
                <img
                  src="/ProjectImage/DevFlow-Dark.png"
                  alt="DevFlow Intelligent AI Web Development Platform"
                  className="w-full h-auto object-cover hidden dark:block transition-transform duration-500 group-hover/frame:scale-[1.015]"
                  loading="lazy"
                />
                <img
                  src="/ProjectImage/DevFlow-Light.png"
                  alt="DevFlow Intelligent AI Web Development Platform"
                  className="w-full h-auto object-cover block dark:hidden transition-transform duration-500 group-hover/frame:scale-[1.015]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-neutral-950/0 group-hover/frame:bg-neutral-950/5 dark:group-hover/frame:bg-white/5 transition-colors pointer-events-none" />
              </div>

              {/* Editorial Metadata Footer */}
              <div className="mt-4 pt-3 border-t border-neutral-300 dark:border-[#2A2A2A] flex justify-between items-center font-mono-code text-[10px] text-neutral-500 dark:text-[#777777]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="uppercase tracking-wider font-semibold text-neutral-800 dark:text-[#CCCCCC]">DEVFLOW PLATFORM</span>
                </div>
                <div className="flex items-center gap-3 tracking-wide">
                  <span>E2B SANDBOX</span>
                  <span>•</span>
                  <span>NEXT.JS 15</span>
                </div>
              </div>
            </div>

            {/* Right: Technical Spec & Architecture */}
            <div className="project-info lg:col-span-6 order-1 lg:order-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 font-mono-code text-xs text-neutral-400 dark:text-[#666666] mb-3">
                  <span className="font-semibold text-neutral-900 dark:text-[#F5F3EF]">02</span>
                  <span>/</span>
                  <span className="uppercase">{devflow.category}</span>
                </div>

                <h3 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight text-neutral-950 dark:text-[#F5F3EF]">
                  {devflow.title}
                </h3>
                <p className="font-mono-code text-xs text-neutral-500 dark:text-[#A3A3A3] mt-2 uppercase tracking-wider">
                  {devflow.tagline}
                </p>

                <p className="mt-5 text-base text-neutral-700 dark:text-[#A3A3A3] leading-relaxed font-normal">
                  {devflow.shortDescription || devflow.description}
                </p>

                {/* High-Level Architecture Pipeline */}
                <div className="mt-6 p-4 border border-neutral-300 dark:border-[#2A2A2A] bg-neutral-100/60 dark:bg-[#111111]">
                  <div className="font-mono-code text-[10px] text-neutral-400 dark:text-[#666666] uppercase tracking-wider mb-2.5">
                    PROCESSING ARCHITECTURE
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono-code">
                    {devflow.flowSteps.map((step, idx) => (
                      <React.Fragment key={step}>
                        <span className="px-2.5 py-1 bg-white dark:bg-[#181818] border border-neutral-300 dark:border-[#2A2A2A] text-neutral-900 dark:text-[#F5F3EF] font-medium">
                          {step}
                        </span>
                        {idx < devflow.flowSteps.length - 1 && (
                          <span className="text-neutral-400 dark:text-[#666666]">➔</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Concise Core Capabilities */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono-code text-xs">
                  {(devflow.conciseFeatures || devflow.features.slice(0, 4)).map((feat, i) => (
                    <div
                      key={i}
                      className="px-3 py-2 border border-neutral-200 dark:border-[#222222] bg-white dark:bg-[#111111] flex items-center gap-2 text-neutral-700 dark:text-[#A3A3A3]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-950 dark:bg-[#F5F3EF] shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Compact Tech Stack */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {(devflow.compactTechnologies || devflow.technologies.slice(0, 8)).map((t) => (
                    <span
                      key={t}
                      className="font-mono-code text-[10px] px-2.5 py-1 border border-neutral-300 dark:border-[#2A2A2A] bg-neutral-100/40 dark:bg-[#111111] text-neutral-700 dark:text-[#A3A3A3] inline-flex items-center gap-1.5 hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors"
                    >
                      <TechIcon name={t} className="w-3 h-3 shrink-0" />
                      <span>{t}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href={devflow.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="OPEN"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-950 hover:bg-neutral-800 dark:bg-[#F5F3EF] dark:hover:bg-white text-white dark:text-[#0A0A0A] font-mono-code text-xs font-semibold tracking-wider transition-colors duration-200 cursor-pointer"
                >
                  <span>LAUNCH DEVFLOW</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => setActiveModalProject(devflow)}
                  data-cursor="VIEW"
                  className="inline-flex items-center gap-2 px-5 py-3 border border-neutral-300 dark:border-[#2A2A2A] hover:bg-neutral-200/60 dark:hover:bg-[#181818] text-neutral-900 dark:text-[#F5F3EF] font-mono-code text-xs tracking-wider transition-colors cursor-pointer"
                >
                  <span>CASE STUDY & SPECS</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-70" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- PROJECT 03: SMARTJOURNEY ---------------- */}
        <div className="project-block">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            {/* Left: Editorial Details */}
            <div className="project-info lg:col-span-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 font-mono-code text-xs text-neutral-400 dark:text-[#666666] mb-3">
                  <span className="font-semibold text-neutral-900 dark:text-[#F5F3EF]">03</span>
                  <span>/</span>
                  <span className="uppercase">{smartjourney.category}</span>
                </div>

                <h3 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight text-neutral-950 dark:text-[#F5F3EF]">
                  {smartjourney.title}
                </h3>
                <p className="font-mono-code text-xs text-neutral-500 dark:text-[#A3A3A3] mt-2 uppercase tracking-wider">
                  {smartjourney.tagline}
                </p>

                <p className="mt-5 text-base text-neutral-700 dark:text-[#A3A3A3] leading-relaxed font-normal">
                  {smartjourney.shortDescription || smartjourney.description}
                </p>

                {/* High-Level Architecture Pipeline */}
                <div className="mt-6 p-4 border border-neutral-300 dark:border-[#2A2A2A] bg-neutral-100/60 dark:bg-[#111111]">
                  <div className="font-mono-code text-[10px] text-neutral-400 dark:text-[#666666] uppercase tracking-wider mb-2.5">
                    PROCESSING ARCHITECTURE
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono-code">
                    {smartjourney.flowSteps.map((step, idx) => (
                      <React.Fragment key={step}>
                        <span className="px-2.5 py-1 bg-white dark:bg-[#181818] border border-neutral-300 dark:border-[#2A2A2A] text-neutral-900 dark:text-[#F5F3EF] font-medium">
                          {step}
                        </span>
                        {idx < smartjourney.flowSteps.length - 1 && (
                          <span className="text-neutral-400 dark:text-[#666666]">➔</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Concise Core Capabilities */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono-code text-xs">
                  {(smartjourney.conciseFeatures || smartjourney.features.slice(0, 4)).map((feat, i) => (
                    <div
                      key={i}
                      className="px-3 py-2 border border-neutral-200 dark:border-[#222222] bg-white dark:bg-[#111111] flex items-center gap-2 text-neutral-700 dark:text-[#A3A3A3]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-950 dark:bg-[#F5F3EF] shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Compact Tech Stack */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {(smartjourney.compactTechnologies || smartjourney.technologies.slice(0, 8)).map((t) => (
                    <span
                      key={t}
                      className="font-mono-code text-[10px] px-2.5 py-1 border border-neutral-300 dark:border-[#2A2A2A] bg-neutral-100/40 dark:bg-[#111111] text-neutral-700 dark:text-[#A3A3A3] inline-flex items-center gap-1.5 hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors"
                    >
                      <TechIcon name={t} className="w-3 h-3 shrink-0" />
                      <span>{t}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href={smartjourney.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="OPEN"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-950 hover:bg-neutral-800 dark:bg-[#F5F3EF] dark:hover:bg-white text-white dark:text-[#0A0A0A] font-mono-code text-xs font-semibold tracking-wider transition-colors duration-200 cursor-pointer"
                >
                  <span>LAUNCH SMARTJOURNEY</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => setActiveModalProject(smartjourney)}
                  data-cursor="VIEW"
                  className="inline-flex items-center gap-2 px-5 py-3 border border-neutral-300 dark:border-[#2A2A2A] hover:bg-neutral-200/60 dark:hover:bg-[#181818] text-neutral-900 dark:text-[#F5F3EF] font-mono-code text-xs tracking-wider transition-colors cursor-pointer"
                >
                  <span>CASE STUDY & SPECS</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-70" />
                </button>
              </div>
            </div>

            {/* Right: Product Interface & Editorial Frame */}
            <div className="project-visual lg:col-span-6 relative rounded-2xl border border-neutral-300 dark:border-[#2A2A2A] bg-neutral-100/50 dark:bg-[#111111]/60 p-4 sm:p-6 overflow-hidden group">
              <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-neutral-400 dark:border-[#3A3A3A] pointer-events-none z-10" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-neutral-400 dark:border-[#3A3A3A] pointer-events-none z-10" />

              {/* Editorial Browser Chrome Bar */}
              <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-neutral-300 dark:border-[#2A2A2A] font-mono-code text-[11px] text-neutral-500 dark:text-[#888888]">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]/80" />
                  </div>
                  <span className="ml-1.5 text-neutral-700 dark:text-[#C5C3BF] font-medium">smartjourney-v2.vercel.app</span>
                </div>
                <a
                  href={smartjourney.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="OPEN"
                  className="inline-flex items-center gap-1.5 text-neutral-500 dark:text-[#888888] hover:text-neutral-950 dark:hover:text-[#F5F3EF] transition-colors"
                >
                  <span className="text-[10px] uppercase tracking-wider hidden sm:inline">LIVE</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Actual Product Screenshot in Editorial Frame */}
              <div
                onClick={() => setActiveModalProject(smartjourney)}
                data-cursor="VIEW"
                className="relative rounded-lg border border-neutral-300/80 dark:border-[#2A2A2A] overflow-hidden bg-neutral-950/5 dark:bg-black/40 cursor-pointer shadow-sm group/frame"
              >
                <img
                  src="/ProjectImage/SmartJourney-Dark.png"
                  alt="SmartJourney AI-Driven Personalized Travel Assistant"
                  className="w-full h-auto object-cover hidden dark:block transition-transform duration-500 group-hover/frame:scale-[1.015]"
                  loading="lazy"
                />
                <img
                  src="/ProjectImage/SmartJourney-Light.png"
                  alt="SmartJourney AI-Driven Personalized Travel Assistant"
                  className="w-full h-auto object-cover block dark:hidden transition-transform duration-500 group-hover/frame:scale-[1.015]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-neutral-950/0 group-hover/frame:bg-neutral-950/5 dark:group-hover/frame:bg-white/5 transition-colors pointer-events-none" />
              </div>

              {/* Editorial Metadata Footer */}
              <div className="mt-4 pt-3 border-t border-neutral-300 dark:border-[#2A2A2A] flex justify-between items-center font-mono-code text-[10px] text-neutral-500 dark:text-[#777777]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="uppercase tracking-wider font-semibold text-neutral-800 dark:text-[#CCCCCC]">SMARTJOURNEY</span>
                </div>
                <div className="flex items-center gap-3 tracking-wide">
                  <span>MAPBOX</span>
                  <span>•</span>
                  <span>CONVEX DB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Case Study Modal */}
      <ProjectModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
      />
    </section>
  );
};
