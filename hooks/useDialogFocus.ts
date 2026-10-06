'use client';

import { useEffect, useRef, type RefObject } from 'react';

const dialogs: HTMLElement[] = [];
const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
let scrollLocks = 0;
let previousOverflow = '';

/** Manage focus and Escape; modal dialogs also trap focus and lock scrolling. */
export function useDialogFocus(
  dialogRef: RefObject<HTMLDivElement | null>,
  open: boolean,
  onClose: () => void,
  returnFocusSelector?: string,
  modal = true,
) {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusable = () => Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector))
      .filter(element => element.getClientRects().length > 0 && !element.closest('[inert]'));
    const isTopmost = () => modal
      ? dialogs[dialogs.length - 1] === dialog
      : dialogs.length === 0 && dialog.contains(document.activeElement);
    const focusFirst = () => {
      const input = dialog.querySelector<HTMLElement>('textarea:not([disabled])');
      (input || focusable()[0] || dialog).focus({ preventScroll: true });
    };

    if (modal) {
      dialogs.push(dialog);
      if (scrollLocks++ === 0) {
        previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
      }
    }
    const frame = requestAnimationFrame(focusFirst);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isTopmost()) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onCloseRef.current();
      } else if (modal && event.key === 'Tab') {
        const elements = focusable();
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (!first) {
          event.preventDefault();
          dialog.focus({ preventScroll: true });
        } else if (!dialog.contains(document.activeElement) || document.activeElement === dialog ||
          (event.shiftKey && document.activeElement === first) ||
          (!event.shiftKey && document.activeElement === last)) {
          event.preventDefault();
          (event.shiftKey ? last : first).focus({ preventScroll: true });
        }
      }
    };
    const handleFocus = (event: FocusEvent) => {
      if (isTopmost() && event.target instanceof Node && !dialog.contains(event.target)) {
        focusFirst();
      }
    };
    document.addEventListener('keydown', handleKeyDown, true);
    if (modal) document.addEventListener('focusin', handleFocus);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('focusin', handleFocus);
      const shouldRestoreFocus = modal ? isTopmost() : dialogs.length === 0 &&
        (dialog.contains(document.activeElement) || document.activeElement === document.body);
      const index = dialogs.lastIndexOf(dialog);
      if (index >= 0) dialogs.splice(index, 1);
      if (modal && --scrollLocks === 0) document.body.style.overflow = previousOverflow;
      if (shouldRestoreFocus) {
        const target = previousFocus?.isConnected && previousFocus.getClientRects().length
          ? previousFocus
          : returnFocusSelector ? document.querySelector<HTMLElement>(returnFocusSelector) : null;
        target?.focus({ preventScroll: true });
      }
    };
  }, [dialogRef, open, returnFocusSelector, modal]);
}
