# Quickstart: Form Primitives — Round 2

## Prerequisites

Same as feature 001 — this feature adds no new dependencies. If you
haven't already:

```bash
npm install
npx playwright install --with-deps
```

## Run the component gallery

```bash
npm run dev
```

Radio, Select, and Toggle each get their own gallery card linking to a
standalone demo page, alongside the four existing feature 001 components.

## Validate token discipline and AAA contrast (Principle IV / II gates)

```bash
npm run audit:tokens
npm run audit:contrast
```

**Expected outcome**: both pass with 0 violations. No new entries were
needed in either script's allowlist/pairings for this feature (research.md
verified Radio/Select reuse feature 001's exact tokens, and Toggle's new
`ring-neutral-500` boundary is a non-text use already covered by
`audit-tokens.mjs`'s color allowlist).

## Run the full test suite

```bash
npm run build
npm run test:e2e
```

**Expected outcome**: all specs pass, including the three new ones
(`radio.spec.ts`, `select.spec.ts`, `toggle.spec.ts`) alongside the four
existing ones from feature 001.

## Generating new visual regression baselines (read this before running --update-snapshots)

**Do not generate new baselines locally, on macOS or via local Docker.**
Feature 001 found that even `mcr.microsoft.com/playwright` run in a local
Docker container isn't bit-identical to GitHub's actual `ubuntu-latest`
runner. Instead:

```bash
gh workflow run update-snapshots.yml
# wait for it to complete, then:
gh run list --workflow=update-snapshots.yml --limit 1
gh run download <run-id> -n updated-snapshots -D /tmp/updated-snapshots
# copy the new *-linux.png files into tests/e2e/<component>.spec.ts-snapshots/
```

## Manual validation scenarios (traceable to spec.md)

1. **Radio mutual exclusivity** (User Story 1): selecting one option in the
   shipping-method group automatically deselects any other in the same
   group.
2. **Radio disabled option** (User Story 1, Edge Case): the disabled option
   cannot be selected and its label visibly dims along with the input.
3. **Select focus ring** (User Story 2, AC1): tabbing into the Select shows
   the brand-token focus ring, matching Text Input's treatment.
4. **Select error state** (User Story 2, AC2): the error-state Select shows
   its inline error message with `aria-invalid="true"`.
5. **Select error + unselected together** (Edge Case): the placeholder
   option text remains visible alongside the error message.
6. **Toggle click/Space** (User Story 3, AC1): clicking or pressing Space
   while focused switches the track color and slides the dot.
7. **Toggle disabled + on** (Edge Case): the disabled-and-on Toggle visually
   combines both states and does not respond to interaction.
8. **Toggle track visibility** (research.md finding): the off-state track's
   `ring-neutral-500` boundary is visibly perceivable against the white
   page background, unlike the ratified catalog pattern's shadow-only dot.

## Discoverability check (SC-001)

Same manual, human-only timing check as feature 001 — not automatable.
Track as an outstanding manual QA item in `tasks.md`.
