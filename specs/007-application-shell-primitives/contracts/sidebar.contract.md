# Component Contract: Sidebar

## Markup contract

```html
<!-- Light theme -->
<nav aria-label="Main" data-testid="sidebar-light" class="sidebar sidebar-light">
  <a href="#" data-testid="sidebar-item-dashboard" aria-current="page" class="sidebar-item sidebar-item-light">
    Dashboard
  </a>
  <a href="#" data-testid="sidebar-item-projects" class="sidebar-item sidebar-item-light">
    Projects
  </a>
  <a href="#" data-testid="sidebar-item-team" class="sidebar-item sidebar-item-light">
    Team
  </a>
  <a href="#" data-testid="sidebar-item-settings" class="sidebar-item sidebar-item-light">
    Settings
  </a>
</nav>

<!-- Dark theme -->
<nav aria-label="Main" data-testid="sidebar-dark" class="sidebar sidebar-dark">
  <a href="#" data-testid="sidebar-dark-item-dashboard" aria-current="page" class="sidebar-item sidebar-item-dark">
    Dashboard
  </a>
  <a href="#" data-testid="sidebar-dark-item-projects" class="sidebar-item sidebar-item-dark">
    Projects
  </a>
  <a href="#" data-testid="sidebar-dark-item-team" class="sidebar-item sidebar-item-dark">
    Team
  </a>
  <a href="#" data-testid="sidebar-dark-item-settings" class="sidebar-item sidebar-item-dark">
    Settings
  </a>
</nav>
```

## Behavior wiring

None — zero JavaScript. The active item is static, consumer/router-composed
markup (data-model.md Assumptions).

## Required attributes (Principle II gate, FR-005)

| Behavior | Mechanism |
|---|---|
| Exactly one active item, visually + semantically distinct | `aria-current="page"` + `.sidebar-item[aria-current="page"]` |
| Both themes independently AAA-compliant | `.sidebar-item-light`/`.sidebar-item-dark` use different, independently-verified resting-text tokens (data-model.md's two corrections) |
| Distinct navigation landmark | `<nav aria-label="Main">` |

## Required states (Principle V gate)

| Element | State | Required utility |
|---|---|---|
| `.sidebar-item-light` | hover | `hover:bg-neutral-100` |
| `.sidebar-item-light` | active | `active:bg-neutral-200` |
| `.sidebar-item-dark` | hover | `hover:bg-neutral-800` |
| `.sidebar-item-dark` | active | `active:bg-neutral-700` |
| `.sidebar-item[aria-current="page"]` | current/active item | `bg-brand-dark text-white` |
| `.sidebar-item` | focus-visible | `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand` |

`active:` is declared per Principle V's unconditional mandate — a first
draft omitted it across all three of this feature's components, which
`/speckit-analyze` caught as a CRITICAL gap before implementation.

## Edge cases

- **Long item label wrapping (spec.md Edge Case)**: `.sidebar-item` has no
  `truncate`/`whitespace-nowrap` utility, so long labels wrap onto a
  second line within the fixed-width `.sidebar` container rather than
  overflowing or truncating — verified visually during implementation
  with an intentionally long label in the gallery demo.

## Token allowlist used — with two real AAA corrections

`text-neutral-700` (light theme resting — not specified by the
originally-ratified pattern at all, proposed here at the AAA floor,
10.31:1), `bg-neutral-100` (light theme hover), `text-neutral-300`
(dark theme resting — **corrected** from the ratified pattern's literal
`text-neutral-400`, which measures 6.99:1 against `bg-neutral-900` and
fails AAA by a hair; `text-neutral-300` measures 12.04:1), `bg-neutral-800`
(dark theme hover, as ratified), `bg-brand-dark text-white` (active item
— **corrected** from the ratified pattern's literal `bg-brand text-white`,
which measures 4.83:1 and fails AAA; `bg-brand-dark` reuses Button
primary's already-verified pair, 7.90:1). No raw palette classes (FR-008).

## Acceptance mapping

- FR-005, FR-008, FR-009, FR-010, FR-012 → this contract
- SC-001, SC-002, SC-003, SC-005 → verified by `tests/e2e/sidebar.spec.ts`,
  `scripts/audit-tokens.mjs`, `scripts/check-contrast.mjs`
