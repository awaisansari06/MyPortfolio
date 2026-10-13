'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { projectImages } from '@/lib/projectImages';
import { portfolioData, ProjectCaseStudy } from '@/data/portfolio';
import { ProjectModal } from './ProjectModal';
import { TechIcon } from './TechIcon';
import { ArrowUpRight, ArrowRight, ExternalLink } from 'lucide-react';
import { gsap, isReducedMotion, MOTION_EASE } from '@/lib/motion';
import { useGlassHoverLens } from '@/hooks/useGlassHoverLens';
import { RefractiveProcessFlow, RefractiveButton } from '@/components/liquid-glass/LiquidGlass';

export const SelectedWork = () => {
  const containerRef = useRef<HTMLElement>(null);
  const [activeModalProject, setActiveModalProject] = useState<ProjectCaseStudy | null>(null);

  // Interactive specular hover lens refs for each project visual frame
  const frame1Ref = useGlassHoverLens<HTMLDivElement>();
  const frame2Ref = useGlassHoverLens<HTMLDivElement>();
  const frame3Ref = useGlassHoverLens<HTMLDivElement>();

  const careerwise = portfolioData.projects[0];
  const buildstack = portfolioData.projects[1];
  const tripcraft = portfolioData.projects[2];

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      const reduced = isReducedMotion();
      if (reduced) return;

      // Header reveal
      gsap.fromTo(
        '.work-header',
        { opacity: 1, y: reduced ? 0 : 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: MOTION_EASE.out,
          scrollTrigger: {
            trigger: '.work-header',
            start: 'top 85%',
            once: true,
          },
        }
      );

      // Project blocks stagger-in
      const blocks = gsap.utils.toArray<HTMLElement>('.project-block');
      blocks.forEach((block) => {
        const info = block.querySelector('.project-info');
        const visual = block.querySelector('.project-visual');

        if (info) {
          gsap.fromTo(
            info,
            { opacity: 1, y: reduced ? 0 : 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: MOTION_EASE.out,
              scrollTrigger: {
                trigger: block,
                start: 'top 80%',
                once: true,
              },
            }
          );
        }

        if (visual) {
          gsap.fromTo(
            visual,
            { opacity: 1, y: reduced ? 0 : 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              delay: 0.1,
              ease: MOTION_EASE.out,
              scrollTrigger: {
                trigger: block,
                start: 'top 80%',
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

        <div className="work-header flex flex-col md:flex-row md:items-end justify-between pb-8 mb-16 border-b border-neutral-300 dark:border-[#2A2A2A]">
          <div>
            <div className="font-mono-code text-[11px] text-neutral-500 dark:text-[#A3A3A3] tracking-[0.25em] uppercase mb-2">
              02 / FLAGSHIP SYSTEMS
            </div>
            <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-neutral-950 dark:text-[#F5F3EF] uppercase">
              SELECTED WORK
            </h2>
          </div>
          <p className="mt-4 md:mt-0 font-mono-code text-xs text-neutral-500 dark:text-[#A3A3A3] max-w-md leading-relaxed">
            Three production-grade full-stack and AI applications engineered with Next.js, PostgreSQL, Google Gemini, and modern cloud sandboxes.
          </p>
        </div>

        <div className="project-block mb-32 pb-24 border-b border-neutral-300 dark:border-[#2A2A2A]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">

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

                <div className="mt-6 p-4 transition-all duration-300 liquid-glass-node">
                  <div className="font-mono-code text-[10px] text-neutral-400 dark:text-[#666666] uppercase tracking-wider mb-2.5">
                    PROCESSING ARCHITECTURE
                  </div>
                  <RefractiveProcessFlow steps={careerwise.flowSteps} />
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono-code text-xs">
                  {(careerwise.conciseFeatures || careerwise.features.slice(0, 4)).map((feat, i) => (
                    <div
                      key={i}
                      className="px-3 py-2 flex items-center gap-2 transition-all duration-200 rounded-lg border border-neutral-300/70 dark:border-[#2A2A2A] bg-white/50 dark:bg-[#141414]/50 text-neutral-800 dark:text-[#D4D4D4]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-950 dark:bg-[#F5F3EF] shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {(careerwise.compactTechnologies || careerwise.technologies.slice(0, 8)).map((t) => (
                    <span
                      key={t}
                      className="font-mono-code text-[10px] px-2.5 py-1 inline-flex items-center gap-1.5 transition-all duration-200 liquid-glass-chip text-neutral-800 dark:text-[#D4D4D4]"
                    >
                      <TechIcon name={t} className="w-3 h-3 shrink-0" />
                      <span>{t}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href={careerwise.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="OPEN"
                  className="inline-flex items-center gap-2 px-6 py-3 font-mono-code text-xs font-semibold tracking-wider cursor-pointer liquid-glass-btn-primary bg-neutral-950 dark:bg-[#F5F3EF] text-white dark:text-[#0A0A0A]"
                >
                  <span>VISIT CAREERWISE</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <RefractiveButton
                  onClick={() => setActiveModalProject(careerwise)}
                  data-cursor="VIEW"
                >
                  <span>CASE STUDY & SPECS</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-70" />
                </RefractiveButton>
              </div>
            </div>

            <div className="project-visual lg:col-span-6">
              <div
                ref={frame1Ref}
                className="relative rounded-2xl p-4 sm:p-6 overflow-hidden group transition-all duration-300 liquid-glass-card-frame"
              >

                <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-neutral-300/60 dark:border-[#2E2E2E] font-mono-code text-[11px] text-neutral-500 dark:text-[#888888]">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]/80" />
                    </div>
                    <span className="ml-1.5 text-neutral-700 dark:text-[#C5C3BF] font-medium">careerwise.app</span>
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

                <button
                  type="button"
                  aria-label={`View ${careerwise.title} case study`}
                  onClick={() => setActiveModalProject(careerwise)}
                  data-cursor="VIEW"
                  className="relative block w-full text-left rounded-lg border border-neutral-300/80 dark:border-[#2A2A2A] overflow-hidden bg-neutral-950/5 dark:bg-black/40 cursor-pointer shadow-sm group/frame"
                >
                  <Image
                    src={projectImages.careerwise.dark}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    alt="CareerWise AI-Powered Preparation & Assessment Platform Interface"
                    className="w-full h-auto object-cover hidden dark:block transition-transform duration-500 group-hover/frame:scale-[1.015]"
                    loading="lazy"
                  />
                  <Image
                    src={projectImages.careerwise.light}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    alt="CareerWise AI-Powered Preparation & Assessment Platform Interface"
                    className="w-full h-auto object-cover block dark:hidden transition-transform duration-500 group-hover/frame:scale-[1.015]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-neutral-950/0 group-hover/frame:bg-neutral-950/5 dark:group-hover/frame:bg-white/5 transition-colors pointer-events-none" />
                </button>

                <div className="mt-4 pt-3 border-t border-neutral-300/60 dark:border-[#2E2E2E] flex justify-between items-center font-mono-code text-[10px] text-neutral-500 dark:text-[#777777]">
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

        <div className="project-block mb-32 pb-24 border-b border-neutral-300 dark:border-[#2A2A2A]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">

            <div className="project-visual lg:col-span-6 order-2 lg:order-1">
              <div
                ref={frame2Ref}
                className="relative rounded-2xl p-4 sm:p-6 overflow-hidden group transition-all duration-300 liquid-glass-card-frame"
              >

                <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-neutral-300/60 dark:border-[#2E2E2E] font-mono-code text-[11px] text-neutral-500 dark:text-[#888888]">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]/80" />
                    </div>
                    <span className="ml-1.5 text-neutral-700 dark:text-[#C5C3BF] font-medium">buildstack-project.vercel.app</span>
                  </div>
                  <a
                    href={buildstack.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="OPEN"
                    className="inline-flex items-center gap-1.5 text-neutral-500 dark:text-[#888888] hover:text-neutral-950 dark:hover:text-[#F5F3EF] transition-colors"
                  >
                    <span className="text-[10px] uppercase tracking-wider hidden sm:inline">LIVE</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                <button
                  type="button"
                  aria-label={`View ${buildstack.title} case study`}
                  onClick={() => setActiveModalProject(buildstack)}
                  data-cursor="VIEW"
                  className="relative block w-full text-left rounded-lg border border-neutral-300/80 dark:border-[#2A2A2A] overflow-hidden bg-neutral-950/5 dark:bg-black/40 cursor-pointer shadow-sm group/frame"
                >
                  <Image
                    src={projectImages.buildstack.dark}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    alt="BuildStack Collaborative AI-Driven Development Platform Interface"
                    className="w-full h-auto object-cover hidden dark:block transition-transform duration-500 group-hover/frame:scale-[1.015]"
                    loading="lazy"
                  />
                  <Image
                    src={projectImages.buildstack.light}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    alt="BuildStack Collaborative AI-Driven Development Platform Interface"
                    className="w-full h-auto object-cover block dark:hidden transition-transform duration-500 group-hover/frame:scale-[1.015]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-neutral-950/0 group-hover/frame:bg-neutral-950/5 dark:group-hover/frame:bg-white/5 transition-colors pointer-events-none" />
                </button>

                <div className="mt-4 pt-3 border-t border-neutral-300/60 dark:border-[#2E2E2E] flex justify-between items-center font-mono-code text-[10px] text-neutral-500 dark:text-[#777777]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="uppercase tracking-wider font-semibold text-neutral-800 dark:text-[#CCCCCC]">BUILDSTACK PLATFORM</span>
                  </div>
                  <div className="flex items-center gap-3 tracking-wide">
                    <span>E2B SANDBOX</span>
                    <span>•</span>
                    <span>NEXT.JS 15</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="project-info lg:col-span-6 order-1 lg:order-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 font-mono-code text-xs text-neutral-400 dark:text-[#666666] mb-3">
                  <span className="font-semibold text-neutral-900 dark:text-[#F5F3EF]">02</span>
                  <span>/</span>
                  <span className="uppercase">{buildstack.category}</span>
                </div>

                <h3 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight text-neutral-950 dark:text-[#F5F3EF]">
                  {buildstack.title}
                </h3>
                <p className="font-mono-code text-xs text-neutral-500 dark:text-[#A3A3A3] mt-2 uppercase tracking-wider">
                  {buildstack.tagline}
                </p>

                <p className="mt-5 text-base text-neutral-700 dark:text-[#A3A3A3] leading-relaxed font-normal">
                  {buildstack.shortDescription || buildstack.description}
                </p>

                <div className="mt-6 p-4 transition-all duration-300 liquid-glass-node">
                  <div className="font-mono-code text-[10px] text-neutral-400 dark:text-[#666666] uppercase tracking-wider mb-2.5">
                    PROCESSING ARCHITECTURE
                  </div>
                  <RefractiveProcessFlow steps={buildstack.flowSteps} />
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono-code text-xs">
                  {(buildstack.conciseFeatures || buildstack.features.slice(0, 4)).map((feat, i) => (
                    <div
                      key={i}
                      className="px-3 py-2 flex items-center gap-2 transition-all duration-200 rounded-lg border border-neutral-300/70 dark:border-[#2A2A2A] bg-white/50 dark:bg-[#141414]/50 text-neutral-800 dark:text-[#D4D4D4]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-950 dark:bg-[#F5F3EF] shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {(buildstack.compactTechnologies || buildstack.technologies.slice(0, 8)).map((t) => (
                    <span
                      key={t}
                      className="font-mono-code text-[10px] px-2.5 py-1 inline-flex items-center gap-1.5 transition-all duration-200 liquid-glass-chip text-neutral-800 dark:text-[#D4D4D4]"
                    >
                      <TechIcon name={t} className="w-3 h-3 shrink-0" />
                      <span>{t}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href={buildstack.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="OPEN"
                  className="inline-flex items-center gap-2 px-6 py-3 font-mono-code text-xs font-semibold tracking-wider cursor-pointer liquid-glass-btn-primary bg-neutral-950 dark:bg-[#F5F3EF] text-white dark:text-[#0A0A0A]"
                >
                  <span>LAUNCH BUILDSTACK</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <RefractiveButton
                  onClick={() => setActiveModalProject(buildstack)}
                  data-cursor="VIEW"
                >
                  <span>CASE STUDY &amp; SPECS</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-70" />
                </RefractiveButton>
              </div>
            </div>
          </div>
        </div>

        <div className="project-block">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">

            <div className="project-info lg:col-span-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 font-mono-code text-xs text-neutral-400 dark:text-[#666666] mb-3">
                  <span className="font-semibold text-neutral-900 dark:text-[#F5F3EF]">03</span>
                  <span>/</span>
                  <span className="uppercase">{tripcraft.category}</span>
                </div>

                <h3 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight text-neutral-950 dark:text-[#F5F3EF]">
                  {tripcraft.title}
                </h3>
                <p className="font-mono-code text-xs text-neutral-500 dark:text-[#A3A3A3] mt-2 uppercase tracking-wider">
                  {tripcraft.tagline}
                </p>

                <p className="mt-5 text-base text-neutral-700 dark:text-[#A3A3A3] leading-relaxed font-normal">
                  {tripcraft.shortDescription || tripcraft.description}
                </p>

                <div className="mt-6 p-4 transition-all duration-300 liquid-glass-node">
                  <div className="font-mono-code text-[10px] text-neutral-400 dark:text-[#666666] uppercase tracking-wider mb-2.5">
                    PROCESSING ARCHITECTURE
                  </div>
                  <RefractiveProcessFlow steps={tripcraft.flowSteps} />
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono-code text-xs">
                  {(tripcraft.conciseFeatures || tripcraft.features.slice(0, 4)).map((feat, i) => (
                    <div
                      key={i}
                      className="px-3 py-2 flex items-center gap-2 transition-all duration-200 rounded-lg border border-neutral-300/70 dark:border-[#2A2A2A] bg-white/50 dark:bg-[#141414]/50 text-neutral-800 dark:text-[#D4D4D4]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-950 dark:bg-[#F5F3EF] shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {(tripcraft.compactTechnologies || tripcraft.technologies.slice(0, 8)).map((t) => (
                    <span
                      key={t}
                      className="font-mono-code text-[10px] px-2.5 py-1 inline-flex items-center gap-1.5 transition-all duration-200 liquid-glass-chip text-neutral-800 dark:text-[#D4D4D4]"
                    >
                      <TechIcon name={t} className="w-3 h-3 shrink-0" />
                      <span>{t}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href={tripcraft.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="OPEN"
                  className="inline-flex items-center gap-2 px-6 py-3 font-mono-code text-xs font-semibold tracking-wider cursor-pointer liquid-glass-btn-primary bg-neutral-950 dark:bg-[#F5F3EF] text-white dark:text-[#0A0A0A]"
                >
                  <span>LAUNCH TRIPCRAFT</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <RefractiveButton
                  onClick={() => setActiveModalProject(tripcraft)}
                  data-cursor="VIEW"
                >
                  <span>CASE STUDY &amp; SPECS</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-70" />
                </RefractiveButton>
              </div>
            </div>

            <div className="project-visual lg:col-span-6">
              <div
                ref={frame3Ref}
                className="relative rounded-2xl p-4 sm:p-6 overflow-hidden group transition-all duration-300 liquid-glass-card-frame"
              >

                <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-neutral-300/60 dark:border-[#2E2E2E] font-mono-code text-[11px] text-neutral-500 dark:text-[#888888]">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]/80" />
                    </div>
                    <span className="ml-1.5 text-neutral-700 dark:text-[#C5C3BF] font-medium">tripcraft-project.vercel.app</span>
                  </div>
                  <a
                    href={tripcraft.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="OPEN"
                    className="inline-flex items-center gap-1.5 text-neutral-500 dark:text-[#888888] hover:text-neutral-950 dark:hover:text-[#F5F3EF] transition-colors"
                  >
                    <span className="text-[10px] uppercase tracking-wider hidden sm:inline">LIVE</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                <button
                  type="button"
                  aria-label={`View ${tripcraft.title} case study`}
                  onClick={() => setActiveModalProject(tripcraft)}
                  data-cursor="VIEW"
                  className="relative block w-full text-left rounded-lg border border-neutral-300/80 dark:border-[#2A2A2A] overflow-hidden bg-neutral-950/5 dark:bg-black/40 cursor-pointer shadow-sm group/frame"
                >
                  <Image
                    src={projectImages.tripcraft.dark}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    alt="TripCraft AI-Driven Personalized Travel Assistant"
                    className="w-full h-auto object-cover hidden dark:block transition-transform duration-500 group-hover/frame:scale-[1.015]"
                    loading="lazy"
                  />
                  <Image
                    src={projectImages.tripcraft.light}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    alt="TripCraft AI-Driven Personalized Travel Assistant"
                    className="w-full h-auto object-cover block dark:hidden transition-transform duration-500 group-hover/frame:scale-[1.015]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-neutral-950/0 group-hover/frame:bg-neutral-950/5 dark:group-hover/frame:bg-white/5 transition-colors pointer-events-none" />
                </button>

                <div className="mt-4 pt-3 border-t border-neutral-300/60 dark:border-[#2E2E2E] flex justify-between items-center font-mono-code text-[10px] text-neutral-500 dark:text-[#777777]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="uppercase tracking-wider font-semibold text-neutral-800 dark:text-[#CCCCCC]">TRIPCRAFT</span>
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
      </div>

      <ProjectModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
      />
    </section>
  );
};
