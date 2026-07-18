export interface SimpleGridProps {
  columns?: 2 | 3 | 4;
  children: React.ReactNode;
  className?: string;
  "data-testid"?: string;
}

// Evenly-sized grid sibling of Grid (feature 028 US3) — identical
// responsive rule, no per-item column spanning.
export function SimpleGrid({ columns = 3, children, className, "data-testid": testId }: SimpleGridProps) {
  return (
    <div
      data-testid={testId}
      className={`simple-grid grid-cols-${columns}-lg ${className ?? ""}`.trim()}
    >
      {children}
    </div>
  );
}
