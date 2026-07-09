# Quickstart: Data Display Primitives

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

Avatar and Card demo pages load with zero `<script>` tags. Alert/Banner's
demo page loads `src/scripts/alert.js` as a module.

## Validate token discipline and AAA/non-text contrast (Principle IV / II gates)

```bash
npm run audit:tokens
npm run audit:contrast
```

**Expected outcome**: both pass with zero new tokens — research.md
R2-R4 verified every proposed color reuses an already-ratified token
before implementation. If either script fails, treat it as a real
finding (per feature 005's precedent — a real `text-neutral-500` AAA
failure was found and fixed, not assumed away), not evidence the audit
scripts need adjusting.

## Run the full test suite

```bash
npm run build
npm run test:e2e
```

**Expected outcome**: all specs pass, including the three new ones
(`avatar.spec.ts`, `card.spec.ts`, `alert.spec.ts`) alongside every
existing spec from features 001-005. `npm run build` MUST produce all
three new component pages in `dist/` — confirm via `ls dist/src/components/`
that `avatar/`, `card/`, and `alert/` are present (feature 005's real
build-config gap: pages 404'd in production despite passing tests against
the dev server, because `vite.config.ts`'s `rollupOptions.input` wasn't
updated).

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

1. **Avatar image + fallback** (User Story 1, AC1-AC2): render both
   variants at both sizes — the image variant clips to a circle with
   `alt` text; the fallback variant shows legible initials on a
   AAA-contrast background.
2. **Card visual separation** (User Story 2, AC1): render 2+ cards side
   by side — each has a clear border+shadow boundary from the page and
   from its neighbors.
3. **Card hover elevation** (AC2): hover an elevated card — its shadow
   deepens with no layout shift.
4. **Card composition** (AC3): render a card containing an Avatar and a
   Badge — no visual conflicts.
5. **Alert severity distinction** (User Story 3, AC1): render all four
   severity variants side by side — each is visually distinguishable by
   color and icon alone, without reading the message.
6. **Alert dismissal** (AC2): click the dismissible variant's close
   button — inspect via DevTools that the node is fully removed, not just
   hidden.
7. **Non-dismissible default** (AC3): render the default variant — no
   close button is present in the DOM at all.
8. **Alert perceivable without interaction** (AC4): with a screen reader
   running, navigate the page top-to-bottom — the Alert's content and
   severity are announced as ordinary page content, not as a distinct
   live-region event.

## Discoverability check (SC-005)

Same manual, human-only timing check as every prior feature — not
automatable. Track as an outstanding manual QA item in `tasks.md`.

## Constitution amendment reminder

Card and Alert/Banner have no pre-existing catalog entry (like Accordion/
Tabs/Dropdown Menu in feature 005); Avatar reuses the existing ratified
Lists avatar size. Once implementation is verified stable, run
`/speckit-constitution` to ratify the new patterns into the Data Display
& Listings section (MINOR version bump), per the same sequence feature
005 used.
