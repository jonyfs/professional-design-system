import type { HTMLAttributes, ReactNode } from "react";

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional decorative icon; rendered inside an aria-hidden container. */
  icon?: ReactNode;
  /** Heading text — rendered as a real <h2>. */
  heading: string;
  /** Optional supporting copy. */
  description?: ReactNode;
  /** Optional action slot, e.g. a <Button>. */
  action?: ReactNode;
}

// Direct port of src/components/empty-state/empty-state.html (feature 014) —
// a compositional recipe built from ratified utilities. The icon is always
// decorative (aria-hidden); the heading is a real heading element.
export function EmptyState({
  icon,
  heading,
  description,
  action,
  className,
  ...rest
}: EmptyStateProps) {
  const classes = [
    "flex max-w-md flex-col items-center gap-3 rounded-lg border border-neutral-200 py-12 text-center",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={classes} {...rest}>
      {icon ? (
        <span aria-hidden="true" className="text-neutral-500">
          {icon}
        </span>
      ) : null}
      <h2 className="text-sm font-semibold text-neutral-900">{heading}</h2>
      {description ? <p className="max-w-sm text-sm text-neutral-600">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
