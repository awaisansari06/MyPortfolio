'use client';

import React from 'react';
import { GitHubRepo } from '@/lib/github/types';
import { ArrowUpRight, FolderGit2, Star } from 'lucide-react';
import { useGlassHoverLens } from '@/hooks/useGlassHoverLens';

const FALLBACK_REPOSITORIES: GitHubRepo[] = [
  {
    name: 'MyPortfolio',
    description: 'Modern software engineering portfolio showcasing full-stack systems and technical projects.',
    url: 'https://github.com/awaisansari06/MyPortfolio',
    stargazerCount: 0,
    primaryLanguage: { name: 'TypeScript', color: '#3178c6' },
    updatedAt: '2026-09-06T12:00:00Z',
  },
  {
    name: 'CareerWise',
    description: 'AI-powered career intelligence platform with ATS resume optimization and mock interview agents.',
    url: 'https://github.com/awaisansari06/CareerWise',
    stargazerCount: 0,
    primaryLanguage: { name: 'JavaScript', color: '#f1e05a' },
    updatedAt: '2026-09-05T12:00:00Z',
  },
  {
    name: 'devflow',
    description: 'Agentic AI development platform generating full-stack web applications with cloud VM sandbox execution.',
    url: 'https://github.com/awaisansari06/devflow',
    stargazerCount: 0,
    primaryLanguage: { name: 'TypeScript', color: '#3178c6' },
    updatedAt: '2026-09-06T06:00:00Z',
  },
  {
    name: 'smart-journey',
    description: 'Intelligent personalized travel planning system with dynamic route and place recommendations.',
    url: 'https://github.com/awaisansari06/smart-journey',
    stargazerCount: 0,
    primaryLanguage: { name: 'TypeScript', color: '#3178c6' },
    updatedAt: '2026-08-31T12:00:00Z',
  },
];

interface GitHubRepositoriesProps {
  repositories?: GitHubRepo[];
}

/** A single repo card with interactive glass hover lens effect */
const RepoCard: React.FC<{ repo: GitHubRepo; description: string }> = ({
  repo,
  description,
}) => {
  const lensRef = useGlassHoverLens<HTMLAnchorElement>();

  return (
    <a
      ref={lensRef}
      key={repo.name}
      href={repo.url}
      target="_blank"
      rel="noreferrer"
      className="p-6 flex flex-col justify-between group transition-all duration-300 liquid-glass-card"
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
          {description}
        </p>
      </div>

      <div className="mt-6 pt-4 flex items-center justify-between font-mono-code text-[11px] text-neutral-500 dark:text-[#777777] border-t border-[var(--glass-rim)]">
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
  );
};

export const GitHubRepositories: React.FC<GitHubRepositoriesProps> = ({ repositories }) => {
  const getRepoDescription = (name: string, originalDesc: string | null) => {
    if (originalDesc) return originalDesc;
    const lower = name.toLowerCase();
    if (lower.includes('portfolio')) {
      return 'Modern software engineering portfolio showcasing full-stack systems and technical projects.';
    }
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

  const sourceRepos = repositories && repositories.length > 0 ? repositories : FALLBACK_REPOSITORIES;
  const displayRepos = sourceRepos.slice(0, 4);

  return (
    <div className="mt-12 pt-10 border-t border-neutral-300 dark:border-[#2A2A2A]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-4">
        <div>
          <span className="font-mono-code text-[10px] text-neutral-400 dark:text-[#666666] uppercase tracking-widest block">
            SOURCE CODE &amp; ARTIFACTS
          </span>
          <h3 className="font-mono-code text-sm sm:text-base font-bold text-neutral-950 dark:text-[#F5F3EF] uppercase">
            SELECTED REPOSITORIES
          </h3>
        </div>

        <a
          href="https://github.com/awaisansari06?tab=repositories"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 font-mono-code text-xs uppercase transition-colors liquid-glass-badge px-3 py-1.5 text-neutral-700 dark:text-[#A3A3A3]"
        >
          <span>VIEW ALL REPOSITORIES</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayRepos.map((repo) => (
          <RepoCard
            key={repo.name}
            repo={repo}
            description={getRepoDescription(repo.name, repo.description)}
          />
        ))}
      </div>
    </div>
  );
};
