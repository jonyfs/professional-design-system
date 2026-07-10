# Fix Contract: Dropdown Menu Panel Positioning

## CSS change (`src/styles/tailwind.css` and `packages/react/src/styles.css`)

```css
.dropdown-menu-panel {
  @apply mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg
    ring-1 ring-neutral-300 focus:outline-none;
  position: absolute;
  top: anchor(bottom);
  right: anchor(right);
}
```

Removed from the `@apply` line: `right-0` (superseded by `right:
anchor(right)`). `mt-2`'s existing spacing is kept as the gap between
trigger and panel (anchor positioning doesn't require removing existing
spacing utilities — `margin-top` still applies normally after the
element's anchored position is resolved).

## JS change — unique per-instance anchor name

**Vanilla** (`src/scripts/dropdown-menu.js`):

```js
let anchorCounter = 0;

export function initDropdownMenus() {
  document.querySelectorAll("[data-dropdown-trigger]").forEach((trigger) => {
    const menu = document.getElementById(trigger.getAttribute("popovertarget"));
    if (!menu) return;
    const anchorName = `--dropdown-anchor-${anchorCounter++}`;
    trigger.style.anchorName = anchorName;
    menu.style.positionAnchor = anchorName;
    // ...existing logic unchanged below this point
  });
}
```

**React** (`packages/react/src/hooks/useDropdownMenu.ts`): inside the
existing ref effect (the one that already sets `panel.popover = "auto"`
and the native invoker properties):

```ts
const anchorName = `--dropdown-anchor-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
// ...
trigger.style.anchorName = anchorName;
panel.style.positionAnchor = anchorName;
```

## Required verification (Principle II / FR-004 gate)

| Assertion | Mechanism |
|---|---|
| Panel positioned adjacent to trigger, not viewport-centered | New Playwright test: compare `panel.boundingBox()` against `trigger.boundingBox()` — panel's top edge within a few pixels of the trigger's bottom edge, horizontally overlapping |
| No regression to existing keyboard/focus/ARIA behavior | Full existing `dropdown-menu.spec.ts`/`react-dropdown-menu.spec.ts` suites re-run, zero regressions expected |
| No new design tokens | `audit-tokens.mjs`/`check-contrast.mjs` unchanged pass |

## Acceptance mapping

- FR-001, FR-003, FR-004, FR-005, FR-006 → this contract
- SC-001, SC-002, SC-003 → verified by `tests/e2e/dropdown-menu.spec.ts`,
  `tests/e2e/react-dropdown-menu.spec.ts`
