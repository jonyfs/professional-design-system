# Component Contract: Breadcrumbs

## Markup contract

```html
<nav aria-label="Breadcrumb" data-testid="breadcrumbs" class="breadcrumb-nav">
  <ol class="flex flex-wrap items-center gap-2">
    <li class="flex items-center gap-2">
      <a href="/" class="breadcrumb-link" data-testid="breadcrumb-link-0">Home</a>
      <svg viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5 breadcrumb-divider" aria-hidden="true">
        <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z" clip-rule="evenodd" />
      </svg>
    </li>
    <li class="flex items-center gap-2">
      <a href="/category" class="breadcrumb-link" data-testid="breadcrumb-link-1">Category</a>
      <svg viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5 breadcrumb-divider" aria-hidden="true">
        <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z" clip-rule="evenodd" />
      </svg>
    </li>
    <li>
      <span aria-current="page" class="breadcrumb-current" data-testid="breadcrumb-current">
        Current Page
      </span>
    </li>
  </ol>
</nav>
```

Single-entry Edge Case (only the current page, no ancestors — still
renders the `<nav>` wrapper, per data-model.md's validation rules):

```html
<nav aria-label="Breadcrumb" data-testid="breadcrumbs-single" class="breadcrumb-nav">
  <ol class="flex flex-wrap items-center gap-2">
    <li>
      <span aria-current="page" class="breadcrumb-current" data-testid="breadcrumb-current">
        Current Page
      </span>
    </li>
  </ol>
</nav>
```

## Behavior wiring

None — zero JavaScript (FR-002). Plain `<a>` navigation.

## Required attributes (Principle II gate, FR-001)

| Behavior | Mechanism |
|---|---|
| Distinct navigation landmark | `<nav aria-label="Breadcrumb">` — distinguishes it from the page's primary `<nav aria-label="Main navigation">` so assistive tech users can jump directly to either |
| Current page marked non-interactive | Rendered as `<span>`, not `<a>` — cannot be activated |
| Current page announced as current location | `aria-current="page"` |
| Divider icons hidden from assistive tech | `aria-hidden="true"` on each `<svg>` — purely decorative, the list structure already conveys order |

## Required states (Principle V gate)

Only `.breadcrumb-link` is interactive (the current-page `<span>` is not):

| State | Required utility |
|---|---|
| resting | `text-neutral-600` |
| hover | `hover:text-neutral-900 transition-colors duration-150` |
| active | `active:text-neutral-700` |
| focus-visible | `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand rounded-sm` |

Resting color is `text-neutral-600`, not the constitution's originally
ratified `text-neutral-500` — found during implementation: a real
`@axe-core/playwright` scan against the rendered page failed AAA (4.83:1,
below the 7:1 normal-text threshold; `text-neutral-600` measures 7.56:1).
See data-model.md's AAA contrast correction note.

`active:` is declared per Principle V's unconditional mandate for any `<a>`
(FR-013, corrected after `/speckit-analyze` — an earlier draft's "plain
navigational anchors, not action buttons" reasoning was exactly the
"applicable" hedge FR-013 no longer permits). No `disabled:` utility is
declared, but not as a scope hedge either: Tailwind's `disabled:` variant
targets the `:disabled` CSS pseudo-class, which cannot match on an `<a>`
element regardless of what utilities are appended to it — an unreachable
ancestor is rendered as `.breadcrumb-current` (a `<span>`, the same
non-interactive treatment already used for the current page), never as a
"disabled" anchor (data-model.md).

## Edge cases (long trail / long label, narrow viewport)

Per spec.md's Edge Cases, on narrow viewports (320px) a long trail or long
individual label MUST NOT cause horizontal page overflow. The `<ol>`'s
`flex-wrap` utility (added after `/speckit-analyze` caught that the first
draft omitted it — Tailwind's default is `flex-wrap: nowrap`, so *omitting*
the utility would have caused exactly the horizontal overflow this Edge
Case warns against, the opposite of the first draft's claim) lets trail
items wrap onto a second line once `gap-2` spacing is exceeded, rather than
truncating labels or scrolling horizontally — keeping every ancestor level
reachable and readable rather than hidden behind a scroll affordance.

## Token allowlist used

`text-neutral-600` (resting link — corrected from the constitution's
originally ratified `text-neutral-500` after a real AAA contrast failure,
see above), `text-neutral-700` (link active), `text-neutral-900` (hover /
current page), `text-neutral-300` (divider —
the constitution's ratified pattern
allows either token for the divider; `neutral-300` is used here for the
icon, `neutral-500` for link text, matching the ratified string exactly:
"dividers `text-neutral-300` or a minimum `h-5 w-5` Chevron icon"). No raw
palette classes (FR-011).

## Acceptance mapping

- FR-001, FR-002, FR-011, FR-012, FR-013, FR-015 → this contract
- SC-001, SC-002, SC-003 → verified by `tests/e2e/breadcrumbs.spec.ts`,
  `scripts/audit-tokens.mjs`, `scripts/check-contrast.mjs`
