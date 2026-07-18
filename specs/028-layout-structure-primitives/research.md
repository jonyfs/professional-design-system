# Research: Layout & Structure Primitives

## R1. Per-primitive token mapping (verified against real source, not assumed)

**Decision**: every primitive maps to Tailwind utility classes already
used throughout this catalog — confirmed by reading `src/styles/
tailwind.css` and existing component files directly, not inferred from
name alone.

| Primitive | Real existing convention reused | New `@apply` class |
|---|---|---|
| Stack | `space-y-*` (used throughout, e.g. `space-y-2`/`space-y-6`/`space-y-8` across dozens of demo pages) | `.stack` (base) + size modifiers `.stack-xs`/`.stack-sm`/`.stack-md`/`.stack-lg` mapping to the existing `space-y-2/4/6/8` scale already in informal use |
| Group | `flex items-center gap-*` (used verbatim in dashboard-example.html's avatar row, navbar-inner, etc.) | `.group-row` (avoids colliding with Tailwind's own built-in `.group` hover-state utility — the same collision class this catalog already hit once with `.collapse` vs Tailwind's `visibility: collapse`, feature 023) |
| Center | `flex items-center justify-center` (used in several existing icon-button classes) | `.center` |
| Container | This catalog's existing page-content max-width convention — verified: `dashboard-example`'s `max-w-2xl`, `index.html`'s category sections use `max-w-5xl`/`max-w-7xl` inconsistently across pages today | `.container-page` standardizing on `max-w-5xl px-6` (the most common existing value, per `navbar.html`'s `<main class="mx-auto max-w-5xl px-6 py-10">`) |
| Paper | Card's real existing tokens — verified: `.card { @apply rounded-lg border border-neutral-200 bg-neutral-50 p-6 shadow-sm; }` (or equivalent) | `.paper` — same border/radius/background, no shadow, no mandated padding scale (lighter weight, per spec.md US2) |
| Grid | CSS Grid, new pattern per feature 018's own signal — column-count controlled via existing breakpoint convention | `.grid-responsive` + `.grid-cols-{2,3,4}` responsive variants using this catalog's existing 320/768/1024/1440 breakpoints |
| SimpleGrid | Grid's own conventions, once built (per feature 018 R1's own note) | `.simple-grid` — thin wrapper matching Grid's responsive column rules, no per-item span control |
| Flex | Existing flex utility conventions (`flex`, `flex-col`, `items-*`, `justify-*`, already used ad hoc everywhere) | `.flex-row`/`.flex-col` base classes with gap-scale modifiers matching Stack/Group's scale |
| AppShell | See R5 below — composition, not a token mapping | `.app-shell`, `.app-shell-main` |

**Naming collision check** (per this catalog's own established
precedent of Tailwind-builtin collisions — `.list-item` feature 011,
`.data-table*` feature 012, `.collapse` feature 023): `.group` and
`.container` are BOTH real Tailwind built-in utilities (`.group` for
`group-hover:`-style state scoping, `.container` for a breakpoint-
keyed max-width utility) — verified by checking Tailwind's own
generated output. Both are renamed (`.group-row`, `.container-page`)
to avoid silently colliding with a component class of the same name,
exactly like `.collapse` → `.collapse-item` was renamed for this same
reason in feature 023.

## R2. Static-HTML shipping mechanics

**Decision**: each of the 8 presentational primitives ships as a
`src/components/<name>/<name>.html` demo page following this
catalog's exact existing "trivial component" template (verified
against `divider.html`: CSP meta tag, `page-shell` body class,
`.demo-page-header` wrapper, back-link, theme-selector snippet, no
dedicated JS file beyond the shared `theme-switcher.js`/
`gallery-theme-selector.js` pair) — these primitives introduce zero
interactive behavior, so no new script file is needed for any of the
8. AppShell is the only one needing a demo page that also loads
Navbar's own existing script reference (none currently required,
since Navbar's mobile menu is a native `<details>/<summary>`, zero
JS).

## R3. Breakpoint convention for Grid/SimpleGrid/Flex

**Decision**: reuse this catalog's existing, ratified 4-breakpoint
set (320/768/1024/1440 — `rules/web/testing.md`'s own standard,
already the basis for every Playwright project in `playwright.config.ts`).
Grid's column-count responsive rule: 1 column below 768px, 2 columns
768-1023px, the configured count (2-4) at 1024px+ — matching the
existing responsive pattern already used in `dashboard-example.html`'s
`grid grid-cols-1 gap-6 sm:grid-cols-2` and index.html's card grids.

## R4. React wrapper shape

**Decision**: each of the 8 presentational primitives ships as a
thin styled wrapper component (e.g. `<Stack gap="md">{children}</Stack>`
renders a `<div className="stack stack-md">`) — no internal state, no
hooks, matching this catalog's existing "presentational-only"
component pattern (e.g. how `Highlight`/`Code`/`ColorSwatch` from
feature 023 are implemented). AppShell's React port additionally
imports and composes the existing `Sidebar`/`Navbar` React components
(feature 007/009's ports) rather than re-implementing their markup.

## R5. AppShell's real composition contract — correction from spec.md's assumption

**Finding (verified directly against current source, not assumed)**:
spec.md's FR-004/SC-004 assumed AppShell would "reuse this catalog's
existing Sidebar mobile-collapse behavior." Reading `src/components/
sidebar/sidebar.html` and its `.sidebar`/`.sidebar-light`/
`.sidebar-dark` classes in `src/styles/tailwind.css` directly: **Sidebar
has no mobile-collapse mechanism at all** — it is a fixed `w-64`
flex column with zero responsive breakpoint classes and zero toggle
script. Only Navbar has real, working responsive behavior (a native
`<details>/<summary>` mobile menu, genuinely zero-JS).

**Corrected decision**: AppShell's own mobile behavior is a pure CSS
reflow — Sidebar's region stacks above the main content region below
the 768px breakpoint (the same breakpoint Sidebar's own light/dark
demo already informally uses via `flex flex-wrap`), rather than
collapsing into a hidden drawer. This keeps AppShell consistent with
this batch's zero-new-interactive-script philosophy (matching
Stack/Group/Center/etc.) instead of inventing a new toggle mechanism
that would itself be out of scope for a "layout composition"
primitive. A genuine collapsible/hidden-by-default sidebar drawer
(the more typical "AppShell" mobile pattern in Mantine/Chakra) is
explicitly deferred as a future enhancement to Sidebar itself, not
bundled into this feature — reusing what exists beats inventing new
scope silently.

**spec.md correction applied**: FR-004/SC-004 are amended (see spec.md
edit accompanying this research) to describe AppShell's mobile
behavior as "reflows to a stacked, full-width layout," not "collapses
via Sidebar's existing behavior" — since that behavior doesn't exist.

## R6. Contrast/token audit

**Decision**: since zero new colors are introduced (R1's mapping is
100% reuse), no new `check-contrast.mjs` pairings are needed — the 8
presentational primitives introduce no new fg/bg text pairing beyond
what Card (Paper) and existing borders (Container/Grid) already
verify. Verified during implementation via a real audit run, not
assumed clean by construction.
