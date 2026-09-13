'use client';

import React, { useState, useEffect, useCallback, useRef, useId } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { portfolioData } from '@/data/portfolio';
import { Menu, X, Sun, Moon, ArrowUpRight } from 'lucide-react';
import { type LensConfig, type DisplacementMapData } from '@/components/liquid-glass/types';
import { DEFAULT_LENS_CONFIG } from '@/components/liquid-glass/lens';
import { generateDisplacementMap } from '@/components/liquid-glass/displacement-map';
import { LiquidGlassFilter, getFilterUrl } from '@/components/liquid-glass/LiquidGlassFilter';

// ─── Navbar Liquid Glass Backing ──────────────────────────────────────────────
// The floating navbar is a suspended glass capsule with real SVG feDisplacementMap
// live DOM refraction, edge specular highlights, and soft ambient shadow.

const NAVBAR_LENS_PRESET: Omit<LensConfig, 'width' | 'height'> = {
  borderRadius: 9999,
  depth: 0.24,
  curvature: 1.4,
  scale: 18,
  chroma: 0.02,
  glow: 0.10,
  edgeHighlight: 0.32,
  specularAngle: 45,
};

const NavbarGlassBacking: React.FC<{
  filterId: string;
  mapData: DisplacementMapData | null;
  borderRadius?: string;
}> = ({ filterId, mapData, borderRadius = '9999px' }) => {
  return (
    <>
      {/* SVG filter injected into document if mapData ready */}
      {mapData && (
        <LiquidGlassFilter
          surfaceId={filterId}
          mapData={mapData}
          config={{ ...NAVBAR_LENS_PRESET, width: mapData.width, height: mapData.height }}
        />
      )}
      {/* Refractive physical curved glass backing layer */}
      <div
        aria-hidden="true"
        className="glass-surface-backing"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius,
          backdropFilter: 'blur(var(--glass-blur, 18px)) saturate(var(--glass-saturate, 1.25))',
          WebkitBackdropFilter: 'blur(var(--glass-blur, 18px)) saturate(var(--glass-saturate, 1.25))',
          background: 'var(--glass-surface-strong)',
          boxShadow: [
            'inset 0 1.5px 0 var(--glass-edge-highlight)',
            'inset 0 0 0 0.5px var(--glass-rim-strong)',
            '0 4px 16px var(--glass-shadow)',
            '0 16px 48px var(--glass-shadow-lg)',
          ].join(', '),
          zIndex: 0,
          pointerEvents: 'none',
          border: '0.5px solid var(--glass-rim-strong)',
        }}
      />
      {/* Top specular highlight edge line */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '1px',
          background: 'var(--glass-edge-highlight)',
          opacity: 0.85,
          zIndex: 1,
          pointerEvents: 'none',
          borderRadius: '9999px',
        }}
      />
    </>
  );
};

// ─── Main Navbar Component ────────────────────────────────────────────────────

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const reactId = useId().replace(/:/g, '');
  const filterId = `navbar-${reactId}`;
  const [navGlassMap, setNavGlassMap] = useState<DisplacementMapData | null>(null);
  const [navPillMap, setNavPillMap] = useState<DisplacementMapData | null>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // ── Active sliding glass pill ──────────────────────────────────────────────
  const navListRef = useRef<HTMLUListElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, visible: false });

  // Dedicated lens configuration for the moving navigation glass pill
  const NAV_PILL_LENS = useRef<LensConfig>({
    width: 120,
    height: 28,
    borderRadius: 14,
    depth: 0.30,
    curvature: 1.3,
    scale: 8,
    chroma: 0,
    glow: 0.08,
    edgeHighlight: 0.38,
    specularAngle: 45,
  }).current;

  // Deterministic mount to avoid hydration mismatch
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setMounted(true);
      const pillMap = generateDisplacementMap(NAV_PILL_LENS);
      if (pillMap) setNavPillMap(pillMap);
    });
    return () => cancelAnimationFrame(id);
  }, [NAV_PILL_LENS]);

  const regenerateNavbarMap = useCallback(() => {
    if (typeof window === 'undefined') return;
    const width = headerRef.current?.offsetWidth ?? Math.min(1024, window.innerWidth - 32);
    const height = headerRef.current?.offsetHeight ?? 54;
    const config: LensConfig = {
      ...DEFAULT_LENS_CONFIG,
      ...NAVBAR_LENS_PRESET,
      width,
      height,
      borderRadius: Math.min(width, height) / 2,
    };
    const map = generateDisplacementMap(config);
    if (map) setNavGlassMap(map);
  }, []);

  // Regenerate navbar glass map on mount and window resize
  useEffect(() => {
    regenerateNavbarMap();

    const handleResize = () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(regenerateNavbarMap, 100);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [regenerateNavbarMap]);

  // ── Scroll tracking ────────────────────────────────────────────────────────

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

  // ── Compute active glass pill position ────────────────────────────────────
  useEffect(() => {
    const updatePill = () => {
      const effectiveIdx = hoverIdx !== null
        ? hoverIdx
        : navLinks.findIndex(l => l.href.replace('#', '') === activeSection);

      if (effectiveIdx < 0) {
        setPillStyle(p => ({ ...p, visible: false }));
        return;
      }

      const linkEl = linkRefs.current[effectiveIdx];
      const listEl = navListRef.current;
      if (!linkEl || !listEl) return;

      const linkRect = linkEl.getBoundingClientRect();
      const listRect = listEl.getBoundingClientRect();
      setPillStyle({
        left: linkRect.left - listRect.left - 4,
        width: linkRect.width + 8,
        visible: true,
      });
    };

    const id = requestAnimationFrame(updatePill);
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection, hoverIdx]);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const headerClass = `fixed top-3 sm:top-4 inset-x-3 sm:inset-x-6 md:inset-x-8 max-w-5xl mx-auto z-40 transition-all duration-300 rounded-full border border-neutral-300/70 dark:border-white/15 bg-[var(--glass-surface-strong)] backdrop-blur-xl ${
    scrolled
      ? 'py-2 px-4 sm:px-6 shadow-[0_16px_40px_-10px_var(--glass-shadow)]'
      : 'py-2.5 px-4 sm:px-6 shadow-[0_8px_24px_-6px_var(--glass-shadow)]'
  }`;

  return (
    <header
      ref={headerRef}
      id="main-navigation"
      className={headerClass}
      style={{ position: 'fixed' }}
    >
      {/* ── Liquid Glass backing layer ────────────────────────────────────── */}
      <NavbarGlassBacking filterId={filterId} mapData={navGlassMap} borderRadius="9999px" />

      {/* ── Optical Glass Filter for moving Navigation Pill ───────────────── */}
      {navPillMap && (
        <LiquidGlassFilter
          surfaceId="nav-pill"
          mapData={navPillMap}
          config={NAV_PILL_LENS}
        />
      )}

      {/* ── Navbar content ────────────────────────────────────────────────── */}
      <div className="w-full flex items-center justify-between" style={{ position: 'relative', zIndex: 1 }}>
        {/* Brand / Logo */}
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
          {/* Relative container so the glass pill can be absolutely positioned */}
          <div style={{ position: 'relative' }}>
            {/* Sliding active optical refractive glass pill */}
            <div
              aria-hidden="true"
              className="liquid-glass-nav-pill pointer-events-none overflow-hidden"
              style={{
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                left: pillStyle.left,
                width: pillStyle.width,
                height: '26px',
                borderRadius: '9999px',
                opacity: pillStyle.visible ? 1 : 0,
                transition:
                  'left 0.36s cubic-bezier(0.16,1,0.3,1), width 0.30s cubic-bezier(0.16,1,0.3,1), opacity 0.2s ease',
                background: 'var(--glass-surface-weak)',
                border: '0.5px solid var(--glass-rim-strong)',
                boxShadow:
                  'inset 0 1px 0 var(--glass-edge-highlight), 0 2px 8px var(--glass-shadow-sm)',
                backdropFilter: 'blur(1.5px) saturate(1.15)',
                WebkitBackdropFilter: 'blur(1.5px) saturate(1.15)',
                zIndex: 10,
              }}
            >
              {/* Synchronized Refraction Target: translated inversely so text aligns perfectly under the lens */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  transform: `translate(${-pillStyle.left}px, -50%)`,
                  transition: 'transform 0.36s cubic-bezier(0.16,1,0.3,1)',
                  filter: navPillMap ? getFilterUrl('nav-pill', navPillMap.version) : undefined,
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                <ul className="flex items-center gap-3 lg:gap-4 xl:gap-5">
                  {navLinks.map((link) => (
                    <li key={link.label} className="shrink-0">
                      <span className="font-mono-code text-[11px] tracking-[0.18em] uppercase font-semibold py-1 px-2 inline-block text-neutral-950 dark:text-[#F5F3EF]">
                        {link.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Specular top catch rim */}
              <div
                className="absolute top-0 inset-x-2 h-[1px] bg-white/90 dark:bg-white/60 rounded-full opacity-80 pointer-events-none"
                aria-hidden="true"
              />
            </div>

            <ul
              ref={navListRef}
              onMouseLeave={() => setHoverIdx(null)}
              className="flex items-center gap-3 lg:gap-4 xl:gap-5"
            >
              {navLinks.map((link, idx) => {
                const sectionId = link.href.replace('#', '');
                const isActive = activeSection === sectionId;
                return (
                  <li key={link.label} className="shrink-0">
                    <a
                      ref={el => { linkRefs.current[idx] = el; }}
                      href={link.href}
                      onMouseEnter={() => setHoverIdx(idx)}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollTo(link.href);
                      }}
                      className={`font-mono-code text-[11px] tracking-[0.18em] uppercase font-medium transition-all py-1 px-2 relative whitespace-nowrap ${
                        isActive
                          ? 'text-neutral-950 dark:text-[#F5F3EF] font-semibold'
                          : 'text-neutral-500 dark:text-[#A3A3A3] hover:text-neutral-950 dark:hover:text-[#F5F3EF]'
                      }`}
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* ── Theme Control (Light / Dark only) ─────────────────────────── */}
          <div className="flex items-center shrink-0 ml-1">
            <button
              id="theme-toggle-desktop"
              onClick={toggleTheme}
              aria-label={mounted && theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="w-8 h-8 flex items-center justify-center transition-colors cursor-pointer rounded-full border border-neutral-300/80 dark:border-[#333333] hover:bg-black/5 dark:hover:bg-white/10 text-neutral-800 dark:text-[#F5F3EF] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 dark:focus-visible:ring-white"
            >
              {mounted && theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5" />
              ) : (
                <Moon className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile menu trigger & controls */}
        <div className="flex items-center gap-1.5 md:hidden">
          <button
            id="theme-toggle-mobile"
            onClick={toggleTheme}
            aria-label={mounted && theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-1.5 rounded-full border border-neutral-300/80 dark:border-[#333333] text-neutral-800 dark:text-neutral-200 transition-colors cursor-pointer"
          >
            {mounted && theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          <button
            id="mobile-nav-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            className="p-1.5 rounded-full border border-neutral-300/80 dark:border-[#333333] text-neutral-800 dark:text-neutral-200 cursor-pointer"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-x-3 sm:inset-x-6 top-[64px] max-w-5xl mx-auto rounded-2xl border border-neutral-300/80 dark:border-[#333333] bg-[var(--glass-surface-strong)] backdrop-blur-xl px-6 py-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all"
          style={{ zIndex: 50 }}
        >
          <nav className="flex flex-col gap-5">
            <ul className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(link.href);
                    }}
                    className="block text-sm font-mono-code tracking-wider text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white py-1"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-neutral-200 dark:border-[#2A2A2A] flex flex-col gap-3">
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

      {/* Scroll Progress Indicator */}
      <div
        className="absolute bottom-0 left-6 right-6 h-[1.5px] bg-neutral-300/30 dark:bg-neutral-700/30 rounded-full overflow-hidden pointer-events-none"
        style={{ zIndex: 2 }}
        aria-hidden="true"
      >
        <div
          className="h-full bg-neutral-900/60 dark:bg-[#F5F3EF]/60 rounded-full transition-[width] duration-75 ease-out"
          style={{ width: `${(scrollProgress * 100).toFixed(2)}%` }}
        />
      </div>
    </header>
  );
};
