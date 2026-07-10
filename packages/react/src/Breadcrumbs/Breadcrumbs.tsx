import type { HTMLAttributes } from "react";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface BreadcrumbsProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  items: BreadcrumbItem[];
  currentLabel: string;
}

// Pure markup port (contracts/009-react-port-nav-disclosure/breadcrumbs.contract.md)
// — no hooks, no state, direct translation of breadcrumbs.html.
export function Breadcrumbs({ items, currentLabel, className, ...rest }: BreadcrumbsProps) {
  const classes = ["breadcrumb-nav", className].filter(Boolean).join(" ");
  return (
    <nav aria-label="Breadcrumb" className={classes} {...rest}>
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item) => (
          <li key={item.href} className="flex items-center gap-2">
            <a href={item.href} className="breadcrumb-link">
              {item.label}
            </a>
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 breadcrumb-divider" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z"
                clipRule="evenodd"
              />
            </svg>
          </li>
        ))}
        <li>
          <span aria-current="page" className="breadcrumb-current">
            {currentLabel}
          </span>
        </li>
      </ol>
    </nav>
  );
}
