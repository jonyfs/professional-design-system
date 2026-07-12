# Component Contract: Kbd

## Markup contract

```html
<p class="text-sm text-neutral-600">
  Press <kbd class="kbd">⌘</kbd><kbd class="kbd">K</kbd> to open the command palette.
</p>
```

```css
.kbd {
  @apply inline-flex min-w-[1.5rem] items-center justify-center rounded-sm
    border border-neutral-300 bg-neutral-50 px-1.5 py-0.5 font-mono text-xs
    text-neutral-700 shadow-sm;
}
```

`font-mono` requires a new `mono` key added to `shared/design-tokens.ts`'s
`fontFamily` object (R3) — none existed previously (only `sans`):
`["ui-monospace", "SFMono-Regular", "Menlo", "monospace"]`, a standard
system stack requiring no new font file/CDN link.

## Required classes (Principle V gate)

Non-interactive inline element — no state suffixes apply.

## Required attributes

- Real `<kbd>` element (native semantics communicate "this represents
  keyboard input" to assistive technology without any ARIA needed)

## Token allowlist used

`border-neutral-300`, `bg-neutral-50`, `text-neutral-700` — all
already-ratified. Plus the one new token this feature adds: `fontFamily.mono`
(R3).

## Acceptance mapping

- FR-003, R3 → `tests/e2e/kbd.spec.ts`
- Cross-reference: Command Palette's existing markup (feature 008) is
  assessed for whether it should adopt this component to display its ⌘K
  shortcut — a cross-cutting task in tasks.md (T066, sequenced in Phase 5
  for dependency reasons only, not a US4/Context Menu task), not assumed
  necessary here
