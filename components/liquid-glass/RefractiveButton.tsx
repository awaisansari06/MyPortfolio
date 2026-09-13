'use client';

import React, { useState, useEffect } from 'react';
import { type LensConfig, type DisplacementMapData } from './types';
import { generateDisplacementMap } from './displacement-map';
import { LiquidGlassFilter, getFilterUrl } from './LiquidGlassFilter';

const BTN_LENS_CONFIG: LensConfig = {
  width: 200,
  height: 48,
  borderRadius: 9999,
  depth: 0.28,
  curvature: 1.3,
  scale: 8, // Controlled optical distortion
  chroma: 0,
  glow: 0.06,
  edgeHighlight: 0.38,
  specularAngle: 45,
};

interface RefractiveButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
  'data-cursor'?: string;
  id?: string;
}

export const RefractiveButton: React.FC<RefractiveButtonProps> = ({
  children,
  onClick,
  href,
  target,
  rel,
  className = '',
  'data-cursor': dataCursor = 'VIEW',
  id,
}) => {
  const [mapData, setMapData] = useState<DisplacementMapData | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const map = generateDisplacementMap(BTN_LENS_CONFIG);
    if (map) {
      setMapData(map);
    }
  }, []);

  const filterUrl = mapData ? getFilterUrl('btn-lens', mapData.version) : undefined;

  const content = (
    <>
      {/* ── 1. Original Semantic Content (Always Accessible & 100% Visible) ── */}
      <span className="relative z-10 flex items-center justify-center gap-2 select-none">
        {children}
      </span>

      {/* ── 2. Optical Glass Lens (~200 × 48px) with Refraction Target ─────── */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full overflow-hidden pointer-events-none z-20 transition-all duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'scale(1.02)' : 'scale(0.98)',
          background: 'var(--glass-surface-weak)',
          border: '0.5px solid var(--glass-rim-strong)',
          boxShadow:
            'inset 0 1.5px 0 var(--glass-edge-highlight), inset 0 0 0 0.5px var(--glass-rim-strong), 0 6px 20px var(--glass-shadow)',
          backdropFilter: 'blur(1.5px) saturate(1.15)',
          WebkitBackdropFilter: 'blur(1.5px) saturate(1.15)',
        }}
      >
        {/* Synchronized Refraction Target: positioned identically, receives feDisplacementMap */}
        <span
          className="absolute inset-0 flex items-center justify-center gap-2 px-5 py-3 whitespace-nowrap text-neutral-950 dark:text-[#F5F3EF] font-semibold"
          style={{
            filter: filterUrl,
            opacity: 0.92,
          }}
        >
          {children}
        </span>

        {/* Specular top catch rim */}
        <span
          className="absolute top-0 inset-x-3 h-[1px] bg-white/90 dark:bg-white/70 rounded-full opacity-90"
          aria-hidden="true"
        />
      </span>
    </>
  );

  const baseClasses = `relative inline-flex items-center justify-center gap-2 px-5 py-3 font-mono-code text-xs tracking-wider cursor-pointer select-none rounded-full transition-all duration-300 liquid-glass-btn-secondary text-neutral-900 dark:text-[#F5F3EF] ${className}`;

  return (
    <>
      {mapData && (
        <LiquidGlassFilter
          surfaceId="btn-lens"
          mapData={mapData}
          config={BTN_LENS_CONFIG}
        />
      )}

      {href ? (
        <a
          id={id}
          href={href}
          target={target}
          rel={rel}
          data-cursor={dataCursor}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={baseClasses}
        >
          {content}
        </a>
      ) : (
        <button
          id={id}
          type="button"
          onClick={onClick}
          data-cursor={dataCursor}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={baseClasses}
        >
          {content}
        </button>
      )}
    </>
  );
};
