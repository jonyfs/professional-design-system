export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  "data-testid"?: string;
}

// Width-constrained, centered content wrapper (feature 028 US2). Named
// .container-page, not .container — Tailwind ships its own built-in
// breakpoint-keyed max-width utility under that name.
export function Container({ children, className, "data-testid": testId }: ContainerProps) {
  return (
    <div data-testid={testId} className={`container-page ${className ?? ""}`.trim()}>
      {children}
    </div>
  );
}
