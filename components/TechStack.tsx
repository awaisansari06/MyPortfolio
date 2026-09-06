'use client';

import React, { useState, useEffect, useRef } from 'react';
import { portfolioData } from '@/data/portfolio';
import { TechIcon } from './TechIcon';
import { gsap, isReducedMotion, MOTION_EASE } from '@/lib/motion';

// Relational map linking technologies to interconnected concepts
const TECH_RELATIONS: Record<string, string[]> = {
  TypeScript: ['Next.js', 'React.js', 'tRPC', 'Prisma ORM', 'Zod', 'Vercel AI SDK', 'JavaScript', 'VS Code'],
  JavaScript: ['HTML5', 'CSS3', 'React.js', 'Next.js', 'Node.js', 'TypeScript'],
  Python: ['Google Gemini', 'AI Agents', 'SQL', 'PostgreSQL', 'VS Code'],
  'C++': ['Java', 'SQL', 'VS Code'],
  Java: ['C++', 'SQL', 'PostgreSQL'],
  HTML5: ['CSS3', 'JavaScript', 'React.js'],
  CSS3: ['HTML5', 'Tailwind CSS', 'React.js'],
  'Next.js': ['React.js', 'TypeScript', 'Tailwind CSS', 'tRPC', 'Vercel', 'Inngest'],
  'React.js': ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'shadcn/ui'],
  'Google Gemini': ['AI Agents', 'Vercel AI SDK', 'Python', 'TypeScript', 'Inngest'],
  tRPC: ['Next.js', 'TypeScript', 'Zod', 'Prisma ORM'],
  PostgreSQL: ['Prisma ORM', 'SQL', 'Next.js', 'Database'],
  SQL: ['PostgreSQL', 'Prisma ORM', 'Python', 'Java'],
  Convex: ['Next.js', 'TypeScript', 'React.js'],
  E2B: ['AI Agents', 'Vercel AI SDK', 'Node.js', 'PowerShell'],
  Inngest: ['Next.js', 'Google Gemini', 'PostgreSQL'],
  'VS Code': ['TypeScript', 'JavaScript', 'Python', 'C++', 'Git'],
  PowerShell: ['E2B', 'Git', 'Node.js'],
};

export const TechStack = () => {
  const containerRef = useRef<HTMLElement>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Header reveal
      gsap.fromTo(
        '.stack-header',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: MOTION_EASE.out,
          scrollTrigger: {
            trigger: '.stack-header',
            start: 'top 85%',
            once: true,
          },
        }
      );

      // Staggered cards reveal
      gsap.fromTo(
        '.stack-card',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.06,
          ease: MOTION_EASE.out,
          scrollTrigger: {
            trigger: '.stack-grid',
            start: 'top 80%',
            once: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const isRelated = (skill: string) => {
    if (!hoveredSkill) return false;
    if (skill === hoveredSkill) return true;
    const relations = TECH_RELATIONS[hoveredSkill];
    return relations ? relations.includes(skill) : false;
  };

  return (
    <section
      ref={containerRef}
      id="stack"
      className="py-24 md:py-36 border-b border-neutral-300 dark:border-[#2A2A2A] bg-neutral-50/40 dark:bg-[#0A0A0A] relative"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="stack-header flex flex-col md:flex-row md:items-end justify-between pb-8 mb-12 border-b border-neutral-300 dark:border-[#2A2A2A]">
          <div>
            <div className="font-mono-code text-[11px] text-neutral-500 dark:text-[#A3A3A3] tracking-[0.25em] uppercase mb-2">
              03 / TECHNOLOGIES & TOOLS
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-950 dark:text-[#F5F3EF] uppercase">
              TECH STACK
            </h2>
          </div>
          <p className="mt-4 md:mt-0 font-mono-code text-xs text-neutral-500 dark:text-[#A3A3A3] max-w-sm leading-relaxed">
            Languages, frameworks, and developer tools used across full-stack development and practical AI systems.
          </p>
        </div>

        {/* Categorized Matrix with pure CSS card hover */}
        <div className="stack-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioData.techCategories.map((category) => {
            return (
              <div
                key={category.title}
                className="stack-card p-6 border border-neutral-300 dark:border-[#2A2A2A] bg-white/50 dark:bg-[#111111]/30 hover:border-neutral-950 dark:hover:border-[#F5F3EF] hover:bg-white dark:hover:bg-[#151515] transition-colors duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-200 dark:border-[#2A2A2A]">
                    <span className="font-mono-code text-xs font-bold tracking-widest text-neutral-950 dark:text-[#F5F3EF] uppercase">
                      {category.title}
                    </span>
                    <span className="font-mono-code text-[10px] text-neutral-400 dark:text-[#666666]">
                      {category.skills.length} ITEMS
                    </span>
                  </div>

                  {/* Skills Pills */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {category.skills.map((skill) => {
                      const highlighted = isRelated(skill);
                      const isHovered = hoveredSkill === skill;

                      return (
                        <button
                          key={skill}
                          onMouseEnter={() => setHoveredSkill(skill)}
                          onMouseLeave={() => setHoveredSkill(null)}
                          className={`font-mono-code text-xs px-3 py-1.5 border transition-colors duration-150 text-left cursor-pointer inline-flex items-center gap-2 group/skill ${
                            isHovered
                              ? 'bg-neutral-950 dark:bg-[#F5F3EF] text-white dark:text-[#0A0A0A] border-neutral-950 dark:border-[#F5F3EF] font-semibold shadow-xs'
                              : highlighted
                              ? 'bg-neutral-200 dark:bg-[#1F1F1F] text-neutral-950 dark:text-[#F5F3EF] border-neutral-400 dark:border-neutral-500 font-medium'
                              : 'bg-transparent text-neutral-700 dark:text-[#A3A3A3] border-neutral-300 dark:border-[#2A2A2A] hover:border-neutral-500 dark:hover:border-neutral-600'
                          }`}
                        >
                          <TechIcon name={skill} className="w-3.5 h-3.5 shrink-0 transition-transform duration-200 group-hover/skill:scale-110" />
                          <span>{skill}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
