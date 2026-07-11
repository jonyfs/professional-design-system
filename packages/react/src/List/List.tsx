import type { ReactNode } from "react";
import { Avatar } from "../Avatar/Avatar";

export interface ListItemData {
  id: string;
  avatar: { src?: string; alt: string; initials?: string };
  title: string;
  metadata?: string;
  href?: string;
  trailing?: ReactNode;
}

export interface ListProps {
  items: ListItemData[];
  interactive?: boolean;
  "data-testid"?: string;
}

// Direct port of list.html (feature 011) — .list-row*, not .list-item*
// (the Tailwind corePlugins naming collision that fix was about applies
// identically here — these classes are reused verbatim, not reinvented).
export function List({ items, interactive, "data-testid": testId }: ListProps) {
  return (
    <div className="list" data-testid={testId}>
      {items.map((item) => {
        const content = (
          <>
            <Avatar src={item.avatar.src} alt={item.avatar.alt} initials={item.avatar.initials} size="lg" />
            <div className="min-w-0">
              <p className="list-row-title">{item.title}</p>
              {item.metadata && <p className="list-row-metadata">{item.metadata}</p>}
            </div>
            {item.trailing}
          </>
        );
        // href is required per-item when `interactive` is set
        // (data-model.md) — every row becomes a real <a tabindex="0">,
        // the same WebKit Tab-order fix from feature 011, ported
        // verbatim, not re-derived. `href` stays optional in the type
        // (a discriminated union keyed on the list-level `interactive`
        // flag doesn't cleanly express a per-item requirement), so this
        // dev-only check catches the caller error TypeScript can't
        // (code review finding): a missing href would otherwise render
        // <a href={undefined} tabIndex={0}>, a link with no
        // destination, silently losing every native-link affordance
        // this component exists to preserve.
        if (interactive && !item.href && process.env.NODE_ENV !== "production") {
          console.warn(
            `List: item "${item.id}" has no href but the list is interactive — it will render as a link with no destination.`,
          );
        }
        if (interactive) {
          return (
            <a
              key={item.id}
              href={item.href}
              tabIndex={0}
              className="list-row-interactive"
              data-testid={testId && `${testId}-item-${item.id}`}
            >
              {content}
            </a>
          );
        }
        return (
          <div key={item.id} className="list-row" data-testid={testId && `${testId}-item-${item.id}`}>
            {content}
          </div>
        );
      })}
    </div>
  );
}
