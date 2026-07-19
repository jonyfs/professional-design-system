export interface SpinnerProps {
  /** Rendered size. Default "lg". */
  size?: "sm" | "lg";
  /** Accessible name. Default "Loading". */
  label?: string;
  "data-testid"?: string;
}

// Direct port of src/components/spinner/spinner.html (feature 014) — a
// zero-JS rotating SVG. role=status + aria-label give it an accessible
// name; motion-reduce:animate-none disables the spin under reduced motion.
const SIZE_CLASSES: Record<NonNullable<SpinnerProps["size"]>, string> = {
  sm: "spinner-sm",
  lg: "spinner-lg",
};

export function Spinner({ size = "lg", label = "Loading", "data-testid": testId }: SpinnerProps) {
  const classes = `spinner ${SIZE_CLASSES[size]} motion-reduce:animate-none`;
  return (
    <svg
      data-testid={testId}
      className={classes}
      role="status"
      aria-label={label}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
