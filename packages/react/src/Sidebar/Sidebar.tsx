export interface SidebarItemData {
  id: string;
  label: string;
  href: string;
  active?: boolean;
}

export interface SidebarProps {
  theme: "light" | "dark";
  items: SidebarItemData[];
  onItemClick?: (id: string) => void;
  "data-testid"?: string;
}

// Direct port of sidebar.html (feature 007) — zero JS. Items are real
// <a href>, not callback-only <button>s: the static reference uses real
// anchors for every item, and a button-only API would lose native link
// affordances (ctrl/cmd-click, "open in new tab") — a real capability
// regression the constitution warns against (data-model.md).
export function Sidebar({ theme, items, onItemClick, "data-testid": testId }: SidebarProps) {
  return (
    <nav aria-label="Main" data-testid={testId} className={`sidebar sidebar-${theme}`}>
      {items.map((item) => (
        <a
          key={item.id}
          href={item.href}
          aria-current={item.active ? "page" : undefined}
          className={`sidebar-item sidebar-item-${theme}`}
          data-testid={testId && `${testId}-item-${item.id}`}
          onClick={onItemClick ? () => onItemClick(item.id) : undefined}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
