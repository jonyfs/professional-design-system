import type { ReactNode } from "react";

export interface BlockquoteProps {
  children: ReactNode;
  cite?: string;
  "data-testid"?: string;
}

// Feature 033 (contracts/theme-icon-blockquote.contract.md) — existing
// typography/spacing tokens only, no new font/color/size token.
export function Blockquote({ children, cite, "data-testid": testId }: BlockquoteProps) {
  return (
    <blockquote data-testid={testId} className="blockquote">
      {children}
      {cite && <cite className="blockquote-cite">{cite}</cite>}
    </blockquote>
  );
}
