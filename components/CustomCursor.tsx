'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { attachCursor } from '@/lib/cursor';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!mounted || !cursorRef.current || !labelRef.current) return;
    return attachCursor(cursorRef.current, labelRef.current);
  }, [mounted]);

  // Keep fixed pointer coordinates independent of animated page containers.
  if (!mounted) return null;
  return createPortal(
    <div ref={cursorRef} data-custom-cursor data-visible="false" data-mode="default" className="portfolio-cursor" aria-hidden="true">
      <span className="portfolio-cursor-dot" />
      <span className="portfolio-cursor-ring" />
      <span className="portfolio-cursor-label"><span ref={labelRef} /></span>
    </div>,
    document.body,
  );
}
