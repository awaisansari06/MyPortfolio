/** Use instant scrolling when the visitor requests reduced motion. */
export function getScrollBehavior(): ScrollBehavior {
  return typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 'instant'
    : 'smooth';
}
