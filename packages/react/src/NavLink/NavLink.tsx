import type { AnchorHTMLAttributes, ReactNode } from "react";

export interface NavLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Link target. */
  href: string;
  /** When true, marks this as the current page: sets `aria-current="page"`
   * and applies Sidebar's active-item visual treatment (research.md R6).
   * Caller-determined (e.g. from the current URL) — this catalog does no
   * client-side routing (nav-utility.contract.md). */
  current?: boolean;
  children: ReactNode;
}

// Standalone navigation link reusing Sidebar's exact active-item
// convention (.nav-link mirrors .sidebar-item byte-for-byte). A real
// <a href>, not a callback-only <button>, so native link affordances
// (ctrl/cmd-click, "open in new tab") are preserved — the same rationale
// Sidebar's own port records.
export function NavLink({ href, current, className, children, ...rest }: NavLinkProps) {
  const classes = ["nav-link", "nav-link-light", className].filter(Boolean).join(" ");

  return (
    <a
      href={href}
      className={classes}
      aria-current={current ? "page" : undefined}
      {...rest}
    >
      {children}
    </a>
  );
}
