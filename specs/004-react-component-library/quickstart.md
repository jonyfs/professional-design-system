# Quickstart: React Component Library

## Prerequisites

```bash
npm install   # root install now also installs packages/react via npm workspaces
```

## Build the package

```bash
npm run build --workspace packages/react
```

**Expected outcome**: `packages/react/dist/` contains `index.mjs`,
`index.js`, `index.d.ts`, and `styles.css` — the exact shape
`react-package.contract.md` specifies.

## Verify type extraction (SC-002)

```bash
npx tsc --noEmit --declaration --emitDeclarationOnly false \
  packages/react/dist/index.d.ts
```

Or, more directly, open `packages/react/dist/index.d.ts` and confirm each
`<Name>Props` interface listed in `data-model.md`'s Component table is
present with no `any` types leaking through — a `.d.ts` a type-parsing
tool can consume without a hand-written override (FR-002/SC-002).

## Run the React test harness

```bash
npm run dev --workspace tests/react-harness
```

Renders every component with realistic props (mirroring each existing
HTML demo page). This is dev-only tooling, never published.

## Run the full test suite (including the new React specs)

```bash
npm run test:e2e
```

**Expected outcome**: the existing ten `.spec.ts` files (static HTML)
plus the new `tests/e2e/react-*.spec.ts` files (React harness) all pass.
For Modal/SlideOver specifically, the React specs re-run the exact same
Tab-cycle/Escape/backdrop/focus-return assertions as feature 003's
originals — confirming `useDialogTrigger` reproduces the native `<dialog>`
behavior, not just visually but behaviorally.

## Validate token discipline on `.tsx` source (Principle IV gate, extended)

```bash
npm run audit:tokens
npm run audit:contrast
```

**Expected outcome**: both pass, now also scanning
`packages/react/src/**/*.tsx` for `className` string literals and
`packages/react/src/styles.css`'s `@apply` blocks, per research.md's
scanner-extension decision.

## Visual parity check (SC-001)

```bash
npx playwright test tests/e2e/react-button.spec.ts --update-snapshots
```

then diff the resulting screenshot against the existing
`tests/e2e/button.spec.ts-snapshots/button-*.png` baselines — pixel
parity between the HTML reference and the React port is the acceptance
bar for FR-004, not a subjective "looks the same" judgment.

## Manual validation scenarios (traceable to spec.md)

1. **Package foundation** (User Story 1, AC1-AC3): build the package,
   import `Button` in a scratch React app, confirm visual parity and
   full TypeScript prop-completion.
2. **Non-overlay primitives** (User Story 2, AC1-AC2): repeat for each of
   Text Input, Badge, Checkbox, Radio, Select, Toggle.
3. **Overlay primitives** (User Story 3, AC1-AC2): render `<Modal open>`,
   confirm Escape/backdrop/close-button dismissal and focus-return; same
   for `<SlideOver>`; render `<Toast>` and confirm no focus theft.

## Discoverability check (SC-005)

Same manual, human-only timing check as every prior feature's SC-001 —
not automatable. Track as an outstanding manual QA item in `tasks.md`.
