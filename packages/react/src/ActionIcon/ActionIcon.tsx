import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

// `ariaLabel` is a REQUIRED prop, not optional (spec.md FR-004,
// contracts/023.../button-variants.contract.md): an ActionIcon is icon-only,
// so its accessible name can only come from aria-label. Making it required at
// the TypeScript level turns "an ActionIcon with no accessible name" from a
// silent runtime a11y bug into a compile error. `aria-label` itself is
// therefore Omit-ted from the spread HTML attrs so it can't be passed as an
// empty string that would defeat the required-prop guarantee.
export interface ActionIconProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> {
  /** Visual treatment — mirrors Button's own variant system. */
  variant?: "primary" | "secondary";
  /** The rendered icon (an <svg> or similar). */
  icon: ReactNode;
  /** Mandatory accessible name — there is no visible text label. */
  ariaLabel: string;
}

// forwardRef for parity with Button (an ActionIcon can equally be a
// Modal/Dropdown trigger needing a real DOM ref for reliable focus-return).
export const ActionIcon = forwardRef<HTMLButtonElement, ActionIconProps>(function ActionIcon(
  { variant = "primary", icon, ariaLabel, className, type = "button", ...rest },
  ref,
) {
  const variantClass =
    variant === "primary" ? "action-icon-primary" : "action-icon-secondary";
  const classes = ["action-icon", variantClass, className].filter(Boolean).join(" ");
  return (
    <button ref={ref} type={type} aria-label={ariaLabel} className={classes} {...rest}>
      {icon}
    </button>
  );
});
