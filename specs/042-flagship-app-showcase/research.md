# Research: Flagship App Showcase

## R1. Surface decision — new `showcase/` app, not `tests/react-harness/`

Verified directly (not assumed): `tests/react-harness/vite.config.ts`'s
own header comment states "Dev-only harness (never published)". Every
existing harness page mounts exactly one component in isolation for a
single Playwright spec to exercise; none compose multiple components
into a realistic screen, and the directory's own name/comment make its
scope explicit. Building a real, published, marketing-facing showcase
inside a directory documented as dev-only would either (a) silently
violate that documented contract, or (b) require rewriting the
comment and now depend on the same directory build for both dev/test
infra AND public content — two concerns with very different
change-risk profiles sharing one blast radius. A new, small,
independent `showcase/` workspace avoids both.

## R2. Component selection for a realistic SaaS dashboard (>= 15, spec.md SC-001)

Selected for genuine plausibility (a real product screen would use
every one of these), not merely to hit the floor:

| Role in the screen | Component(s) |
|---|---|
| Primary navigation | `Sidebar`, `Navbar` |
| Identity / org switching | `Avatar`, `AvatarGroup`, `ContextSwitcher` (Team/Workspace Switcher) |
| Global actions | `CommandPalette`, `DropdownMenu` (user menu), `ActionIcon`, `Button` |
| Metrics | `Card`, `Badge`, `RingProgress` or `RollingNumber` |
| Data | `DataTable`, `Pagination` |
| Visualization | `Chart` (React-only, the deciding factor per plan.md Summary) |
| Feedback | `Toast`, `NotificationCenter`, `Modal` (a confirm-style dialog) |
| Wayfinding | `Breadcrumbs`, `Tabs` |
| Theming | `DarkModeToggle` / `ThemeIcon` |

18 distinct components across the list above, clearing SC-001's
15-component floor with real headroom, while every one plays a
plausible, load-bearing role — none is included merely to inflate the
count (spec.md's own Assumptions section explicitly rejects a
count-maximizing interpretation).

## R3. Sample data shape

A small, self-contained `src/data/sample-data.ts` module: a fictional
company name/team roster (for `Sidebar`/`ContextSwitcher`/`Avatar`),
~8-12 fictional data-table rows (e.g., "customers" or "projects", not
tied to any real entity), a small time-series for `Chart`, and 2-3
sample notification/toast messages — all clearly fictional (spec.md
FR-009), matching the naming conventions this catalog's own existing
composed examples (`dashboard-example.html`) already use (e.g. "Acme
Inc", generic placeholder company names, per feature 031's own
ContextSwitcher demo data already shipped).

## R4. Deploy integration

`deploy-pages.yml`'s existing `build` job (feature 039) already builds
the main static site with a `GITHUB_PAGES_BASE` env var and runs
`scripts/rewrite-base-path.mjs` afterward. Adding a `showcase/` build
step (its own `npm run build` with its own `base` set to
`/professional-design-system/showcase/`) and copying its `dist/`
output into the main `dist/showcase/` directory before the existing
`upload-pages-artifact` step reuses the exact same mechanism already
proven for `tests/react-harness`'s deployment (found and fixed while
investigating this feature's own Chart-link bug, a separate,
pre-existing issue tracked in this feature's tasks rather than
invented fresh).

## R5. Chart's broken link, found while researching this feature

`src/components/chart/chart.html` contains a hardcoded
`href="http://localhost:5174/chart.html"` — dead on any deployed
environment, confirmed directly against the live GitHub Pages site
(returns nothing, since `localhost` never resolves off the visitor's
own machine). This predates this feature and is unrelated to its own
scope, but is fixed as part of this feature's implementation since (a)
`scripts/rewrite-base-path.mjs` is being extended for `showcase/`'s own
deployment anyway, and (b) leaving a known-broken link live on the
public site while shipping a new one nearby is not a reasonable
trade-off. Fix: rewrite this one specific href to point at the
deployed `showcase/` (or, if Chart is not itself part of the
showcase's own composed screen, a dedicated small React-harness Chart
page deployed the same way) via the existing rewrite script rather
than a new mechanism.
