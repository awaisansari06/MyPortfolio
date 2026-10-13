'use client';

import { useLayoutEffect } from 'react';
import { ScrollTrigger } from '@/lib/motion';

/** Keep existing section animations synchronized with the compact page scrollport. */
export function useResponsiveScroll() {
  useLayoutEffect(() => {
    const page = document.getElementById('portfolio-scroll');
    if (!page) return;
    const media = window.matchMedia('(width < 1100px)');
    let compact = media.matches;
    let position = compact ? page.scrollTop : window.scrollY;
    let refreshFrame = 0;
    let disposed = false;
    const scheduleRefresh = () => {
      if (disposed || refreshFrame) return;
      refreshFrame = requestAnimationFrame(() => {
        refreshFrame = 0;
        ScrollTrigger.refresh();
      });
    };
    const remember = () => { position = compact ? page.scrollTop : window.scrollY; };
    const configure = () => {
      compact = media.matches;
      const scroller = compact ? page : window;
      ScrollTrigger.defaults({ scroller });
      ScrollTrigger.getAll().forEach(trigger => {
        const vars = { ...trigger.vars, animation: trigger.animation, scroller };
        trigger.kill(false, true);
        ScrollTrigger.create(vars);
      });
      scroller.scrollTo({ top: position, behavior: 'instant' });
      ScrollTrigger.refresh();
    };
    ScrollTrigger.defaults({ scroller: compact ? page : window });
    // Refresh when real content dimensions change, including late images and fonts.
    const observer = new ResizeObserver(scheduleRefresh);
    page.querySelectorAll('section').forEach(section => observer.observe(section));
    void document.fonts.ready.then(scheduleRefresh);
    window.addEventListener('load', scheduleRefresh);
    scheduleRefresh();
    document.addEventListener('scroll', remember, true);
    media.addEventListener('change', configure);
    return () => {
      disposed = true;
      observer.disconnect();
      cancelAnimationFrame(refreshFrame);
      window.removeEventListener('load', scheduleRefresh);
      document.removeEventListener('scroll', remember, true);
      media.removeEventListener('change', configure);
      ScrollTrigger.defaults({ scroller: window });
    };
  }, []);
}
