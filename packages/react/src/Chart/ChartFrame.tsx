import type { ReactNode } from "react";

export interface ChartFrameProps {
  ariaLabel: string;
  tableId: string;
  children: ReactNode;
}

// Shared wrapper fixing a real axe-core finding (WCAG 4.1.2): role="img"
// asserts a leaf node with no focusable descendants, so it MUST wrap only
// the chart visualization itself — never the Legend's interactive
// <button> elements or anything else focusable. Legend/DataTable render as
// siblings of this frame, not children, in every chart component.
export function ChartFrame({ ariaLabel, tableId, children }: ChartFrameProps) {
  return (
    <div role="img" aria-label={ariaLabel} aria-describedby={tableId} className="h-80 w-full">
      {children}
    </div>
  );
}
