'use client';

import React, { useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { CustomCursor } from '@/components/CustomCursor';
import { Hero } from '@/components/Hero';
import { WhatIBuild } from '@/components/WhatIBuild';
import { SelectedWork } from '@/components/SelectedWork';
import { TechStack } from '@/components/TechStack';
import { EngineeringFoundation } from '@/components/EngineeringFoundation';
import { About } from '@/components/About';
import { GitHubContributions } from '@/components/github/GitHubContributions';
import { Contact } from '@/components/Contact';
import { AskAwaisChat } from '@/components/ai/AskAwaisChat';
import { ScrollTrigger } from '@/lib/motion';
import { useResponsiveScroll } from '@/hooks/useResponsiveScroll';

export default function Home() {
  useResponsiveScroll();
  useEffect(() => {
    const handleLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', handleLoad);
    const t1 = setTimeout(() => ScrollTrigger.refresh(), 150);
    const t2 = setTimeout(() => ScrollTrigger.refresh(), 600);
    const t3 = setTimeout(() => ScrollTrigger.refresh(), 1500);
    return () => {
      window.removeEventListener('load', handleLoad);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <main id="portfolio-scroll" className="relative min-h-screen bg-[#F1F0EC] dark:bg-[#0A0A0A] text-[#171717] dark:text-[#F5F3EF] selection:bg-[#171717] selection:text-white dark:selection:bg-neutral-100 dark:selection:text-neutral-950 font-sans overflow-x-hidden">
      {/* Subtle Environmental Ambient Light */}
      <div className="liquid-env-light" aria-hidden="true" />
      {/* Subtle Architectural Grid Pattern */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0 opacity-70 dark:opacity-40" aria-hidden="true" />

      <CustomCursor />
      <Navbar />
      <Hero />
      <WhatIBuild />
      <SelectedWork />
      <TechStack />
      <EngineeringFoundation />
      <About />
      <GitHubContributions />
      <Contact />
      <AskAwaisChat />
    </main>
  );
}
