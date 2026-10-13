/** One visual update per display frame; the dot always marks the actual hit point. */
export function attachCursor(cursor: HTMLElement, label: HTMLElement) {
  const media = window.matchMedia('(min-width: 1100px) and (pointer: fine) and (hover: hover)');
  let frame = 0;
  let x = 0;
  let y = 0;
  let target: Element | null = null;
  let hasPosition = false;
  let hitTest = false;

  const hide = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    hasPosition = false;
    cursor.dataset.visible = 'false';
    document.body.classList.remove('has-custom-cursor');
  };

  const render = () => {
    frame = 0;
    if (!media.matches || !hasPosition || document.hidden) return hide();
    if (hitTest) {
      target = document.elementFromPoint(x, y);
      hitTest = false;
    }
    // Preserve native editing, selection and resize cursors.
    if (!target || target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"]), iframe')) return hide();

    cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    const action = target.closest('[data-cursor]')?.getAttribute('data-cursor')?.trim();
    const interactive = target.closest('a, button, [role="button"], .cursor-pointer, [data-interactive]');
    cursor.dataset.mode = action ? 'action' : interactive ? 'interactive' : 'default';
    if (label.textContent !== (action || '')) label.textContent = action || '';
    // Flip the label at the viewport edges; its position never changes the dot.
    cursor.dataset.flipX = String(x > window.innerWidth - 140);
    cursor.dataset.flipY = String(y > window.innerHeight - 60);
    cursor.dataset.visible = 'true';
    if (!document.body.classList.contains('has-custom-cursor')) document.body.classList.add('has-custom-cursor');
  };

  const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
  const move = (event: PointerEvent) => {
    if (event.pointerType === 'touch' || !media.matches) return hide();
    x = event.clientX;
    y = event.clientY;
    target = event.target instanceof Element ? event.target : null;
    hitTest = !target;
    hasPosition = true;
    schedule();
  };
  const scroll = () => {
    if (!hasPosition) return;
    hitTest = true;
    schedule();
  };
  const keydown = (event: KeyboardEvent) => {
    if (event.key === 'Tab') hide();
  };

  window.addEventListener('pointermove', move, { passive: true });
  window.addEventListener('pointerdown', move, { passive: true });
  document.documentElement.addEventListener('pointerleave', hide);
  document.addEventListener('scroll', scroll, { passive: true, capture: true });
  document.addEventListener('keydown', keydown);
  document.addEventListener('visibilitychange', hide);
  window.addEventListener('blur', hide);
  window.addEventListener('resize', hide);
  media.addEventListener('change', hide);

  return () => {
    hide();
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerdown', move);
    document.documentElement.removeEventListener('pointerleave', hide);
    document.removeEventListener('scroll', scroll, true);
    document.removeEventListener('keydown', keydown);
    document.removeEventListener('visibilitychange', hide);
    window.removeEventListener('blur', hide);
    window.removeEventListener('resize', hide);
    media.removeEventListener('change', hide);
  };
}
