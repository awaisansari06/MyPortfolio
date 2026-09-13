'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const CustomCursor = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

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
        const innerEl = innerRef.current;
        const textEl = textRef.current;
        if (!cursorEl || !innerEl || !textEl) return;

        document.body.classList.add('has-custom-cursor');

        // Initialize GSAP quickTo setters for high-performance, non-blocking transforms
        const xTo = gsap.quickTo(cursorEl, 'x', {
            duration: 0.18,
            ease: 'power3.out',
        });

        const yTo = gsap.quickTo(cursorEl, 'y', {
            duration: 0.18,
            ease: 'power3.out',
        });

        // Start hidden until first mousemove
        gsap.set(cursorEl, { opacity: 0, x: -100, y: -100 });

        let isVisible = false;
        let currentHoverType: 'default' | 'clickable' | 'custom' = 'default';
        let currentText = '';

        const updateAppearance = (type: 'default' | 'clickable' | 'custom', text: string) => {
            if (type === currentHoverType && text === currentText) return;
            currentHoverType = type;
            currentText = text;

            if (type === 'custom' && text) {
                textEl.textContent = text;
                textEl.style.display = 'block';
                innerEl.className =
                    '-translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-200 flex items-center justify-center font-mono-code text-[9px] tracking-widest uppercase font-medium h-11 w-11 bg-neutral-900/90 dark:bg-neutral-100/90 text-white dark:text-neutral-950 border-neutral-700 dark:border-neutral-300 shadow-md backdrop-blur-[2px]';
            } else if (type === 'clickable') {
                textEl.textContent = '';
                textEl.style.display = 'none';
                innerEl.className =
                    '-translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-200 flex items-center justify-center font-mono-code text-[9px] tracking-widest uppercase font-medium h-8 w-8 bg-neutral-500/20 dark:bg-neutral-400/20 border-neutral-400 dark:border-neutral-500 backdrop-blur-[2px]';
            } else {
                textEl.textContent = '';
                textEl.style.display = 'none';
                innerEl.className =
                    '-translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-200 flex items-center justify-center font-mono-code text-[9px] tracking-widest uppercase font-medium h-3.5 w-3.5 bg-neutral-700/60 dark:bg-neutral-300/60 border-neutral-400 dark:border-neutral-500 backdrop-blur-[2px]';
            }
        };

        const handlePointerMove = (e: PointerEvent) => {
            xTo(e.clientX);
            yTo(e.clientY);

            if (!isVisible) {
                isVisible = true;
                gsap.to(cursorEl, { opacity: 1, duration: 0.15, overwrite: 'auto' });
            }

            // Check hovered element for cursor attributes
            const target = e.target as HTMLElement | null;
            if (!target) return;

            const cursorTarget = target.closest('[data-cursor]') as HTMLElement | null;
            if (cursorTarget) {
                const text = cursorTarget.getAttribute('data-cursor') || '';
                updateAppearance('custom', text);
            } else {
                const clickable = target.closest('a, button, [role="button"], input, textarea, select');
                if (clickable) {
                    updateAppearance('clickable', '');
                } else {
                    updateAppearance('default', '');
                }
            }
        };

        const handlePointerLeave = () => {
            isVisible = false;
            gsap.to(cursorEl, { opacity: 0, duration: 0.2, overwrite: 'auto' });
        };

        const handlePointerEnter = () => {
            isVisible = true;
            gsap.to(cursorEl, { opacity: 1, duration: 0.15, overwrite: 'auto' });
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
        <div
            ref={cursorRef}
            aria-hidden="true"
            className="pointer-events-none fixed top-0 left-0 z-[9999] will-change-transform"
            style={{
                transform: 'translate3d(-100px, -100px, 0)',
            }}
        >
            <div
                ref={innerRef}
                className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-neutral-400 dark:border-neutral-500 bg-neutral-700/60 dark:bg-neutral-300/60 backdrop-blur-[2px] transition-all duration-200 flex items-center justify-center font-mono-code text-[9px] tracking-widest uppercase font-medium h-3.5 w-3.5"
            >
                <span ref={textRef} className="hidden" />
            </div>
        </div>
    );
};
