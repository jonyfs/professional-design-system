# Phase 0 Research: Design System Primitive Components

## Decision: Tailwind CSS 3.4.x (config-file based), not Tailwind 4

**Rationale**: The constitution's Principle III explicitly describes the
styling architecture in terms of `theme()`, `@layer`, and "Tailwind
configuration tokens" — the classic `tailwind.config.js`/`.ts` model. Tailwind
3.4 has the mature, widely-documented JS/TS config surface for semantic token
extension (`theme.extend.colors`, `theme.extend.borderRadius`, etc.) that this
constitution assumes. It is also the version most Tailwind UI reference
patterns (already quoted verbatim in the constitution's Component Catalog
section) were authored against, minimizing translation risk.

**Alternatives considered**: Tailwind CSS 4 (CSS-first `@theme` config, no
required `tailwind.config.js`) — rejected for this feature because it would
require re-deriving every semantic token mapping into CSS custom properties
and is a materially different authoring model than what the constitution
documents; revisit in a future major-version migration feature, not silently
inside a primitives feature.

## Decision: Vite as the dev/build tool

**Rationale**: Needed a lightweight way to serve multiple standalone HTML
component partials plus a gallery page with live reload during development,
and to produce a static production build. Vite has first-class multi-page
HTML support out of the box, near-zero config for a plain HTML + Tailwind
project, and integrates cleanly with the Playwright test runner (both read
`vite.config.ts` for base path/port).

**Alternatives considered**: Tailwind CLI + a static file server (`serve`) —
simpler, but no live reload and no multi-page HTML build graph; would need a
second tool for production bundling later. Rejected in favor of Vite's single
toolchain covering both dev and build.

## Decision: Playwright for visual regression + accessibility

**Rationale**: Already the E2E standard referenced in [web/testing.md] rules
(breakpoints 320/768/1024/1440, Chrome/Firefox/Safari coverage). `@playwright/test`
ships built-in screenshot assertions (`toHaveScreenshot`) for visual regression
and composes directly with `@axe-core/playwright` for automated WCAG scans —
one test runner covers both concerns without a second framework.

**Alternatives considered**: Storybook + Chromatic for visual regression —
rejected as unnecessary infrastructure (paid service, extra build step) for a
4-component slice; Playwright alone is sufficient and already the project's
established E2E tool per the global testing rules.

## Decision: Custom Node scripts for token-discipline and contrast gates

**Rationale**: Principle IV (zero raw palette classes) and Principle II (AAA
contrast) are project-specific, non-negotiable gates with no off-the-shelf
linter that understands this constitution's exact token table. Two small,
dependency-light scripts are more auditable and precise than configuring a
generic ESLint/Stylelint plugin to approximate the same rule:
- `scripts/audit-tokens.mjs` — parses the rendered HTML/class output for any
  Tailwind color/radius utility not present in the constitution's token
  allowlist (derived from `tailwind.config.ts`'s `theme.extend`).
- `scripts/check-contrast.mjs` — uses the `wcag-contrast` npm package to
  compute contrast ratios for every foreground/background token pairing used
  by the four components and fails if any pairing is below the AAA threshold
  (7:1 normal text, 4.5:1 large text/UI components).

**Alternatives considered**: `eslint-plugin-tailwindcss` — good for class
sorting/duplicate detection, but does not understand "semantic token
allowlist vs. raw palette" as a concept; would need custom rule authoring
anyway. Rejected in favor of the purpose-built script, which is simpler to
reason about and directly enforceable in a pre-commit/test step.

## Resolved unknowns

All `NEEDS CLARIFICATION` markers from the Technical Context are resolved
above. No open questions remain for Phase 1.
