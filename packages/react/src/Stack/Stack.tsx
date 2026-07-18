export interface StackProps {
  gap?: "xs" | "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
  "data-testid"?: string;
}

// Vertical spacing primitive (feature 028 US1) — a thin styled wrapper,
// no internal state. Reuses this catalog's existing space-y-* scale via
// the .stack-{gap} classes; never inspects or restyles its children.
export function Stack({ gap = "md", children, className, "data-testid": testId }: StackProps) {
  return (
    <div data-testid={testId} className={`stack stack-${gap} ${className ?? ""}`.trim()}>
      {children}
    </div>
  );
}
