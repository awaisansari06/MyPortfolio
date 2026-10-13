let depth = 0;
let locked: { element: HTMLElement; overflow: string }[] = [];

export function lockPageScroll() {
  if (depth++ === 0) {
    const page = document.getElementById('portfolio-scroll');
    locked = [document.body, ...(page ? [page] : [])].map(element => ({
      element, overflow: element.style.overflow,
    }));
    locked.forEach(({ element }) => { element.style.overflow = 'hidden'; });
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    if (--depth === 0) {
      locked.forEach(({ element, overflow }) => { element.style.overflow = overflow; });
      locked = [];
    }
  };
}
