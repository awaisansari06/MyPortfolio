'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { type LensConfig, type DisplacementMapData } from '@/components/liquid-glass/types';
import { generateDisplacementMap } from '@/components/liquid-glass/displacement-map';
import { LiquidGlassFilter } from '@/components/liquid-glass/LiquidGlassFilter';

/**
 * Dedicated 32px circular lens configuration for the custom cursor.
 * Uses the Aave-style displacement map infrastructure to optically refract live DOM pixels.
 */
const CURSOR_LENS_CONFIG: LensConfig = {
  width: 32,
  height: 32,
  borderRadius: 16,
  depth: 0.22,
  curvature: 1.4,
  scale: 10,
  chroma: 0,
  glow: 0.05,
  edgeHighlight: 0.35,
  specularAngle: 45,
};

export const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const [mapData, setMapData] = useState<DisplacementMapData | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Generate the 32x32 circular displacement map ONCE on mount
    const map = generateDisplacementMap(CURSOR_LENS_CONFIG);
    if (map) {
      setMapData(map);
    }

    // Disable on touch / coarse devices
    const isTouchDevice =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches;

    // Respect user's reduced-motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouchDevice || prefersReducedMotion) {
      return;
    }

    const cursorEl = cursorRef.current;
    const dotEl = dotRef.current;
    const lensEl = lensRef.current;
    if (!cursorEl || !dotEl || !lensEl) return;

    document.body.classList.add('has-custom-cursor');

    // Initialize GSAP quickTo setters for high-performance, non-blocking transforms.
    // 0.10s interpolation provides stable, smooth tracking without chasing raw pointer events or lagging behind.
    const xTo = gsap.quickTo(cursorEl, 'x', {
      duration: 0.10,
      ease: 'power2.out',
    });

    const yTo = gsap.quickTo(cursorEl, 'y', {
      duration: 0.10,
      ease: 'power2.out',
    });

    // Start hidden until first pointermove
    gsap.set(cursorEl, { opacity: 0, x: -100, y: -100 });
    gsap.set(dotEl, { opacity: 1, scale: 1 });
    gsap.set(lensEl, { opacity: 0, scale: 0.5 });

    let isVisible = false;
    let isHovered = false;
    let currentInteractiveEl: Element | null = null;

    const handlePointerMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);

      if (!isVisible) {
        isVisible = true;
        gsap.to(cursorEl, { opacity: 1, duration: 0.10, overwrite: 'auto' });
      }

      // Check hovered element for clickable / interactive controls
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactiveEl = target.closest(
        'a, button, [role="button"], input, textarea, select, [data-cursor]'
      );

      // Prevent hover thrashing: only transition when resolved interactive target changes
      if (interactiveEl !== currentInteractiveEl) {
        currentInteractiveEl = interactiveEl;
        const nextHovered = Boolean(interactiveEl);

        if (nextHovered !== isHovered) {
          isHovered = nextHovered;
          if (isHovered) {
            // Smooth 140ms non-elastic transition to optical glass lens
            gsap.to(dotEl, {
              scale: 0.3,
              opacity: 0,
              duration: 0.14,
              ease: 'power2.out',
              overwrite: 'auto',
            });
            gsap.to(lensEl, {
              scale: 1,
              opacity: 1,
              duration: 0.14,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          } else {
            // Smooth 140ms transition back to normal dot
            gsap.to(dotEl, {
              scale: 1,
              opacity: 1,
              duration: 0.14,
              ease: 'power2.out',
              overwrite: 'auto',
            });
            gsap.to(lensEl, {
              scale: 0.5,
              opacity: 0,
              duration: 0.14,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          }
        }
      }
    };

    const handlePointerLeave = () => {
      isVisible = false;
      currentInteractiveEl = null;
      gsap.to(cursorEl, { opacity: 0, duration: 0.15, overwrite: 'auto' });
    };

    const handlePointerEnter = () => {
      isVisible = true;
      gsap.to(cursorEl, { opacity: 1, duration: 0.10, overwrite: 'auto' });
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave);
    document.addEventListener('pointerenter', handlePointerEnter);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('pointerenter', handlePointerEnter);
    };
  }, []);

  return (
    <>
      {/* SVG feDisplacementMap filter injected once on mount for the lens specification */}
      {mapData && (
        <LiquidGlassFilter
          surfaceId="cursor"
          mapData={mapData}
          config={CURSOR_LENS_CONFIG}
        />
      )}

      {/* Outer cursor element solely responsible for pointer translation */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] text-neutral-900 dark:text-[#F5F3EF]"
        style={{
          transform: 'translate3d(-100px, -100px, 0)',
          willChange: 'transform',
        }}
      >
        {/* Normal State: Crisp 10px solid dot centered at pointer (0, 0) */}
        <div
          ref={dotRef}
          className="pointer-events-none rounded-full bg-current shadow-xs"
          style={{
            position: 'absolute',
            top: '-5px',
            left: '-5px',
            width: '10px',
            height: '10px',
            transformOrigin: 'center center',
          }}
        />

        {/* Interactive Hover: 32px Liquid Glass Lens centered at pointer (0, 0) */}
        <div
          ref={lensRef}
          className="pointer-events-none overflow-hidden rounded-full border border-neutral-900/15 dark:border-white/25 bg-white/20 dark:bg-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_2px_8px_rgba(0,0,0,0.12)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_2px_10px_rgba(0,0,0,0.35)]"
          style={{
            position: 'absolute',
            top: '-16px',
            left: '-16px',
            width: '32px',
            height: '32px',
            transformOrigin: 'center center',
            backdropFilter: 'blur(1.5px) saturate(1.1)',
            WebkitBackdropFilter: 'blur(1.5px) saturate(1.1)',
          }}
        >
          {/* Subtle top specular catch rim */}
          <div
            className="absolute top-0 inset-x-2 h-[1px] bg-white/80 dark:bg-white/60 rounded-full opacity-80 pointer-events-none"
            aria-hidden="true"
          />
        </div>
      </div>
    </>
  );
};
