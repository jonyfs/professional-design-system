import type { ReactNode } from "react";

export interface CodeProps {
  variant?: "inline" | "block";
  children: ReactNode;
  "data-testid"?: string;
}

// Data-display micro-component (feature 023 US3). Shares Kbd's font-mono
// token (via .code-inline / .code-block), sized/colored for code display
// — distinct from Kbd's keyboard-input semantics. Purely presentational.
export function Code({ variant = "inline", children, "data-testid": testId }: CodeProps) {
  if (variant === "block") {
    // tabIndex=0 keeps the horizontally-scrollable block reachable by
    // keyboard (axe scrollable-region-focusable / WCAG 2.1.1).
    return (
      <pre data-testid={testId} tabIndex={0} className="code-block">
        <code>{children}</code>
      </pre>
    );
  }
  return (
    <code data-testid={testId} className="code-inline">
      {children}
    </code>
  );
}
