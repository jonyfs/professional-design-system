import type { DetailsHTMLAttributes, ReactNode } from "react";

export interface CollapseProps
  extends Omit<DetailsHTMLAttributes<HTMLDetailsElement>, "title"> {
  /** The always-visible summary/trigger label. */
  label: ReactNode;
  /** The revealed content. */
  children: ReactNode;
  /** Whether the panel is open on first render. Uncontrolled — the native
   * <details> owns its open/closed state afterward (nav-utility.contract.md). */
  defaultOpen?: boolean;
}

// A single, independent collapsible container built on native <details>
// (research.md R5) — zero JS, browser-native disclosure semantics.
// Distinct from Accordion: each Collapse is standalone with no group /
// sibling-closing behavior. Reuses Accordion's exact visual treatment via
// the .collapse-* classes.
export function Collapse({
  label,
  children,
  defaultOpen,
  className,
  ...rest
}: CollapseProps) {
  const classes = ["group collapse-item", className].filter(Boolean).join(" ");

  return (
    <details className={classes} open={defaultOpen} {...rest}>
      <summary className="collapse-trigger">
        {label}
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className="collapse-chevron"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </summary>
      <div className="collapse-content">{children}</div>
    </details>
  );
}
