export interface DividerProps {
  /** Rendered orientation. Default "horizontal". */
  orientation?: "horizontal" | "vertical";
  /**
   * Horizontal only: when true (default) render a semantic <hr> (implicit
   * separator role, no ARIA needed). When false, render a <div> with an
   * explicit role="separator" for non-semantic layout breaks. Ignored for
   * vertical dividers, which are always non-semantic <div>s.
   */
  semantic?: boolean;
  "data-testid"?: string;
  className?: string;
}

// Direct port of src/components/divider/divider.html (feature 014).
// Three shapes: semantic <hr class="divider">, non-semantic
// <div role="separator" class="divider">, and vertical
// <div role="separator" aria-orientation="vertical" class="divider-vertical">.
export function Divider({
  orientation = "horizontal",
  semantic = true,
  "data-testid": testId,
  className,
}: DividerProps) {
  if (orientation === "vertical") {
    const classes = ["divider-vertical", className].filter(Boolean).join(" ");
    return (
      <div
        data-testid={testId}
        role="separator"
        aria-orientation="vertical"
        className={classes}
      />
    );
  }

  const classes = ["divider", className].filter(Boolean).join(" ");

  if (semantic) {
    return <hr data-testid={testId} className={classes} />;
  }

  return <div data-testid={testId} role="separator" className={classes} />;
}
