import { useId, type ReactNode } from "react";

// A tooltip anchor pairing is one of a pre-declared, numbered set of
// class pairs (`.tooltip-anchor-N` / `.tooltip-target-N`) already shipped
// in src/styles/tailwind.css. This project's CSP (`style-src 'self'`, no
// `unsafe-inline`) blocks inline `style="anchor-name: ..."` attributes
// outright, and Tooltip is deliberately zero-JavaScript, so a per-instance
// anchor name can't be assigned at runtime the way Dropdown Menu/Popover
// do it. The numbered class set is the zero-JS-compatible mechanism (see
// the CSS comment on `.tooltip-anchor-1`); a page needing more than four
// concurrent Tooltip instances should add another numbered pair there.
export type TooltipAnchor = 1 | 2 | 3 | 4;

export interface TooltipProps {
  /** Text shown in the floating label (role="tooltip"). */
  label: string;
  /** Trigger content — the visible button contents (icon, text, etc.). */
  children: ReactNode;
  /**
   * Which pre-declared anchor-name/position-anchor class pair to use.
   * Two Tooltips on the same page must use distinct values or their CSS
   * Anchor Positioning names collide. Defaults to 1.
   */
  anchor?: TooltipAnchor;
  /** Renders the trigger button disabled — the wrapper still reveals the
   * label on hover/focus-within, matching the reference's disabled demo. */
  disabled?: boolean;
  /** Extra classes merged onto the trigger button (after `btn-secondary`). */
  triggerClassName?: string;
  triggerTestId?: string;
  wrapperTestId?: string;
  labelTestId?: string;
}

// Zero-JavaScript hover/focus label (contracts/tooltip.contract.md,
// feature 014) — reveal is driven entirely by the stylesheet's
// `.tooltip-wrapper:hover .tooltip` / `:focus-within .tooltip` rules, so
// there is no open state, effect, or event handler here. Hovering the
// wrapper (not the trigger) is what reveals the label, which is why a
// disabled trigger's tooltip still appears on hover.
export function Tooltip({
  label,
  children,
  anchor = 1,
  disabled,
  triggerClassName,
  triggerTestId,
  wrapperTestId,
  labelTestId,
}: TooltipProps) {
  const labelId = useId();
  const triggerClasses = ["btn-secondary", `tooltip-anchor-${anchor}`, triggerClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <span className="tooltip-wrapper" data-testid={wrapperTestId}>
      <button
        type="button"
        disabled={disabled}
        aria-describedby={labelId}
        className={triggerClasses}
        data-testid={triggerTestId}
      >
        {children}
      </button>
      <span
        role="tooltip"
        id={labelId}
        data-testid={labelTestId}
        className={`tooltip tooltip-top tooltip-target-${anchor}`}
      >
        {label}
      </span>
    </span>
  );
}
