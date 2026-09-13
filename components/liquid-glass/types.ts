// ─────────────────────────────────────────────────────────────────────────────
// Liquid Glass — Core Type Definitions
// Inspired by Aave's "Building Glass for the Web" technique
// ─────────────────────────────────────────────────────────────────────────────


/**
 * Configuration for the rounded-rectangle glass lens.
 * These parameters control the shape and optical properties of the displacement
 * map that drives live DOM refraction through SVG feDisplacementMap.
 */
export interface LensConfig {
  /** Physical width of the glass surface in pixels */
  width: number;
  /** Physical height of the glass surface in pixels */
  height: number;
  /** Corner radius in pixels — must match CSS border-radius exactly */
  borderRadius: number;
  /**
   * Depth of the virtual lens (conceptual curvature height).
   * Higher = more pronounced curvature.
   * @default 0.18
   */
  depth: number;
  /**
   * Controls how steeply the lens curves at the edges vs center.
   * Higher = sharper edge curvature, flatter center.
   * @default 1.4
   */
  curvature: number;
  /**
   * Maximum pixel displacement scale for feDisplacementMap.
   * Governs how far pixels shift at the lens rim.
   * @default 12
   */
  scale: number;
  /**
   * Subtle chromatic dispersion amount (restrained — must not produce rainbow).
   * Expressed as a fraction of scale. 0 = disabled.
   * @default 0.04
   */
  chroma: number;
  /**
   * Subtle inner glow intensity. 0 = none.
   * @default 0.12
   */
  glow: number;
  /**
   * Edge highlight intensity for physical curvature perception.
   * @default 0.25
   */
  edgeHighlight: number;
  /**
   * Simulated specular light angle in degrees (0 = top-left, 90 = top, etc.)
   * @default 45
   */
  specularAngle: number;
}

/**
 * The result of generating a displacement map for a lens.
 * Contains the canvas data URI and metadata for caching/versioning.
 */
export interface DisplacementMapData {
  /** PNG data URI of the generated displacement map */
  dataUri: string;
  /** Width of the map canvas (may be scaled down for performance) */
  width: number;
  /** Height of the map canvas */
  height: number;
  /**
   * Incrementing version counter — used to generate unique SVG filter IDs
   * so Safari cannot cache stale filter outputs when the map changes.
   */
  version: number;
  /**
   * Hash string derived from the lens parameters that produced this map.
   * Used to avoid redundant regeneration when config is unchanged.
   */
  hash: string;
}

/** Props for the public LiquidGlass wrapper component */
export interface LiquidGlassProps {
  children: React.ReactNode;
  /** Explicitly set lens dimensions. Defaults to container measured dimensions. */
  lens?: Partial<Pick<LensConfig, 'width' | 'height' | 'borderRadius'>>;
  /** Optical depth — controls curvature prominence */
  depth?: number;
  /** Curvature profile */
  curvature?: number;
  /** Pixel displacement scale */
  scale?: number;
  /** Chromatic dispersion fraction */
  chroma?: number;
  /** Edge highlight intensity */
  edgeHighlight?: number;
  /** Additional CSS className for the outer wrapper */
  className?: string;
  /** ID for aria / testing */
  id?: string;
}
