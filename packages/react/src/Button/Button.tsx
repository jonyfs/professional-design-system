import type { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual treatment — see contracts/001-primitive-components/button.contract.md */
  variant?: "primary" | "secondary";
}

export function Button({ variant = "primary", className, type = "button", ...rest }: ButtonProps) {
  const variantClass = variant === "primary" ? "btn-primary" : "btn-secondary";
  const classes = [variantClass, className].filter(Boolean).join(" ");
  return <button type={type} className={classes} {...rest} />;
}
