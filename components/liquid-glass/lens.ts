// ─────────────────────────────────────────────────────────────────────────────
// Liquid Glass — Lens Mathematics
// Inspired by Aave's "Building Glass for the Web" technique
//
// This module handles the mathematical modeling of the glass lens:
// - Rounded rectangle Signed Distance Field (SDF)
// - Surface normal vectors at each point
// - Refracted ray directions based on curvature
// - Parameter hashing for displacement-map cache invalidation
// ─────────────────────────────────────────────────────────────────────────────

import { type LensConfig } from './types';

// ─── Defaults ─────────────────────────────────────────────────────────────────

/** Default lens parameters tuned for this portfolio's restrained aesthetic */
export const DEFAULT_LENS_CONFIG: Omit<LensConfig, 'width' | 'height'> = {
  borderRadius: 8,
  depth: 0.22,
  curvature: 1.5,
  scale: 16,
  chroma: 0.02,
  glow: 0.10,
  edgeHighlight: 0.28,
  specularAngle: 45,
};

// ─── Mobile / reduced-motion overrides ────────────────────────────────────────

/** Detect touch/coarse pointer once at module load */
const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return (
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(pointer: coarse)').matches
  );
};

const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Returns a lens config adjusted for device capability.
 * On mobile or reduced-motion, we dial down complexity.
 */
export function adaptLensConfig(config: LensConfig): LensConfig {
  if (typeof window === 'undefined') return config;
  if (isMobile() || prefersReducedMotion()) {
    return {
      ...config,
      // Scale displacement gracefully on mobile
      scale: config.scale * 0.6,
      // No chromatic dispersion on reduced-motion
      chroma: 0,
      // Subtler edge highlight
      edgeHighlight: config.edgeHighlight * 0.7,
      glow: config.glow * 0.5,
    };
  }
  return config;
}

// ─── Rounded-Rectangle SDF ────────────────────────────────────────────────────

/**
 * Computes the signed distance from point (px, py) to a rounded rectangle
 * centered at the origin with half-extents (hw, hh) and corner radius r.
 *
 * Returns a negative value inside, positive outside.
 * At the surface it is 0.
 *
 * Formula: SDF(p) = |q| - (hw - r) where q = |p| - (hw - r, hh - r)
 */
export function roundedRectSDF(
  px: number,
  py: number,
  hw: number, // half-width
  hh: number, // half-height
  r: number,  // corner radius
): number {
  const qx = Math.abs(px) - (hw - r);
  const qy = Math.abs(py) - (hh - r);
  return (
    Math.sqrt(Math.max(qx, 0) ** 2 + Math.max(qy, 0) ** 2) +
    Math.min(Math.max(qx, qy), 0) -
    r
  );
}

// ─── Surface Normal Calculation ───────────────────────────────────────────────

/**
 * Computes height at an arbitrary point for the finite-difference gradient.
 * Supports:
 * - Wide cylindrical bar lens (e.g. navbar: continuous vertical curvature)
 * - Rounded rectangle dome (e.g. buttons, modals: smooth 2D hermite dome)
 */
function heightAt(
  cx: number,
  cy: number,
  hw: number,
  hh: number,
  r: number,
  depth: number,
  curvature: number,
): number {
  // If this is a wide bar lens (like the navbar where hw >> hh or r === 0)
  if (r === 0 || hw > hh * 3) {
    if (Math.abs(cx) > hw || Math.abs(cy) > hh) return 0;
    const v = Math.abs(cy) / Math.max(1, hh);
    // Smooth cosine cylindrical lens cross-section with subtle edge bevel
    const bevelDist = Math.max(0, (hh - Math.abs(cy)) / Math.max(1, hh));
    const bevelFactor = Math.min(1, bevelDist * 4);
    const cylindrical = Math.cos(v * (Math.PI / 2));
    return depth * Math.pow(Math.max(0, cylindrical), curvature) * bevelFactor;
  }

  // Rounded rectangle dome (buttons, modals, controls)
  const sdf = roundedRectSDF(cx, cy, hw, hh, r);
  if (sdf > 0) return 0;
  const maxExtent = Math.max(1, Math.min(hw, hh));
  const t = Math.max(0, Math.min(1, -sdf / maxExtent));
  // Smooth hermite interpolation — non-zero derivative across entire surface
  const smoothT = t * t * (3 - 2 * t);
  return depth * Math.pow(smoothT, curvature * 0.6);
}

/**
 * Given a pixel position (px, py) within a lens of given dimensions,
 * compute a normalized 3D surface normal vector (nx, ny, nz).
 *
 * Outside the lens: normal = (0, 0, 1) → no displacement.
 * Across the lens: normal continuously bends light according to the surface gradient.
 *
 * @param px - pixel x relative to top-left
 * @param py - pixel y relative to top-left
 * @param config - full LensConfig
 * @returns { nx, ny, nz, inside } — (nx, ny) drive the feDisplacementMap channels
 */
export function computeSurfaceNormal(
  px: number,
  py: number,
  config: LensConfig,
): { nx: number; ny: number; nz: number; height: number; inside: boolean } {
  const { width, height: h, borderRadius, depth, curvature } = config;

  const cx = px - width / 2;
  const cy = py - h / 2;
  const hw = width / 2;
  const hh = h / 2;

  const isBar = borderRadius === 0 || hw > hh * 3;
  if (isBar) {
    if (Math.abs(cx) > hw || Math.abs(cy) > hh) {
      return { nx: 0, ny: 0, nz: 1, height: 0, inside: false };
    }
  } else {
    const sdf = roundedRectSDF(cx, cy, hw, hh, borderRadius);
    if (sdf > 1) {
      return { nx: 0, ny: 0, nz: 1, height: 0, inside: false };
    }
  }

  const lensHeight = heightAt(cx, cy, hw, hh, borderRadius, depth, curvature);

  // Finite difference gradient of the height field for the surface normal
  const eps = 1.5; // pixels

  const hRight = heightAt(cx + eps, cy, hw, hh, borderRadius, depth, curvature);
  const hLeft  = heightAt(cx - eps, cy, hw, hh, borderRadius, depth, curvature);
  const hDown  = heightAt(cx, cy + eps, hw, hh, borderRadius, depth, curvature);
  const hUp    = heightAt(cx, cy - eps, hw, hh, borderRadius, depth, curvature);

  const dhdx = (hRight - hLeft) / (2 * eps);
  const dhdy = (hDown  - hUp)   / (2 * eps);

  // Normal = normalize(-dhdx, -dhdy, 1) using the gradient
  const len = Math.sqrt(dhdx * dhdx + dhdy * dhdy + 1);
  const nx = -dhdx / len;
  const ny = -dhdy / len;
  const nz = 1 / len;

  return { nx, ny, nz, height: lensHeight, inside: true };
}

// ─── Parameter Hashing ────────────────────────────────────────────────────────

/**
 * Compute a compact string hash from lens parameters that affect the
 * displacement map shape.
 *
 * IMPORTANT: This is used to detect SHAPE changes — not POSITION changes.
 * A changing hash means the map must be regenerated.
 * A stable hash means we can reuse the existing map even as the surface moves.
 */
export function computeLensHash(config: LensConfig): string {
  return [
    Math.round(config.width),
    Math.round(config.height),
    Math.round(config.borderRadius * 10),
    Math.round(config.depth * 1000),
    Math.round(config.curvature * 100),
    Math.round(config.scale * 10),
    Math.round(config.chroma * 1000),
    Math.round(config.edgeHighlight * 100),
    Math.round(config.specularAngle),
  ].join(':');
}

/**
 * Determine whether two lens configs have the same displacement-map shape.
 * Returns true if maps can be reused (no regeneration needed).
 *
 * Position changes (top, left, transform) are intentionally NOT part of this
 * comparison — movement never triggers map regeneration per the Aave technique.
 */
export function lensShapeEqual(a: LensConfig, b: LensConfig): boolean {
  return computeLensHash(a) === computeLensHash(b);
}
