'use client';

import { useEffect, useState, type CSSProperties } from 'react';

/** Tracks the visible viewport, including keyboards that only resize visualViewport. */
export function useChatViewport(open: boolean) {
  const [compact, setCompact] = useState(false);
  const [viewportStyle, setViewportStyle] = useState<CSSProperties>({});

  useEffect(() => {
    const query = window.matchMedia('(width < 1100px)');
    const sync = () => setCompact(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.aiOpen = String(open);
    if (!open || !compact) return;
    const viewport = window.visualViewport;
    const sync = () => setViewportStyle({
      '--chat-visible-height': `${viewport?.height ?? window.innerHeight}px`,
      '--chat-visible-top': `${viewport?.offsetTop ?? 0}px`,
    } as CSSProperties);
    sync();
    viewport?.addEventListener('resize', sync);
    viewport?.addEventListener('scroll', sync);
    window.addEventListener('resize', sync);
    return () => {
      viewport?.removeEventListener('resize', sync);
      viewport?.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [open, compact]);

  return { compact, viewportStyle };
}
