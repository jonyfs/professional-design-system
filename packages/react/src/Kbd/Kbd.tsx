import type { HTMLAttributes, ReactNode } from "react";

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  /** The key label, e.g. "⌘", "K", or "Esc". */
  children: ReactNode;
}

// Direct port of src/components/kbd/kbd.html (feature 014) — a real <kbd>
// element carrying the .kbd class (mono font + key-cap styling).
export function Kbd({ children, className, ...rest }: KbdProps) {
  const classes = ["kbd", className].filter(Boolean).join(" ");
  return (
    <kbd className={classes} {...rest}>
      {children}
    </kbd>
  );
}
