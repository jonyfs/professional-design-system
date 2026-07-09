import { forwardRef, type ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual treatment — see contracts/001-primitive-components/button.contract.md */
  variant?: "primary" | "secondary";
}

// forwardRef: a Modal/Slide-over trigger needs a real DOM ref for reliable
// cross-browser focus-return (useDialogTrigger's triggerRef — WebKit does
// not focus a <button> on mouse click, so document.activeElement alone is
// unreliable there). A plain function component can't receive a `ref` at
// all (React silently drops it with a dev warning), so any consumer using
// <Button> as a Modal/Slide-over trigger needs this to work.
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", className, type = "button", ...rest },
  ref,
) {
  const variantClass = variant === "primary" ? "btn-primary" : "btn-secondary";
  const classes = [variantClass, className].filter(Boolean).join(" ");
  return <button ref={ref} type={type} className={classes} {...rest} />;
});
