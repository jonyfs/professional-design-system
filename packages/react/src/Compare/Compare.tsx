import { useState } from "react";

export interface CompareProps {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  "data-testid"?: string;
}

// Feature 034 (contracts/compare.contract.md) — the divider reuses
// Slider's exact native <input type="range"> + .slider class
// verbatim; keyboard operability and 0-100% clamping come from the
// native input, not custom logic. React's style prop compiles to a
// direct DOM property assignment, not a literal style="..." HTML
// attribute — so it isn't subject to this project's static-HTML CSP
// restriction (the same distinction documented for Password Strength
// Meter, feature 029).
export function Compare({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  "data-testid": testId,
}: CompareProps) {
  const [position, setPosition] = useState(50);

  return (
    <div data-testid={testId} className="compare-container mt-8 h-64 w-full max-w-md">
      <img src={beforeSrc} alt={beforeAlt} className="compare-image" />
      <span className="compare-label compare-label-before" aria-hidden="true">
        Before
      </span>
      <div
        className="compare-after-wrapper"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img src={afterSrc} alt={afterAlt} className="compare-image" />
        <span className="compare-label compare-label-after" aria-hidden="true">
          After
        </span>
      </div>
      <div className="compare-divider-line" style={{ left: `${position}%` }} aria-hidden="true">
        <span className="compare-handle">
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path d="M8.7 4.3a1 1 0 0 1 0 1.4L6.4 8H14v2H6.4l2.3 2.3a1 1 0 0 1-1.4 1.4l-4-4a1 1 0 0 1 0-1.4l4-4a1 1 0 0 1 1.4 0zm2.6 0a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 0 1-1.4-1.4L13.6 10H11V8h2.6l-2.3-2.3a1 1 0 0 1 0-1.4z" />
          </svg>
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={position}
        aria-label="Comparison position"
        className="compare-slider slider"
        onChange={(e) => setPosition(Number(e.target.value))}
      />
    </div>
  );
}
