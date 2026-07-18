export interface PaperProps {
  children: React.ReactNode;
  className?: string;
  "data-testid"?: string;
}

// Minimal surface primitive (feature 028 US2) — same border/radius/
// background as Card, deliberately without its shadow or mandated
// padding scale. Caller supplies padding via className.
export function Paper({ children, className, "data-testid": testId }: PaperProps) {
  return (
    <div data-testid={testId} className={`paper ${className ?? ""}`.trim()}>
      {children}
    </div>
  );
}
