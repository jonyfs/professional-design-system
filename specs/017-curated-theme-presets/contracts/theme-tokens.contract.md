# Contract: Theme Token Architecture

## `tailwind.config.ts` / `packages/react/tailwind.config.ts` changes

```ts
// shared/design-tokens.ts — colors object values become CSS custom-
// property references instead of static hex strings. The RGB-tuple
// pattern (space-separated components) preserves Tailwind's opacity-
// modifier syntax (bg-success/5, ring-warning/10), confirmed empirically
// (research.md R1) — a plain var(--x) without RGB decomposition would
// NOT support opacity modifiers.
export const colors = {
  brand: {
    light: "rgb(var(--color-brand-light) / <alpha-value>)",
    DEFAULT: "rgb(var(--color-brand) / <alpha-value>)",
    dark: "rgb(var(--color-brand-dark) / <alpha-value>)",
  },
  neutral: {
    50: "rgb(var(--color-neutral-50) / <alpha-value>)",
    // ... 100-800 identical pattern ...
    900: "rgb(var(--color-neutral-900) / <alpha-value>)",
  },
  success: {
    DEFAULT: "rgb(var(--color-success) / <alpha-value>)",
    strong: "rgb(var(--color-success-strong) / <alpha-value>)",
  },
  // warning, error, info — identical DEFAULT/strong pattern
};
```

No component file's `class="..."` attribute changes at all — `bg-brand-
dark`, `text-neutral-900`, `bg-success/5`, `ring-warning/10` all
continue to work exactly as before; only what those Tailwind utilities
COMPILE TO changes (from a literal hex value to a `rgb(var(...))`
expression that resolves against whatever `--color-*` values are
currently in scope via the active `[data-theme]`).

## `src/styles/themes.css` (NEW file)

```css
/* Each theme is a flat block of 21 custom properties. `:root` (no
   attribute needed) carries the DEFAULT theme's values so an unthemed
   page (or one where the switcher script hasn't run yet, e.g. no-JS)
   still renders correctly — this is the "light" theme, the pure
   refactor of this catalog's pre-existing single palette. */
:root,
[data-theme="light"] {
  --color-brand-light: 230 240 255;   /* #E6F0FF, unchanged from today */
  --color-brand: 0 102 255;            /* #0066FF, unchanged from today */
  --color-brand-dark: 0 75 179;        /* #004BB3, unchanged from today */
  --color-neutral-50: 249 250 251;
  /* ... neutral-100 through neutral-800 ... */
  --color-neutral-900: 17 24 39;
  --color-success: 16 185 129;
  --color-success-strong: 6 95 70;
  --color-warning: 245 158 11;
  --color-warning-strong: 120 53 15;
  --color-error: 239 68 68;
  --color-error-strong: 153 27 27;
  --color-info: 59 130 246;
  --color-info-strong: 30 64 175;
}

[data-theme="nord"] {
  /* 21 properties, Nord's real published palette values converted to
     RGB triplets — exact values are an implementation-phase task, not
     decided in this contract. */
}

/* ... 40 more [data-theme="..."] blocks, one per research.md R3 entry ... */
```

**Required properties per theme (Principle IV gate)**: all 21 —
`--color-brand-light`, `--color-brand`, `--color-brand-dark`,
`--color-neutral-50` through `--color-neutral-900` (10), `--color-
success`, `--color-success-strong`, `--color-warning`, `--color-warning-
strong`, `--color-error`, `--color-error-strong`, `--color-info`,
`--color-info-strong`. A theme missing any property silently falls back
to `:root`'s (the default theme's) value for that one property — the
implementation-phase task list MUST include an automated check that
every theme block declares all 21, not rely on visual review alone.

## `scripts/check-contrast.mjs` parametrization

```js
// Existing PAIRINGS/RING_PAIRINGS keep their exact current shape (fg/bg
// token names + threshold) — nothing about the RELATIONSHIPS changes.
// What's NEW: a themes loop that re-resolves each pairing's fg/bg token
// names against EVERY theme's own RGB values (imported from
// shared/design-tokens.ts's new theme map) instead of the single
// existing TOKENS lookup table, reporting failures per-theme.
for (const theme of ALL_THEMES) {
  for (const { name, fg, bg, threshold } of [...PAIRINGS, ...RING_PAIRINGS]) {
    const ratio = hex(theme.tokens[fg], theme.tokens[bg]);
    if (ratio < threshold) {
      failures.push(`[theme: ${theme.id}] ${name}: ${ratio.toFixed(2)}:1 — below required ${threshold}:1`);
    }
  }
}
```

This is a parametrization of the EXISTING script's existing arrays, not
a rewrite — the single source of truth for "which pairings matter"
remains `PAIRINGS`/`RING_PAIRINGS`, now evaluated 42 times (once per
theme) instead of once.

## Acceptance mapping

- FR-002, FR-007, SC-003 → `scripts/check-contrast.mjs`'s parametrized
  per-theme run (no per-theme Playwright test needed for contrast
  itself — this is a build-time/CI audit, matching how the single
  existing theme's contrast is verified today)
