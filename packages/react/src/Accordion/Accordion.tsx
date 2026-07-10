import { useId, type HTMLAttributes, type ReactNode } from "react";

export interface AccordionItemData {
  id: string;
  trigger: string;
  content: ReactNode;
  defaultOpen?: boolean;
}

export interface AccordionProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  items: AccordionItemData[];
  /** Single-open-at-a-time via the native <details> shared `name` group
   * mechanism — no React state (contracts/009-react-port-nav-disclosure/
   * accordion.contract.md, research.md R1). */
  exclusive?: boolean;
}

export function Accordion({ items, exclusive, className, ...rest }: AccordionProps) {
  // useId(), not a hardcoded literal: two Accordion instances on the same
  // page (e.g. this project's own harness) would otherwise share one
  // native exclusive group — the same duplicate-id class of bug this
  // package's other components already guard against with useId().
  const groupName = useId();
  const classes = ["divide-y divide-neutral-200 border-t border-neutral-200", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...rest}>
      {items.map((item) => (
        <details
          key={item.id}
          data-testid={item.id}
          className="group accordion-item"
          open={item.defaultOpen}
          {...(exclusive ? { name: groupName } : {})}
        >
          <summary className="accordion-trigger">
            {item.trigger}
            <svg viewBox="0 0 20 20" fill="currentColor" className="accordion-chevron" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </summary>
          <p className="accordion-content">{item.content}</p>
        </details>
      ))}
    </div>
  );
}
