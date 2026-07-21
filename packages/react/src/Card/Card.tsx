import type { HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  /** Primary/anchor card: brand accent rail, deeper elevation, looser rhythm. */
  featured?: boolean;
}

// Direct port of src/components/card/card.html (feature 006) — zero JS,
// optional hover-elevation and featured emphasis via pure CSS.
export function Card({ elevated, featured, className, children, ...rest }: CardProps) {
  const classes = ["card", featured && "card-featured", elevated && "card-elevated", className]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}
