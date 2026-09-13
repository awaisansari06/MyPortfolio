'use client';

import React, { useState, useEffect, useRef } from 'react';
import { type LensConfig, type DisplacementMapData } from './types';
import { generateDisplacementMap } from './displacement-map';
import { LiquidGlassFilter, getFilterUrl } from './LiquidGlassFilter';

const PROC_FLOW_LENS: LensConfig = {
  width: 130,
  height: 28,
  borderRadius: 14,
  depth: 0.30,
  curvature: 1.3,
  scale: 8, // Controlled optical refraction
  chroma: 0,
  glow: 0.08,
  edgeHighlight: 0.38,
  specularAngle: 45,
};

interface RefractiveProcessFlowProps {
  steps: string[];
  initialIndex?: number;
}

export const RefractiveProcessFlow: React.FC<RefractiveProcessFlowProps> = ({
  steps,
  initialIndex = 0,
}) => {
  const [mapData, setMapData] = useState<DisplacementMapData | null>(null);
  const [activeIdx, setActiveIdx] = useState(initialIndex);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [lensStyle, setLensStyle] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    visible: false,
  });

  const trackRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const map = generateDisplacementMap(PROC_FLOW_LENS);
    if (map) {
      setMapData(map);
    }
  }, []);

  useEffect(() => {
    const updateLens = () => {
      const targetIdx = hoverIdx !== null ? hoverIdx : activeIdx;
      const stepEl = stepRefs.current[targetIdx];
      const trackEl = trackRef.current;
      if (!stepEl || !trackEl) {
        setLensStyle(prev => ({ ...prev, visible: false }));
        return;
      }

      const stepRect = stepEl.getBoundingClientRect();
      const trackRect = trackEl.getBoundingClientRect();

      setLensStyle({
        left: stepRect.left - trackRect.left - 4,
        top: stepRect.top - trackRect.top - 2,
        width: stepRect.width + 8,
        height: stepRect.height + 4,
        visible: true,
      });
    };

    const id = requestAnimationFrame(updateLens);
    return () => cancelAnimationFrame(id);
  }, [activeIdx, hoverIdx, steps]);

  const filterUrl = mapData ? getFilterUrl('proc-flow', mapData.version) : undefined;

  return (
    <>
      {mapData && (
        <LiquidGlassFilter
          surfaceId="proc-flow"
          mapData={mapData}
          config={PROC_FLOW_LENS}
        />
      )}

      <div
        ref={trackRef}
        onMouseLeave={() => setHoverIdx(null)}
        className="relative flex flex-wrap items-center gap-2 text-xs font-mono-code"
      >
        {/* ── 1. Real Semantic DOM Content (Accessible & Visible) ─────────────── */}
        {steps.map((step, idx) => {
          const isCurrent = (hoverIdx !== null ? hoverIdx : activeIdx) === idx;
          return (
            <React.Fragment key={step}>
              <button
                ref={el => { stepRefs.current[idx] = el; }}
                type="button"
                onClick={() => setActiveIdx(idx)}
                onMouseEnter={() => setHoverIdx(idx)}
                data-cursor="NODE"
                aria-pressed={isCurrent}
                className={`relative px-2.5 py-1 font-medium rounded-full cursor-pointer transition-colors duration-200 select-none ${
                  isCurrent
                    ? 'text-neutral-950 dark:text-[#F5F3EF] font-semibold'
                    : 'text-neutral-600 dark:text-[#A3A3A3] hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {step}
              </button>
              {idx < steps.length - 1 && (
                <span className="text-neutral-400 dark:text-[#666666] select-none">➔</span>
              )}
            </React.Fragment>
          );
        })}

        {/* ── 2. Moving Optical Glass Selection Lens (~120 × 28px) ───────────── */}
        {lensStyle.visible && (
          <div
            aria-hidden="true"
            className="pointer-events-none overflow-hidden"
            style={{
              position: 'absolute',
              left: lensStyle.left,
              top: lensStyle.top,
              width: lensStyle.width,
              height: lensStyle.height,
              borderRadius: '9999px',
              transition:
                'left 0.32s cubic-bezier(0.16,1,0.3,1), top 0.32s cubic-bezier(0.16,1,0.3,1), width 0.30s cubic-bezier(0.16,1,0.3,1)',
              background: 'var(--glass-surface-weak)',
              border: '0.5px solid var(--glass-rim-strong)',
              boxShadow:
                'inset 0 1px 0 var(--glass-edge-highlight), 0 2px 8px var(--glass-shadow-sm)',
              backdropFilter: 'blur(2px) saturate(1.15)',
              WebkitBackdropFilter: 'blur(2px) saturate(1.15)',
              zIndex: 10,
            }}
          >
            {/* Synchronized Refraction Target: The underlying track offset to align with viewport */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                transform: `translate(${-lensStyle.left}px, ${-lensStyle.top}px)`,
                transition: 'transform 0.32s cubic-bezier(0.16,1,0.3,1)',
                filter: filterUrl,
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono-code">
                {steps.map((step, idx) => (
                  <React.Fragment key={step}>
                    <span className="px-2.5 py-1 font-semibold text-neutral-950 dark:text-[#F5F3EF]">
                      {step}
                    </span>
                    {idx < steps.length - 1 && (
                      <span className="text-neutral-400 dark:text-[#666666]">➔</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Specular top catch rim */}
            <div
              className="absolute top-0 inset-x-2 h-[1px] bg-white/90 dark:bg-white/60 rounded-full opacity-80 pointer-events-none"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
    </>
  );
};
