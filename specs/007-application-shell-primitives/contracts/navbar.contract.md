# Component Contract: Navbar / Header

## Markup contract

```html
<header data-testid="navbar" class="navbar">
  <div class="navbar-inner">
    <a href="/" class="text-lg font-bold text-neutral-900">Acme</a>

    <nav aria-label="Main navigation" class="hidden lg:flex lg:items-center lg:gap-6">
      <a href="#" class="navbar-link">Product</a>
      <a href="#" class="navbar-link">Pricing</a>
      <a href="#" class="navbar-link">Docs</a>
      <a href="#" class="navbar-link">About</a>
    </nav>

    <details class="group lg:hidden" data-testid="navbar-mobile-menu">
      <summary class="navbar-menu-trigger" aria-label="Menu">
        <svg viewBox="0 0 20 20" fill="currentColor" class="h-6 w-6" aria-hidden="true">
          <path fill-rule="evenodd" d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75Zm0 10.5a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1-.75-.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Z" clip-rule="evenodd" />
        </svg>
      </summary>
      <div class="navbar-mobile-panel">
        <a href="#" class="navbar-link">Product</a>
        <a href="#" class="navbar-link">Pricing</a>
        <a href="#" class="navbar-link">Docs</a>
        <a href="#" class="navbar-link">About</a>
      </div>
    </details>
  </div>
</header>
```

## Behavior wiring

None — zero JavaScript. `<details>`/`<summary>` provides the mobile
menu's open/close toggle natively (research.md R1), the exact mechanism
Accordion already established in feature 005.

## Required attributes (Principle I/II gate, FR-006/FR-007)

| Behavior | Mechanism |
|---|---|
| Pinned to viewport top during scroll | `sticky top-0 z-40` |
| Legible background without `backdrop-filter` support | Plain `bg-white` (opaque) as the base; `supports-[backdrop-filter]:bg-white/80 supports-[backdrop-filter]:backdrop-blur-md` as an additive enhancement only where supported (data-model.md) |
| Full nav at wide viewports, hamburger at narrow | `hidden lg:flex` on the full nav; `lg:hidden` on the `<details>` mobile menu |
| Mobile menu has an accessible name | `aria-label="Menu"` on the `<summary>` |
| Mobile menu touch target ≥44×44px | `.navbar-menu-trigger`'s `h-11 w-11` (44px × 44px exactly) |

## Required states (Principle V gate)

| Element | State | Required utility |
|---|---|---|
| `.navbar-link` | hover | `hover:text-neutral-900` |
| `.navbar-link` | active | `active:text-neutral-700` (matching Breadcrumbs' established hover/active convention) |
| `.navbar-menu-trigger` | hover | `hover:bg-neutral-100 hover:text-neutral-900` |
| `.navbar-menu-trigger` | active | `active:scale-95` (matching `close-icon-btn`'s existing press-feedback idiom) |
| both | focus-visible | `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand` |

`active:` is declared per Principle V's unconditional mandate — a first
draft omitted it across all three of this feature's components, which
`/speckit-analyze` caught as a CRITICAL gap before implementation.

## Edge cases

- **Mobile menu left open across a resize to a wide viewport (spec.md
  Edge Case)**: not reset via JavaScript (there is none) — at `lg:` and
  above, the `<details>` element itself is hidden (`lg:hidden`) regardless
  of its own `open` attribute, so an open-but-now-hidden mobile menu has
  no visible effect; reopening it at a narrow viewport later starts from
  its last state, which is acceptable native behavior, not a regression,
  since the element causing any visual effect is unconditionally hidden
  at wide viewports either way.
- **No `backdrop-filter` support (spec.md Edge Case)**: verified via
  `supports-[backdrop-filter]:...` — the plain `bg-white` base ensures
  content is never illegible even without translucency support.

## Token allowlist used

`text-neutral-900` (brand wordmark), `text-neutral-600`/`hover:text-neutral-900`
(nav links, matching every other component's established link-hover
pattern), `border-neutral-200` (bottom border, as ratified), `bg-white`
(opaque base + `backdrop-filter`-supported translucent variant, as
ratified). No raw palette classes (FR-008).

## Acceptance mapping

- FR-006, FR-007, FR-008, FR-009, FR-010, FR-012 → this contract
- SC-001, SC-002, SC-003 → verified by `tests/e2e/navbar.spec.ts`,
  `scripts/audit-tokens.mjs`, `scripts/check-contrast.mjs`
