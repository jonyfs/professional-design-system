export interface CenterProps {
  children: React.ReactNode;
  className?: string;
  "data-testid"?: string;
}

// Centers a single child both axes within its container (feature 028 US1).
export function Center({ children, className, "data-testid": testId }: CenterProps) {
  return (
    <div data-testid={testId} className={`center ${className ?? ""}`.trim()}>
      {children}
    </div>
  );
}
