# Component Contract: Empty State

## Markup contract

```html
<div class="flex flex-col items-center gap-3 py-12 text-center">
  <svg aria-hidden="true" class="h-10 w-10 text-neutral-400">...</svg>
  <h3 class="text-sm font-semibold text-neutral-900">No projects yet</h3>
  <p class="max-w-sm text-sm text-neutral-600">
    Get started by creating your first project.
  </p>
  <button type="button" class="btn-primary mt-2">New project</button>
</div>
```

**Compositional pattern only — no new CSS class ships** (R6). Every class
above is an existing Tailwind utility or an already-ratified component class
(`.btn-primary`). This is documented in the constitution as a recipe, not a
new catalog primitive with its own name.

## Required classes (Principle V gate)

Non-interactive container — no state suffixes of its own. The optional
action button carries its own existing Button contract's states unchanged.

## Required attributes

- Icon (if present) MUST be `aria-hidden="true"` — decorative, the heading
  text already carries the meaning
- Heading MUST be a real heading element (`<h2>`/`<h3>`, matching the
  surrounding page's heading hierarchy) — never a styled `<div>` standing in
  for one

## Token allowlist used

`text-neutral-900`, `text-neutral-600`, `text-neutral-400` — all
already-ratified, reused verbatim. No new tokens.

## Acceptance mapping

- FR-008, SC-003 → `tests/e2e/empty-state.spec.ts`
