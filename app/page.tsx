'use client';

import React from 'react';
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

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#F7F6F3] dark:bg-[#0A0A0A] text-neutral-900 dark:text-[#F5F3EF] selection:bg-neutral-900 selection:text-white dark:selection:bg-neutral-100 dark:selection:text-neutral-950 font-sans overflow-x-hidden">
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
