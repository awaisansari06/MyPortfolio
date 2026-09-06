'use client';

import React from 'react';
import { GitHubRepo } from '@/lib/github/types';
import { ArrowUpRight, FolderGit2, Star } from 'lucide-react';

interface GitHubRepositoriesProps {
  repositories: GitHubRepo[];
}

export const GitHubRepositories: React.FC<GitHubRepositoriesProps> = ({ repositories }) => {
  // Curated descriptions for repos that might not have a GitHub description set
  const getRepoDescription = (name: string, originalDesc: string | null) => {
    if (originalDesc) return originalDesc;
    const lower = name.toLowerCase();
    if (lower.includes('careerwise')) {
      return 'AI-powered career intelligence platform with ATS resume optimization and mock interview agents.';
    }
    if (lower.includes('devflow')) {
      return 'Agentic AI development platform generating full-stack web applications with cloud VM sandbox execution.';
    }
    if (lower.includes('journey') || lower.includes('trip')) {
      return 'Intelligent personalized travel planning system with dynamic route and place recommendations.';
    }
    if (lower.includes('medcore') || lower.includes('hms')) {
      return 'Comprehensive hospital and clinical healthcare workflow management platform.';
    }
    if (lower.includes('hostel')) {
      return 'Full-stack automated resident and room allocation management system.';
    }
    if (lower.includes('quickbite')) {
      return 'High-performance interactive web application with fluid modern UI.';
    }
    return 'Full-stack software engineering project and codebase.';
  };

  // Priority ordering prioritizing projects presented in Selected Work:
  // 1. CareerWise, 2. DevFlow, 3. SmartJourney, followed by other notable repos
  const PRIORITY_KEYWORDS = ['careerwise', 'devflow', 'smartjourney', 'smart-journey', 'journey'];

  const sortedRepos = [...repositories].sort((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();
    const aPriority = PRIORITY_KEYWORDS.findIndex((k) => aName.includes(k));
    const bPriority = PRIORITY_KEYWORDS.findIndex((k) => bName.includes(k));

    if (aPriority !== -1 && bPriority === -1) return -1;
    if (aPriority === -1 && bPriority !== -1) return 1;
    if (aPriority !== -1 && bPriority !== -1) return aPriority - bPriority;
    return (b.stargazerCount || 0) - (a.stargazerCount || 0);
  });

  const displayRepos = sortedRepos.slice(0, 4);

  return (
    <div className="mt-12 pt-10 border-t border-neutral-300 dark:border-[#2A2A2A]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-4">
        <div>
          <span className="font-mono-code text-[10px] text-neutral-400 dark:text-[#666666] uppercase tracking-widest block">
            SOURCE CODE & ARTIFACTS
          </span>
          <h3 className="font-mono-code text-sm sm:text-base font-bold text-neutral-950 dark:text-[#F5F3EF] uppercase">
            SELECTED REPOSITORIES
          </h3>
        </div>

        <a
          href="https://github.com/awaisansari06?tab=repositories"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 font-mono-code text-xs text-neutral-700 dark:text-[#A3A3A3] hover:text-neutral-950 dark:hover:text-[#F5F3EF] hover:underline uppercase transition-colors"
        >
          <span>VIEW ALL REPOSITORIES</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayRepos.map((repo) => (
          <a
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            className="p-6 border border-neutral-300 dark:border-[#2A2A2A] bg-white dark:bg-[#111111] flex flex-col justify-between hover:border-neutral-500 dark:hover:border-[#444444] transition-colors group"
          >
            <div>
              <div className="flex items-center justify-between font-mono-code text-[10px] text-neutral-400 dark:text-[#666666] mb-3">
                <div className="flex items-center gap-1.5">
                  <FolderGit2 className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="uppercase">PUBLIC REPO</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-[#F5F3EF] transition-colors" />
              </div>

              <h4 className="font-mono-code text-sm sm:text-base font-bold text-neutral-950 dark:text-[#F5F3EF] mb-2 group-hover:underline">
                {repo.name}
              </h4>

              <p className="text-xs text-neutral-600 dark:text-[#A3A3A3] leading-relaxed line-clamp-2">
                {getRepoDescription(repo.name, repo.description)}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-[#222222] flex items-center justify-between font-mono-code text-[11px] text-neutral-500 dark:text-[#777777]">
              {repo.primaryLanguage ? (
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: repo.primaryLanguage.color || '#888888' }}
                  />
                  <span>{repo.primaryLanguage.name}</span>
                </span>
              ) : (
                <span>Full-Stack</span>
              )}

              {repo.stargazerCount > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  <span>{repo.stargazerCount}</span>
                </span>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
