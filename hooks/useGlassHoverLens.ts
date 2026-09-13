'use client';

import { useRef, useCallback, useEffect } from 'react';

/**
 * useGlassHoverLens
 *
 * Drives the interactive specular highlight that follows the pointer across
 * a Liquid Glass surface. It uses RAF-based damped interpolation so the
 * highlight lags behind the cursor with a natural spring feel.
 *
 * The specular position and opacity are written as CSS custom properties
 * (--spec-x, --spec-y, --spec-opacity) directly onto the container element,
 * which are then consumed by the ::after pseudo-element defined in globals.css.
 *
 * This keeps React state entirely out of the hot path.
 *
 * @returns A ref to attach to the glass card container element.
 */
export function useGlassHoverLens<T extends HTMLElement = HTMLDivElement>() {
  const containerRef = useRef<T>(null);
  const rafRef = useRef<number>(0);

  // Mutable state stored in refs — no re-renders
  const specX = useRef(0.5);
  const specY = useRef(0.5);
  const specOpacity = useRef(0);
  const isHoveredRef = useRef(false);

  const writeProps = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    el.style.setProperty('--spec-x', `${specX.current * 100}%`);
    el.style.setProperty('--spec-y', `${specY.current * 100}%`);
    el.style.setProperty('--spec-opacity', String(specOpacity.current));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const tx = (e.clientX - rect.left) / rect.width;
      const ty = (e.clientY - rect.top) / rect.height;

      // Damped lerp — 10% per frame toward target
      specX.current += (tx - specX.current) * 0.10;
      specY.current += (ty - specY.current) * 0.10;

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(writeProps);
    };

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      specOpacity.current = 1;
      writeProps();
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;

      // Smooth fade-out without keeping pointer events alive
      const fadeOut = () => {
        specOpacity.current = Math.max(0, specOpacity.current - 0.055);
        const el2 = containerRef.current;
        if (el2) {
          el2.style.setProperty('--spec-opacity', String(specOpacity.current));
        }
        if (specOpacity.current > 0) {
          rafRef.current = requestAnimationFrame(fadeOut);
        }
      };

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(fadeOut);
    };

    el.addEventListener('mousemove', handleMouseMove, { passive: true });
    el.addEventListener('mouseenter', handleMouseEnter, { passive: true });
    el.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [writeProps]);

  return containerRef;
}
