# Component Contract: Accordion / Disclosure

## Markup contract

```html
<div data-testid="accordion" class="divide-y divide-neutral-200 border-t border-neutral-200">
  <details class="group accordion-item" data-testid="accordion-item-0">
    <summary class="accordion-trigger">
      What is your return policy?
      <svg viewBox="0 0 20 20" fill="currentColor" class="accordion-chevron" aria-hidden="true">
        <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
      </svg>
    </summary>
    <p class="accordion-content">
      Items can be returned within 30 days of delivery for a full refund.
    </p>
  </details>
  <details class="group accordion-item" data-testid="accordion-item-1">
    <summary class="accordion-trigger">
      How long does shipping take?
      <svg viewBox="0 0 20 20" fill="currentColor" class="accordion-chevron" aria-hidden="true">
        <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
      </svg>
    </summary>
    <p class="accordion-content">
      Standard shipping takes 3-5 business days within the continental US.
    </p>
  </details>
</div>
```

Single-open-at-a-time (`exclusive`) Edge Case variant — siblings share a
native `name` attribute, no JS added or required:

```html
<div data-testid="accordion-exclusive" class="divide-y divide-neutral-200 border-t border-neutral-200">
  <details name="accordion-exclusive-group" class="group accordion-item" data-testid="accordion-exclusive-item-0">
    <summary class="accordion-trigger">First section<!-- chevron omitted for brevity --></summary>
    <p class="accordion-content">Opening this closes any other open item in the same group.</p>
  </details>
  <details name="accordion-exclusive-group" class="group accordion-item" data-testid="accordion-exclusive-item-1">
    <summary class="accordion-trigger">Second section</summary>
    <p class="accordion-content">Native browser behavior — no JavaScript.</p>
  </details>
</div>
```

## Behavior wiring

None — zero JavaScript (FR-003). The `<details>`/`<summary>` element pair
provides toggle, keyboard activation (Enter/Space on the `summary`, which
is natively focusable and role-mapped), and — for the `exclusive` variant
— mutually-exclusive opening via the shared `name` attribute, entirely
natively.

## Required attributes (Principle II gate, FR-003/FR-004)

| Behavior | Mechanism |
|---|---|
| Open/closed state announced to AT | Native — browsers expose `<summary>` with an implicit disclosure role and expanded/collapsed state with no explicit `aria-expanded` needed |
| Keyboard activation | Native — `<summary>` is focusable and responds to Enter/Space by default |
| Independent state per instance | Native — each `<details>` manages its own `open` attribute independently unless `name` is shared |
| Single-open-at-a-time (Edge Case) | Native — shared `name` attribute, HTML Living Standard's exclusive accordion group mechanism |

## Required states (Principle V gate)

`.accordion-trigger` (the `<summary>` element) is the sole interactive
surface:

| State | Required utility |
|---|---|
| resting | `text-neutral-900` |
| hover | `hover:text-neutral-700` (an earlier draft left this implicit via `cursor-pointer` alone with no color change — `/speckit-analyze` flagged the inconsistency against the other three components in this slice, all of which declare an explicit hover treatment; corrected here) |
| active | `active:text-neutral-600` |
| focus-visible | `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand` |
| open | `.accordion-chevron` rotates 180° via `group-open:rotate-180`, the `<details>` element carries `group` |

`hover:`/`active:` are declared even though `<summary>` sits outside
Principle V's literal `<button>`/`<a>` scope (data-model.md's Principle V
scope note) — matching the principle's intent rather than treating the
literal-tag gap as license to skip them.

No `disabled:` state applies — this slice does not ship a disabled
Accordion item (not required by any acceptance scenario in spec.md).

## Edge cases (long content, layout shift)

Per spec.md's Edge Cases, expanding an item MUST push subsequent content
down predictably with no layout jump on the trigger row itself —
`.accordion-trigger`'s own box (padding, height) does not change between
open/closed states; only `.accordion-content`'s presence changes, which is
native `<details>` behavior (the content is literally removed from layout
when closed, not just visually hidden), verified visually during
implementation rather than assumed.

## Token allowlist used

`text-neutral-900` (trigger label, resting), `text-neutral-700` (trigger
hover), `text-neutral-600` (trigger active, content body), `text-neutral-400`
(chevron resting), `border-neutral-200`/`divide-neutral-200` (item
dividers). No raw palette classes (FR-011).

## Acceptance mapping

- FR-003, FR-004, FR-011, FR-012, FR-013, FR-015 → this contract
- SC-001, SC-002, SC-003 → verified by `tests/e2e/accordion.spec.ts`,
  `scripts/audit-tokens.mjs`, `scripts/check-contrast.mjs`
