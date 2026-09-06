'use client';

import React from 'react';
import { portfolioData } from '@/data/portfolio';
import { TechIcon } from './TechIcon';
import { Award, GraduationCap, CheckCircle2, ArrowDownToLine, ArrowUpRight } from 'lucide-react';

export const About = () => {
  return (
    <section id="about" className="py-24 md:py-36 border-b border-neutral-300 dark:border-[#2A2A2A] bg-neutral-50/30 dark:bg-[#0A0A0A] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-16 border-b border-neutral-300 dark:border-[#2A2A2A]">
          <div>
            <div className="font-mono-code text-[11px] text-neutral-500 dark:text-[#A3A3A3] tracking-[0.25em] uppercase mb-2">
              05 / BACKGROUND & PEDIGREE
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-950 dark:text-[#F5F3EF] uppercase">
              ABOUT AWAIS
            </h2>
          </div>
          <p className="mt-4 md:mt-0 font-mono-code text-xs text-neutral-500 dark:text-[#A3A3A3] max-w-sm leading-relaxed">
            Rigorous computer science foundation paired with an appetite for production AI system engineering.
          </p>
        </div>

        {/* Editorial Bio & Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-stretch">
          {/* Main Statement (Left) */}
          <div className="lg:col-span-7 flex flex-col justify-between p-8 border border-neutral-300 dark:border-[#2A2A2A] bg-white dark:bg-[#111111]">
            <div>
              <div className="font-mono-code text-[10px] text-neutral-400 dark:text-[#666666] uppercase tracking-widest mb-4">
                DEVELOPER PROFILE & BACKGROUND
              </div>
              <h3 className="text-2xl sm:text-3xl font-semibold leading-tight text-neutral-950 dark:text-[#F5F3EF] mb-6">
                Full-Stack Developer and Computer Science graduate specializing in AI-powered web applications.
              </h3>
              <p className="text-base text-neutral-600 dark:text-[#A3A3A3] leading-relaxed font-normal mb-4">
                {portfolioData.bio}
              </p>
              <p className="text-sm text-neutral-500 dark:text-[#888888] leading-relaxed font-normal">
                Focusing on clean architecture, normalized database schemas, type-safe API communication, and scalable background job orchestration.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-[#2A2A2A] flex flex-col gap-6">
              <div className="flex flex-wrap items-center gap-6 font-mono-code text-xs text-neutral-600 dark:text-[#A3A3A3]">
                <div>
                  <span className="text-[10px] text-neutral-400 dark:text-[#666666] uppercase block">LOCATION</span>
                  <span className="text-neutral-900 dark:text-[#F5F3EF] font-medium">{portfolioData.location}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 dark:text-[#666666] uppercase block">SPOKEN LANGUAGES</span>
                  <span className="text-neutral-900 dark:text-[#F5F3EF] font-medium">English, Hindi, Marathi</span>
                </div>
              </div>

              {/* Resume Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="/AwaisCV.pdf"
                  download="Mohammad-Awais-Ansari-Resume.pdf"
                  data-cursor="RESUME"
                  aria-label="Download resume as PDF"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-950 hover:bg-neutral-800 dark:bg-[#F5F3EF] dark:hover:bg-white text-white dark:text-[#0A0A0A] font-mono-code text-xs font-semibold tracking-wider transition-colors duration-200 cursor-pointer"
                >
                  <span>DOWNLOAD RESUME</span>
                  <ArrowDownToLine className="w-3.5 h-3.5" />
                </a>

                <a
                  href="/AwaisCV.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="VIEW"
                  aria-label="View resume in a new tab"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-neutral-300 dark:border-[#2A2A2A] bg-transparent hover:bg-neutral-200/60 dark:hover:bg-[#181818] text-neutral-900 dark:text-[#F5F3EF] font-mono-code text-xs tracking-wider transition-colors duration-200 cursor-pointer"
                >
                  <span>VIEW RESUME</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
                </a>
              </div>
            </div>
          </div>

          {/* Right: Engineering Profile Card */}
          <div className="lg:col-span-5 p-8 border border-neutral-300 dark:border-[#2A2A2A] bg-white dark:bg-[#111111] space-y-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-[#2A2A2A] mb-6">
                <span className="font-mono-code text-xs font-bold uppercase tracking-wider text-neutral-950 dark:text-[#F5F3EF]">
                  ENGINEERING PROFILE
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="space-y-5 font-mono-code text-xs">
                <div>
                  <span className="text-neutral-400 dark:text-[#666666] text-[10px] uppercase block mb-1">PRIMARY FOCUS</span>
                  <span className="text-neutral-950 dark:text-[#F5F3EF] font-medium text-sm">Full-Stack Web & AI Applications</span>
                </div>

                <div>
                  <span className="text-neutral-400 dark:text-[#666666] text-[10px] uppercase block mb-1">CURRENTLY</span>
                  <span className="text-neutral-900 dark:text-[#F5F3EF] font-medium block">M.Sc. Computer Science</span>
                  <span className="text-neutral-500 dark:text-[#888888] text-[11px] block">University of Mumbai · Expected 2028</span>
                </div>

                <div>
                  <span className="text-neutral-400 dark:text-[#666666] text-[10px] uppercase block mb-2">CORE STACK</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['Next.js 15', 'React 19', 'TypeScript', 'Node.js', 'PostgreSQL'].map((s) => (
                      <span key={s} className="inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 border border-neutral-300 dark:border-[#2A2A2A] bg-neutral-50 dark:bg-[#181818] text-neutral-900 dark:text-[#F5F3EF]">
                        <TechIcon name={s} className="w-3 h-3 shrink-0" />
                        <span>{s}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-neutral-400 dark:text-[#666666] text-[10px] uppercase block mb-1">AI INTEGRATIONS</span>
                  <span className="text-neutral-800 dark:text-[#A3A3A3] text-xs leading-relaxed block">
                    Google Gemini · OpenRouter · Vercel AI SDK
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200 dark:border-[#2A2A2A] font-mono-code text-[10px] text-neutral-400 dark:text-[#666666] uppercase tracking-wider">
              PRAGMATIC · PRODUCTION-FOCUSED · MODERN WEB
            </div>
          </div>
        </div>

        {/* ---------------- EDUCATION TIMELINE ---------------- */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8 pb-3 border-b border-neutral-300 dark:border-[#2A2A2A]">
            <GraduationCap className="w-4 h-4 text-neutral-600 dark:text-[#A3A3A3]" />
            <h3 className="font-mono-code text-xs font-bold tracking-widest text-neutral-950 dark:text-[#F5F3EF] uppercase">
              ACADEMIC EDUCATION TIMELINE
            </h3>
          </div>

          <div className="space-y-6">
            {portfolioData.education.map((edu, index) => (
              <div
                key={edu.degree}
                className="p-6 sm:p-8 border border-neutral-300 dark:border-[#2A2A2A] bg-white/70 dark:bg-[#111111]/50 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-neutral-500 dark:hover:border-neutral-500 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono-code text-xs px-2 py-0.5 border border-neutral-300 dark:border-[#2A2A2A] bg-neutral-100 dark:bg-[#181818] font-semibold text-neutral-900 dark:text-[#F5F3EF]">
                      {edu.year}
                    </span>
                    <span className="font-mono-code text-xs text-neutral-500 dark:text-[#A3A3A3]">
                      {edu.institution}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold uppercase tracking-tight text-neutral-950 dark:text-[#F5F3EF] pt-1">
                    {edu.degree}
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-[#A3A3A3] max-w-2xl pt-1">
                    {edu.details}
                  </p>
                </div>

                {edu.score && (
                  <div className="shrink-0 p-3 sm:text-right border border-neutral-300 dark:border-[#2A2A2A] bg-neutral-50 dark:bg-[#0A0A0A]">
                    <span className="font-mono-code text-[10px] text-neutral-400 dark:text-[#666666] uppercase block">
                      GRADE / CGPA
                    </span>
                    <span className="font-mono-code text-base font-bold text-neutral-950 dark:text-[#F5F3EF]">
                      {edu.score}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ---------------- CERTIFICATIONS ---------------- */}
        <div>
          <div className="flex items-center gap-3 mb-8 pb-3 border-b border-neutral-300 dark:border-[#2A2A2A]">
            <Award className="w-4 h-4 text-neutral-600 dark:text-[#A3A3A3]" />
            <h3 className="font-mono-code text-xs font-bold tracking-widest text-neutral-950 dark:text-[#F5F3EF] uppercase">
              PROFESSIONAL CERTIFICATIONS
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolioData.certifications.map((cert, i) => (
              <div
                key={i}
                className="p-5 border border-neutral-300 dark:border-[#2A2A2A] bg-white/50 dark:bg-[#111111]/30 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between font-mono-code text-[10px] text-neutral-400 dark:text-[#666666] mb-2">
                    <span>{cert.issuer}</span>
                    <span>{cert.year}</span>
                  </div>
                  <h4 className="font-semibold text-xs sm:text-sm text-neutral-950 dark:text-[#F5F3EF] uppercase tracking-tight">
                    {cert.title}
                  </h4>
                </div>
                <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-[#2A2A2A] flex items-center gap-1.5 font-mono-code text-[10px] text-neutral-500 dark:text-[#A3A3A3]">
                  <CheckCircle2 className="w-3 h-3 text-neutral-400 dark:text-[#666666]" />
                  <span>CREDENTIAL</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
