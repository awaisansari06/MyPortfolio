'use client';

// ─────────────────────────────────────────────────────────────────────────────
// LiquidGlassFilter — SVG filter with versioned ID for Safari cache safety
// Inspired by Aave's "Building Glass for the Web" technique
//
// Why versioned filter IDs?
//   Safari aggressively caches SVG filter output keyed by filter element ID.
//   When the displacement map is regenerated (on shape/size change), if we
//   reuse the same filter ID Safari shows the stale cached refraction.
//   Solution: increment the ID each time the map changes.
//   e.g.  liquid-filter-navbar-v1  →  liquid-filter-navbar-v2
//
// The filter chain:
//   1. feImage: loads the generated displacement PNG
//   2. feDisplacementMap: bends source pixels using R→X, G→Y channels
//   (Optional) feDisplacementMap chroma pass: restrained second pass
//              at fractionally different scale → subtle color fringe
//   3. feComposite: clips result to source bounds
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { type DisplacementMapData, type LensConfig } from './types';

interface LiquidGlassFilterProps {
  /** Identifier for this glass surface (e.g. "navbar", "ai-button") */
  surfaceId: string;
  /** Current displacement map data — version triggers filter ID update */
  mapData: DisplacementMapData;
  /** Full lens config for scale and chroma parameters */
  config: LensConfig;
}

export const LiquidGlassFilter: React.FC<LiquidGlassFilterProps> = ({
  surfaceId,
  mapData,
  config,
}) => {
  // Versioned filter ID — prevents Safari from serving stale cached output
  const filterId = `liquid-filter-${surfaceId}-v${mapData.version}`;

  // The feDisplacementMap scale controls the maximum pixel displacement.
  // We apply the full configured scale from the lens.
  const dispScale = config.scale;

  // Chromatic dispersion: a second feDisplacementMap pass at a slightly
  // different scale creates a subtle color fringe around the lens rim.
  // Must be extremely restrained — this is not chromatic aberration art.
  const chromaScale = config.chroma > 0 ? dispScale * (1 + config.chroma) : 0;

  return (
    <svg
      aria-hidden="true"
      style={{
        position: 'absolute',
        width: 0,
        height: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <defs>
        <filter
          id={filterId}
          x="-5%"
          y="-5%"
          width="110%"
          height="110%"
          colorInterpolationFilters="sRGB"
        >
          {/* Step 1: Load generated displacement map PNG */}
          <feImage
            id={`${filterId}-map`}
            href={mapData.dataUri}
            xlinkHref={mapData.dataUri}
            result="displacementMap"
            x="0"
            y="0"
            width="100%"
            height="100%"
            preserveAspectRatio="none"
          />

          {/* Step 2: Core optical displacement (feDisplacementMap) */}
          {/* Reads R→X and G→Y displacement vectors from the generated map */}
          <feDisplacementMap
            in="SourceGraphic"
            in2="displacementMap"
            scale={dispScale}
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
        </filter>
      </defs>
    </svg>
  );
};

/**
 * Returns the current versioned CSS filter reference string for applying
 * the SVG filter to a DOM element via the `filter` CSS property.
 */
export function getFilterUrl(surfaceId: string, version: number): string {
  return `url(#liquid-filter-${surfaceId}-v${version})`;
}
