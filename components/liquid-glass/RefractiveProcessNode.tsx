'use client';

import React, { useState, useEffect, useRef } from 'react';
import { type LensConfig, type DisplacementMapData } from './types';
import { generateDisplacementMap } from './displacement-map';
import { LiquidGlassFilter, getFilterUrl } from './LiquidGlassFilter';

const NODE_LENS_CONFIG: LensConfig = {
  width: 120,
  height: 28,
  borderRadius: 14,
  depth: 0.32,
  curvature: 1.3,
  scale: 8, // Controlled, readable optical displacement
  chroma: 0,
  glow: 0.08,
  edgeHighlight: 0.38,
  specularAngle: 45,
};

interface RefractiveProcessNodeProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const RefractiveProcessNode: React.FC<RefractiveProcessNodeProps> = ({
  label,
  isActive = false,
  onClick,
}) => {
  const [mapData, setMapData] = useState<DisplacementMapData | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const nodeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const map = generateDisplacementMap(NODE_LENS_CONFIG);
    if (map) {
      setMapData(map);
    }
  }, []);

  const filterUrl = mapData ? getFilterUrl('procnode', mapData.version) : undefined;
  const isElevated = isActive || isHovered;

  return (
    <>
      {/* SVG feDisplacementMap filter */}
      {mapData && (
        <LiquidGlassFilter
          surfaceId="procnode"
          mapData={mapData}
          config={NODE_LENS_CONFIG}
        />
      )}

      <button
        ref={nodeRef}
        type="button"
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        data-cursor="NODE"
        aria-pressed={isActive}
        className={`group/node relative px-2.5 py-1 text-xs font-mono-code rounded-full transition-all duration-300 cursor-pointer select-none text-left inline-flex items-center justify-center ${
          isElevated
            ? 'text-neutral-950 dark:text-[#F5F3EF]'
            : 'text-neutral-700 dark:text-[#C5C3BF] hover:text-neutral-950 dark:hover:text-white'
        }`}
        style={{ position: 'relative' }}
      >
        {/* Base badge background */}
        <span
          className={`absolute inset-0 rounded-full transition-all duration-300 ${
            isElevated
              ? 'bg-black/5 dark:bg-white/10 border border-neutral-400/50 dark:border-white/30 shadow-[0_2px_8px_var(--glass-shadow-sm)]'
              : 'liquid-glass-badge'
          }`}
          aria-hidden="true"
        />

        {/* 1. Visible semantic content (always readable and accessible) */}
        <span className={`relative z-10 transition-opacity duration-200 ${isElevated ? 'opacity-0' : 'opacity-100'}`}>
          {label}
        </span>

        {/* 2. Refraction Target / Optical Glass Lens (visible only when hovered or active) */}
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full overflow-hidden pointer-events-none z-20 transition-all duration-200"
          style={{
            opacity: isElevated ? 1 : 0,
            transform: isElevated ? 'scale(1.02)' : 'scale(0.98)',
            backdropFilter: 'blur(2px) saturate(1.15)',
            WebkitBackdropFilter: 'blur(2px) saturate(1.15)',
            boxShadow:
              'inset 0 1px 0 var(--glass-edge-highlight), inset 0 0 0 0.5px var(--glass-rim-strong), 0 4px 12px var(--glass-shadow)',
          }}
        >
          {/* Synchronized Refraction Target receiving SVG displacement filter */}
          <span
            className="absolute inset-0 flex items-center justify-center px-2.5 py-1 whitespace-nowrap font-medium text-neutral-950 dark:text-white will-change-transform"
            style={{
              filter: filterUrl,
            }}
          >
            {label}
          </span>

          {/* Top specular highlight rim */}
          <span
            className="absolute top-0 inset-x-2 h-[1px] bg-white/90 dark:bg-white/70 rounded-full opacity-90"
            aria-hidden="true"
          />
        </span>
      </button>
    </>
  );
};
