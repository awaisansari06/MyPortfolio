/** Render only inside the route's pending boundary, never over a ready page. */
export function PageLoader() {
  return (
    <div className="portfolio-loader" role="status" aria-live="polite">
      <span className="portfolio-loader-mark" aria-hidden="true">ma<span>.</span></span>
      <span className="portfolio-loader-copy">Loading portfolio<span className="portfolio-loader-track" aria-hidden="true" /></span>
    </div>
  );
}
