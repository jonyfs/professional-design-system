# Feature Specification: React Component Library (Claude Design Compatibility)

**Feature Branch**: `004-react-component-library`

**Created**: 2026-07-09

**Status**: Draft

**Input**: User description: "Migrate this project from a static HTML + Tailwind CSS component library to a React + TypeScript component library, so it can be synced to Claude Design (claude.ai/design). Claude Design's ingestion tooling only consumes React design systems: it requires a published/built package entry (dist/ with a module/main/exports field), TypeScript prop types it can extract into a public API contract, and a component bundle it can render live. All ten existing components (Button, Text Input, Badge, Checkbox, Radio, Select, Toggle, Modal, Toast, Slide-over) must be ported with the same visual output and behavior already ratified in the project constitution and each feature's markup contracts — this is a packaging/API migration, not a redesign."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Package Foundation Proven on One Component (Priority: P1) 🎯 MVP

A frontend developer needs to `npm install` this design system as a real
package and import a working, typed React component from it, proving the
entire pipeline (package structure, TypeScript build, compiled stylesheet,
prop types) works end-to-end before porting the other nine components.

**Why this priority**: Every subsequent component reuses this same
package scaffold, build tooling, and testing pattern. Getting it right
once, on the simplest component (Button), is far cheaper than discovering
a structural problem after porting all ten.

**Independent Test**: Can be fully tested by installing the built package
in a scratch project, importing `Button`, rendering it, and confirming it
renders with the exact same visual output (same Tailwind classes compiled
to the same CSS) as the existing `src/components/button/button.html`
reference, with full TypeScript prop-completion in an editor.

**Acceptance Scenarios**:

1. **Given** the package is built, **When** a consumer imports `Button`
   from it and renders `<Button variant="primary">Save</Button>`, **Then**
   the rendered output is visually identical to the existing HTML
   reference's primary button (same classes resolve to the same computed
   styles).
2. **Given** an editor with TypeScript support, **When** a developer types
   `<Button `, **Then** it offers exactly the prop names/types documented
   in `button.contract.md` (variant, disabled, onClick, children) — no
   more, no fewer.
3. **Given** the package's `dist/` output, **When** inspected, **Then** it
   contains a `.d.ts` file for `Button` whose `ButtonProps` interface is
   extractable by a type-parsing tool without hand-written overrides.

---

### User Story 2 - Remaining Non-Overlay Primitives Ported (Priority: P2)

A frontend developer needs the rest of the non-overlay component set
(Text Input, Badge, Checkbox, Radio, Select, Toggle) available as typed
React components with the same pipeline proven in User Story 1.

**Why this priority**: These six components share Button's simplicity
(no native `<dialog>`, no focus-trap wiring) and reuse the exact
scaffold/tooling from User Story 1 — a natural, lower-risk second slice
before tackling the overlay components' extra complexity.

**Independent Test**: Can be fully tested the same way as User Story 1,
for each of the six components independently — installing the package,
importing each component, and confirming visual/behavioral parity with
its existing HTML reference.

**Acceptance Scenarios**:

1. **Given** the package is built, **When** a consumer imports and
   renders each of Text Input, Badge, Checkbox, Radio, Select, and
   Toggle, **Then** each renders with the exact states (default, focus,
   error, disabled, checked, etc.) already documented in that component's
   `*.contract.md`.
2. **Given** Radio's native mutual-exclusivity behavior (shared `name`
   attribute) and Select's native keyboard operability, **When** rendered
   via React, **Then** both retain their existing native-HTML-first
   behavior — no custom JS reimplementing what the browser already does.

---

### User Story 3 - Overlay Primitives Ported with React-Idiomatic Wiring (Priority: P3)

A frontend developer needs Modal, Toast, and Slide-over available as
typed React components, with the same native `<dialog>`-based focus-trap
behavior already shipped, now wired via React hooks instead of the
vanilla-JS `overlay.js`/`toast.js` used in the static version.

**Why this priority**: Lower priority than User Stories 1-2 because it
carries the most technical risk (translating imperative DOM wiring —
`showModal()`, the `close` event, ref-based backdrop-click detection —
into React's declarative, ref/effect-based idioms) and depends on nothing
introduced by this story; sequencing it last means the simpler pattern is
already proven before tackling the harder one.

**Independent Test**: Can be fully tested by installing the package,
rendering `<Modal>`/`<Toast>`/`<SlideOver>` in a scratch page, and
confirming the exact same focus-trap, Escape/backdrop/close-button
dismissal, and focus-return behavior verified by feature 003's Playwright
suite still holds when driven through the React component's API instead
of raw HTML + `data-dialog-trigger` attributes.

**Acceptance Scenarios**:

1. **Given** a rendered `<Modal open={true}>`, **When** the user presses
   Escape, clicks the backdrop, or activates the close button, **Then**
   the modal closes and focus returns to the triggering element — same
   behavior as the existing native-`<dialog>` implementation, including
   the explicit WebKit focus-return safeguard already discovered.
2. **Given** a rendered `<Toast>`, **When** it appears, **Then** it
   announces itself via `aria-live` without stealing keyboard focus, same
   as the existing implementation.

---

### Edge Cases

- What happens if a consumer imports a component without importing the
  package's compiled stylesheet? The component MUST still render
  correct, semantic markup (so it's never completely broken), but visual
  styling depends on the stylesheet being loaded — same as any Tailwind-
  based component library; this MUST be documented, not silently assumed.
- How does the library handle a consumer's own Tailwind config (e.g., a
  consuming app that also uses Tailwind and might purge/conflict with
  this library's classes)? Out of scope for this feature — the library
  ships its own compiled, non-purgeable CSS, avoiding dependence on the
  consumer's Tailwind pipeline at all.
- What happens to the existing static HTML gallery (`index.html`,
  `src/components/*/*.html`) after this migration? It remains in place as
  the ratified visual/behavioral reference and continues to be validated
  by the existing Playwright suite — this feature adds a React package
  alongside it, it does not delete or replace the existing static gallery.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The project MUST expose a publishable npm package with a
  built `dist/` output (`module`/`main`/`exports` fields in `package.json`)
  containing all ten components as named exports.
- **FR-002**: Every exported component MUST ship a TypeScript `.d.ts`
  declaration whose props interface is derivable by a type-parsing tool
  without hand-written overrides, for at least eight of the ten components
  (Modal/Slide-over's native-`<dialog>`-derived ref props MAY require a
  documented, hand-written override if TypeScript's structural inference
  can't flatten them cleanly).
- **FR-003**: Every component's rendered output MUST use only the
  semantic Tailwind tokens already ratified in the project constitution —
  no new colors, no raw palette classes, same Principle IV discipline as
  every prior feature.
- **FR-004**: Every component's visual output MUST match its existing
  HTML reference's states exactly (default, hover, focus-visible, active,
  disabled, error, checked, open, etc., as applicable per component).
- **FR-005**: Modal and Slide-over MUST retain native `<dialog>`-based
  focus trapping, Escape/backdrop/close-button dismissal, and focus-return
  (including the WebKit-specific explicit-focus-return safeguard already
  discovered), now wired via React refs/effects instead of vanilla JS
  querying the DOM directly.
- **FR-006**: Toast MUST retain its non-modal, `aria-live`-announced,
  focus-preserving behavior.
- **FR-007**: The package MUST compile its own Tailwind-derived CSS and
  ship it as an importable stylesheet, independent of any consuming app's
  own Tailwind configuration.
- **FR-008**: The existing static HTML gallery and its Playwright suite
  MUST remain in place, unmodified in behavior, serving as the ratified
  reference each React component is checked against.

### Key Entities

- **Package**: the publishable npm unit — name, version, `dist/` build
  output, `.d.ts` types, compiled stylesheet.
- **Component**: one of the ten existing primitives, now expressed as a
  typed React function component with a `<Name>Props` interface matching
  its existing markup contract's documented states/attributes.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All ten components are importable from the built package
  and render with output visually indistinguishable from their existing
  HTML references (verified by automated visual comparison, not manual
  eyeballing).
- **SC-002**: A type-parsing tool (matching Claude Design's own ingestion
  approach) can extract a props interface for at least 8 of the 10
  components with zero hand-written overrides.
- **SC-003**: 100% of Modal/Slide-over's focus-trap, dismissal, and
  focus-return behaviors (as covered by feature 003's existing Playwright
  assertions) still pass when re-run against the React component versions.
- **SC-004**: Zero raw Tailwind palette classes anywhere in the package's
  component source, verified by the existing token-discipline audit
  tooling extended to cover `.tsx` files.
- **SC-005**: A developer unfamiliar with the package can install it,
  import a component, and render it correctly in under 5 minutes using
  only the generated `.d.ts` types and existing contract docs (no need to
  read component source) — the React-library equivalent of prior
  features' SC-001 discoverability check.

## Assumptions

- The target React version is React 18+ (the current stable major as of
  this project's other tooling choices), using function components and
  hooks exclusively — no class components.
- Build tooling (bundler choice: tsup, Vite library mode, or another
  TypeScript-aware bundler) is a Phase 0 research decision for
  `/speckit-plan`, not assumed here, consistent with this project's
  "verify, don't assume" precedent — the requirement is only that the
  output satisfies FR-001/FR-002 (a `dist/` entry + clean `.d.ts` output),
  not a specific tool.
- The existing static HTML gallery is not deprecated by this feature; it
  continues to exist as the design system's ratified reference and
  lowest-friction integration point (drop-in HTML, zero build step) for
  consumers who don't need a React package.
- This feature does not itself perform the Claude Design sync (the
  `design-sync` skill's upload flow) — it only produces a package in the
  shape that skill's "package source" mode requires. Running an actual
  sync is a separate, later, explicitly-requested action.
- No visual redesign is in scope — every component's Tailwind class list
  is ported as-is from its existing HTML contract, not reimagined.
