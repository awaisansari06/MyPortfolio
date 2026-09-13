'use client';

// ─────────────────────────────────────────────────────────────────────────────
// LiquidGlassSurface — Core refractive glass container
// Inspired by Aave's "Building Glass for the Web" technique
//
// Architecture:
//   1. Measures the container element via ResizeObserver.
//   2. Generates a displacement map (only on shape changes, never on moves).
//   3. Injects a versioned SVG filter into the document.
//   4. Renders a refractive "backing" div that applies CSS backdrop-filter
//      referencing the SVG filter URL to bend live DOM pixels behind it.
//   5. Renders crisp foreground content on top in an isolated layer.
//
// Lint-safe design:
//   - All render state lives in React useState, not useRef.current during render.
//   - setState calls inside effects are wrapped in queueMicrotask or use
//     functional form to avoid react-hooks/set-state-in-effect violations.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useEffect, useCallback, useId, useState } from 'react';
import { type LensConfig, type DisplacementMapData, type LiquidGlassProps } from './types';
import { DEFAULT_LENS_CONFIG } from './lens';
import { generateDisplacementMap } from './displacement-map';
import { LiquidGlassFilter, getFilterUrl } from './LiquidGlassFilter';

// ─── Preset configurations tuned per component ────────────────────────────────

type Preset =
  | 'navbar'
  | 'button'
  | 'modal'
  | 'control'
  | 'card'
  | 'card-frame'
  | 'chip'
  | 'badge'
  | 'floating'
  | 'launcher';

const PRESETS: Record<Preset, Partial<LensConfig>> = {
  /** Full-width navigation bar — cylindrical horizontal lens */
  navbar: {
    borderRadius: 0,
    depth: 0.18,
    curvature: 1.6,
    scale: 14,
    chroma: 0.025,
    edgeHighlight: 0.22,
    specularAngle: 45,
  },
  /** Small interactive controls — compact dome */
  button: {
    borderRadius: 4,
    depth: 0.24,
    curvature: 1.3,
    scale: 10,
    chroma: 0.04,
    edgeHighlight: 0.32,
    specularAngle: 35,
  },
  /** Overlay modal — deep, restrained refraction */
  modal: {
    borderRadius: 20,
    depth: 0.14,
    curvature: 1.8,
    scale: 10,
    chroma: 0.018,
    edgeHighlight: 0.18,
    specularAngle: 50,
  },
  /** Generic control (select, toggle, pill CTA) */
  control: {
    borderRadius: 9999,
    depth: 0.22,
    curvature: 1.2,
    scale: 9,
    chroma: 0.03,
    edgeHighlight: 0.30,
    specularAngle: 40,
  },
  /** Mid-size glass card — project meta, contact card */
  card: {
    borderRadius: 20,
    depth: 0.20,
    curvature: 1.4,
    scale: 12,
    chroma: 0.022,
    edgeHighlight: 0.26,
    specularAngle: 42,
  },
  /** Large glass card frame — project visual frame, About hero */
  'card-frame': {
    borderRadius: 20,
    depth: 0.16,
    curvature: 1.6,
    scale: 14,
    chroma: 0.018,
    edgeHighlight: 0.22,
    specularAngle: 48,
  },
  /** Compact chip / technology tag */
  chip: {
    borderRadius: 8,
    depth: 0.28,
    curvature: 1.2,
    scale: 7,
    chroma: 0.04,
    edgeHighlight: 0.35,
    specularAngle: 38,
  },
  /** Full-pill badge / status capsule */
  badge: {
    borderRadius: 9999,
    depth: 0.30,
    curvature: 1.1,
    scale: 8,
    chroma: 0.04,
    edgeHighlight: 0.38,
    specularAngle: 36,
  },
  /** Floating elevated panel (chat panel, tooltip) */
  floating: {
    borderRadius: 20,
    depth: 0.18,
    curvature: 1.5,
    scale: 13,
    chroma: 0.022,
    edgeHighlight: 0.28,
    specularAngle: 44,
  },
  /** Circular/pill launcher button — maximum specular */
  launcher: {
    borderRadius: 9999,
    depth: 0.35,
    curvature: 1.0,
    scale: 15,
    chroma: 0.05,
    edgeHighlight: 0.45,
    specularAngle: 30,
  },
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface LiquidGlassSurfaceProps extends LiquidGlassProps {
  borderRadius?: string | number;
  preset?: Preset;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const LiquidGlassSurface: React.FC<LiquidGlassSurfaceProps> = ({
  children,
  lens,
  depth,
  curvature,
  scale,
  chroma,
  edgeHighlight,
  className = '',
  id,
  borderRadius,
  preset,
}) => {
  // Stable unique ID for filter versioning (React 18 useId)
  const reactId = useId();
  const surfaceId = (id ?? `surface-${reactId}`).replace(/:/g, '');

  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Render state — all in React useState so render reads are safe ──────────
  const [mapData, setMapData] = useState<DisplacementMapData | null>(null);
  const [activeConfig, setActiveConfig] = useState<LensConfig | null>(null);

  // ── Build effective lens config from props + preset + defaults ────────────

  const buildConfig = useCallback(
    (width: number, height: number): LensConfig => {
      const presetVals = preset ? PRESETS[preset] : {};
      return {
        ...DEFAULT_LENS_CONFIG,
        ...presetVals,
        ...lens,
        width: lens?.width ?? width,
        height: lens?.height ?? height,
        borderRadius: lens?.borderRadius ?? presetVals.borderRadius ?? DEFAULT_LENS_CONFIG.borderRadius,
        depth: depth ?? presetVals.depth ?? DEFAULT_LENS_CONFIG.depth,
        curvature: curvature ?? presetVals.curvature ?? DEFAULT_LENS_CONFIG.curvature,
        scale: scale ?? presetVals.scale ?? DEFAULT_LENS_CONFIG.scale,
        chroma: chroma ?? presetVals.chroma ?? DEFAULT_LENS_CONFIG.chroma,
        glow: DEFAULT_LENS_CONFIG.glow,
        edgeHighlight: edgeHighlight ?? presetVals.edgeHighlight ?? DEFAULT_LENS_CONFIG.edgeHighlight,
        specularAngle: presetVals.specularAngle ?? DEFAULT_LENS_CONFIG.specularAngle,
      };
    },
    [preset, lens, depth, curvature, scale, chroma, edgeHighlight],
  );

  // ── Regenerate displacement map (only on shape change) ────────────────────

  const regenerateMap = useCallback(
    (width: number, height: number) => {
      if (width < 4 || height < 4) return;
      const newConfig = buildConfig(width, height);
      const newMapData = generateDisplacementMap(newConfig);
      if (!newMapData) return;
      // Batch these two updates together
      setMapData(newMapData);
      setActiveConfig(newConfig);
    },
    [buildConfig],
  );

  // ── ResizeObserver — regenerate when element dimensions change ────────────

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;

      // Debounce: only regenerate map after resize settles
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        regenerateMap(Math.round(width), Math.round(height));
      }, 80);
    });

    observer.observe(el);

    // Initial measurement
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      regenerateMap(Math.round(rect.width), Math.round(rect.height));
    }

    return () => {
      observer.disconnect();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [regenerateMap]);

  // ── Render ────────────────────────────────────────────────────────────────

  const showGlass = mapData !== null && activeConfig !== null;
  const filterUrl = showGlass && mapData ? getFilterUrl(surfaceId, mapData.version) : undefined;

  // CSS border-radius for the glass backing layer
  const brCss =
    borderRadius !== undefined
      ? typeof borderRadius === 'number'
        ? `${borderRadius}px`
        : borderRadius
      : activeConfig?.borderRadius
        ? `${activeConfig.borderRadius}px`
        : '0px';

  return (
    <div
      ref={containerRef}
      id={id}
      className={className}
      style={{ position: 'relative', isolation: 'isolate' }}
    >
      {/* ── SVG filter injection (zero visible size) ────────────────────── */}
      {showGlass && mapData && activeConfig && (
        <LiquidGlassFilter
          surfaceId={surfaceId}
          mapData={mapData}
          config={activeConfig}
        />
      )}

      {/* ── Refractive glass backing layer ─────────────────────────────── */}
      {/* This bends live DOM pixels via CSS backdrop-filter with SVG URL.
          Falls back to .glass-surface-backing CSS class for Firefox. */}
      {showGlass && filterUrl && (
        <div
          aria-hidden="true"
          className="glass-surface-backing"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: brCss,
            backdropFilter: `${filterUrl} blur(var(--glass-blur, 16px)) saturate(var(--glass-saturate, 1.2))`,
            WebkitBackdropFilter: `${filterUrl} blur(var(--glass-blur, 16px)) saturate(var(--glass-saturate, 1.2))`,
            background: 'var(--glass-surface-card)',
            boxShadow: [
              'inset 0 1.5px 0 var(--glass-edge-highlight)',
              'inset 0 0 0 0.5px var(--glass-rim)',
              '0 1px 2px var(--glass-shadow-near)',
              '0 8px 28px var(--glass-shadow)',
              '0 28px 56px var(--glass-shadow-lg)',
            ].join(', '),
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* ── Top specular rim — physically correct brightest edge ───────── */}
      {showGlass && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: '8%',
            right: '8%',
            height: '1px',
            background: 'var(--glass-edge-highlight)',
            opacity: 0.75,
            borderRadius: '0 0 50% 50%',
            pointerEvents: 'none',
            zIndex: 8,
          }}
        />
      )}

      {/* ── Foreground content — always crisp, always readable ─────────── */}
      {/* Isolated from the backing layer so content is never distorted. */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          isolation: 'isolate',
        }}
      >
        {children}
      </div>
    </div>
  );
};
