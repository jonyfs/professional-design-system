export interface FlexProps {
  direction?: "row" | "col";
  children: React.ReactNode;
  className?: string;
  "data-testid"?: string;
}

// Flexible row/column arrangement (feature 028 US3), for layouts that
// don't need Grid's strict column mechanics.
export function Flex({ direction = "row", children, className, "data-testid": testId }: FlexProps) {
  return (
    <div
      data-testid={testId}
      className={`flex-${direction}-primitive ${className ?? ""}`.trim()}
    >
      {children}
    </div>
  );
}
