import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { DetailsHTMLAttributes, ReactNode } from "react";

export interface SpoilerProps
  extends Omit<DetailsHTMLAttributes<HTMLDetailsElement>, "title"> {
  /** The text/content to truncate while collapsed. */
  children: ReactNode;
  /** Label for the collapsed "reveal" control. */
  showMoreLabel?: string;
  /** Label for the expanded "re-collapse" control. */
  showLessLabel?: string;
}

// SSR-safe layout effect: useLayoutEffect on the client (measure before
// paint, no flicker), useEffect on the server (no-op, avoids React's
// useLayoutEffect-on-server warning).
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Spoiler = Collapse's native-<details> mechanism plus a pre-open
// truncation measurement. NOTE: it does NOT wrap the Collapse component —
// a closed <details> renders only its <summary>, so Spoiler's preview must
// live inside the summary (line-clamped while closed, unclamped via
// group-open while open); Collapse's summary/content split hides content
// when closed and can't produce a truncated preview. Both share the same
// underlying <details> disclosure mechanism, not the same layout.
//
// The label toggle is pure CSS (group-open). The one thing CSS can't do is
// decide whether the content is long enough to need a control at all: per
// spec.md's US4 edge case, content that already fits shows NO control. That
// requires measuring the clamped content, done here in a layout effect.
export function Spoiler({
  children,
  showMoreLabel = "Show more",
  showLessLabel = "Show less",
  className,
  ...rest
}: SpoilerProps) {
  const contentRef = useRef<HTMLSpanElement>(null);
  // null = "not yet measured" → control stays visible (progressive
  // enhancement); after measuring it becomes a definite true/false.
  const [truncatable, setTruncatable] = useState<boolean | null>(null);

  useIsomorphicLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    // Measured while closed and clamped: scrollHeight is the full natural
    // height, clientHeight the clamped visible height. +1 guards sub-pixel
    // rounding.
    setTruncatable(el.scrollHeight > el.clientHeight + 1);
  }, [children]);

  const classes = ["group spoiler", className].filter(Boolean).join(" ");

  return (
    <details
      className={classes}
      data-truncatable={truncatable === null ? undefined : String(truncatable)}
      {...rest}
    >
      <summary className="spoiler-summary">
        <span ref={contentRef} className="spoiler-content" data-spoiler-content>
          {children}
        </span>
        <span className="spoiler-toggle">
          <span className="group-open:hidden">{showMoreLabel}</span>
          <span className="hidden group-open:inline">{showLessLabel}</span>
        </span>
      </summary>
    </details>
  );
}
