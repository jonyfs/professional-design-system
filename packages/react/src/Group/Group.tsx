export interface GroupProps {
  gap?: "xs" | "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
  "data-testid"?: string;
}

// Horizontal spacing primitive (feature 028 US1). Named Group, rendering
// .group-row (not .group) — Tailwind's own built-in `.group` utility
// already claims that class name for group-hover:/group-focus: state
// scoping; colliding would silently break any child relying on it.
export function Group({ gap = "md", children, className, "data-testid": testId }: GroupProps) {
  return (
    <div data-testid={testId} className={`group-row group-row-${gap} ${className ?? ""}`.trim()}>
      {children}
    </div>
  );
}
