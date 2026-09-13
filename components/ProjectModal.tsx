'use client';

import React, { useEffect } from 'react';
import { ProjectCaseStudy } from '@/data/portfolio';
import { TechIcon } from './TechIcon';
import { X, ExternalLink, Github, CheckCircle2, Terminal, ArrowRight } from 'lucide-react';
import { LiquidGlassSurface } from '@/components/liquid-glass/LiquidGlassSurface';

interface ProjectModalProps {
  project: ProjectCaseStudy | null;
  onClose: () => void;
}

export const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <LiquidGlassSurface
        preset="modal"
        borderRadius={16}
        id="project-modal-glass"
        className="w-full max-w-4xl"
      >
        <div
          className="relative w-full max-h-[90vh] overflow-y-auto text-neutral-950 dark:text-[#F5F3EF] p-6 sm:p-10 transition-all duration-300 rounded-2xl border border-neutral-300/80 dark:border-[#333333] bg-[var(--glass-surface-tint)] backdrop-blur-xl shadow-[0_24px_64px_rgba(0,0,0,0.4),inset_0_1px_0_var(--glass-edge-highlight)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            data-cursor="CLOSE"
            className="absolute top-6 right-6 p-2 transition-all cursor-pointer rounded-full border border-neutral-300/80 dark:border-[#333333] bg-white/60 dark:bg-[#181818]/60 shadow-[inset_0_1px_0_var(--glass-edge-highlight)] hover:scale-105"
          >
            <X className="w-4 h-4 text-neutral-700 dark:text-[#A3A3A3]" />
          </button>

          {/* Header */}
          <div className="border-b border-neutral-300 dark:border-[#2A2A2A] pb-6 mb-8">
            <div className="flex items-center gap-3 mb-2 font-mono-code text-xs text-neutral-500 dark:text-[#A3A3A3]">
              <span>PROJECT {project.number}</span>
              <span>/</span>
              <span className="uppercase">{project.category}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight uppercase">
              {project.title}
            </h2>
            <p className="font-mono-code text-xs sm:text-sm text-neutral-600 dark:text-[#A3A3A3] mt-2 uppercase tracking-wide">
              {project.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-6">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 font-mono-code text-xs font-semibold tracking-wider transition-all cursor-pointer rounded-full bg-neutral-950 dark:bg-[#F5F3EF] text-white dark:text-[#0A0A0A] shadow-[0_8px_24px_-4px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.35)] hover:scale-[1.02]"
              >
                <span>LAUNCH LIVE DEMO</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://github.com/awaisansari06"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 font-mono-code text-xs tracking-wider transition-all text-neutral-900 dark:text-[#F5F3EF] cursor-pointer rounded-full border border-neutral-300/80 dark:border-[#333333] bg-white/60 dark:bg-[#181818]/60 shadow-[inset_0_1px_0_var(--glass-edge-highlight)] hover:scale-[1.02]"
              >
                <Github className="w-3.5 h-3.5" />
                <span>VIEW GITHUB REPOSITORY</span>
              </a>
            </div>
          </div>

          {/* Real Product Interface Preview */}
          <div className="mb-10 rounded-xl p-3 sm:p-4 transition-all duration-300 liquid-glass-card-frame bg-white/60 dark:bg-[#111111]/70 backdrop-blur-md">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-300 dark:border-[#2A2A2A] font-mono-code text-[11px] text-neutral-500 dark:text-[#888888]">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]/80" />
                </div>
                <span className="ml-1.5 text-neutral-700 dark:text-[#C5C3BF] font-medium">
                  {project.liveUrl.replace('https://', '').replace(/\/$/, '')}
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-wider font-medium flex items-center gap-1.5 font-mono-code liquid-glass-badge text-emerald-600 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                VERIFIED LIVE BUILD
              </span>
            </div>
            <div className="rounded-lg border border-neutral-300/80 dark:border-[#2A2A2A] overflow-hidden bg-neutral-950/5 dark:bg-black/50">
              {project.id === 'careerwise' && (
                <>
                  <img src="/ProjectImage/CareerWise-Dark.png" alt="CareerWise Platform" className="w-full h-auto hidden dark:block" />
                  <img src="/ProjectImage/CareerWise-Light.png" alt="CareerWise Platform" className="w-full h-auto block dark:hidden" />
                </>
              )}
              {project.id === 'devflow' && (
                <>
                  <img src="/ProjectImage/DevFlow-Dark.png" alt="DevFlow Platform" className="w-full h-auto hidden dark:block" />
                  <img src="/ProjectImage/DevFlow-Light.png" alt="DevFlow Platform" className="w-full h-auto block dark:hidden" />
                </>
              )}
              {project.id === 'smartjourney' && (
                <>
                  <img src="/ProjectImage/SmartJourney-Dark.png" alt="SmartJourney Platform" className="w-full h-auto hidden dark:block" />
                  <img src="/ProjectImage/SmartJourney-Light.png" alt="SmartJourney Platform" className="w-full h-auto block dark:hidden" />
                </>
              )}
            </div>
          </div>

          {/* Content Columns */}
          <div className="space-y-10">
            {/* Overview */}
            <div>
              <h3 className="font-mono-code text-xs text-neutral-500 dark:text-[#A3A3A3] uppercase tracking-widest mb-3">
                01 // OVERVIEW
              </h3>
              <p className="text-neutral-700 dark:text-[#A3A3A3] leading-relaxed text-sm sm:text-base font-normal">
                {project.description}
              </p>
            </div>

            {/* Problem & Approach */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 transition-all duration-300 rounded-xl border border-neutral-300/70 dark:border-[#2A2A2A] bg-white/40 dark:bg-[#111111]/40">
                <h4 className="font-mono-code text-xs text-neutral-500 dark:text-[#A3A3A3] uppercase tracking-widest mb-3">
                  THE PROBLEM
                </h4>
                <p className="text-xs sm:text-sm text-neutral-700 dark:text-[#A3A3A3] leading-relaxed font-normal">
                  {project.problem}
                </p>
              </div>
              <div className="p-6 transition-all duration-300 rounded-xl border border-neutral-300/70 dark:border-[#2A2A2A] bg-white/40 dark:bg-[#111111]/40">
                <h4 className="font-mono-code text-xs text-neutral-500 dark:text-[#A3A3A3] uppercase tracking-widest mb-3">
                  THE ENGINEERING APPROACH
                </h4>
                <p className="text-xs sm:text-sm text-neutral-700 dark:text-[#A3A3A3] leading-relaxed font-normal">
                  {project.approach}
                </p>
              </div>
            </div>

            {/* Verified Features */}
            <div>
              <h3 className="font-mono-code text-xs text-neutral-500 dark:text-[#A3A3A3] uppercase tracking-widest mb-4">
                02 // KEY SYSTEM CAPABILITIES
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.features.map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-3 text-xs transition-all duration-200 rounded-lg border border-neutral-300/60 dark:border-[#2A2A2A] bg-white/40 dark:bg-[#111111]/40 text-neutral-800 dark:text-[#D4D4D4]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-neutral-500 dark:text-[#666666] mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Implementation Details */}
            <div>
              <h3 className="font-mono-code text-xs text-neutral-500 dark:text-[#A3A3A3] uppercase tracking-widest mb-4">
                03 // IMPLEMENTATION SPECIFICATION
              </h3>
              <div className="border divide-y transition-all duration-300 rounded-xl overflow-hidden border-neutral-300/70 dark:border-[#2A2A2A] divide-neutral-300/50 dark:divide-[#222222]">
                {project.implementation.map((impl, i) => (
                  <div key={i} className="p-4 flex items-start gap-3 text-xs sm:text-sm bg-white/30 dark:bg-[#111111]/30">
                    <Terminal className="w-4 h-4 text-neutral-400 dark:text-[#666666] mt-0.5 shrink-0 font-mono-code" />
                    <span className="text-neutral-700 dark:text-[#A3A3A3] leading-relaxed">
                      {impl}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Process Flow Pipeline */}
            <div className="p-4 transition-all duration-300 rounded-xl border border-neutral-300/60 dark:border-[#2A2A2A] bg-white/40 dark:bg-[#111111]/40">
              <div className="font-mono-code text-[10px] text-neutral-500 dark:text-[#A3A3A3] uppercase tracking-widest mb-3">
                ARCHITECTURAL DATA FLOW PIPELINE
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono-code">
                {project.flowSteps.map((step, idx) => (
                  <React.Fragment key={step}>
                    <span className="px-2.5 py-1 font-medium transition-all duration-200 liquid-glass-badge text-neutral-900 dark:text-[#F5F3EF]">
                      {step}
                    </span>
                    {idx < project.flowSteps.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-400 dark:text-[#666666]" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Technology Stack Tags */}
            <div>
              <h3 className="font-mono-code text-xs text-neutral-500 dark:text-[#A3A3A3] uppercase tracking-widest mb-3">
                04 // TECHNOLOGIES & TOOLS
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="font-mono-code text-xs px-3 py-1.5 font-medium inline-flex items-center gap-2 transition-all duration-200 liquid-glass-chip text-neutral-900 dark:text-[#F5F3EF]"
                  >
                    <TechIcon name={tech} className="w-3.5 h-3.5 shrink-0" />
                    <span>{tech}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Architectural Metrics */}
            {project.metrics && (
              <div className="pt-6 border-t border-neutral-300 dark:border-[#2A2A2A] grid grid-cols-2 sm:grid-cols-4 gap-4">
                {project.metrics.map((m) => (
                  <div key={m.label} className="p-3 transition-all duration-300 rounded-xl border border-neutral-300/70 dark:border-[#2A2A2A] bg-white/40 dark:bg-[#111111]/40">
                    <div className="font-mono-code text-[10px] text-neutral-400 dark:text-[#666666]">
                      {m.label}
                    </div>
                    <div className="font-mono-code text-xs font-bold text-neutral-950 dark:text-[#F5F3EF] mt-1">
                      {m.value}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </LiquidGlassSurface>
    </div>
  );
};
