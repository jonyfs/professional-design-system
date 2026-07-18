export interface RangeSliderProps {
  label?: string;
  min: number;
  max: number;
  low: number;
  high: number;
  onChange: (low: number, high: number) => void;
  "data-testid"?: string;
}

// React port of src/scripts/range-slider.js — two genuinely separate
// rows sharing one value pair (never overlapping inputs — see the
// real WCAG 2.5.8 finding in that file), each clamped so neither
// handle crosses the other (contracts/range-slider.contract.md).
export function RangeSlider({
  label,
  min,
  max,
  low,
  high,
  onChange,
  "data-testid": testId,
}: RangeSliderProps) {
  return (
    <div>
      {label && <span className="mb-2 block text-sm font-medium text-neutral-900">{label}</span>}
      <div data-testid={testId} className="range-slider-rows">
        <div className="range-slider-row">
          <span className="range-slider-row-label">Min</span>
          <input
            className="slider"
            type="range"
            min={min}
            max={max}
            value={low}
            aria-label="Minimum"
            onChange={(e) => onChange(Math.min(Number(e.target.value), high), high)}
          />
        </div>
        <div className="range-slider-row">
          <span className="range-slider-row-label">Max</span>
          <input
            className="slider"
            type="range"
            min={min}
            max={max}
            value={high}
            aria-label="Maximum"
            onChange={(e) => onChange(low, Math.max(Number(e.target.value), low))}
          />
        </div>
      </div>
    </div>
  );
}
