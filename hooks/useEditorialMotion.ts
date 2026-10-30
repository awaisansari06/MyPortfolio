'use client';
import { useEffect, type RefObject } from 'react';
import { gsap, ScrollTrigger } from '@/lib/motion';

export function useEditorialMotion(ref: RefObject<HTMLElement | null>, hero = false) {
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add({ motion: '(prefers-reduced-motion: no-preference)', parallax: '(min-width: 600px)' }, (match) => {
      if (!match.conditions?.motion) return;
      const context = gsap.context(() => {
        const elements = gsap.utils.toArray<HTMLElement>('[data-reveal]');
        if (hero) {
          gsap.fromTo(elements, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: .9, stagger: .11, delay: .18, ease: 'power3.out' });
          gsap.fromTo('[data-cutout]', { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.35, ease: 'power3.inOut' });
          gsap.fromTo('.portrait-print', { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, stagger: .14, delay: .45, ease: 'power3.out' });
          if (match.conditions?.parallax) gsap.to('[data-parallax]', { y: 30, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: 1 } });
          gsap.utils.toArray<HTMLElement>('.portrait-print').forEach((print, index) => {
            gsap.to(print, { y: -18 - index * 12, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: 1.2 } });
          });
        } else {
          elements.forEach(element => gsap.fromTo(element, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .85, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 92%', once: true } }));
          if (ref.current?.querySelector('[data-story-photo]')) gsap.fromTo('[data-story-photo]', { clipPath: 'inset(0 0 14% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '[data-story-photo]', start: 'top 88%', once: true } });
        }
      }, ref);
      const section = ref.current;
      const refresh = () => ScrollTrigger.refresh();
      section?.addEventListener('toggle', refresh, true);
      return () => { section?.removeEventListener('toggle', refresh, true); context.revert(); };
    });
    return () => media.revert();
  }, [ref, hero]);
}
