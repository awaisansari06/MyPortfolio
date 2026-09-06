'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { portfolioData } from '@/data/portfolio';
import { Menu, X, Sun, Moon, ArrowUpRight } from 'lucide-react';

const emptySubscribe = () => () => {};

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const navLinks = [
    { label: 'WORK', href: '#work' },
    { label: 'STACK', href: '#stack' },
    { label: 'ABOUT', href: '#about' },
    { label: 'ACTIVITY', href: '#activity' },
    { label: 'CONTACT', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(Math.min(1, Math.max(0, window.scrollY / totalScroll)));
      }
      setScrolled(window.scrollY > 40);

      // Section spy
      const sections = ['hero', 'what-i-build', 'work', 'stack', 'engineering', 'about', 'activity', 'contact'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160 && rect.bottom >= 160) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-navigation"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#F7F6F3]/90 dark:bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#E2E0DC] dark:border-[#2A2A2A] py-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)]'
          : 'bg-transparent py-6 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand / Logo - Editorial Aesthetic */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            scrollTo('#hero');
          }}
          className="group flex flex-col transition-colors text-left shrink-0"
          data-cursor="HOME"
          aria-label="Mohammad Awais Ansari - Home"
        >
          <span className="text-[9px] md:text-[10px] tracking-[0.3em] font-medium text-neutral-500 dark:text-[#A3A3A3] font-mono-code mb-0.5 whitespace-nowrap">
            / PORTFOLIO 2026
          </span>
          <span className="text-xs md:text-sm font-semibold uppercase tracking-widest text-neutral-950 dark:text-[#F5F3EF] whitespace-nowrap">
            A. ANSARI
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-7 xl:gap-8 shrink-0">
          <ul className="flex items-center gap-4 lg:gap-5 xl:gap-6">
            {navLinks.map((link) => {
              const sectionId = link.href.replace('#', '');
              const isActive = activeSection === sectionId;
              return (
                <li key={link.label} className="shrink-0">
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(link.href);
                    }}
                    className={`font-mono-code text-[11px] tracking-[0.2em] uppercase font-medium transition-colors py-1 relative whitespace-nowrap ${
                      isActive
                        ? 'text-neutral-950 dark:text-[#F5F3EF] font-semibold'
                        : 'text-neutral-500 dark:text-[#A3A3A3] hover:text-neutral-950 dark:hover:text-[#F5F3EF]'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-neutral-950 dark:bg-[#F5F3EF]" />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Compact Icon-Only Theme Toggle */}
          <button
            id="theme-toggle-desktop"
            onClick={toggleTheme}
            aria-label={mounted && theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-9 h-9 flex items-center justify-center border border-neutral-300 dark:border-[#2A2A2A] hover:border-neutral-950 dark:hover:border-[#F5F3EF] bg-transparent text-neutral-800 dark:text-[#F5F3EF] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 dark:focus-visible:ring-white shrink-0 ml-1"
          >
            {mounted && theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5" />
            ) : (
              <Moon className="w-3.5 h-3.5" />
            )}
          </button>
        </nav>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            id="theme-toggle-mobile"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-md border border-neutral-300 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
          >
            {mounted && theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          <button
            id="mobile-nav-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-md border border-neutral-300 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-x-0 top-[57px] bg-[#F7F6F3] dark:bg-[#0A0A0A] border-b border-neutral-200 dark:border-neutral-800 px-6 py-8 shadow-2xl transition-all">
          <nav className="flex flex-col gap-6">
            <ul className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(link.href);
                    }}
                    className="block text-base font-mono-code tracking-wider text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  window.dispatchEvent(new CustomEvent('open-ask-ai'));
                }}
                className="flex items-center justify-between text-xs font-mono-code text-neutral-950 dark:text-[#F5F3EF] font-bold text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>ASK AWAIS AI</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              <a
                href="/AwaisCV.pdf"
                download="Mohammad-Awais-Ansari-Resume.pdf"
                className="flex items-center justify-between text-xs font-mono-code text-neutral-950 dark:text-[#F5F3EF] font-bold"
              >
                <span>DOWNLOAD RESUME (PDF)</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <a
                href="/AwaisCV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between text-xs font-mono-code text-neutral-600 dark:text-neutral-400"
              >
                <span>VIEW RESUME</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <a
                href={portfolioData.socials.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between text-xs font-mono-code text-neutral-600 dark:text-neutral-400"
              >
                <span>GITHUB REPOSITORY</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <a
                href={portfolioData.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between text-xs font-mono-code text-neutral-600 dark:text-neutral-400"
              >
                <span>LINKEDIN PROFILE</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <a
                href={`mailto:${portfolioData.email}`}
                className="flex items-center justify-between text-xs font-mono-code text-neutral-900 dark:text-neutral-100 font-semibold"
              >
                <span>{portfolioData.email}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </nav>
        </div>
      )}

      {/* 1px Minimal Scroll Progress Indicator */}
      <div
        className="absolute bottom-0 left-0 h-[1px] bg-neutral-900/40 dark:bg-[#F5F3EF]/40 transition-[width] duration-75 ease-out pointer-events-none"
        style={{ width: `${(scrollProgress * 100).toFixed(2)}%` }}
        aria-hidden="true"
      />
    </header>
  );
};
