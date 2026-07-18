# Contract: Team/Workspace Switcher, Language Switcher

Both reuse Dropdown Menu's exact markup/wiring (`dropdown-menu.js`'s
`data-dropdown-trigger` selector, `popovertarget`/`popover="auto"`/
`role="menu"`) verbatim — zero new interaction mechanism. The only new
script updates the trigger's displayed "current selection" when an
option is clicked, layered on top of `dropdown-menu.js`'s existing
close/focus/keyboard wiring, not replacing it.

## `src/scripts/context-switcher.js`

```js
// Feature 031 (research.md R1) — a thin display-update layer on top of
// dropdown-menu.js's existing wiring (data-dropdown-trigger), which
// this script does NOT duplicate: closing, focus-return, and arrow-key
// navigation all still come from dropdown-menu.js/initDropdownMenus().
export function initContextSwitchers() {
  document.querySelectorAll("[data-context-switcher-trigger]").forEach((trigger) => {
    const currentLabel = trigger.querySelector("[data-context-switcher-current-label]");
    const currentAvatar = trigger.querySelector("[data-context-switcher-current-avatar]");
    const panel = document.getElementById(trigger.getAttribute("popovertarget"));
    if (!panel || !currentLabel) return;

    panel.querySelectorAll("[data-context-switcher-option]").forEach((option) => {
      option.addEventListener("click", () => {
        currentLabel.textContent = option.dataset.contextSwitcherLabel;
        if (currentAvatar && option.dataset.contextSwitcherAvatar) {
          currentAvatar.textContent = option.dataset.contextSwitcherAvatar;
        }
      });
    });
  });
}
```

## Static HTML usage — Team/Workspace Switcher

```html
<div class="relative inline-block text-left">
  <button
    type="button"
    id="team-switcher-trigger"
    data-testid="team-switcher-trigger"
    popovertarget="team-switcher-panel"
    aria-expanded="false"
    data-dropdown-trigger
    data-context-switcher-trigger
    class="btn-secondary inline-flex items-center gap-2"
  >
    <span class="avatar-fallback" data-context-switcher-current-avatar data-testid="team-switcher-current-avatar">AC</span>
    <span data-context-switcher-current-label data-testid="team-switcher-current-label">Acme Inc</span>
  </button>
  <div id="team-switcher-panel" popover="auto" role="menu" aria-labelledby="team-switcher-trigger" class="dropdown-menu-panel" data-testid="team-switcher-panel">
    <button type="button" role="menuitem" class="dropdown-menu-item flex items-center gap-2" data-context-switcher-option data-context-switcher-label="Acme Inc" data-context-switcher-avatar="AC" data-testid="team-switcher-option-acme">
      <span class="avatar-fallback avatar-sm">AC</span> Acme Inc
    </button>
    <button type="button" role="menuitem" class="dropdown-menu-item flex items-center gap-2" data-context-switcher-option data-context-switcher-label="Globex Corp" data-context-switcher-avatar="GC" data-testid="team-switcher-option-globex">
      <span class="avatar-fallback avatar-sm">GC</span> Globex Corp
    </button>
  </div>
</div>
```

## Static HTML usage — Language Switcher

```html
<div class="relative inline-block text-left">
  <button type="button" id="language-switcher-trigger" data-testid="language-switcher-trigger" popovertarget="language-switcher-panel" aria-expanded="false" data-dropdown-trigger data-context-switcher-trigger class="btn-secondary">
    <span data-context-switcher-current-label data-testid="language-switcher-current-label">English</span>
  </button>
  <div id="language-switcher-panel" popover="auto" role="menu" aria-labelledby="language-switcher-trigger" class="dropdown-menu-panel" data-testid="language-switcher-panel">
    <button type="button" role="menuitem" class="dropdown-menu-item" data-context-switcher-option data-context-switcher-label="English" data-testid="language-switcher-option-en">English</button>
    <button type="button" role="menuitem" class="dropdown-menu-item" data-context-switcher-option data-context-switcher-label="Português" data-testid="language-switcher-option-pt">Português</button>
    <button type="button" role="menuitem" class="dropdown-menu-item" data-context-switcher-option data-context-switcher-label="Español" data-testid="language-switcher-option-es">Español</button>
  </div>
</div>
```

## React wrapper shape

Both reuse `useDropdownMenu` directly (not the base `DropdownMenu`
component, which has no per-item avatar content slot) since Team
Switcher needs richer item content than plain text:

```tsx
import { useId, useState } from "react";
import { useDropdownMenu, type DropdownMenuItemData } from "../hooks/useDropdownMenu";

export interface SwitcherOption {
  label: string;
  avatarInitials?: string;
}
export interface ContextSwitcherProps {
  options: SwitcherOption[];
  initialSelected?: number;
  "data-testid"?: string;
}
export function ContextSwitcher({ options, initialSelected = 0, "data-testid": testId }: ContextSwitcherProps) {
  const [current, setCurrent] = useState(options[initialSelected]);
  const items: DropdownMenuItemData[] = options.map((opt, i) => ({
    id: `option-${i}`,
    label: opt.label,
    onSelect: () => setCurrent(opt),
  }));
  const { isOpen, panelRef, triggerRef, itemRefs, onPanelKeyDown, selectItem } = useDropdownMenu(items);
  const triggerId = useId();

  return (
    <div className="relative inline-block text-left">
      <button ref={triggerRef} id={triggerId} type="button" data-testid={testId} aria-expanded={isOpen} aria-haspopup="menu" className="btn-secondary inline-flex items-center gap-2">
        {current.avatarInitials && <span className="avatar-fallback">{current.avatarInitials}</span>}
        <span>{current.label}</span>
      </button>
      <div ref={panelRef} role="menu" aria-labelledby={triggerId} className="dropdown-menu-panel" onKeyDown={onPanelKeyDown}>
        {items.map((item, i) => (
          <button key={item.id} ref={(el) => (itemRefs.current[i] = el)} type="button" role="menuitem" className="dropdown-menu-item flex items-center gap-2" onClick={() => selectItem(item)}>
            {options[i].avatarInitials && <span className="avatar-fallback avatar-sm">{options[i].avatarInitials}</span>}
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
```

Language Switcher reuses the identical `ContextSwitcher` component
with `avatarInitials` omitted from every option (the component already
conditionally renders the avatar chip) — NOT a second component, per
research.md R1.

## Acceptance mapping

- FR-001, spec.md US1 Acceptance Scenarios 1-2 → the markup/scripts above
- spec.md Edge Case (selection resets on reload) → no persistence anywhere in this contract
