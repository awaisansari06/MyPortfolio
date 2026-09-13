// ─────────────────────────────────────────────────────────────────────────────
// Liquid Glass — Displacement Map Generator
// Inspired by Aave's "Building Glass for the Web" technique
//
// Generates a small offscreen canvas encoding the per-pixel displacement
// vectors for the glass lens:
//
//   RED   channel → horizontal (X) displacement
//   GREEN channel → vertical   (Y) displacement
//   BLUE  channel → specular highlight intensity
//   ALPHA channel → lens mask (255 = inside lens, 0 = outside)
//
// The feDisplacementMap SVG primitive reads R/G and produces optical refraction.
//
// KEY OPTIMISATION — Four-Fold Symmetry:
//   A rounded rectangle has left-right and top-bottom symmetry.
//   Therefore:
//     1. We compute only the TOP-LEFT quadrant (W/2 × H/2 pixels).
//     2. We mirror to TOP-RIGHT by inverting X displacement (R → 255-R).
//     3. We mirror to BOTTOM-LEFT by inverting Y displacement (G → 255-G).
//     4. We mirror to BOTTOM-RIGHT by inverting both.
//   This reduces computation by ~75%.
//
// KEY RULE — Regenerate vs Reuse:
//   This module is called ONLY when the lens SHAPE changes.
//   When the lens merely MOVES or SCROLLS, the same map is reused.
//   See: LiquidGlassSurface.tsx for how this is enforced.
// ─────────────────────────────────────────────────────────────────────────────

import { type LensConfig, type DisplacementMapData } from './types';
import { computeSurfaceNormal, adaptLensConfig, computeLensHash } from './lens';

// ─── Internal cache ───────────────────────────────────────────────────────────

/**
 * Module-level cache keyed by lens hash.
 * Prevents regenerating the same map across React re-renders if dimensions
 * and config have not changed.
 */
const mapCache = new Map<string, DisplacementMapData>();

/** Monotonically incrementing version counter for Safari filter ID versioning */
let globalVersion = 0;

// ─── Resolution Scaling ───────────────────────────────────────────────────────

/**
 * Compute the canvas resolution to use for the displacement map.
 *
 * Per the Aave technique: avoid unnecessarily large map canvases.
 * We use a scaled-down map since feDisplacementMap interpolates smoothly.
 * On mobile we scale down further for performance.
 */
function getMapResolution(width: number, height: number): { w: number; h: number } {
  const isMobile =
    typeof window !== 'undefined' &&
    (navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches);

  // Mobile: quarter resolution (max 128px in either dimension)
  // Desktop: half resolution (max 256px in either dimension)
  const divisor = isMobile ? 4 : 2;
  const maxDim = isMobile ? 96 : 220;

  const rawW = Math.ceil(width / divisor);
  const rawH = Math.ceil(height / divisor);

  // Clamp to maxDim while preserving aspect ratio
  const scale = Math.min(1, maxDim / Math.max(rawW, rawH));

  return {
    w: Math.max(4, Math.round(rawW * scale)),
    h: Math.max(4, Math.round(rawH * scale)),
  };
}

// ─── Main Generator ───────────────────────────────────────────────────────────

/**
 * Generate (or retrieve from cache) a displacement map PNG data URI for the
 * given lens configuration.
 *
 * Returns null if canvas is not available (SSR, test environments).
 */
export function generateDisplacementMap(
  rawConfig: LensConfig,
): DisplacementMapData | null {
  if (typeof document === 'undefined') return null;

  // Adapt config for device capability
  const config = adaptLensConfig(rawConfig);

  // Check cache — if lens hash matches, return the cached map
  const hash = computeLensHash(config);
  const cached = mapCache.get(hash);
  if (cached) return cached;

  // ── Compute canvas dimensions ────────────────────────────────────────────

  const { w: canvasW, h: canvasH } = getMapResolution(config.width, config.height);
  const halfW = Math.ceil(canvasW / 2);
  const halfH = Math.ceil(canvasH / 2);

  // ── Create offscreen canvas ──────────────────────────────────────────────

  const canvas = document.createElement('canvas');
  canvas.width = canvasW;
  canvas.height = canvasH;

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const imageData = ctx.createImageData(canvasW, canvasH);
  const data = imageData.data; // Uint8ClampedArray, RGBA

  // ── Specular precompute ──────────────────────────────────────────────────

  const specRadians = (config.specularAngle * Math.PI) / 180;
  const specDirX = Math.cos(specRadians);
  const specDirY = -Math.sin(specRadians); // canvas Y is flipped

  // ── Four-fold symmetry: compute top-left quadrant ────────────────────────
  //
  // We iterate over the quadrant [0, halfW) × [0, halfH) in scaled-map space,
  // convert to full-lens pixel space, compute the surface normal, then encode
  // R/G/B/A channels. We then mirror to the other three quadrants.

  // Scale factors: map pixel → lens pixel
  const scaleX = config.width / canvasW;
  const scaleY = config.height / canvasH;

  for (let mapY = 0; mapY < halfH; mapY++) {
    for (let mapX = 0; mapX < halfW; mapX++) {
      // Convert map pixel to lens pixel (center of the map pixel)
      const lensX = (mapX + 0.5) * scaleX;
      const lensY = (mapY + 0.5) * scaleY;

      const { nx, ny, nz, height, inside } = computeSurfaceNormal(lensX, lensY, config);

      if (!inside || (nx === 0 && ny === 0)) {
        // Outside lens — neutral: R=128, G=128 → zero displacement
        // Alpha = 0 so lens mask is transparent outside
        writeQuadrantPixels(data, canvasW, canvasH, mapX, mapY, halfW, halfH, {
          r: 128, g: 128, b: 0, a: 0,
        });
        continue;
      }

      // ── Encode displacement ──────────────────────────────────────────────
      // feDisplacementMap interprets:
      //   R = 0   → maximum negative X displacement
      //   R = 128 → zero X displacement
      //   R = 255 → maximum positive X displacement
      // Similarly for G → Y.

      const r = Math.round(128 + 127 * nx);
      const g = Math.round(128 + 127 * ny);

      // ── Specular / edge highlight ────────────────────────────────────────
      // Use dot product of surface normal with light direction to compute specular
      const nDotL = Math.max(0, nx * specDirX + ny * specDirY + nz * 0.5);
      const specular = Math.pow(nDotL, 6); // tight specular lobe
      const edgeSpec = height < config.depth * 0.3 ? config.edgeHighlight : 0;
      const brightness = Math.round(255 * Math.min(1, specular * 0.7 + edgeSpec));

      // Alpha: full opacity inside lens for mask
      const a = 255;

      // ── Write all four quadrant pixels via symmetry ──────────────────────
      writeQuadrantPixels(data, canvasW, canvasH, mapX, mapY, halfW, halfH, {
        r, g, b: brightness, a,
      });
    }
  }

  ctx.putImageData(imageData, 0, 0);
  const dataUri = canvas.toDataURL('image/png');

  globalVersion++;
  const result: DisplacementMapData = {
    dataUri,
    width: canvasW,
    height: canvasH,
    version: globalVersion,
    hash,
  };

  mapCache.set(hash, result);

  // Prevent unbounded cache growth — evict oldest entries beyond 32
  if (mapCache.size > 32) {
    const firstKey = mapCache.keys().next().value;
    if (firstKey !== undefined) mapCache.delete(firstKey);
  }

  return result;
}

// ─── Quadrant pixel writer ────────────────────────────────────────────────────

interface PixelRGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
 * Write pixel values for all four symmetry quadrants simultaneously.
 *
 * For the horizontal mirror (right side), we negate X displacement:
 *   R_right = 255 - R_left  (direction flipped)
 *   G_right = G_left        (vertical same)
 *
 * For the vertical mirror (bottom), we negate Y displacement:
 *   R_bottom = R_top         (horizontal same)
 *   G_bottom = 255 - G_top  (direction flipped)
 *
 * For diagonal mirror (bottom-right): negate both.
 */
function writeQuadrantPixels(
  data: Uint8ClampedArray,
  canvasW: number,
  canvasH: number,
  mapX: number,
  mapY: number,
  halfW: number,
  halfH: number,
  { r, g, b, a }: PixelRGBA,
): void {
  // Mirror positions
  const mirrorX = canvasW - 1 - mapX;
  const mirrorY = canvasH - 1 - mapY;

  // Inverted displacement values
  const rMirror = a === 0 ? 128 : (255 - r); // flip X
  const gMirror = a === 0 ? 128 : (255 - g); // flip Y

  // Top-left
  writePx(data, canvasW, mapX, mapY, r, g, b, a);

  // Top-right (mirror X)
  if (mirrorX !== mapX) {
    writePx(data, canvasW, mirrorX, mapY, rMirror, g, b, a);
  }

  // Bottom-left (mirror Y)
  if (mirrorY !== mapY) {
    writePx(data, canvasW, mapX, mirrorY, r, gMirror, b, a);
  }

  // Bottom-right (mirror both)
  if (mirrorX !== mapX && mirrorY !== mapY) {
    writePx(data, canvasW, mirrorX, mirrorY, rMirror, gMirror, b, a);
  }
}

/** Write RGBA into an ImageData buffer at (x, y) */
function writePx(
  data: Uint8ClampedArray,
  width: number,
  x: number,
  y: number,
  r: number,
  g: number,
  b: number,
  a: number,
): void {
  const idx = (y * width + x) * 4;
  data[idx]     = r;
  data[idx + 1] = g;
  data[idx + 2] = b;
  data[idx + 3] = a;
}

/** Clear the displacement map cache (e.g. on window resize) */
export function clearDisplacementMapCache(): void {
  mapCache.clear();
}
