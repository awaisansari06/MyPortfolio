'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { type LensConfig, type DisplacementMapData } from '@/components/liquid-glass/types';
import { generateDisplacementMap } from '@/components/liquid-glass/displacement-map';
import { LiquidGlassFilter } from '@/components/liquid-glass/LiquidGlassFilter';

const CURSOR_LENS_CONFIG: LensConfig = {
  width: 38,
  height: 38,
  borderRadius: 19,
  depth: 0.22,
  curvature: 1.4,
  scale: 8,
  chroma: 0,
  glow: 0.05,
  edgeHighlight: 0.45,
  specularAngle: 45,
};

export const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const badgeTextRef = useRef<HTMLSpanElement>(null);
  const [mapData, setMapData] = useState<DisplacementMapData | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Only disable custom cursor if device is strictly touch-only (no mouse/trackpad pointer)
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    const isTouchOnly = !hasFinePointer && window.matchMedia('(pointer: coarse)').matches;

    if (isTouchOnly) {
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animDuration = prefersReducedMotion ? 0.02 : 0.15;

    const cursorEl = cursorRef.current;
    const dotEl = dotRef.current;
    const lensEl = lensRef.current;
    const badgeEl = badgeRef.current;
    const badgeTextEl = badgeTextRef.current;
    if (!cursorEl || !dotEl || !lensEl || !badgeEl || !badgeTextEl) return;

    const mapFrame = requestAnimationFrame(() => {
      const map = generateDisplacementMap(CURSOR_LENS_CONFIG);
      if (map) setMapData(map);
    });

    // Start hidden until first pointer movement
    cursorEl.style.opacity = '0';
    cursorEl.style.transform = 'translate3d(-100px, -100px, 0)';
    gsap.set(dotEl, { opacity: 1, scale: 1 });
    gsap.set(lensEl, { opacity: 0, scale: 0.5 });
    gsap.set(badgeEl, { opacity: 0, scale: 0.5 });

    let isVisible = false;
    let currentMode: 'hidden' | 'text' | 'badge' | 'clickable' | 'default' = 'default';
    let currentBadgeText = '';

    const handlePointerMove = (e: PointerEvent) => {
      // Ignore touch events so taps on touch screens don't trigger custom cursor
      if (e.pointerType === 'touch') {
        document.body.classList.remove('has-custom-cursor');
        cursorEl.style.opacity = '0';
        isVisible = false;
        return;
      }

      // Keep anchor positioning independent of GSAP's transform cache and
      // hover animations so every pointer event has an exact viewport position.
      cursorEl.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;

      // Document-level pointerenter events can target Document rather than an
      // element, which has no closest() method.
      const target = e.target instanceof Element ? e.target : document.documentElement;

      // 1. Text input / editable element check -> yield to native I-beam cursor
      const textInput = target.closest('input, textarea, select, [contenteditable="true"]');
      if (textInput) {
        document.body.classList.remove('has-custom-cursor');
        if (currentMode !== 'text') {
          currentMode = 'text';
          cursorEl.style.opacity = '0';
        }
        return;
      }

      // Hide the native pointer only after the replacement is positioned.
      document.body.classList.add('has-custom-cursor');

      // Ensure cursor container is visible
      if (!isVisible || currentMode === 'text') {
        isVisible = true;
        cursorEl.style.opacity = '1';
      }

      // 2. Custom action badge (data-cursor)
      const dataCursorEl = target.closest('[data-cursor]') as HTMLElement | null;
      const dataCursorValue = dataCursorEl?.getAttribute('data-cursor')?.trim();

      if (dataCursorValue) {
        if (currentMode !== 'badge' || currentBadgeText !== dataCursorValue) {
          currentMode = 'badge';
          currentBadgeText = dataCursorValue;
          badgeTextEl.textContent = dataCursorValue;

          gsap.to(badgeEl, {
            scale: 1,
            opacity: 1,
            duration: animDuration,
            ease: 'power2.out',
            overwrite: 'auto',
          });
          gsap.to(dotEl, {
            scale: 0.4,
            opacity: 0,
            duration: animDuration,
            overwrite: 'auto',
          });
          gsap.to(lensEl, {
            scale: 0.5,
            opacity: 0,
            duration: animDuration,
            overwrite: 'auto',
          });
        }
        return;
      }

      // 3. Clickable / interactive element
      const clickableEl = target.closest(
        'a, button, [role="button"], .cursor-pointer, [data-interactive]'
      );

      if (clickableEl) {
        if (currentMode !== 'clickable') {
          currentMode = 'clickable';
          currentBadgeText = '';

          // Center dot remains clearly visible, outer liquid glass lens expands
          gsap.to(dotEl, {
            scale: 0.75,
            opacity: 1,
            duration: animDuration,
            ease: 'power2.out',
            overwrite: 'auto',
          });
          gsap.to(lensEl, {
            scale: 1,
            opacity: 1,
            duration: animDuration,
            ease: 'power2.out',
            overwrite: 'auto',
          });
          gsap.to(badgeEl, {
            scale: 0.5,
            opacity: 0,
            duration: animDuration,
            overwrite: 'auto',
          });
        }
        return;
      }

      // 4. Default state
      if (currentMode !== 'default') {
        currentMode = 'default';
        currentBadgeText = '';

        gsap.to(dotEl, {
          scale: 1,
          opacity: 1,
          duration: animDuration,
          ease: 'power2.out',
          overwrite: 'auto',
        });
        gsap.to(lensEl, {
          scale: 0.5,
          opacity: 0,
          duration: animDuration,
          ease: 'power2.out',
          overwrite: 'auto',
        });
        gsap.to(badgeEl, {
          scale: 0.5,
          opacity: 0,
          duration: animDuration,
          overwrite: 'auto',
        });
      }
    };

    const handlePointerLeave = () => {
      isVisible = false;
      currentMode = 'hidden';
      document.body.classList.remove('has-custom-cursor');
      cursorEl.style.opacity = '0';
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave);
    document.addEventListener('pointerenter', handlePointerMove);

    return () => {
      cancelAnimationFrame(mapFrame);
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('pointerenter', handlePointerMove);
    };
  }, []);

  return (
    <>
      {mapData && (
        <LiquidGlassFilter
          surfaceId="cursor"
          mapData={mapData}
          config={CURSOR_LENS_CONFIG}
        />
      )}

      {/* Main Cursor Anchor */}
      <div
        ref={cursorRef}
        data-custom-cursor
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999]"
        style={{
          transform: 'translate3d(-100px, -100px, 0)',
          willChange: 'transform',
        }}
      >
        {/* State 1: Crisp Center Dot - Always precisely centered and visible in both light & dark themes */}
        <div
          ref={dotRef}
          className="pointer-events-none rounded-full bg-neutral-900 dark:bg-[#F5F3EF] border border-white/60 dark:border-black/40 shadow-[0_0_8px_rgba(0,0,0,0.3)] dark:shadow-[0_0_10px_rgba(255,255,255,0.6)]"
          style={{
            position: 'absolute',
            top: '-4px',
            left: '-4px',
            width: '8px',
            height: '8px',
            transformOrigin: 'center center',
          }}
        />

        {/* State 2: Interactive Hover Lens - 38px Liquid Glass Lens around the central dot */}
        <div
          ref={lensRef}
          className="pointer-events-none rounded-full border border-neutral-900/35 dark:border-white/50 bg-neutral-900/[0.07] dark:bg-white/[0.14] backdrop-blur-[3px] shadow-[0_4px_16px_rgba(0,0,0,0.12)] dark:shadow-[0_0_20px_rgba(255,255,255,0.15)] overflow-hidden"
          style={{
            position: 'absolute',
            top: '-19px',
            left: '-19px',
            width: '38px',
            height: '38px',
            transformOrigin: 'center center',
          }}
        >
          {/* Specular Edge Highlight */}
          <div
            className="absolute top-0 inset-x-2 h-[1px] bg-white/70 dark:bg-white/80 rounded-full pointer-events-none"
            aria-hidden="true"
          />
        </div>

        {/* State 3: Custom Action Badge - Displays label for elements with data-cursor */}
        <div
          ref={badgeRef}
          className="pointer-events-none flex items-center justify-center px-3 py-1 rounded-full bg-neutral-950/90 dark:bg-[#F5F3EF]/95 text-white dark:text-[#0A0A0A] border border-neutral-700/60 dark:border-white/60 shadow-xl backdrop-blur-md"
          style={{
            position: 'absolute',
            top: '0px',
            left: '0px',
            transform: 'translate(-50%, -50%)',
            transformOrigin: 'center center',
            whiteSpace: 'nowrap',
          }}
        >
          <span
            ref={badgeTextRef}
            className="font-mono-code text-[10px] tracking-widest uppercase font-semibold leading-none select-none"
          />
        </div>
      </div>
    </>
  );
};
