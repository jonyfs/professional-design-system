# Component Contract: Divider

## Markup contract

```html
<!-- Semantic thematic break -->
<hr class="divider" />

<!-- Non-semantic, layout-only break, horizontal (e.g. between two flex rows
     where an <hr>'s default block-level box model is unwanted) -->
<div role="separator" class="divider"></div>

<!-- Non-semantic, layout-only break, vertical (e.g. inside a flex toolbar) -->
<div role="separator" aria-orientation="vertical" class="divider-vertical"></div>
```

The `.divider` class itself is reused verbatim for both the semantic `<hr>`
and the non-semantic horizontal `<div>` — the same `border-t` treatment
applies regardless of element, so no second class is needed for the
horizontal non-semantic case (only the vertical orientation needs its own
`.divider-vertical` class, since it changes the box model from a border to
a width/height fill).

```css
.divider {
  @apply border-0 border-t border-neutral-200;
}
.divider-vertical {
  @apply h-full w-px self-stretch bg-neutral-200;
}
```

## Required classes (Principle V gate)

Non-interactive — no state suffixes apply.

## Required attributes

- `<hr>` needs no ARIA (native semantics already communicate a thematic break)
- The `<div>` variant MUST carry `role="separator"` and, when vertical,
  `aria-orientation="vertical"` (horizontal is the ARIA default and needs no
  explicit attribute)

## Token allowlist used

`border-neutral-200`, `bg-neutral-200`. No new tokens.

## Acceptance mapping

- FR-002, SC-001 → `tests/e2e/divider.spec.ts`
