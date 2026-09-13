'use client';

// ─────────────────────────────────────────────────────────────────────────────
// Liquid Glass — Public API Barrel
// ─────────────────────────────────────────────────────────────────────────────

export { LiquidGlassSurface } from './LiquidGlassSurface';
export { LiquidGlassFilter, getFilterUrl } from './LiquidGlassFilter';
export { generateDisplacementMap, clearDisplacementMapCache } from './displacement-map';
export { DEFAULT_LENS_CONFIG, computeLensHash, lensShapeEqual, adaptLensConfig } from './lens';
export { RefractiveProcessNode } from './RefractiveProcessNode';
export { RefractiveProcessFlow } from './RefractiveProcessFlow';
export { RefractiveButton } from './RefractiveButton';
export type { LensConfig, DisplacementMapData, LiquidGlassProps } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// LiquidGlass — Convenience wrapper component
// Wraps LiquidGlassSurface with simplified API for general use.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { LiquidGlassSurface } from './LiquidGlassSurface';
import { type LiquidGlassProps } from './types';

/**
 * LiquidGlass — Wrap any content with real optical refraction.
 *
 * Applies live DOM displacement via SVG feDisplacementMap.
 *
 * @example
 * ```tsx
 * <LiquidGlass depth={0.18} scale={12} className="rounded-md">
 *   <NavbarContent />
 * </LiquidGlass>
 * ```
 */
export const LiquidGlass: React.FC<LiquidGlassProps> = ({
  children,
  lens,
  depth,
  curvature,
  scale,
  chroma,
  edgeHighlight,
  className,
  id,
}) => {
  return (
    <LiquidGlassSurface
      lens={lens}
      depth={depth}
      curvature={curvature}
      scale={scale}
      chroma={chroma}
      edgeHighlight={edgeHighlight}
      className={className}
      id={id}
    >
      {children}
    </LiquidGlassSurface>
  );
};
