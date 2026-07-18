export interface GridProps {
  columns?: 2 | 3 | 4;
  children: React.ReactNode;
  className?: string;
  "data-testid"?: string;
}

// Responsive CSS Grid layout (feature 028 US3) — 1 column below 768px,
// 2 at 768-1023px, the configured count at 1024px+ (research.md R3).
export function Grid({ columns = 3, children, className, "data-testid": testId }: GridProps) {
  return (
    <div
      data-testid={testId}
      className={`grid-responsive grid-cols-${columns}-lg ${className ?? ""}`.trim()}
    >
      {children}
    </div>
  );
}
