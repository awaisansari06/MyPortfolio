'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { portfolioData } from '@/data/portfolio';
import { projectImages } from '@/lib/projectImages';
import { ArrowDown, ArrowUpRight, Pause, Play } from 'lucide-react';
import { gsap, MOTION_EASE } from '@/lib/motion';
import { getScrollBehavior } from '@/lib/scroll';

const featuredProjects = [
  { project: portfolioData.projects[0], images: projectImages.careerwise, name: 'CareerWise', description: 'From resume feedback to interview prep. A clearer path to your next role.' },
  { project: portfolioData.projects[1], images: projectImages.buildstack, name: 'BuildStack', description: 'Turn natural-language prompts into working web apps with AI agents and live previews.' },
  { project: portfolioData.projects[2], images: projectImages.tripcraft, name: 'TripCraft', description: 'Turn travel ideas into personalized itineraries with AI-powered trip planning.' },
];

export const Hero = () => {
  const containerRef = useRef<HTMLElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const featured = featuredProjects[activeIndex];
  const stepProject = (direction: number) => {
    setActiveIndex(index => (index + direction + featuredProjects.length) % featuredProjects.length);
    setPaused(true);
  };

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => setReducedMotion(preference.matches);
    const syncVisibility = () => setPageVisible(!document.hidden);
    syncMotion();
    syncVisibility();
    preference.addEventListener('change', syncMotion);
    document.addEventListener('visibilitychange', syncVisibility);
    return () => {
      preference.removeEventListener('change', syncMotion);
      document.removeEventListener('visibilitychange', syncVisibility);
    };
  }, []);

  useEffect(() => {
    if (paused || hovered || focused || reducedMotion || !pageVisible) return;
    const timer = window.setTimeout(() => {
      setActiveIndex(index => (index + 1) % featuredProjects.length);
    }, 6000);
    return () => window.clearTimeout(timer);
  }, [activeIndex, paused, hovered, focused, reducedMotion, pageVisible]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReduced) {
        gsap.fromTo(
          '.hero-reveal',
          { opacity: 0.85, y: 12 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: MOTION_EASE.out }
        );
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const scrollToWork = () => {
    document.getElementById('work')?.scrollIntoView({ behavior: getScrollBehavior() });
  };

  return (
    <section ref={containerRef} id="hero" aria-labelledby="hero-heading" className="hero-split relative isolate overflow-hidden border-b border-neutral-300 dark:border-white/10">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[#F1F0EC] dark:bg-[#0A0A0A]" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-grid-pattern opacity-30" />
      <div aria-hidden="true" className="hero-ambient" />

      <div className="hero-layout mx-auto max-w-7xl px-6 md:px-12 lg:px-12">
        <div className="min-w-0">
          <p className="hero-reveal hero-role mb-7 flex items-center gap-3 font-mono-code text-[10px] sm:text-xs uppercase tracking-[0.16em] text-neutral-600 dark:text-neutral-400">
            <span aria-hidden="true" className="h-px w-7 bg-emerald-600 dark:bg-emerald-400" />
            Full-stack developer / AI applications
          </p>
          <h1 id="hero-heading" className="hero-reveal hero-heading font-bold uppercase text-neutral-950 dark:text-[#F5F3EF]">
            <span className="hero-given-name block">Mohammad</span>
            <span className="hero-primary-name block">Awais</span>
          </h1>
          <p className="hero-reveal hero-description mt-7 max-w-lg text-xl sm:text-2xl leading-relaxed tracking-tight text-neutral-700 dark:text-neutral-300">
            I turn ideas into <span className="text-emerald-700 dark:text-emerald-400">useful web apps</span>—with AI where it matters.
          </p>
          <div className="hero-reveal hero-hiring mt-5 max-w-lg border-l-2 border-emerald-600/40 pl-4 dark:border-emerald-400/40">
            <p className="text-sm font-medium leading-relaxed text-neutral-800 dark:text-neutral-200">
              Open to Frontend, Backend, Full Stack &amp; Software Engineer (SWE) roles.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
              React, Next.js &amp; TypeScript · API development · PostgreSQL &amp; Prisma · Applied AI integrations
            </p>
          </div>
          <div className="hero-reveal hero-actions mt-8 flex flex-wrap items-center gap-7">
            <button onClick={scrollToWork} data-cursor="EXPLORE" className="hero-primary group inline-flex items-center gap-4 rounded-full bg-emerald-700 px-6 py-4 text-sm font-semibold text-white dark:bg-emerald-400 dark:text-emerald-950">
              Explore my work <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none" />
            </button>
            <a href="/AwaisCV.pdf" target="_blank" rel="noopener noreferrer" className="hero-text-link inline-flex items-center gap-2 py-3 text-sm text-neutral-700 dark:text-neutral-300">
              Resume <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
          <a href="#contact" className="hero-reveal hero-availability hero-text-link mt-8 inline-flex items-center gap-2.5 text-xs text-neutral-600 dark:text-neutral-400">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
            Open to opportunities <span aria-hidden="true">·</span> Let’s connect <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="hero-reveal hero-showcase min-w-0" role="region" aria-roledescription="carousel" aria-label="Featured projects" tabIndex={0}
          onKeyDown={event => {
            if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
              event.preventDefault();
              stepProject(event.key === 'ArrowRight' ? 1 : -1);
            }
          }}
          onTouchStart={event => {
            const touch = event.touches[0];
            touchStart.current = { x: touch.clientX, y: touch.clientY };
            swiped.current = false;
          }}
          onTouchEnd={event => {
            const start = touchStart.current;
            const touch = event.changedTouches[0];
            if (start && touch) {
              const dx = touch.clientX - start.x;
              const dy = touch.clientY - start.y;
              if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) {
                swiped.current = true;
                stepProject(dx < 0 ? 1 : -1);
              }
            }
            touchStart.current = null;
          }}
          onClickCapture={event => { if (swiped.current) { event.preventDefault(); event.stopPropagation(); swiped.current = false; } }}
          onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
          onFocusCapture={() => setFocused(true)}
          onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
          <div className="mb-5 flex items-center justify-between font-mono-code text-[10px] uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
            <span className="flex items-center gap-2"><span className="text-emerald-700 dark:text-emerald-400">0{activeIndex + 1} /</span> Featured build</span>
            <span>Design. Build. Ship.</span>
          </div>
          <a href={featured.project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`Explore ${featured.name} live app (opens in a new tab)`} className="hero-project group block rounded-2xl border border-neutral-300 bg-white dark:border-white/15 dark:bg-[#111513]">
            <div key={featured.project.id} className="hero-slide">
            <div aria-hidden="true" className="flex items-center gap-1.5 rounded-t-2xl border-b border-neutral-200 px-4 py-3 dark:border-white/10">
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-300 dark:bg-neutral-600" /><span className="h-1.5 w-1.5 rounded-full bg-neutral-300 dark:bg-neutral-600" /><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="ml-3 truncate font-mono-code text-[9px] tracking-wider text-neutral-500 dark:text-neutral-400">{new URL(featured.project.liveUrl).hostname}</span>
              <ArrowUpRight className="ml-auto h-3.5 w-3.5 text-neutral-500" />
            </div>
            <div className="hero-preview overflow-hidden border-b border-neutral-200 dark:border-white/10">
              <Image src={featured.images.light} alt={`${featured.name} application preview`} priority sizes="(min-width: 900px) 42vw, 100vw" className="block dark:hidden" />
              <Image src={featured.images.dark} alt={`${featured.name} application preview`} priority sizes="(min-width: 900px) 42vw, 100vw" className="hidden dark:block" />
            </div>
            <div className="hero-project-details p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold tracking-tight">{featured.name}<span className="ml-2 text-emerald-700 dark:text-emerald-400">↗</span></h2>
                <span className="hero-project-arrow flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 dark:border-white/15"><ArrowUpRight aria-hidden="true" className="h-4 w-4" /></span>
              </div>
              <p className="hero-project-description mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{featured.description}</p>
              <div className="hero-project-tech mt-5 flex flex-wrap gap-x-4 gap-y-2 font-mono-code text-[9px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400">{featured.project.technologies.slice(0, 3).map(technology => <span key={technology}>{technology}</span>)}</div>
            </div>
            </div>
          </a>
          <div className="hero-carousel-controls mt-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1" aria-label="Choose featured project">
              {featuredProjects.map((item, index) => <button key={item.project.id} type="button" aria-label={`Show ${item.name}`} aria-pressed={activeIndex === index} onClick={() => { setActiveIndex(index); setPaused(true); }} className="hero-slide-control flex h-11 w-11 items-center justify-center rounded-full"><span className={`h-1.5 rounded-full transition-all motion-reduce:transition-none ${activeIndex === index ? 'w-6 bg-emerald-600 dark:bg-emerald-400' : 'w-1.5 bg-neutral-400 dark:bg-neutral-600'}`} /></button>)}
            </div>
            {!reducedMotion && <button type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Resume automatic project rotation' : 'Pause automatic project rotation'} className="hero-text-link flex min-h-11 items-center gap-2 text-[10px] font-mono-code text-neutral-600 dark:text-neutral-400">{paused ? <Play aria-hidden="true" className="h-3 w-3" /> : <Pause aria-hidden="true" className="h-3 w-3" />}{paused ? 'Resume' : 'Auto / 6s'}</button>}
          </div>
        </div>
      </div>
      <div className="hero-footer mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 pb-7 md:px-12 lg:px-12">
        <span className="font-mono-code text-[9px] uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">Based in India · Building for the web</span>
        <button onClick={scrollToWork} className="hero-text-link flex items-center gap-2 py-2 text-[10px] font-mono-code uppercase tracking-widest text-neutral-600 dark:text-neutral-400">Selected work <ArrowDown aria-hidden="true" className="h-3 w-3" /></button>
      </div>
    </section>
  );
};
