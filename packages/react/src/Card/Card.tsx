import type { HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
}

// Direct port of src/components/card/card.html (feature 006) — zero JS,
// optional hover-elevation via pure CSS.
export function Card({ elevated, className, children, ...rest }: CardProps) {
  const classes = ["card", elevated && "card-elevated", className].filter(Boolean).join(" ");
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}
