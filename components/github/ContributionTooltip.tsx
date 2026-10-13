'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { ContributionDay } from '@/lib/github/types';

export interface TooltipPosition {
  x: number;
  y: number;
  rect?: {
    left: number;
    top: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
  };
}

interface ContributionTooltipProps {
  day: ContributionDay | null;
  position: TooltipPosition | null;
}

export const ContributionTooltip: React.FC<ContributionTooltipProps> = ({ day, position }) => {
  if (!day || !position) return null;

  const dateParts = day.date.split('-');
  const year = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1;
  const dayOfMonth = parseInt(dateParts[2], 10);
  const dateObj = new Date(Date.UTC(year, month, dayOfMonth));

  const formattedDate = dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  });

  const countText =
    day.contributionCount === 0
      ? 'No contributions'
      : day.contributionCount === 1
      ? '1 contribution'
      : `${day.contributionCount} contributions`;

  // Default coordinate calculations
  let left = position.x;
  let top = position.y - 8;
  let placement: 'top' | 'bottom' = 'top';

  if (typeof window !== 'undefined') {
    const viewportWidth = window.innerWidth;
    const estimatedWidth = 180;
    const padding = 12;

    // Viewport edge collision detection - horizontal clamping
    if (left - estimatedWidth / 2 < padding) {
      left = padding + estimatedWidth / 2;
    } else if (left + estimatedWidth / 2 > viewportWidth - padding) {
      left = viewportWidth - padding - estimatedWidth / 2;
    }

    // Viewport edge collision detection - vertical flipping
    const topEdge = position.rect ? position.rect.top : position.y;
    const estimatedHeight = 52;
    if (topEdge - estimatedHeight - 12 < 0) {
      placement = 'bottom';
      const bottomEdge = position.rect ? position.rect.bottom : position.y + 14;
      top = bottomEdge + 8;
    }
  }

  const tooltipElement = (
    <div
      role="tooltip"
      aria-hidden="false"
      className="fixed z-[9999] pointer-events-none select-none px-3 py-2 text-left shadow-2xl transition-opacity duration-150 ease-out rounded-lg border"
      style={{
        left: `${left}px`,
        top: `${top}px`,
        transform: placement === 'top' ? 'translate(-50%, -100%)' : 'translate(-50%, 0)',
        backgroundColor: '#0D1117',
        borderColor: 'rgba(255, 255, 255, 0.15)',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
        width: 'max-content',
        maxWidth: '240px',
        minWidth: '130px',
      }}
    >
      <div className="font-mono-code text-[11px] font-medium text-neutral-300 tracking-tight">
        {formattedDate}
      </div>
      <div className="font-mono-code text-xs font-semibold text-white mt-0.5 tracking-tight">
        {countText}
      </div>
    </div>
  );

  // Portal to document.body in browser so it is never trapped by container overflow, transforms, or stacking contexts.
  if (typeof document !== 'undefined' && document.body) {
    return createPortal(tooltipElement, document.body);
  }

  return tooltipElement;
};
