export interface ColorSwatchProps {
  /** Any valid CSS color; applied via inline style (caller-supplied). */
  value: string;
  /** Required accessible text alternative — never conveyed by hue alone. */
  label: string;
  /** When true, the label is also shown visibly beside the chip. */
  showLabel?: boolean;
  "data-testid"?: string;
}

// Data-display micro-component (feature 023 US3). The chip's background is
// set inline (the value is caller-supplied and unbounded — the one place
// in this batch where an inline style is legitimate, matching how Chart
// sets data-driven colors). An .sr-only label always carries the color's
// name/value so it is never conveyed by hue alone (WCAG use-of-color).
export function ColorSwatch({
  value,
  label,
  showLabel = false,
  "data-testid": testId,
}: ColorSwatchProps) {
  return (
    <span data-testid={testId} className="inline-flex items-center gap-2">
      <span className="color-swatch" style={{ backgroundColor: value }} />
      <span className="sr-only">{label}</span>
      {showLabel && (
        <span aria-hidden="true" className="text-sm text-neutral-900">
          {label}
        </span>
      )}
    </span>
  );
}
