import { useEffect, useRef, useState, type ButtonHTMLAttributes } from "react";

// Milliseconds the transient copied/failed state stays visible before
// reverting to idle (research.md R7 — a fixed, short confirmation window).
const REVERT_DELAY_MS = 2000;

type CopyStatus = "idle" | "copied" | "failed";

export interface CopyButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onCopy"> {
  /** The value written to the clipboard on click. */
  textToCopy: string;
  /** Idle label (defaults to "Copy link"). */
  label?: string;
  /**
   * Test/story seam to force the clipboard write to reject deterministically
   * so the failure state can be exercised without a denied-permission or
   * insecure-context environment. Not for production use.
   */
  forceFailure?: boolean;
}

const ICONS = {
  idle: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="mr-2 h-5 w-5" aria-hidden="true">
      <path d="M7 3.5A1.5 1.5 0 0 1 8.5 2h5A1.5 1.5 0 0 1 15 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 7 12.5v-9Z" />
      <path d="M4.5 6A1.5 1.5 0 0 0 3 7.5v9A1.5 1.5 0 0 0 4.5 18h5A1.5 1.5 0 0 0 11 16.5V16H8.5A2.5 2.5 0 0 1 6 13.5V6h-1.5Z" />
    </svg>
  ),
  copied: (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className="mr-2 h-5 w-5 text-success-strong"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.79 6.8-6.79a1 1 0 0 1 1.4 0Z"
        clipRule="evenodd"
      />
    </svg>
  ),
  failed: (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className="mr-2 h-5 w-5 text-error-strong"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM9 6a1 1 0 1 1 2 0v4a1 1 0 1 1-2 0V6Zm1 9a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z"
        clipRule="evenodd"
      />
    </svg>
  ),
} as const;

// Reuses Button's .btn-secondary treatment verbatim; only the inner icon+
// label swap between idle / copied / failed. On click it calls
// navigator.clipboard.writeText, wrapped in try/catch — on rejection it shows
// a DISTINCT failure state rather than silently claiming success (spec.md
// Edge Cases). The outcome is announced via an aria-live="polite" region so
// screen-reader users hear it without re-focusing the button (Toast's
// convention, contracts/023.../button-variants.contract.md).
export function CopyButton({
  textToCopy,
  label = "Copy link",
  forceFailure = false,
  className,
  type = "button",
  ...rest
}: CopyButtonProps) {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timerRef.current), []);

  async function handleClick() {
    clearTimeout(timerRef.current);
    try {
      if (forceFailure) throw new Error("Copy forced to fail");
      await navigator.clipboard.writeText(textToCopy);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    timerRef.current = setTimeout(() => setStatus("idle"), REVERT_DELAY_MS);
  }

  const classes = ["btn-secondary", className].filter(Boolean).join(" ");
  const visibleLabel =
    status === "copied" ? "Copied" : status === "failed" ? "Copy failed" : label;
  const announcement =
    status === "copied" ? "Copied to clipboard" : status === "failed" ? "Copy failed" : "";

  return (
    <>
      <button type={type} className={classes} onClick={handleClick} {...rest}>
        {ICONS[status]}
        <span>{visibleLabel}</span>
      </button>
      {/* Polite live region kept separate from the visible label so the
          announcement is stable regardless of icon/label swapping. No fixed
          data-testid: two CopyButtons on one page would collide — tests
          scope to it via the owning button/section and assert the visible
          label ("Copied"/"Copy failed") as the primary observable. */}
      <span aria-live="polite" className="sr-only">
        {announcement}
      </span>
    </>
  );
}
