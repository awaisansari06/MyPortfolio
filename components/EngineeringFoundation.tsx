'use client';

import React from 'react';
import { portfolioData } from '@/data/portfolio';
import { TechIcon } from './TechIcon';
import { BookOpen, Cpu, Database, Network, Binary, ShieldCheck } from 'lucide-react';

const FOUNDATION_TOOLS: Record<string, string> = {
  'Data Structures & Algorithms': 'C++',
  'Object-Oriented Programming': 'Java',
  'Database Management': 'SQL',
  'Operating Systems': 'PowerShell',
  'Software Engineering': 'VS Code',
};

export const EngineeringFoundation = () => {
  const icons = [Binary, ShieldCheck, Database, Cpu, BookOpen];

  return (
    <section id="engineering" className="py-24 md:py-36 border-b border-neutral-300 dark:border-[#2A2A2A] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-16 border-b border-neutral-300 dark:border-[#2A2A2A]">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioData.engineeringFoundations.map((foundation, index) => {
            const Icon = icons[index % icons.length];
            const associatedTool = foundation.tool || FOUNDATION_TOOLS[foundation.name];

            return (
              <div
                key={foundation.name}
                className="bg-white dark:bg-[#111111] p-8 border border-neutral-300 dark:border-[#2A2A2A] flex flex-col justify-between hover:border-neutral-500 dark:hover:border-neutral-500 transition-colors duration-200 group"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 mb-6 border-b border-neutral-200 dark:border-[#2A2A2A]">
                    <span className="font-mono-code text-xs font-semibold text-neutral-400 dark:text-[#666666]">
                      FOUNDATION 0{index + 1}
                    </span>
                    <div className="flex items-center gap-2.5">
                      {associatedTool && (
                        <span className="font-mono-code text-[10px] px-2 py-0.5 border border-neutral-300 dark:border-[#2A2A2A] bg-neutral-50 dark:bg-[#181818] text-neutral-700 dark:text-[#A3A3A3] inline-flex items-center gap-1.5 shadow-2xs">
                          <TechIcon name={associatedTool} className="w-3 h-3 shrink-0" />
                          <span>{associatedTool}</span>
                        </span>
                      )}
                      <Icon className="w-4 h-4 text-neutral-400 dark:text-[#666666]" />
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
