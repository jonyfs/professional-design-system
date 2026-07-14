import type { AnchorHTMLAttributes, ReactNode } from "react";

export interface AnchorProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Link target. */
  href: string;
  children: ReactNode;
}

// The simplest component in the batch: a styled inline link reusing the
// ratified brand-dark link token (.anchor). No state — purely
// presentational (nav-utility.contract.md).
export function Anchor({ href, className, children, ...rest }: AnchorProps) {
  const classes = ["anchor", className].filter(Boolean).join(" ");

  return (
    <a href={href} className={classes} {...rest}>
      {children}
    </a>
  );
}
