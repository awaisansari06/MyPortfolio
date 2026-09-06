'use client';

import React from 'react';
import {
  Code2,
  Terminal,
  Cpu,
  Database,
  Layers,
  Globe,
  Binary,
  Workflow,
  Shield,
  Sparkles,
  Server,
  Zap,
} from 'lucide-react';

interface TechIconProps {
  name: string;
  className?: string;
  size?: number;
}

// User-provided icons in public/Programming-Icons/
const LOCAL_PROGRAMMING_ICONS: Record<string, string> = {
  // C++
  'c++': '/Programming-Icons/icons8-c++.svg',
  cpp: '/Programming-Icons/icons8-c++.svg',
  // CSS3
  css: '/Programming-Icons/icons8-css3.svg',
  css3: '/Programming-Icons/icons8-css3.svg',
  // HTML5
  html: '/Programming-Icons/icons8-html-5.svg',
  html5: '/Programming-Icons/icons8-html-5.svg',
  // Java
  java: '/Programming-Icons/icons8-java.svg',
  // JavaScript
  javascript: '/Programming-Icons/icons8-javascript.svg',
  js: '/Programming-Icons/icons8-javascript.svg',
  // Oracle / SQL / DBMS
  sql: '/Programming-Icons/icons8-oracle-logo-96.svg',
  oracle: '/Programming-Icons/icons8-oracle-logo-96.svg',
  'oracle sql': '/Programming-Icons/icons8-oracle-logo-96.svg',
  dbms: '/Programming-Icons/icons8-oracle-logo-96.svg',
  // PowerShell
  powershell: '/Programming-Icons/icons8-powershell.svg',
  shell: '/Programming-Icons/icons8-powershell.svg',
  terminal: '/Programming-Icons/icons8-powershell.svg',
  // Python
  python: '/Programming-Icons/icons8-python.svg',
  py: '/Programming-Icons/icons8-python.svg',
  // VS Code
  vscode: '/Programming-Icons/icons8-visual-studio-code-2019.svg',
  'vs code': '/Programming-Icons/icons8-visual-studio-code-2019.svg',
  'visual studio code': '/Programming-Icons/icons8-visual-studio-code-2019.svg',
};

// Additional high-fidelity inline SVGs for full-stack & AI ecosystem
const VECTOR_ICONS: Record<string, React.FC<{ className?: string }>> = {
  typescript: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect width="24" height="24" rx="4" fill="#3178C6" />
      <path
        d="M12.8 13.5h-2.1v6.5h-1.6v-6.5H7v-1.3h5.8v1.3zm3.7 4.1c.4.3.9.5 1.5.5.7 0 1.1-.3 1.1-.8 0-.5-.4-.7-1.3-1.1-1.2-.5-2-1.1-2-2.3 0-1.3 1-2.3 2.6-2.3 1 0 1.8.3 2.4.8l-.6 1.2c-.4-.3-1-.6-1.7-.6-.6 0-1 .3-1 .7 0 .4.3.7 1.2 1 1.3.5 2.1 1.1 2.1 2.3 0 1.4-1.1 2.4-2.8 2.4-1.2 0-2.1-.4-2.7-.9l.7-1.1z"
        fill="#FFFFFF"
      />
    </svg>
  ),
  react: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <ellipse cx="12" cy="12" rx="3" ry="8.5" stroke="#61DAFB" strokeWidth="1.2" transform="rotate(30 12 12)" />
      <ellipse cx="12" cy="12" rx="3" ry="8.5" stroke="#61DAFB" strokeWidth="1.2" transform="rotate(90 12 12)" />
      <ellipse cx="12" cy="12" rx="3" ry="8.5" stroke="#61DAFB" strokeWidth="1.2" transform="rotate(150 12 12)" />
      <circle cx="12" cy="12" r="1.8" fill="#61DAFB" />
    </svg>
  ),
  'react.js': ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <ellipse cx="12" cy="12" rx="3" ry="8.5" stroke="#61DAFB" strokeWidth="1.2" transform="rotate(30 12 12)" />
      <ellipse cx="12" cy="12" rx="3" ry="8.5" stroke="#61DAFB" strokeWidth="1.2" transform="rotate(90 12 12)" />
      <ellipse cx="12" cy="12" rx="3" ry="8.5" stroke="#61DAFB" strokeWidth="1.2" transform="rotate(150 12 12)" />
      <circle cx="12" cy="12" r="1.8" fill="#61DAFB" />
    </svg>
  ),
  'react 19': ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <ellipse cx="12" cy="12" rx="3" ry="8.5" stroke="#61DAFB" strokeWidth="1.2" transform="rotate(30 12 12)" />
      <ellipse cx="12" cy="12" rx="3" ry="8.5" stroke="#61DAFB" strokeWidth="1.2" transform="rotate(90 12 12)" />
      <ellipse cx="12" cy="12" rx="3" ry="8.5" stroke="#61DAFB" strokeWidth="1.2" transform="rotate(150 12 12)" />
      <circle cx="12" cy="12" r="1.8" fill="#61DAFB" />
    </svg>
  ),
  nextjs: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M15.5 17.5L8.5 8h-1.5v8h1.5v-5.2l6 7.2c.3-.1.7-.3 1-.5zM15.5 8h1.5v5.5l-1.5-1.8V8z"
        fill="currentColor"
      />
    </svg>
  ),
  'next.js': ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M15.5 17.5L8.5 8h-1.5v8h1.5v-5.2l6 7.2c.3-.1.7-.3 1-.5zM15.5 8h1.5v5.5l-1.5-1.8V8z"
        fill="currentColor"
      />
    </svg>
  ),
  'next.js 15': ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M15.5 17.5L8.5 8h-1.5v8h1.5v-5.2l6 7.2c.3-.1.7-.3 1-.5zM15.5 8h1.5v5.5l-1.5-1.8V8z"
        fill="currentColor"
      />
    </svg>
  ),
  'next.js 15.5': ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M15.5 17.5L8.5 8h-1.5v8h1.5v-5.2l6 7.2c.3-.1.7-.3 1-.5zM15.5 8h1.5v5.5l-1.5-1.8V8z"
        fill="currentColor"
      />
    </svg>
  ),
  tailwind: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="#06B6D4" className={className}>
      <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z" />
    </svg>
  ),
  'tailwind css': ({ className }) => (
    <svg viewBox="0 0 24 24" fill="#06B6D4" className={className}>
      <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z" />
    </svg>
  ),
  nodejs: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="#5FA04E" className={className}>
      <path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2zm-1 5.5h-1.5v9H11v-9zm3 0h-1.5v9H14v-9z" />
    </svg>
  ),
  'node.js': ({ className }) => (
    <svg viewBox="0 0 24 24" fill="#5FA04E" className={className}>
      <path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2zm-1 5.5h-1.5v9H11v-9zm3 0h-1.5v9H14v-9z" />
    </svg>
  ),
  postgresql: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="#336791" className={className}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15.93c-2.83.48-5.35-1.12-5.91-3.67l1.47-.33c.4 1.82 2.19 2.96 4.21 2.62 1.88-.31 3.23-1.89 3.23-3.79 0-2.45-1.8-3.48-3.79-4.22-2.12-.79-4.21-1.78-4.21-4.54 0-2.3 1.76-4.14 4.09-4.45 2.51-.34 4.85 1.05 5.37 3.37l-1.47.33c-.37-1.65-2.04-2.64-3.83-2.4-1.63.22-2.86 1.51-2.86 3.15 0 2.08 1.54 2.87 3.49 3.6 2.23.83 4.51 1.89 4.51 5.16 0 2.67-1.99 4.79-4.7 5.17z" />
    </svg>
  ),
  prisma: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.77 2.05a1 1 0 0 0-1.54 0L2.12 14.88a1 1 0 0 0 .54 1.59l8.6 2.5 1.74 3.03a1 1 0 0 0 1.74 0l7.14-12.44a1 1 0 0 0-.15-1.2L12.77 2.05zm-.77 2.53l6.5 8.78-6.14-1.78-.36-7zm-1.56 1.48v6.78l-5.6 1.63 5.6-8.41zm1.2 8.44l5.12 1.49-4.78 8.32-.34-.59V14.5z" />
    </svg>
  ),
  'prisma orm': ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.77 2.05a1 1 0 0 0-1.54 0L2.12 14.88a1 1 0 0 0 .54 1.59l8.6 2.5 1.74 3.03a1 1 0 0 0 1.74 0l7.14-12.44a1 1 0 0 0-.15-1.2L12.77 2.05zm-.77 2.53l6.5 8.78-6.14-1.78-.36-7zm-1.56 1.48v6.78l-5.6 1.63 5.6-8.41zm1.2 8.44l5.12 1.49-4.78 8.32-.34-.59V14.5z" />
    </svg>
  ),
  git: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="#F05032" className={className}>
      <path d="M21.6 10.9L13.1 2.4a1.7 1.7 0 0 0-2.4 0L8.3 4.8l3.1 3.1a2 2 0 0 1 2.5 2.5l3 3a2 2 0 0 1 1.7 2.7l-1.4-1.4a.8.8 0 0 0-.8-.8.8.8 0 0 0-.8.8v2.3a2 2 0 1 1-1.5-.1v-4.6a2 2 0 0 1-1.1-.9L9.7 8.3l-7.3 7.3a1.7 1.7 0 0 0 0 2.4l8.5 8.5a1.7 1.7 0 0 0 2.4 0l8.3-8.3a1.7 1.7 0 0 0 0-2.4z" />
    </svg>
  ),
  github: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  ),
  'google gemini': ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 2C12 7.523 7.523 12 2 12C7.523 12 12 16.477 12 22C12 16.477 16.477 12 22 12C16.477 12 12 7.523 12 2Z"
        fill="url(#gemini-grad)"
      />
      <defs>
        <linearGradient id="gemini-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4E75F6" />
          <stop offset="0.5" stopColor="#9B72CB" />
          <stop offset="1" stopColor="#D96570" />
        </linearGradient>
      </defs>
    </svg>
  ),
  gemini: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 2C12 7.523 7.523 12 2 12C7.523 12 12 16.477 12 22C12 16.477 16.477 12 22 12C16.477 12 12 7.523 12 2Z"
        fill="url(#gemini-grad-2)"
      />
      <defs>
        <linearGradient id="gemini-grad-2" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4E75F6" />
          <stop offset="0.5" stopColor="#9B72CB" />
          <stop offset="1" stopColor="#D96570" />
        </linearGradient>
      </defs>
    </svg>
  ),
  vercel: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2L24 22H0L12 2Z" />
    </svg>
  ),
  'vercel ai sdk': ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2L24 22H0L12 2Z" />
    </svg>
  ),
  trpc: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="#398CCB" className={className}>
      <path d="M11 2v9H2v2h9v9h2v-9h9v-2h-9V2h-2z" />
    </svg>
  ),
  convex: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="#E65100" className={className}>
      <circle cx="12" cy="12" r="9" fill="none" stroke="#E65100" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" fill="#E65100" />
    </svg>
  ),
  clerk: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="#6C47FF" className={className}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
    </svg>
  ),
  inngest: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="#6366F1" className={className}>
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  threejs: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2L2 20h20L12 2zm0 4.5l6.5 11.5h-13L12 6.5z" />
    </svg>
  ),
  'three.js': ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2L2 20h20L12 2zm0 4.5l6.5 11.5h-13L12 6.5z" />
    </svg>
  ),
  'shadcn/ui': ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <line x1="16" y1="4" x2="8" y2="20" />
      <line x1="20" y1="8" x2="4" y2="16" />
    </svg>
  ),
  'framer motion': ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z" />
    </svg>
  ),
};

export const TechIcon: React.FC<TechIconProps> = ({ name, className = 'w-3.5 h-3.5', size = 14 }) => {
  const normalized = name.trim().toLowerCase();

  // 1. Check user-provided SVGs from Programming-Icons
  const localIcon = LOCAL_PROGRAMMING_ICONS[normalized];
  if (localIcon) {
    return (
      <img
        src={localIcon}
        alt={name}
        width={size}
        height={size}
        loading="lazy"
        className={`object-contain shrink-0 ${className}`}
      />
    );
  }

  // 2. Check rich vector SVGs
  const VectorIcon = VECTOR_ICONS[normalized];
  if (VectorIcon) {
    return <VectorIcon className={`shrink-0 ${className}`} />;
  }

  // 3. Contextual smart icons (Restrained monochrome)
  if (normalized.includes('api') || normalized.includes('rest')) {
    return <Globe className={`shrink-0 text-neutral-700 dark:text-[#A3A3A3] ${className}`} />;
  }
  if (normalized.includes('agent') || normalized.includes('e2b')) {
    return <Cpu className={`shrink-0 text-neutral-700 dark:text-[#A3A3A3] ${className}`} />;
  }
  if (normalized.includes('data') || normalized.includes('convex')) {
    return <Database className={`shrink-0 text-neutral-700 dark:text-[#A3A3A3] ${className}`} />;
  }
  if (normalized.includes('map') || normalized.includes('place')) {
    return <Globe className={`shrink-0 text-neutral-700 dark:text-[#A3A3A3] ${className}`} />;
  }
  if (normalized.includes('ai') || normalized.includes('model') || normalized.includes('router')) {
    return <Sparkles className={`shrink-0 text-neutral-700 dark:text-[#A3A3A3] ${className}`} />;
  }
  if (normalized.includes('workflow') || normalized.includes('job')) {
    return <Workflow className={`shrink-0 text-neutral-700 dark:text-[#A3A3A3] ${className}`} />;
  }
  if (normalized.includes('shield') || normalized.includes('arcjet') || normalized.includes('auth')) {
    return <Shield className={`shrink-0 text-neutral-700 dark:text-[#A3A3A3] ${className}`} />;
  }
  if (normalized.includes('form') || normalized.includes('zod')) {
    return <Zap className={`shrink-0 text-neutral-700 dark:text-[#A3A3A3] ${className}`} />;
  }

  // Default clean programming icon
  return <Code2 className={`shrink-0 text-neutral-400 dark:text-neutral-500 ${className}`} />;
};
