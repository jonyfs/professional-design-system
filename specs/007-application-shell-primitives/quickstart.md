# Quickstart: Application Shell Primitives

## Prerequisites

Same as every prior feature — no new dependencies.

```bash
npm install
npx playwright install --with-deps
```

## Run the component gallery

```bash
npm run dev
```

All three demo pages load with zero `<script>` tags — this is the first
static-HTML feature since 003 to ship no JavaScript at all.

## Validate token discipline and AAA/non-text contrast (Principle IV / II gates)

```bash
npm run audit:tokens
npm run audit:contrast
```

**Expected outcome**: `audit:tokens` passes with zero new tokens (every
color used is already ratified). `audit:contrast` requires new
`BASE_TOKENS`/`PAIRINGS` entries for `neutral-300`-on-`neutral-900` (new
pairing) and `neutral-700`-on-white (new pairing) — add these as part of
implementation, the same way feature 006 extended the script for its own
new pairings, not deferred.

## Run the full test suite

```bash
npm run build
npm run test:e2e
```

**Expected outcome**: all specs pass, including the three new ones
(`pagination.spec.ts`, `sidebar.spec.ts`, `navbar.spec.ts`). `npm run
build` MUST produce all three new pages in `dist/src/components/` —
confirm via `ls`.

## Generating new visual regression baselines

Same process as every prior feature — **never locally, never via local
Docker**:

```bash
gh workflow run update-snapshots.yml
gh run list --workflow=update-snapshots.yml --limit 1
gh run download <run-id> -n updated-snapshots -D /tmp/updated-snapshots
# copy the new *-linux.png files into tests/e2e/<component>.spec.ts-snapshots/
```

## Manual validation scenarios (traceable to spec.md)

1. **Pagination current page** (User Story 1, AC1): render on page 3 of
   5 — page 3 is visually distinct with `aria-current="page"`.
2. **Pagination boundary disabling** (AC2-AC3): render on page 1 — Previous
   is genuinely disabled; render on the last page — Next is genuinely
   disabled.
3. **Pagination truncation** (AC4): render with 10+ pages — an ellipsis
   appears for the omitted range.
4. **Sidebar active item** (User Story 2, AC1): render with one item
   marked active — visually and semantically distinct from the rest.
5. **Sidebar hover** (AC2): hover an inactive item — distinct from resting
   and active states.
6. **Sidebar dark theme AAA** (AC3): render the dark variant — run an
   axe-core scan, confirm zero violations (this is the whole point of
   research.md R3's correction).
7. **Navbar wide viewport** (User Story 3, AC1): render at 1440px — full
   nav visible, hamburger hidden.
8. **Navbar narrow viewport** (AC2): render at 320px — hamburger visible
   with an accessible name and ≥44×44px target.
9. **Navbar sticky + legible background** (AC3): scroll the page — header
   stays pinned to the top, content underneath never becomes illegible.

## Discoverability check (SC-005)

Same manual, human-only timing check as every prior feature — not
automatable. Track as an outstanding manual QA item in `tasks.md`.

## Constitution amendment reminder

Sidebar and Navbar have pre-existing ratified entries that this feature
**corrects** (not just implements) — two real AAA gaps found by
research.md R3 (`bg-brand text-white` → `bg-brand-dark text-white`;
`text-neutral-400` → `text-neutral-300` on dark backgrounds). Pagination
has no pre-existing entry. Once implementation is verified stable, run
`/speckit-constitution` to fold both corrections and the new Pagination
pattern into the Application & Navigation Component Catalog section
(MINOR version bump) — do not skip this, since leaving the ratified text
uncorrected would mean the constitution itself continues to document a
pattern that fails AAA, the exact "ratified but never empirically
verified" trap this project has now hit three times (Breadcrumbs, Lists,
Sidebar).
