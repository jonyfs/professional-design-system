# Phase 0 Research: React Component Library (Claude Design Compatibility)

## Decision: `tsup` for the package build, not Vite library mode

**Rationale**: The requirement (FR-001/FR-002) is a `dist/` entry with
`module`/`main`/`exports` fields plus clean, tool-extractable `.d.ts`
output — exactly what `tsup` (an esbuild wrapper purpose-built for
TypeScript library authoring) produces with near-zero configuration:
`tsup src/index.ts --format esm,cjs --dts`. The project already uses Vite
for the static gallery, so reusing it for the package build was the first
option considered — but Vite's **library mode** is oriented at bundling
an app-shaped entry, and generating clean rolled-up `.d.ts` output needs
an added plugin (`vite-plugin-dts`) with more configuration surface than
`tsup --dts` for the same result. `design-sync`'s own `non-storybook/
SKILL.md` lists `tsc|tsup|rollup|vite build|esbuild` as the build-script
patterns it already knows how to detect and re-run — `tsup` is a
first-class, expected shape for this exact scenario, not an unusual
choice this project would need to explain to that tooling later.

**Alternatives considered**: Vite library mode (extra plugin surface for
equivalent output, as above) — rejected as unnecessary complexity;
hand-rolled `tsc` + `esbuild` scripts — rejected, `tsup` already wraps
this exact combination and is the more maintainable, standard choice.

## Decision: npm workspaces, not a monorepo tool

**Rationale**: This feature adds exactly one new sub-package
(`packages/react/`) to an otherwise single-purpose repo. npm workspaces
(built into npm ≥7, no new dependency) is sufficient to let the root
install both the static site's and the package's dependencies together
and to `npm run build --workspace=packages/react`. Adopting Turborepo,
Nx, or pnpm+workspaces would add build-graph/caching tooling this
project has no scale to justify — one extra package doesn't need a
build-orchestration layer, per Principle III's underlying "resolved via
configuration before being considered an exception" spirit (see feature
003's research.md, where the same reasoning applied to skipping a
focus-trap library).

## Decision: shared `shared/design-tokens.ts`, not two independently-declared Tailwind configs

**Rationale**: The React package needs its own compiled, self-contained
stylesheet (FR-007 — Claude Design's ingestion renders the bundle
standalone, not inside this project's own dev server). That means a
second `tailwind.config.ts` with its own `colors`/`borderRadius`
`theme.extend` — the exact same values as the root config. Two
independently hand-typed copies of the same hex values is precisely the
kind of drift this project's own `/speckit-analyze` passes have caught
repeatedly (the constitution's ratified tokens have been amended five
times this project already, each time requiring every consumer of those
values to update in lockstep). Extracting the token values into
`shared/design-tokens.ts` (a plain TS object of the same shape
`tailwind.config.ts`'s `theme.extend.colors`/`borderRadius` already use)
and having **both** `tailwind.config.ts` (root) and
`packages/react/tailwind.config.ts` import it makes drift structurally
impossible instead of procedurally discouraged.

**Alternatives considered**: Two independent configs with a code-review
checklist item "keep these in sync" — rejected, this project's own
history shows checklist-only discipline isn't reliable enough for a
NON-NEGOTIABLE principle (Principle IV); a shared import is strictly
better and costs one extra file.

## Decision: duplicate the `@apply`/`@layer components` block (`.btn-primary` etc.) in the package's own `styles.css`, cite the HTML contract as the source of truth for the class list

**Rationale**: Both the static site's `tailwind.css` and the package's
`styles.css` need the exact same component classes compiled, but they
are two independent Tailwind builds (different `content` globs, different
output artifacts) — there is no clean way to `@import` one's `@layer
components` block into the other without adding a build-time dependency
between two otherwise-independent packages (the static site is not, and
should not become, a dependency of the React package or vice versa).
Given the actual class lists are short (10 components' worth of `@apply`
rules, all already written once for the HTML version), duplication here
is a real but small, bounded cost — and it is caught by tooling, not
trusted to manual review: `scripts/audit-tokens.mjs`/`check-contrast.mjs`
already scan `tailwind.css`'s `@apply` blocks (feature 003) and will be
extended to scan the package's `styles.css` identically (data-model.md),
so a class-list divergence that violated token discipline would fail CI
in either file, even if a *visual* drift (forgetting to port a class
change) still requires the visual-regression comparison in quickstart.md
to catch.

**Alternatives considered**: A shared CSS partial via `postcss-import` —
considered, adds a build-time coupling between the static site and the
package for a benefit (avoiding ~150 lines of duplicated `@apply` rules)
that doesn't outweigh the added pipeline complexity, given each
component's contract doc is already the real source of truth for what
the class list *should* be, independent of which file currently contains
it.

## Decision: Playwright against a dev-only React test harness, not React Testing Library

**Rationale**: This project's entire testing discipline (visual
regression, `@axe-core/playwright`, real-browser keyboard-navigation
assertions) is Playwright-based, proven across three features. Adding
React Testing Library (a DOM-in-Node, jsdom-based unit-testing tool)
would introduce a second, differently-shaped testing paradigm for the
same components already covered by the stronger, real-browser Playwright
suite — duplicated effort, not additional confidence. Instead, a minimal
`tests/react-harness/` Vite+React app (dev server only, never published)
renders each component so the **existing** Playwright spec pattern
(`tests/e2e/<name>.spec.ts`) can point at the React-rendered version
instead of (or alongside) the static HTML version, letting this feature
reuse — not reinvent — the project's testing investment.

**Alternatives considered**: React Testing Library + Vitest — rejected
per the duplication reasoning above; Storybook + its own test runner —
rejected as the same unnecessary-complexity reasoning as feature 003's
focus-trap-library decision (this project has no other need for
Storybook yet, per the earlier "start with package shape, no Storybook"
decision already made when answering the user's Claude Design question).

## Decision: Modal/Slide-over's DOM wiring becomes a shared `useDialogTrigger` hook

**Rationale**: `overlay.js`'s `initDialogTriggers()` (feature 003) does
three things per dialog: wire `showModal()` on trigger click, wire
backdrop-click-to-close, and wire the WebKit focus-return safeguard on
the dialog's native `close` event. All three operations are ref-based DOM
operations on the real `<dialog>` element — translating this to React
means a `useRef<HTMLDialogElement>` plus a `useEffect` that attaches the
exact same three listeners on mount and tears them down on unmount, still
calling the browser's own native `showModal()`/`close()` rather than
reimplementing focus-trap logic in JS. `Modal` and `SlideOver` both
consume this one hook (mirroring `overlay.js` being shared code, not
per-component duplicated code, in the HTML version); `Toast`'s simpler
dismiss-only behavior gets its own trivial `onClick` handler directly in
the component, not a hook, mirroring `toast.js`'s "separate file, no
shared dialog semantics" precedent from feature 003.

**Alternatives considered**: A third-party React dialog/modal library
(Radix UI Dialog, Headless UI) — rejected for the same reason feature
003 rejected a focus-trap library: native `<dialog>` already does the
hard part, and this project's constitution's own Principle VII/III
"resolved via configuration before being an exception" spirit applies
here identically — the React port should carry over the *decision*
(native browser behavior over a library), not abandon it just because
the surrounding code is now React.

## Decision: extend `audit-tokens.mjs`/`check-contrast.mjs` to scan `.tsx` files' `className` props

**Rationale**: FR-003/SC-004 require the same zero-raw-palette-class
discipline on the new `.tsx` source. The existing scripts already parse
two different syntaxes for the same underlying question (HTML
`class="..."` attributes; `tailwind.css`'s `@apply` blocks, added in
feature 003) — adding a third extraction path for JSX `className="..."`
string literals is the same pattern, not a new capability. Dynamic/
templated classNames (e.g. `` className={`btn ${variant}`} ``) are
explicitly out of scope for the automated scanner (documented as a known
limitation, matching `RING_PAIRINGS`' precedent of "manually curated
where full automation isn't reliable") — every component in this
feature uses static, literal className strings per variant (matching the
existing HTML contracts' own static-class-per-state pattern), so this
limitation does not affect this feature's actual coverage.

## Resolved unknowns

All three Assumptions-section open items (bundler choice, whether the
static gallery is deprecated, package/monorepo structure) are resolved
above. No `NEEDS CLARIFICATION` remains for Phase 1.
