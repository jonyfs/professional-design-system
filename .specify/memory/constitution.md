<!--
SYNC IMPACT REPORT (v1.39.1 — see below for the v1.39.0/v1.38.0/v1.37.0/v1.36.0/v1.35.0/v1.34.0/v1.33.0/v1.32.0/v1.31.0/v1.30.0/v1.29.0/v1.28.0/v1.27.0/v1.26.0/v1.25.0/v1.24.0/v1.23.0/v1.22.0/v1.21.0/v1.20.0/v1.19.0/v1.18.0/v1.17.0/v1.16.0/v1.15.0/v1.14.0/v1.13.0/v1.12.0/v1.11.0/v1.10.0/v1.9.0/v1.8.0/v1.7.0/v1.6.0/v1.5.0/v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.39.0 → 1.39.1
Modified principles: None
Modified sections:
  - Governance → Amendment Procedure: the dependent-templates parenthetical
    referenced `.claude/skills/speckit-*/` for verifying amendment
    consistency; corrected to `.claude/skills/specjedi-*/` now that this
    project has migrated its installed skill set from speckit to Spec
    Jedi (speckit-* skills removed from `.claude/skills/` in the same
    change set) — a stale reference here would have pointed every future
    amendment's consistency check at a directory that no longer exists.
Rationale: caught by specjedi-govcheck while reviewing the migration PR
that removes the speckit-* skills this clause names — a tooling-path
correction with no principle-text or requirement change, hence PATCH,
not MINOR.
Templates requiring updates: ✅ none — no spec/plan/tasks/checklist
  template references this path.

SYNC IMPACT REPORT (v1.39.0 — see below for the v1.38.0/v1.37.0/v1.36.0/v1.35.0/v1.34.0/v1.33.0/v1.32.0/v1.31.0/v1.30.0/v1.29.0/v1.28.0/v1.27.0/v1.26.0/v1.25.0/v1.24.0/v1.23.0/v1.22.0/v1.21.0/v1.20.0/v1.19.0/v1.18.0/v1.17.0/v1.16.0/v1.15.0/v1.14.0/v1.13.0/v1.12.0/v1.11.0/v1.10.0/v1.9.0/v1.8.0/v1.7.0/v1.6.0/v1.5.0/v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.38.0 → 1.39.0
Modified principles: None
Added sections:
  - NEW top-level "Distribution & Ecosystem Standards" section (between
    Component Catalog and Governance): codifies SemVer discipline as
    NON-NEGOTIABLE for `packages/react/`, mandatory changelog entries in
    consumer-relevant terms, the published package's own README/CHANGELOG/
    LICENSE staying current with what's shipped (not the monorepo root's
    doc drifting stale, which is exactly what feature 048 found), the
    existing TypeScript-required and human-authorized-publish-only
    practices made explicit as governance rather than implicit habit, and
    framework scope (React-only, currently) as a stated, deliberate
    boundary rather than a silent limitation.
Rationale: feature 048's real external-consumption verification (a
throwaway project outside the monorepo, not in-workspace usage) found the
published package had no LICENSE, no README of its own, no changelog, and
a stale root-README component count — plus a major functional defect
(runtime theme switching silently didn't work via npm). None of these were
caught by any existing automated gate, because every gate tests the main
site's build output, not the published package's actual compiled
artifact — the same structural blind spot already named in feature 048's
own competitive-assessment.md. This section exists so the next feature
that touches `packages/react/`'s public surface has an explicit rule to
check against, not just a precedent to rediscover. MINOR bump: new
section added, no existing principle text changed.
Templates requiring updates: ✅ none — this is a new governance section,
  not a spec/plan/tasks template structural change.

SYNC IMPACT REPORT (v1.38.0 — see below for the v1.37.0/v1.36.0/v1.35.0/v1.34.0/v1.33.0/v1.32.0/v1.31.0/v1.30.0/v1.29.0/v1.28.0/v1.27.0/v1.26.0/v1.25.0/v1.24.0/v1.23.0/v1.22.0/v1.21.0/v1.20.0/v1.19.0/v1.18.0/v1.17.0/v1.16.0/v1.15.0/v1.14.0/v1.13.0/v1.12.0/v1.11.0/v1.10.0/v1.9.0/v1.8.0/v1.7.0/v1.6.0/v1.5.0/v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.37.0 → 1.38.0
Modified principles: None
Added sections:
  - Component Catalog & Tailwind UI Patterns → new "Flagship App
    Showcase (feature 042)" subsection: a new standalone `showcase/`
    workspace (architecturally separate from the dev-only
    tests/react-harness/), composing 21 real shipped components into
    one realistic dashboard, deployed under /showcase/. Documents 4
    real defects found and fixed: (1) Modal/Slide-over dark-theme text
    contrast (dialog UA-default color beats CSS inheritance), (2)
    DarkModeToggle vs. the full theme <select> silently desyncing (two
    independent writers to data-theme), (3) useCommandPalette's
    execute() running onExecute() before the dialog closes (inert
    background blocks synchronous page manipulation), (4) Recharts'
    async ResizeObserver redraw causing an intermittent WebKit overflow
    check false-positive (test-timing, not a product bug). Also fixes
    chart.html's pre-existing dead localhost link and a JS-bundle vs.
    HTML-only rewrite-base-path.mjs gap that would have 404'd the
    showcase's own back-link in production.
Corrected sections: None this bump.
Rationale: four real, previously-undiscovered defects (one a genuine
WCAG contrast violation) surfaced only because this feature was the
first to exercise Modal/DarkModeToggle/CommandPalette/Chart together
inside a live dark-themed, narrow-viewport composition — each is
permanently documented here so future features don't rediscover them
from scratch. MINOR bump: new section added, no principle text changed.
Templates requiring updates: ✅ none — this is a component-catalog/
  governance record, not a spec/plan/tasks template concern.

SYNC IMPACT REPORT (v1.37.0 — see below for the v1.36.0/v1.35.0/v1.34.0/v1.33.0/v1.32.0/v1.31.0/v1.30.0/v1.29.0/v1.28.0/v1.27.0/v1.26.0/v1.25.0/v1.24.0/v1.23.0/v1.22.0/v1.21.0/v1.20.0/v1.19.0/v1.18.0/v1.17.0/v1.16.0/v1.15.0/v1.14.0/v1.13.0/v1.12.0/v1.11.0/v1.10.0/v1.9.0/v1.8.0/v1.7.0/v1.6.0/v1.5.0/v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.36.0 → 1.37.0
Modified principles: None
Added sections:
  - Governance → "Repository" fact updated (private → public, 2026-07-18,
    explicitly confirmed, required for GitHub Pages on GitHub's Free
    plan) plus new "Live deployment & semantic versioning" fact:
    `.github/workflows/deploy-pages.yml` publishes to GitHub Pages
    (chained after CI success via `workflow_run`, never an independent
    `push` trigger), `scripts/rewrite-base-path.mjs` fixes a real
    Vite-doesn't-rewrite-plain-anchor-hrefs subpath bug, and a `version`
    job auto-bumps PATCH + tags + releases after every successful
    CI + Pages deploy on main.
Corrected sections: None this bump.
Rationale: the repository's public/private status and its live-deployment
target are standing, project-wide facts every future feature/session
needs to know before assuming "this is a private, unpublished catalog" —
the same reasoning already applied to the pre-existing "Repository"
governance fact. This is a MINOR bump: new governance facts recorded, no
principle text changed or reversed.
Templates requiring updates: ✅ none — this is operational/deployment
  infrastructure, not a spec/plan/tasks template concern.

SYNC IMPACT REPORT (v1.36.0 — see below for the v1.35.0/v1.34.0/v1.33.0/v1.32.0/v1.31.0/v1.30.0/v1.29.0/v1.28.0/v1.27.0/v1.26.0/v1.25.0/v1.24.0/v1.23.0/v1.22.0/v1.21.0/v1.20.0/v1.19.0/v1.18.0/v1.17.0/v1.16.0/v1.15.0/v1.14.0/v1.13.0/v1.12.0/v1.11.0/v1.10.0/v1.9.0/v1.8.0/v1.7.0/v1.6.0/v1.5.0/v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.35.0 → 1.36.0
Modified principles: None
Added sections:
  - Component Catalog & Tailwind UI Patterns → new "Advanced Form
    Inputs Batch (feature 039)" subsection: 10 new/extended
    components (TagsInput, Autocomplete, Mentions, Cascader,
    TreeSelect, InputMask, JsonInput, RangeSlider, FloatLabel,
    Interactive Rating), bringing the catalog to 123 components,
    closing feature 018's inventory candidates #10-27.
Corrected sections: None this bump.
Rationale: feature 039 ships 4 real findings worth a permanent
governance record, each corrected before merge, not after: (1) Rating
had no React port at all before this feature (plan assumed one
existed); (2) decorative `aria-hidden` markup cannot be made
interactive by attaching a handler to it — Interactive Rating uses a
genuinely separate native radio-group markup instead; (3) the classic
"two overlapping range inputs" dual-slider technique fails WCAG 2.5.8
target-size/offset under real axe-core scanning — resolved with two
genuinely separate rows rather than a `clip-path` patch; (4) Tailwind
auto-generates an `:-moz-placeholder` fallback for any
`:placeholder-shown` usage that is unconditionally true in modern
Firefox, floating FloatLabel's label regardless of fill state — fixed
via a `data-filled` attribute instead. This is a MINOR bump: new
component documentation and real, corrected findings, not a principle
reversal.
Templates requiring updates: ✅ none — specs/039-advanced-form-inputs/
  research.md and the contracts/ directory document each reuse target
  and the 4 findings above in full.

SYNC IMPACT REPORT (v1.35.0 — see below for the v1.34.0/v1.33.0/v1.32.0/v1.31.0/v1.30.0/v1.29.0/v1.28.0/v1.27.0/v1.26.0/v1.25.0/v1.24.0/v1.23.0/v1.22.0/v1.21.0/v1.20.0/v1.19.0/v1.18.0/v1.17.0/v1.16.0/v1.15.0/v1.14.0/v1.13.0/v1.12.0/v1.11.0/v1.10.0/v1.9.0/v1.8.0/v1.7.0/v1.6.0/v1.5.0/v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.34.0 → 1.35.0
Modified principles: Theming & Multi-Palette Architecture's per-source
  derivation rule ("never algorithmically generated (e.g. hue-rotated)
  or invented") is narrowly amended, in advance of feature 038's
  implementation (not retroactively): a per-source theme's `brand`
  MAY be hue-rotated in fixed increments *after* real-value derivation,
  strictly to break a near-duplicate collision against an
  already-placed theme (same canvas polarity, within a tight OKLCH
  tolerance) — never as a substitute for sourcing a real value in the
  first place, and never applied to a theme that doesn't already have
  one. This is distinct from Prism's (feature 036) synthesis-from-
  scratch exception: every feature 038 theme still starts from one
  real, cited, per-site anchor; hue-rotation only nudges that real
  anchor's hue when 70 real companies' colors collide.
Added sections:
  - Theming & Multi-Palette Architecture → new "Per-Source Theme Batch
    (feature 038)" paragraph, added below, documenting the rule change
    above plus the monochrome-primary alternate-anchor rule (search the
    same site's own other documented colors before ever falling back to
    a catalog default).
Corrected sections: None this bump.
Rationale: `/speckit-analyze` on feature 038 flagged (C1) that its
plan/research generalized Prism's hue-rotation method into the
per-source-mapped category without the constitution having sanctioned
that blend in advance — the same gate Prism's own carve-out had to
clear before its implementation shipped (v1.33.0). Resolving this
*before* `shared/design-tokens.ts`/`themes.css` are written (not after,
as originally scoped in tasks.md T014) keeps the per-source rule's
"never invented" guarantee intact: every theme still cites one real
anchor per research.md R6's "Raw brand anchor" column; only the FINAL
hue may be nudged, and only to stay distinguishable at 70-theme scale.
This is a MINOR bump: a narrow, explicit exception to an existing rule,
not new principle text or a reversal.
Templates requiring updates: ✅ none — specs/038-per-source-theme-batch/
  research.md documents the real per-site raw anchors and de-duplication
  log this amendment describes.

SYNC IMPACT REPORT (v1.34.0 — see below for the v1.33.0/v1.32.0/v1.31.0/v1.30.0/v1.29.0/v1.28.0/v1.27.0/v1.26.0/v1.25.0/v1.24.0/v1.23.0/v1.22.0/v1.21.0/v1.20.0/v1.19.0/v1.18.0/v1.17.0/v1.16.0/v1.15.0/v1.14.0/v1.13.0/v1.12.0/v1.11.0/v1.10.0/v1.9.0/v1.8.0/v1.7.0/v1.6.0/v1.5.0/v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.33.0 → 1.34.0
Modified principles: None
Added sections:
  - Component Catalog & Tailwind UI Patterns → new "Homepage Component
    Showcase" subsection (feature 037): all 114 homepage cards now
    render a real, `inert`-wrapped excerpt of that component's own
    markup instead of text-only descriptions, in a content-driven
    bento grid, plus a live "proof wall" hero. Documents a new
    `inert`-wrapped-preview pattern (resolves the real HTML conflict
    between "whole card is one native link" and "card embeds the
    component's real, sometimes-interactive markup"), the frozen-
    open-state convention for triggered/overlay components, two
    surfaced pre-existing technical constraints (Chart's React-only
    rendering, Data Table's JS-only static page), and three real bugs
    found and fixed via manual browser verification (nested-`<a>`
    auto-closing the outer card link; a genuine AAA contrast violation
    from a new surface tone; `.card-elevated` used without its
    required base `.card` class).
Corrected sections: None this bump.
Rationale: feature 037 (Homepage Component Showcase) is a
presentation-layer redesign of the existing 114-card gallery grid —
zero components added/removed/recategorized, zero markup change to
any individual component's own demo page. Verified via the full
Playwright suite (see specs/037-homepage-component-showcase/tasks.md
T020 for the reconciled tally) plus manual live-browser verification
(screenshots across the full page, a live theme switch). This is a
MINOR bump: a new documented UI pattern and governance precedent
(inert-wrapped real markup inside whole-card links), not a principle
change.
Templates requiring updates: ✅ none — specs/037-homepage-component-
  showcase/tasks.md documents this feature's own implementation in
  full.

SYNC IMPACT REPORT (v1.33.0 — see below for the v1.32.0/v1.31.0/v1.30.0/v1.29.0/v1.28.0/v1.27.0/v1.26.0/v1.25.0/v1.24.0/v1.23.0/v1.22.0/v1.21.0/v1.20.0/v1.19.0/v1.18.0/v1.17.0/v1.16.0/v1.15.0/v1.14.0/v1.13.0/v1.12.0/v1.11.0/v1.10.0/v1.9.0/v1.8.0/v1.7.0/v1.6.0/v1.5.0/v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.32.0 → 1.33.0
Modified principles: None
Added sections:
  - Theming & Multi-Palette Architecture → new "Prism — a synthesized
    theme, not a source-mapped one" paragraph (feature 036): 1 new
    theme, `prism`, bringing the 48-theme `THEMES` collection to 49.
    Documents a new derivation *category* this section now recognizes
    alongside feature 017's DaisyUI/Bootswatch mapping and feature
    027's per-company mapping: synthesizing ONE palette across a
    representative, cross-category sample of real external sources
    (7 sites from the VoltAgent/awesome-design-md GitHub collection,
    spanning 7 of its 10 categories), rather than one theme per
    source. Documents the real math used (circular-mean hue averaging
    for the `brand` accent — chosen because linear RGB averaging
    across hues this far apart on the wheel produces visual mud, a
    real, checked reason, not an arbitrary preference — and linear-RGB
    averaging for the hue-coherent semantic clusters), and a real,
    live-contrast-tool-driven correction (the initial derived `brand`
    value failed two non-text checks at 2.28:1; two rounds of
    lightness-only adjustment, same hue/saturation, cleared both).
    Exactly one gap was added to `KNOWN_THEME_CONTRAST_GAPS`, matching
    an existing structural-conflict pattern already present on ~20 of
    the other 48 themes.
Corrected sections: None this bump.
Rationale: feature 036 (Prism Color Scheme) ships 1 new theme via a
genuinely new derivation methodology (cross-collection synthesis, not
per-source mapping) — a new governance category worth naming, not a
duplicate of feature 017/027's pattern. Verified via a clean
`audit:tokens`/`audit:contrast` pass (49 themes, 1 documented gap) plus
the full-catalog Playwright regression. This is a MINOR bump: new
theme data, a new documented derivation category, and documentation —
no principle text itself changed.
Templates requiring updates: ✅ none — specs/036-prism-color-scheme/
  tasks.md documents this feature's own implementation in full.

SYNC IMPACT REPORT (v1.32.0 — see below for the v1.31.0/v1.30.0/v1.29.0/v1.28.0/v1.27.0/v1.26.0/v1.25.0/v1.24.0/v1.23.0/v1.22.0/v1.21.0/v1.20.0/v1.19.0/v1.18.0/v1.17.0/v1.16.0/v1.15.0/v1.14.0/v1.13.0/v1.12.0/v1.11.0/v1.10.0/v1.9.0/v1.8.0/v1.7.0/v1.6.0/v1.5.0/v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.31.0 → 1.32.0
Modified principles: None
Added sections:
  - Component Catalog & Tailwind UI Patterns → new "Configurable Social
    Login Buttons" subsection (feature 035): 1 new component
    (SocialLoginGroup) — a genuinely new pattern outside feature 018's
    inventory, requested directly by the user — bringing the catalog to
    114 total components. Documents a real, computed accessibility
    finding (solid provider brand-color fills, e.g. Facebook's official
    blue, fail this catalog's non-negotiable AAA bar — resolved by
    confining brand color to the icon glyph, never the button surface)
    and a new governance category: the first tokens in this catalog
    deliberately kept OUTSIDE the theme-reactive semantic palette,
    since provider brand marks must NOT re-theme with the host app's
    selected curated theme (documented in Complexity Tracking, same
    governance shape as the existing KNOWN_THEME_CONTRAST_GAPS/
    ICON_FILL_TEXT_TOKENS exception precedent). Also documents a CSP
    inline-style bug and an under-AAA caption-text bug, both found and
    fixed via the dedicated Playwright suite before it was accepted as
    green, and flags a separate, larger pre-existing gap (features
    028-034's React package CSS never got duplicated into
    packages/react/src/styles.css) found while scoping this feature's
    own foundational work — tracked as its own follow-up, not fixed
    here, per the user's explicit choice.
Corrected sections: None this bump.
Rationale: feature 035 (Configurable Social Login Buttons) ships 1 new
component plus a deliberately-scoped, justified exception to Principle
IV's token discipline (fixed, non-theme-reactive provider brand
colors) — a new governance category, not a violation left unresolved.
Verified via a clean dedicated suite (90/90 passed across all 6
browser/viewport projects) plus the full-catalog regression (see
tasks.md T025 for the reconciled tally). This is a MINOR bump: new
component data, a new documented exception category, and
documentation — no principle text itself changed.
Templates requiring updates: ✅ none — specs/035-social-login-buttons/
  tasks.md documents this feature's own implementation in full.

SYNC IMPACT REPORT (v1.31.0 — see below for the v1.30.0/v1.29.0/v1.28.0/v1.27.0/v1.26.0/v1.25.0/v1.24.0/v1.23.0/v1.22.0/v1.21.0/v1.20.0/v1.19.0/v1.18.0/v1.17.0/v1.16.0/v1.15.0/v1.14.0/v1.13.0/v1.12.0/v1.11.0/v1.10.0/v1.9.0/v1.8.0/v1.7.0/v1.6.0/v1.5.0/v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.30.0 → 1.31.0
Modified principles: None
Added sections:
  - Component Catalog & Tailwind UI Patterns → new "Data Display
    Patterns" subsection (feature 034): 5 new components (OverflowList,
    RollingNumber, PickList/Transfer, Gallery, Compare) bringing
    feature 018's inventory's Data Display category from 8/16 to
    13/16 — its practical ceiling (TreeTable/QRCode remain out of
    scope per prior notes) — bringing the catalog to 113 total
    components. Documents two real bugs found by live-browser testing
    and fixed before shipping: (1) OverflowList's first draft
    re-measured item widths on every render() call including passes
    after items were already hidden via display:none, so a
    previously-hidden (0-width) item trivially "fit" on the next pass
    and the whole computation cascaded into showing everything
    regardless of real container width — fixed by caching each item's
    natural width once, before any hiding occurs, applied identically
    to the React port which had the same vulnerability; (2) Gallery's
    first draft used bare <img> elements as thumbnail triggers, which
    have no native focusability, breaking keyboard activation and
    focus-return — fixed by wrapping thumbnails in real <button>
    elements on both surfaces, plus a related React-only bug where the
    focus-return ref always pointed at the first thumbnail regardless
    of which one was actually clicked.
Corrected sections: None this bump.
Rationale: feature 034 (Data Display Patterns) ships 5 of the
category's remaining items, reusing existing composition patterns
(overlay.js's dialog mechanism for Gallery, this catalog's established
CSP img-src variant, native range/checkbox inputs for Compare/PickList)
and zero new design tokens or dependencies. Verified via a clean
full-catalog regression (5885 passed / 7 failed — the recurring
menubar flake (4) plus three newly-observed but confirmed-transient
flakes (Session Timeout Modal, Center's a11y check, Team/Workspace
Switcher's arrow-key test), each reproduced as 5/5 passing in
isolation — / 30 skipped = 5922, reconciled against a fresh `--list`
run). This is a MINOR bump: new component data plus documentation, no
principle text changed.
Templates requiring updates: ✅ none — specs/034-data-display-
  patterns/tasks.md documents this feature's own implementation in
  full.

SYNC IMPACT REPORT (v1.30.0 — see below for the v1.29.0/v1.28.0/v1.27.0/v1.26.0/v1.25.0/v1.24.0/v1.23.0/v1.22.0/v1.21.0/v1.20.0/v1.19.0/v1.18.0/v1.17.0/v1.16.0/v1.15.0/v1.14.0/v1.13.0/v1.12.0/v1.11.0/v1.10.0/v1.9.0/v1.8.0/v1.7.0/v1.6.0/v1.5.0/v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.29.0 → 1.30.0
Modified principles: None
Added sections:
  - Component Catalog & Tailwind UI Patterns → new "Data Display
    Composables" subsection (feature 033): 4 new components (ThemeIcon,
    Blockquote, BackgroundImage, Watermark) bringing feature 018's
    inventory's Data Display category from 4/16 to 8/16 — a deliberate
    partial closure, with the remaining 8 items (5 genuinely-new-
    pattern candidates deferred to a future feature, TreeTable/QRCode
    already deferred per prior notes) explicitly documented, not
    silently dropped — bringing the catalog to 108 total components.
    Documents a real CSP gap found by checking existing precedent
    (Watermark's data: URI needed the img-src 'self' data:; variant
    Avatar/Card/List/Aspect Ratio already established, not the generic
    per-page template) and a color-source correction (ThemeIcon's
    info/brand variants sourced from Alert/Button rather than assumed
    to come from Badge, which ships neither). Notably: this was the
    only batch this session with zero real implementation bugs found
    during its own regression gate, consistent with the inventory's
    own "trivial CSS composition" buildability signal for every item
    in it.
Corrected sections: None this bump.
Rationale: feature 033 (Data Display Composables) ships 4 of the
category's remaining 12 items and zero new design tokens or
dependencies — pure composition of already-ratified Badge/Avatar/
Alert/Button tokens and the existing typography/overlay conventions.
Verified via a clean full-catalog regression (5768 passed / 4
known-flaky-unrelated failures — the recurring menubar test plus one
newly-observed but confirmed-transient navigation-micro-patterns flake,
reproduced as 5/5 passing in isolation — / 30 skipped = 5802,
reconciled against a fresh `--list` run). This is a MINOR bump: new
component data plus documentation, no principle text changed.
Templates requiring updates: ✅ none — specs/033-data-display-
  composables/tasks.md documents this feature's own implementation in
  full.

SYNC IMPACT REPORT (v1.29.0 — see below for the v1.28.0/v1.27.0/v1.26.0/v1.25.0/v1.24.0/v1.23.0/v1.22.0/v1.21.0/v1.20.0/v1.19.0/v1.18.0/v1.17.0/v1.16.0/v1.15.0/v1.14.0/v1.13.0/v1.12.0/v1.11.0/v1.10.0/v1.9.0/v1.8.0/v1.7.0/v1.6.0/v1.5.0/v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.28.0 → 1.29.0
Modified principles: None
Added sections:
  - Component Catalog & Tailwind UI Patterns → new "Overlays"
    subsection (feature 032): 3 new components (Affix, LoadingOverlay,
    Bottom Sheet) closing feature 018's inventory's Overlays category
    from 0% to 3/6 — the remaining 3 (Drawer, Dialog Manager, Popover
    Combobox variant) explicitly excluded per verified de-duplication/
    out-of-scope findings, not silently dropped — bringing the catalog
    to 104 total components. Documents 3 real CSS bugs found by
    live-browser testing: LoadingOverlay repeating feature 030's exact
    `.alert`-style `hidden`-vs-`display:flex` collision (same fix:
    CSSOM `style.display` assignment); Bottom Sheet's `<dialog>`
    centering itself instead of anchoring to the bottom edge due to the
    native UA stylesheet's `inset:0`/`margin:auto` defaults (fixed with
    an explicit `top:auto; margin:0` reset, the same class of fix
    `.dropdown-menu-panel`/`.popover-panel` already needed); and a
    flex-shrink gotcha in `.bottom-sheet-panel`'s `flex flex-col`
    structure (a test-fixture-level fix, `shrink-0`, not a change to
    the shared class Slide-over also uses unmodified).
Corrected sections: None this bump.
Rationale: feature 032 (Overlays) closes 3 of the inventory's 6
Overlays items and ships zero new design tokens or dependencies —
Affix is genuinely new scroll-threshold infrastructure, LoadingOverlay
reuses Spinner verbatim, Bottom Sheet reuses Slide-over's exact
`<dialog>` mechanism. Verified via a clean full-catalog regression
(5697 passed / 3 known-flaky-unrelated menubar failures / 30 skipped =
5730, reconciled against a fresh `--list` run) after fixing 3 real
bugs the gate itself surfaced. This is a MINOR bump: new component
data plus documentation, no principle text changed.
Templates requiring updates: ✅ none — specs/032-overlays/tasks.md
  documents this feature's own implementation in full.

SYNC IMPACT REPORT (v1.28.0 — see below for the v1.27.0/v1.26.0/v1.25.0/v1.24.0/v1.23.0/v1.22.0/v1.21.0/v1.20.0/v1.19.0/v1.18.0/v1.17.0/v1.16.0/v1.15.0/v1.14.0/v1.13.0/v1.12.0/v1.11.0/v1.10.0/v1.9.0/v1.8.0/v1.7.0/v1.6.0/v1.5.0/v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.27.0 → 1.28.0
Modified principles: None
Added sections:
  - Component Catalog & Tailwind UI Patterns → new "Navigation
    Micro-Patterns" subsection (feature 031): 5 new components (Team/
    Workspace Switcher, Language Switcher, Back-to-Top Button, Scroll
    Progress Bar, Onboarding Tour/Coachmark) closing feature 018's
    inventory's Navigation micro-patterns category from 1/6 (Avatar
    Group, feature 023) to 6/6 — the third category (after Layout &
    Structure and Consent & System Messaging) to reach 100% — bringing
    the catalog to 101 total components. Documents a repeated scope-
    discipline decision (Back-to-Top scoped to its own minimal
    threshold logic, not a standalone "Affix" primitive, mirroring
    feature 030's identical Countdown-Timer precedent), a real
    gallery-count bug (a combined "Scroll Progress Bar & Back-to-Top"
    card broke the one-card-per-inventory-item convention, caught by
    the feature's own regression gate), and a test-fixture height bug
    found by live-browser testing (the demo page was only ~94px
    scrollable, nowhere near the 400px show/hide threshold).
Corrected sections: None this bump.
Rationale: feature 031 (Navigation Micro-Patterns) closes feature
018's inventory's third 100%-complete category and ships zero new
design tokens or dependencies — every primitive reuses an already-
ratified mechanism (Dropdown Menu, Avatar, Progress, Popover).
Verified via a clean full-catalog regression (5612 passed / 4
known-flaky-unrelated menubar failures / 30 skipped = 5646, reconciled
against a fresh `--list` run) after fixing a real gallery-card
count bug and a test-fixture scroll-height bug the gate itself
surfaced. This is a MINOR bump: new component data plus documentation,
no principle text changed.
Templates requiring updates: ✅ none — specs/031-navigation-micro-
  patterns/tasks.md documents this feature's own implementation in
  full.

SYNC IMPACT REPORT (v1.27.0 — see below for the v1.26.0/v1.25.0/v1.24.0/v1.23.0/v1.22.0/v1.21.0/v1.20.0/v1.19.0/v1.18.0/v1.17.0/v1.16.0/v1.15.0/v1.14.0/v1.13.0/v1.12.0/v1.11.0/v1.10.0/v1.9.0/v1.8.0/v1.7.0/v1.6.0/v1.5.0/v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.26.0 → 1.27.0
Modified principles: None
Added sections:
  - Component Catalog & Tailwind UI Patterns → new "Consent & System
    Messaging Primitives" subsection (feature 030): 5 new components
    (Session Timeout Modal, Offline Banner, 2FA Reminder Banner,
    Maintenance/Announcement Bar, Dark Mode Toggle) closing feature
    018's inventory's Consent & System Messaging category from 0% to
    5/5 — the second category (after Layout & Structure, feature 028)
    to reach 100% — bringing the catalog to 96 total components.
    Documents a scope decision (Dark Mode Toggle's `dim` dark-theme
    pairing, verified against real theme metadata), a real CSS bug
    found by live-browser testing (the native `hidden` attribute
    losing to `.alert`'s author-origin `display:flex`, fixed via
    direct CSSOM `style.display` assignment), a React-package
    architecture correction (an early draft imported a nonexistent
    theme-persistence module; fixed by porting only the minimal logic
    needed, matching the one existing precedent for reading global
    theme state), and a Toggle click-target issue avoided by checking
    this catalog's own established precedent before writing tests
    rather than discovering it via failure.
Corrected sections: None this bump.
Rationale: feature 030 (Consent & System Messaging Primitives) closes
feature 018's inventory's second 100%-complete category and ships zero
new design tokens, themes, or dependencies — every primitive reuses an
already-ratified mechanism (Modal, Alert, Toggle, theme-switcher.js).
Verified via a clean full-catalog regression (5522 passed / 4
known-flaky-unrelated menubar failures / 30 skipped = 5556, reconciled
against a fresh `--list` run) after fixing a real CSS bug, a real
architecture inconsistency, and a stale count the gate's own precedent
anticipated. This is a MINOR bump: new component data plus
documentation, no principle text changed.
Templates requiring updates: ✅ none — specs/030-consent-system-
  messaging/tasks.md documents this feature's own implementation in
  full.

SYNC IMPACT REPORT (v1.26.0 — see below for the v1.25.0/v1.24.0/v1.23.0/v1.22.0/v1.21.0/v1.20.0/v1.19.0/v1.18.0/v1.17.0/v1.16.0/v1.15.0/v1.14.0/v1.13.0/v1.12.0/v1.11.0/v1.10.0/v1.9.0/v1.8.0/v1.7.0/v1.6.0/v1.5.0/v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.25.0 → 1.26.0
Modified principles: None
Added sections:
  - Component Catalog & Tailwind UI Patterns → new "Feedback Primitives"
    subsection (feature 029): 4 new components (RingProgress,
    SemiCircleProgress, Notification Center, Password Strength Meter)
    closing feature 018's inventory's Feedback category from 0% to
    4/5, bringing the catalog to 91 total components. Documents a
    de-duplication finding (the inventory's 5th candidate,
    "Notification", explicitly excluded — Toast's existing
    .toast/.toast-stack already cover it), a new variant of the
    recurring Tailwind-prefix naming-collision bug (this time against
    the audit script's own `ring-` color-utility detection heuristic,
    not Tailwind's generated CSS — fixed via .ring-progress* →
    .circular-progress*), a real axe-caught accessibility bug (an
    aria-labelledby reference to an initially-empty node on Password
    Strength Meter's progressbar, fixed with a static aria-label plus
    a separate aria-live status span), a test-timing lesson (reading
    raw CSSOM-assigned values instead of getComputedStyle/boundingBox,
    which are flaky against in-flight CSS transitions), and a third
    occurrence of the recurring hardcoded-count test bug (87 → 91 in
    gallery-showcase.spec.ts, no new category needed this time).
Corrected sections: None this bump.
Rationale: feature 029 (Feedback Primitives) closes feature 018's
Feedback category to 4/5 (Notification explicitly excluded, not
silently dropped) and ships zero new design tokens or dependencies —
every primitive reuses an already-ratified base (Progress, Indicator,
Dropdown Menu's Popover API). Verified via a clean full-catalog
regression (5415 passed / 3 known-flaky-unrelated menubar failures /
30 skipped = 5448, reconciled against a fresh `--list` run) after
fixing the naming collision, the real a11y bug, and the stale count
the gate itself surfaced. This is a MINOR bump: new component data
plus documentation, no principle text changed.
Templates requiring updates: ✅ none — specs/029-feedback-primitives/
  tasks.md documents this feature's own implementation in full.

SYNC IMPACT REPORT (v1.25.0 — see below for the v1.24.0/v1.23.0/v1.22.0/v1.21.0/v1.20.0/v1.19.0/v1.18.0/v1.17.0/v1.16.0/v1.15.0/v1.14.0/v1.13.0/v1.12.0/v1.11.0/v1.10.0/v1.9.0/v1.8.0/v1.7.0/v1.6.0/v1.5.0/v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.24.0 → 1.25.0
Modified principles: None
Added sections:
  - Component Catalog & Tailwind UI Patterns → new "Layout & Structure
    Primitives" subsection (feature 028): 9 new components (Stack,
    Group, Center, Container, Paper, Grid, SimpleGrid, Flex, AppShell)
    closing feature 018's inventory's Layout & Structure category from
    0/9 to 9/9, bringing the catalog to 87 total components. Documents
    2 Tailwind built-in class-name collisions avoided (.group→
    .group-row, .container→.container-page), a real AppShell scope
    correction found during planning (Sidebar has no mobile-collapse
    mechanism to reuse — verified directly, not assumed — so AppShell
    uses a pure CSS stack instead), and a recurring hardcoded-count
    test bug found again during this feature's own full-catalog
    regression gate (gallery-showcase.spec.ts, same class of issue as
    feature 027's gallery-theme-selector.spec.ts fix).
Corrected sections: None this bump.
Rationale: feature 028 (Layout & Structure Primitives) closes the
component-gap inventory's only 0% category and ships zero new design
tokens or dependencies. Verified via a clean full-catalog regression
(5319 passed / 3 known-flaky-unrelated failures / 30 skipped = 5352,
reconciled) after fixing the one real regression the gate itself
surfaced. This is a MINOR bump: new component data plus documentation,
no principle text changed.
Templates requiring updates: ✅ none — specs/028-layout-structure-
  primitives/tasks.md documents this feature's own implementation in
  full.

SYNC IMPACT REPORT (v1.24.0 — see below for the v1.23.0/v1.22.0/v1.21.0/v1.20.0/v1.19.0/v1.18.0/v1.17.0/v1.16.0/v1.15.0/v1.14.0/v1.13.0/v1.12.0/v1.11.0/v1.10.0/v1.9.0/v1.8.0/v1.7.0/v1.6.0/v1.5.0/v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.23.0 → 1.24.0
Modified principles: None
Added sections:
  - Theming & Multi-Palette Architecture → new "Curated theme batch 2"
    paragraph (feature 027): 5 new themes (aurora/obsidian/linen/
    graphite/nebula), bringing the collection from 43 to 48 themes,
    each independently derived from a real, browser-rendered
    design-language analysis (never fabricated hex values), generic
    mood-based naming with company attribution kept research-only,
    all 5 fitting an existing mood-family category. Documents two real
    implementation-time corrections (nebula's brand color, and
    obsidian/nebula's dark-theme semantic *-strong convention) and the
    User Story 2 confirmatory research conclusion (no new
    component-type gap found).
Corrected sections: None this bump.
Rationale: feature 027 (Claude-Design-Inspired Theme Presets Batch 2)
is a pure additive batch to feature 017's existing architecture — zero
new theming mechanism, zero new dependency, zero regression to any of
the 43 existing themes (verified via a clean full-catalog regression,
5182 passed / 2 known-flaky-unrelated failures / 30 skipped = 5214,
reconciled). This is a MINOR bump: new theme data plus documentation,
no principle text changed.
Templates requiring updates: ✅ none — specs/027-claude-design-
  inspired-themes/tasks.md documents this feature's own implementation
  in full.

SYNC IMPACT REPORT (v1.23.0 — see below for the v1.22.0/v1.21.0/v1.20.0/v1.19.0/v1.18.0/v1.17.0/v1.16.0/v1.15.0/v1.14.0/v1.13.0/v1.12.0/v1.11.0/v1.10.0/v1.9.0/v1.8.0/v1.7.0/v1.6.0/v1.5.0/v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.22.0 → 1.23.0
Modified principles: None
Added sections:
  - Component Catalog & Tailwind UI Patterns → "Gallery Presentation &
    Discoverability" subsection amended with a short addendum
    documenting feature 026's T017 full-catalog regression gate
    findings: one real bug (the demo-page-header rollout script's
    header-anchoring regex assumed every page's `<h1>` precedes its
    live component demo; navbar.html uniquely renders its live
    sticky-navbar demo first, so the regex swallowed it into the
    wrapper div and broke `position: sticky` — fixed in
    `src/components/navbar/navbar.html`, and confirmed via a
    programmatic sweep of all 77 pages that no other page shares this
    structure) plus three pre-existing test-staleness fixes surfaced
    by the same gate (feature 025's theme-selector added a real tab
    stop that broke two hardcoded single-Tab-press tests; feature
    026's own category-section restructuring broke an older test's
    `main section` card locator).
Corrected sections: None this bump.
Rationale: T017 is this project's catalog-wide zero-regression gate,
and a full run surfaced real findings worth recording for future
scripted, catalog-wide rollouts (feature 025 and 026's own pattern):
a page-shape assumption ("intro precedes the live demo") that holds
for 76 of 77 pages but not the one component whose demo depends on
being first in the DOM. This is a MINOR bump: an addendum to existing
documentation, no principle text changed.
Templates requiring updates: ✅ none — specs/026-demo-gallery-showcase/
  tasks.md T017 documents the investigation and fixes in full.

SYNC IMPACT REPORT (v1.22.0 — see below for the v1.21.0/v1.20.0/v1.19.0/v1.18.0/v1.17.0/v1.16.0/v1.15.0/v1.14.0/v1.13.0/v1.12.0/v1.11.0/v1.10.0/v1.9.0/v1.8.0/v1.7.0/v1.6.0/v1.5.0/v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.21.0 → 1.22.0
Modified principles: None
Added sections:
  - Component Catalog & Tailwind UI Patterns → new "Gallery Presentation
    & Discoverability" subsection (feature 026): documents the root
    gallery's redesign from a flat, uncategorized 78-card grid (a
    verified, direct match for this project's own Anti-Template Policy
    banned patterns) into a categorized showcase with an opening
    stats section, zero-JS quick-jump nav, and flagship treatment for
    Data Table/Chart/Command Palette/curated theming — plus a new
    every-page convention (the `.demo-page-header` wrapper, rolled out
    to all 77 demo pages the same scripted way feature 025 rolled out
    theme persistence).
Corrected sections: None this bump.
Rationale: feature 026 (Demo Gallery Visual Showcase) closes a real,
verified violation of this project's own design-quality standards —
the gallery meant to demonstrate this catalog's visual-quality bar did
not meet it. Zero components dropped/duplicated, zero behavior changes
to any shipped component (presentation-layer only). One real
implementation-time bug caught before rollout, not after: the
demo-page-header wrapper's first draft assumed `page-shell` used
`px-6` padding and a different background than `bg-neutral-50` — both
wrong, found by checking `src/styles/tailwind.css` directly rather
than assuming, and simplified to a border-only treatment that needed
neither assumption. This is a MINOR bump: one new documentation
subsection, no principle text changed.
Templates requiring updates: ✅ none — no plan/spec/tasks template
  structural change; specs/026-demo-gallery-showcase/tasks.md
  documents this feature's own implementation in full.

SYNC IMPACT REPORT (v1.21.0 — see below for the v1.20.0/v1.19.0/v1.18.0/v1.17.0/v1.16.0/v1.15.0/v1.14.0/v1.13.0/v1.12.0/v1.11.0/v1.10.0/v1.9.0/v1.8.0/v1.7.0/v1.6.0/v1.5.0/v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.20.0 → 1.21.0
Modified principles: None
Added sections:
  - Theming & Multi-Palette Architecture → new "Sitewide rollout"
    paragraph (feature 025): the theme-activation script + selector
    control, previously present on only 2 of 78 static gallery pages,
    now rolled out to all 77 remaining pages — a required convention
    for every future new static gallery page.
Corrected sections:
  - Theming & Multi-Palette Architecture → the "Known gap —
    packages/react's published styles never define default token
    values" entry was marked unresolved as of feature 020; it is now
    marked RESOLVED, reflecting the actual fix applied during this
    session's Claude Design sync (packages/react/src/styles.css now
    ships the default theme's :root token block) — the constitution
    had drifted out of sync with a fix already applied to the repo,
    corrected here rather than left stale.
Rationale: feature 025 (Sitewide Theme Selector & Persistence) closes a
gap verified directly against the live repo: only index.html and
theme-gallery.html of 78 static pages loaded theme-switcher.js, so
every individual component demo page silently ignored the persisted
theme and had no selector at all. Zero new theming logic, zero new
persistence mechanism — purely a rollout of feature 017/021's
already-shipped mechanism via a small idempotent script, verified
complete via a 77/77 completeness check. This is a MINOR bump: one new
documentation paragraph plus one corrected stale gap-status, no
principle text changed.
Templates requiring updates: ✅ none — no plan/spec/tasks template
  structural change; specs/025-sitewide-theme-persistence/tasks.md
  documents this feature's own implementation in full.

SYNC IMPACT REPORT (v1.20.0 — see below for the v1.19.0/v1.18.0/v1.17.0/v1.16.0/v1.15.0/v1.14.0/v1.13.0/v1.12.0/v1.11.0/v1.10.0/v1.9.0/v1.8.0/v1.7.0/v1.6.0/v1.5.0/v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.19.0 → 1.20.0
Modified principles: None
Added sections:
  - Component Catalog → Data Display & Listings → Charts entry extended
    with 5 additional Recharts chart types (ComposedChart, ScatterChart,
    FunnelChart, Treemap, Sankey), completing full coverage of all 11
    native Recharts top-level chart components (6 from feature 020 + 5
    from feature 024). Known Catalog Gaps' Chart entry updated: no
    remaining Recharts chart-type gap (Candlestick explicitly excluded —
    not a native Recharts component, a separate, larger scope decision
    if ever pursued).
Corrected sections: None this bump.
Rationale: feature 024 (Recharts Additional Chart Types, Batch 2) closes
the remaining slice of feature 020's own explicitly-deferred scope note
("more specialized chart types... are out of scope for this feature").
Zero new dependencies (all 5 types already ship in the `recharts`
package feature 020 adopted), zero new design tokens, zero new shared
chrome — every new chart type reuses `ChartFrame`/`ChartLegend`/
`ChartTooltip`/`ChartEmptyState`/`ChartDataTable`/`useChartColors`/
`usePrefersReducedMotion` verbatim. One real gap closed as a side effect
of this feature's own research: feature 020's Assumptions had
incorrectly listed "Candlestick" as a deferred native Recharts type —
Recharts has no native Candlestick component (it would require composing
custom shapes atop `ComposedChart`, a separate, larger decision) — this
is now correctly documented rather than silently perpetuated. This is a
MINOR bump: one catalog entry extended, no principle text changed.
Templates requiring updates: ✅ none — no plan/spec/tasks template
  structural change; specs/024-recharts-additional-charts/tasks.md
  documents this feature's own implementation notes in full.

SYNC IMPACT REPORT (v1.19.0 — see below for the v1.18.0/v1.17.0/v1.16.0/v1.15.0/v1.14.0/v1.13.0/v1.12.0/v1.11.0/v1.10.0/v1.9.0/v1.8.0/v1.7.0/v1.6.0/v1.5.0/v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.18.0 → 1.19.0
Modified principles: None
Added sections:
  - Component Catalog → new "Component Catalog Expansion (Batch 1,
    Feature 023)" entry: 14 new components (NumberInput, PasswordInput,
    MultiSelect, ActionIcon, CopyButton, SplitButton, AvatarGroup,
    Highlight, Code, ColorSwatch, NavLink, Anchor, Collapse, Spoiler),
    all shipped dual-surface, selected as a curated, buildable slice of
    feature 018's 105-candidate gap inventory — each reusing an existing
    mechanism (Button, Combobox, Dropdown Menu, Accordion's `<details>`,
    Sidebar's active-item convention, Avatar) rather than a new
    interaction pattern. Zero new dependencies, zero new design tokens.
Corrected sections: None this bump.
Rationale: feature 023 (Component Catalog Expansion, Batch 1) closes 14
entries from feature 018's inventory after a fresh confirmatory
competitor-research round (22 named competitors total across both
rounds — Mantine, Ant Design, PrimeReact, Radix, Chakra, Carbon,
Polaris, Primer, Fluent 2 from 018, plus MUI, shadcn/ui, Salesforce
Lightning, Adobe Spectrum, and Atlassian newly verified this round).
Built in parallel by 4 independent implementation passes (one per user
story), then integrated centrally. Real, non-hypothetical fixes found
during implementation, beyond the ones each pass reported inline in
tasks.md: (1) NumberInput's steppers were redesigned from a vertically-
stacked pair to side-by-side, since the stacked layout measured a
24×14px hit target and failed WCAG 2.2's 2.5.8 Target Size (Minimum,
AA) — the project's own axe config enforces `wcag22aa`; (2) MultiSelect's
options panel uses `popover="manual"` rather than Combobox's `popover
="auto"`, because MultiSelect (unlike Combobox) opens on focus/click of
an input outside the popover's own DOM subtree, and an `auto` popover's
light-dismiss algorithm closes it on that same click's `pointerdown`
before the `click` handler ever runs; (3) the static ColorSwatch sets
its caller-supplied color via the CSSOM (`element.style.backgroundColor`)
rather than an inline `style` attribute, since every page's `style-src
'self'` CSP (used verbatim catalog-wide, never `'unsafe-inline'`) would
otherwise render the chip transparent. This is a MINOR bump: one new
catalog entry (14 components), no principle text changed.
Templates requiring updates: ✅ none — no plan/spec/tasks template
  structural change; specs/023-component-catalog-expansion/tasks.md's
  own Implementation Notes section documents these fixes in full.

SYNC IMPACT REPORT (v1.18.0 — see below for the v1.17.0/v1.16.0/v1.15.0/v1.14.0/v1.13.0/v1.12.0/v1.11.0/v1.10.0/v1.9.0/v1.8.0/v1.7.0/v1.6.0/v1.5.0/v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.17.0 → 1.18.0
Modified principles: None
Added sections:
  - Component Catalog → Data Display & Listings → Data Table (NEW entry):
    an advanced, customizable Data Table — sort/filter/paginate, multi-row
    selection with bulk actions, and opt-in CRUD — closing the
    "interactive/sortable Data Table" gap flagged deferred since feature
    014. Shipped on both surfaces (static `src/scripts/data-table.js` +
    React `packages/react/src/DataTable/*`) sharing one framework-agnostic
    `shared/data-table/` module (sorting/filtering/pagination/selection
    pure functions) — the same shared-core convention established by
    feature 019's `shared/validators/`, not a new architectural pattern.
    TanStack Table was evaluated (per Principle VII's adoption-review
    protocol, specs/022-advanced-data-table/research.md R1) and
    deliberately rejected in favor of hand-rolled state: this catalog
    already builds equivalent-complexity interaction from scratch
    (Combobox, Dropdown Menu), and a table this size didn't warrant a new
    runtime dependency.
  - Component Catalog → Known Catalog Gaps → interactive/sortable Data
    Table marked shipped (feature 022); Date Picker/Calendar, Carousel,
    Scroll Area, Resizable panels, HoverCard remain deferred.
Corrected sections: None this bump.
Rationale: feature 022 (Advanced Data Table) closes a gap this
constitution has tracked as deferred since feature 014. Four real bugs
were found and fixed during implementation: (1) the CRUD edit/create form
component was always-mounted rather than conditionally rendered, so
React's useState-initializer-runs-once-on-mount meant switching between
editing different rows left stale values — fixed with a `key` prop keyed
to the target record, forcing a remount; (2) the native HTML5 `required`
attribute on form fields triggered the browser's own constraint
validation before React's `onSubmit`/`preventDefault()` could run,
short-circuiting the custom field-error UI — fixed with `noValidate` on
the form; (3) the static surface's programmatically-opened dialogs
(create/edit/delete, opened via button click rather than
`[data-dialog-trigger]`) never set `dialog._lastTrigger`, so
`overlay.js`'s `wireDialogClose` focus-return-on-close silently no-opped
— fixed by setting `_lastTrigger` at every call site; (4) the static
surface's full-subtree `innerHTML = ""` re-render on every state change
destroyed and recreated the "Columns" visibility `<details>` element,
resetting its `open` state to closed on every checkbox toggle inside it
— fixed with a closure-scoped flag restored via the `toggle` event. A
fifth, narrow-viewport-only layout bug was found post-implementation: the
"Columns" dropdown panel's `absolute right-0` positioning anchored its
right edge to the (narrow, left-of-center) `<summary>` element rather
than the viewport, pushing the panel off-screen to the left at 320px —
fixed with `left-0 sm:left-auto sm:right-0`. This is a MINOR bump: one
new catalog entry, no principle text changed.
Templates requiring updates: ✅ none — no plan/spec/tasks template
  structural change; specs/022-advanced-data-table/tasks.md's own
  Implementation Notes section documents the bugs/fixes described above.

SYNC IMPACT REPORT (v1.17.0 — see below for the v1.16.0/v1.15.0/v1.14.0/v1.13.0/v1.12.0/v1.11.0/v1.10.0/v1.9.0/v1.8.0/v1.7.0/v1.6.0/v1.5.0/v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.16.0 → 1.17.0
Modified principles: None
Added sections:
  - Theming & Multi-Palette Architecture → new "Gallery-wide theme
    preview" paragraph: the main component gallery (`index.html`) gained
    its own theme-selection `<select>` (grouped by `MOOD_FAMILIES`,
    `src/scripts/gallery-theme-selector.js`) so the whole catalog can be
    previewed under any curated theme from one page, complementing
    (not replacing) the dedicated Theme Gallery page. No new persistence
    mechanism, no new theme data — reuses feature 017's `THEMES`/
    `MOOD_FAMILIES`/`selectTheme()`/`KNOWN_THEME_IDS` verbatim.
Corrected sections: None this bump (see Rationale for a fix applied
  without a "corrected" prose change to an already-ratified catalog
  entry — this is a genuinely new, previously-undiscovered bug, not a
  correction to prior documentation).
Rationale: feature 021 (Gallery Theme Selector) added no new component
and no new architectural exception — purely a new consumer of feature
017's already-ratified theming mechanism, hence a documentation
addendum to the existing Theming & Multi-Palette Architecture section
rather than a new Component Catalog entry. One real, previously-
undiscovered bug was found and fixed during implementation while running
this feature's own 320px-viewport check: `index.html`'s header `<code>`
element (present since feature 017's 2026-07-09 commit, unrelated to
this feature's own markup) didn't wrap in WebKit at narrow viewports,
overflowing the page by 4px — invisible until this feature's own SC-004
acceptance test exercised the whole page's scroll width rather than only
the new control. Confirmed via `git blame` to predate this feature
before fixing with a one-class (`break-words`) addition. This is a MINOR
bump: one new documentation paragraph describing a shipped addition, no
principle text changed.
Templates requiring updates: ✅ none — no plan/spec/tasks template
  structural change; specs/021-gallery-theme-selector/tasks.md's own
  Implementation Notes section already documents the bug/fix described
  above.

SYNC IMPACT REPORT (v1.16.0 — see below for the v1.15.0/v1.14.0/v1.13.0/v1.12.0/v1.11.0/v1.10.0/v1.9.0/v1.8.0/v1.7.0/v1.6.0/v1.5.0/v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.15.0 → 1.16.0
Modified principles: None
Added sections:
  - Component Catalog → Forms, Validation & Inputs → Localized Identifier/
    Contact Fields (NEW entry): 11 masked, self-validating components
    (CPF, CNPJ, CEP, Brazilian phone, Título de Eleitor, PIS/PASEP,
    vehicle plate, IBAN, card number, international phone) across both
    the static gallery and the React package — this catalog's first
    feature to add net-new components to both surfaces simultaneously
    since feature 004. A new `shared/validators/` framework-agnostic
    module is the single source of truth for every check-digit/checksum
    algorithm, consumed identically by `src/scripts/localized-inputs.js`
    and every React component.
Corrected sections: None this bump.
Rationale: feature 019 (Localized Input Primitives) shipped with zero new
npm dependencies (every algorithm — CPF/CNPJ/Título/PIS-PASEP modulo-11,
IBAN mod-97, Luhn — is self-contained arithmetic, so Principle VII's
adoption-review protocol was never triggered) and a real, previously-
undiscovered bug found and fixed during implementation: `PhoneIntlInput`'s
first draft prepended the selected country's calling code directly into
the input's own value, which then fed back into the same `format()`/
`validate()` call on the next keystroke — the calling code's own digits
were double-counted as part of the national number, producing a false
"wrong length" rejection after the first keystroke. Fixed by keeping the
calling code as separate, non-editable display chrome, restoring the
idempotency every other component in this feature already had. This is a
MINOR bump: one new catalog entry (11 new components across both
surfaces), no principle text changed.
Templates requiring updates: ✅ none — no plan/spec/tasks template
  structural change; specs/019-localized-input-primitives/{plan,research,
  data-model,tasks}.md already reflect the final, corrected, shipped
  state described above.

SYNC IMPACT REPORT (v1.15.0 — see below for the v1.14.0/v1.13.0/v1.12.0/v1.11.0/v1.10.0/v1.9.0/v1.8.0/v1.7.0/v1.6.0/v1.5.0/v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.14.0 → 1.15.0
Modified principles: None
Added sections:
  - Component Catalog → Data Display & Listings → Charts (NEW entry):
    6 Recharts-based chart types (Line, Bar, Area, Pie/Donut, Radar,
    Radial) plus a shared Tooltip/Legend, closing the "Chart" gap flagged
    deferred since feature 014 — this catalog's SECOND top-level
    architectural exception (after Theming) and its FIRST component ever
    to ship React-only, with no zero-JavaScript static HTML twin
    (Recharts has no framework-independent rendering path; documented in
    spec.md Assumptions and the new static `src/components/chart/
    chart.html` cross-reference page, which links to the React demo
    instead of duplicating it).
  - Component Catalog → Known Catalog Gaps → Chart marked shipped
    (feature 020); Date Picker/Calendar, interactive Data Table, Carousel,
    Scroll Area, Resizable panels, HoverCard remain deferred.
  - Theming & Multi-Palette Architecture → new paragraph documenting a
    real, currently-unresolved gap found while building this feature: the
    React package's compiled `dist/styles.css` only ever *consumes* the
    `--color-*` custom properties, never *defines* their default values —
    only `src/styles/themes.css` (the static gallery) does. Every real
    downstream consumer of `@professional-design-system/react` that
    doesn't separately author an equivalent `:root` block currently gets
    unstyled/invalid theme colors. Fixed locally for this project's own
    dev/test harness (`tests/react-harness/src/harness.css` now imports
    `src/styles/themes.css`) so this feature's own tests could run
    meaningfully, but the underlying package-level gap for real consumers
    is recorded here as unresolved, not silently patched over.
Corrected sections:
  - Component Catalog → Data Display & Listings → Tables: the ratified
    entry claimed the header cell sits on `bg-neutral-50` at "7.23:1
    AAA" — both were wrong. The shipped `.data-table-header-cell` class
    has always used `bg-neutral-100`, and paired with the also-ratified
    `text-neutral-600`, the real measured contrast is 6.86:1, failing
    this catalog's own AAA 7:1 floor. Never caught before because no test
    surface had ever rendered this pairing against real computed theme
    colors until feature 020's harness fix above made that possible for
    the first time. Corrected to `text-neutral-700` (9.37:1 AAA) in both
    `src/styles/tailwind.css` and `packages/react/src/styles.css`, and
    `tests/e2e/table.spec.ts`'s hardcoded color assertion/comment updated
    to match.
Rationale: feature 020 (Recharts-Based Chart Primitives) shipped this
catalog's next architectural exception after Theming — a component whose
underlying library has no non-React output, an explicit, reasoned
Principle III exception (chart colors are still 100% derived from the
same `--color-*` tokens every other component uses, via a new
`useChartColors()` hook reading them live with `getComputedStyle`, never
a hardcoded literal) rather than a violation. Two real, previously-
undiscovered defects were found and fixed during implementation, both the
same class of bug this constitution has repeatedly documented ("ratified/
shipped but never empirically verified against real rendered output"):
(1) a real axe-core `no-focusable-content` violation from an early draft
nesting the shared Legend's interactive `<button>`s inside the
`role="img"` figure wrapper meant only for the chart visualization itself
— fixed by extracting a `ChartFrame` component that scopes `role="img"`
to just the SVG/`ResponsiveContainer`, with Legend/DataTable rendered as
siblings, not descendants; (2) the Table header-cell contrast bug
described above, surfaced only as a side effect of fixing this feature's
own test harness to actually load real theme tokens (previously every
React-harness demo — not just this feature's — silently rendered with
unset/invalid CSS custom properties, undetected because the pre-existing
`react-button.spec.ts` visual baseline predates feature 017's theming
refactor and CI has been down since 2026-07-12). A new
`DECORATIVE_ARIA_HIDDEN_TOKENS` entry (`neutral-400`) was added to
`scripts/check-contrast.mjs` for `ChartEmptyState`'s decorative icon,
which measures 2.54:1 against `bg-neutral-50` — below even the 3:1
non-text floor — the identical already-accepted exception class as
Rating's star fill (v1.13.0), confirmed via the same WCAG
relative-luminance formula rather than assumed. This is a MINOR bump: one
new catalog entry (six new components + two shared primitives), one
corrected already-ratified pairing, one new documented architectural
gap — no principle text changed.
Templates requiring updates: ✅ none — no plan/spec/tasks template
  structural change; specs/020-recharts-chart-primitives/{plan,research,
  data-model,tasks}.md already reflect the final, corrected, shipped
  state described above.

SYNC IMPACT REPORT (v1.14.0 — see below for the v1.13.0/v1.12.0/v1.11.0/v1.10.0/v1.9.0/v1.8.0/v1.7.0/v1.6.0/v1.5.0/v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.13.0 → 1.14.0
Modified principles:
  - II. Absolute Semantic Accessibility (WCAG 2.2 AAA) (NON-NEGOTIABLE) —
    added a "Curated-theme exception precedent" paragraph. The Principle's
    AAA bar remains NON-NEGOTIABLE and zero-exception for the default
    ("light") theme and any future default/primary theme; a new,
    documented allowlist-exception path (mirroring the pre-existing
    DECORATIVE_ARIA_HIDDEN_TOKENS/ICON_FILL_TEXT_TOKENS precedent) is
    permitted ONLY for the curated theme collection described in the new
    Theming & Multi-Palette Architecture section, and only when
    individually named and reasoned in scripts/check-contrast.mjs's
    KNOWN_THEME_CONTRAST_GAPS — never a silent or blanket failure. This is
    an additive clarification, not a redefinition or loosening of the
    Principle's core guarantee, so it does not require a MAJOR bump.
Added sections:
  - NEW top-level "Theming & Multi-Palette Architecture" section (between
    Design Foundations and Component Catalog): documents the CSS-custom-
    property/data-theme runtime-switching mechanism, the zero-markup-
    change guarantee (verified via a real 2-theme proof-of-concept before
    scaling), the 43-theme curated collection across 7 mood families
    sourced exclusively from real, named references (DaisyUI, Bootswatch,
    Nord/Dracula/Gruvbox/Everforest/Tokyo Night/Rose Pine/Catppuccin —
    never algorithmically generated), the localStorage try/catch
    persistence-error-handling requirement (a real code-review finding,
    T074), and the KNOWN_THEME_CONTRAST_GAPS allowlist as the permanent
    mechanism for future theme additions under the fixed schema's dual-
    role token constraint.
Corrected sections: None (see scripts/check-contrast.mjs's own in-file
  comment fix, T074, referenced in the new Theming section above — a
  code-comment accuracy fix, not a constitution-tracked correction).
Rationale: feature 017 (Curated Theme Presets) shipped a genuinely new
architectural layer — this catalog's first multi-palette/runtime-theming
system — rather than a new component or token addition within the existing
single-palette model every prior feature (001-016) worked within. It
required a real Principle II carve-out (a fixed 21-token schema's
`*-strong`/`brand-dark` tokens serving two roles — ink-text and solid-fill —
that invert for sufficiently dark themes, discovered empirically once real
dark themes were derived and audited, not anticipated during planning) and
introduces a permanent precedent (the KNOWN_THEME_CONTRAST_GAPS allowlist)
that will govern every future theme addition, not just this feature's 43.
This is a MINOR bump: one new top-level section plus an additive Principle
II clarification (no principle removed or redefined backward-
incompatibly, and the default theme's AAA guarantee is unchanged and still
zero-exception).
Templates requiring updates: ✅ none — no plan/spec/tasks template
  structural change; specs/017-curated-theme-presets/spec.md's own SC-003
  amendment (documented separately, dated during Phase 4 implementation)
  is the upstream source this constitution amendment now ratifies back
  into the project's permanent governance layer, per this constitution's
  established "propose in Phase 1/discover in implementation, ratify what
  shipped" sequence (v1.4.0 onward).
-->

<!--
SYNC IMPACT REPORT (v1.13.0 — see below for the v1.12.0/v1.11.0/v1.10.0/v1.9.0/v1.8.0/v1.7.0/v1.6.0/v1.5.0/v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.12.0 → 1.13.0
Modified principles: None
Added sections:
  - Component Catalog → Forms, Validation & Inputs → ColorPicker/ColorInput
  - Component Catalog → Data Display & Listings → TreeView, Rating
  - Component Catalog → Navigation & Disclosure → Menubar
  - Component Catalog → Known Catalog Gaps → TreeView/Rating/Menubar/
    ColorPicker marked shipped (feature 016), HoverCard remains deferred
    as redundant with Tooltip+Popover, remaining gaps unaddressed
Corrected sections: None — no prior entry needed correction.
Rationale: feature 016 (Advanced Interaction Primitives) shipped four
components closing the next tier of gaps from the "Known Catalog Gaps"
list ratified in v1.12.0 — each reuses an already-ratified mechanism
(native `<details>/<summary>` for TreeView, Dropdown Menu's panel
mechanics for Menubar, a native `<input type="color">` for ColorPicker)
rather than inventing a new one. This is a MINOR bump (new catalog
guidance, four new components, zero new tokens), matching the precedent
of v1.12.0's own feature-015 addition.
A real accessibility-tree verification (not assumed from spec docs)
confirmed TreeView's native `<details>/<summary>` needs zero ARIA at all
— Chrome DevTools Protocol showed `<summary>` exposed with role
`DisclosureTriangle` and correct independent `expanded` state per
instance. Rating required a genuinely NEW audit-script exemption
category (`DECORATIVE_ARIA_HIDDEN_TOKENS`, distinct from the existing
`ICON_FILL_TEXT_TOKENS`) since its decorative star-fill color fails even
the lower WCAG 1.4.11 non-text 3:1 floor, not just the AAA text bar the
existing exemption category was built for. Menubar surfaced a genuinely
tricky rapid-keypress race condition (found via code review, HIGH
severity) where the Popover API's queued `toggle` event let
`dropdown-menu.js`'s own unconditional close-time focus handling
(reused unmodified) clobber a newer keypress's result regardless of any
staleness guard applied to Menubar's own reactions — fixed by collapsing
a two-call `hidePopover()`-then-`showPopover()` sequence into a single
`showPopover()` call (confirmed to atomically close a sibling
`popover="auto"` panel natively with a guaranteed event order) plus a
`generation`/`settledGeneration` guard that ignores a keypress arriving
before an earlier transition's final focus placement has completed.
ColorPicker/ColorInput's `appearance-none` requirement was found only
after building the real component with Tailwind's `ring`/`shadow`
utility classes — an earlier isolated inline-`style` test had not
revealed this default-appearance suppression of author `box-shadow`.
Templates requiring updates: ✅ none — no principle or template-level
change, only Component Catalog content.
-->

<!--
SYNC IMPACT REPORT (v1.12.0 — see below for the v1.11.0/v1.10.0/v1.9.0/v1.8.0/v1.7.0/v1.6.0/v1.5.0/v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.11.0 → 1.12.0
Modified principles: None
Added sections:
  - Component Catalog → Application & Navigation → Stepper/Steps
  - Component Catalog → Forms, Validation & Inputs → Slider (Range),
    File Input/Upload
  - Component Catalog → Data Display & Listings → AspectRatio,
    Indicator, DataList, Timeline, Stat/Metric Card
  - Component Catalog → Overlays, Modals & Feedback → Spinner/Loader
  - Component Catalog → Advanced Forms & Interaction → PinInput/OTP
  - Component Catalog → Known Catalog Gaps → extended (not replaced)
    with TreeView, Rating, Menubar, ColorPicker/ColorInput, HoverCard
    (feature 015's research phase, a 10-major-design-system comparison)
Corrected sections: None — no prior entry needed correction.
Rationale: feature 015 (Feedback & Data Display Primitives) shipped ten
components closing genuine gaps found via a 10-major-design-system
comparison (shadcn/ui, Radix UI, MUI, Ant Design, Chakra UI, Mantine,
Carbon, Polaris, Primer, Fluent 2) — each reuses an already-ratified
mechanism (Progress's fill/track pairing for Slider, Pagination's
active-item pairing for Stepper, Avatar's sizing for Spinner/Timeline,
Badge's `-strong` tokens for Indicator, TextInput's focus ring for
PinInput) rather than inventing a new one. This is a MINOR bump (new
catalog guidance, ten new components, zero new design tokens), matching
the precedent of v1.11.0's own feature-014 addition.
Two real defects were found and fixed during this feature, both now
documented directly in the affected catalog entries above: (1)
Indicator's initial draft assumed Badge's severity tokens transferred
directly to a solid-fill badge, but the base status colors fail even AA
4.5:1 with white text (2.54:1–4.83:1) — fixed with the `-strong`
variants as solid fills instead (7.68:1–10.31:1, all AAA). (2) File
Input's helper text used `text-neutral-500` (4.83:1, clears AA but fails
this catalog's AAA 7:1 floor) — `neutral-500` is ratified only for
icon-fill/non-text use in this catalog, never body text; fixed with
`text-neutral-600`. A third, non-visual defect was also caught and fixed
during implementation: File Input's native `<input>` had to be
reordered to be first in the DOM (not last) for its mandated
focus-visible rule to be matchable at all by the `~` sibling combinator,
and its icon/text content wrapped in one `.file-drop-zone-content` div
so the focus-visible/disabled rules produce one cohesive visual change
instead of one per child element.
Templates requiring updates: ✅ none — no principle or template-level
change, only Component Catalog content.
-->

<!--
SYNC IMPACT REPORT (v1.11.0 — see below for the v1.10.0/v1.9.0/v1.8.0/v1.7.0/v1.6.0/v1.5.0/v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.10.0 → 1.11.0
Modified principles: None
Added sections:
  - Component Catalog → Forms, Validation & Inputs → Textarea, Button
    Group / Segmented Control
  - Component Catalog → Data Display & Listings → Divider/Separator,
    Kbd, Skeleton, Empty State
  - Component Catalog → Overlays, Modals & Feedback → Tooltip, Progress
  - Component Catalog → Navigation & Disclosure → Popover, Context Menu
  - Component Catalog → NEW "Known Catalog Gaps" subsection (Date
    Picker/Calendar, interactive Data Table, Carousel, Chart, Scroll
    Area, Resizable panels — deliberately deferred, not silently dropped)
  - Design Foundations → Typography & Text Scale → `font-mono` token
    (this catalog's first ratified monospace stack)
Corrected sections:
  - Component Catalog → Navigation & Disclosure → Command Palette: noted
    its ⌘K/Ctrl+K markup now uses the shared `.kbd` class instead of
    duplicating the same utility string inline (feature 014).
Rationale: feature 014 (Micro-Interaction & Utility Primitives) shipped
ten components closing genuine gaps found via a shadcn/ui + Radix UI
Primitives comparison — each extends an already-ratified mechanism
(Accordion's native exclusivity for Button Group, Dropdown Menu's
Popover-API/Anchor-Positioning wiring for Popover/Context Menu, Avatar/
Card's sizing for Skeleton) rather than inventing a new one. This is a
MINOR bump (new catalog guidance + one new token), matching the
precedent of v1.9.0's own Lists addition.
Two genuine, previously-undiscovered bugs were found and fixed during
this feature, both now documented directly in the affected catalog
entries above so future components don't repeat them: (1) this
project's CSP (`style-src 'self'`, no `unsafe-inline`) silently blocks
inline `style="..."` HTML attributes — affected both Tooltip's
`anchor-name`/`position-anchor` and Progress's fill width, caught only
by inspecting computed style values and browser console output, since
no test asserting ARIA attributes or opacity alone would have surfaced
it; fixed via pre-declared numbered CSS classes (Tooltip, preserves
zero-JS) and direct CSSOM property assignment via a small script
(Progress, since percentage is a continuous value space unlike
Tooltip's small set of anchor pairings). (2) `scripts/audit-tokens.mjs`
had a real bug of its own: its code comment claimed to support
directional radius utilities like `rounded-t-lg`, but the allowlist
check never actually stripped the directional infix before validating —
found while building Button Group's `first:rounded-l-md`/
`last:rounded-r-md` segment corners, now fixed to correctly parse
side/corner infixes before checking the base radius allowlist.
Templates requiring updates: ✅ none — no principle or template-level
change, only Component Catalog and Design Foundations content.
-->

<!--
SYNC IMPACT REPORT (v1.10.0 — see below for the v1.9.0/v1.8.0/v1.7.0/v1.6.0/v1.5.0/v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.9.0 → 1.10.0
Modified principles: None
Added sections: Component Catalog → Data Display & Listings → Tables —
  documents the shipped `.data-table`/`.data-table-header-cell`/
  `.data-table-cell`/`.data-table-row-zebra` primitive (feature 012),
  including the py-3/py-4 header/body padding split, the Tailwind
  corePlugins naming-collision lesson applied proactively, and the
  scrollable-region-focusable accessibility fix and its tradeoff.
Corrected sections:
  - Component Catalog → Data Display & Listings → Lists: removed the
    now-resolved KNOWN GAP note about Table (feature 011), replaced
    with a one-line pointer to the Tables entry above.
Rationale: feature 012 closed the "documented but never built" gap
Lists itself had before feature 011 — the Tables catalog entry
described a pattern but no `src/components/table/` component had ever
shipped. Unlike Lists, the documented contrast values were empirically
verified to already be correct (no token correction needed) — this
amendment documents that verification rather than a fix. This is a
MINOR bump (new catalog guidance for a genuinely shipped component),
matching the precedent of v1.9.0's own Lists addition.
Templates requiring updates: ✅ none — no principle or template-level
change, only Component Catalog content.
-->

<!--
SYNC IMPACT REPORT (v1.9.0 — see below for the v1.8.0/v1.7.0/v1.6.0/v1.5.0/v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.8.0 → 1.9.0
Modified principles: None
Added sections: Component Catalog → Data Display & Listings → Lists —
  documents the shipped `.list`/`.list-row`/`.list-row-interactive`/
  `.list-row-title`/`.list-row-metadata` primitive (feature 011).
Corrected sections:
  - Component Catalog → Data Display & Listings → Lists: replaced
    `text-xs text-neutral-500` (4.83:1, fails AAA) with `text-xs
    text-neutral-600` (7.56:1, AAA) for metadata text, and replaced the
    "KNOWN GAP: never implemented" note with documentation of the
    actually-shipped component and its exact class names.
Rationale: feature 011 closed the catalog gap flagged during feature
006 — Lists was documented as a pattern but never built as a real
component, and its metadata token was wrong (never empirically
verified, the same class of gap Breadcrumbs had before feature 005).
This is a MINOR bump (new catalog guidance for a genuinely new shipped
component, not just a wording fix), matching the precedent of v1.3.0's
own new-token additions.
New KNOWN GAP recorded: Table has the identical "documented but never
built" defect Lists had — flagged for whichever future feature ships
it, per this constitution's own established practice of recording
follow-up gaps rather than silently deferring them (e.g. the Lists gap
itself was recorded this way in feature 006, and is now the model for
recording Table's).
Templates requiring updates: ✅ none — no principle or template-level
change, only Component Catalog content.
-->

<!--
SYNC IMPACT REPORT (v1.8.0 — see below for the v1.7.0/v1.6.0/v1.5.0/v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.7.0 → 1.8.0
Modified principles: None
Added sections: None (no new catalog entry — a correctness fix to two
  already-ratified entries).
Corrected sections:
  - Component Catalog → Navigation & Disclosure → Dropdown Menu: added
    that the panel is anchored to its trigger via CSS Anchor Positioning
    (`anchor-name`/`position-anchor`/`anchor()`), not `position: absolute`
    alone.
  - Component Catalog → Advanced Forms & Interaction → Combobox: the
    prior text asserted "`position: absolute` override" was sufficient
    to anchor the listbox under the input — this was WRONG. Once an
    element is shown via the Popover API, the browser promotes it to the
    top layer, which resets its `position: absolute` containing block to
    the viewport's initial containing block, not the nearest positioned
    ancestor — `position: absolute` alone never actually anchored either
    Dropdown Menu's panel or Combobox's listbox to their trigger/input,
    confirmed via direct Playwright bounding-box measurement (feature
    010). Corrected to describe the CSS Anchor Positioning fix.
Rationale: feature 010 (a bug-fix feature, not a new component) found
this real, previously-undiscovered layout bug while building feature
009's React Dropdown Menu port — existing visual-regression screenshots
crop tightly to the popover element itself, which looks fine in
isolation regardless of where on the page it actually renders, so no
prior test caught it since Dropdown Menu (v1.4.0/feature 005) or
Combobox (v1.7.0/feature 008) shipped. Verified via direct
`CSS.supports()` testing against this project's own Playwright browser
engines (Chromium, Firefox, WebKit) that CSS Anchor Positioning is
natively supported in all three before adopting it as the fix — the
same "verify, don't assume" discipline applied to the Popover API itself
in v1.4.0. This is a MINOR bump per this project's versioning policy
(correcting a wrong technical claim in an already-ratified pattern,
matching the precedent of v1.6.0/v1.7.0's own AAA-contrast corrections)
— no principle text changed.
Templates requiring updates: None — this is a catalog-prose correction,
  not a new pattern requiring template updates.

SYNC IMPACT REPORT (v1.7.0 — see below for the v1.6.0/v1.5.0/v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.6.0 → 1.7.0
Modified principles: None
Added sections:
  - Component Catalog → NEW "Advanced Forms & Interaction" section:
    Combobox and Command Palette, reflecting feature
    008-advanced-forms-primitives's shipped patterns — this project's
    3rd and 4th JS modules (after overlay.js/toast.js in v1.0.0/003 and
    tabs.js/dropdown-menu.js in v1.4.0/005). Combobox is a from-scratch
    WAI-ARIA 1.2 combobox (native <datalist> verified insufficient — no
    ARIA combobox roles, no styling control, inconsistent cross-browser
    filtering, no disabled-option/no-results support) using the Popover
    API for its listbox panel, the same mechanism Dropdown Menu already
    established. Command Palette reuses Modal's <dialog>/showModal()
    chrome verbatim plus this project's first document-level global
    keyboard shortcut (Cmd/Ctrl+K).
Corrected sections: None this bump.
Refactored (non-visible, behavior-preserving): src/scripts/overlay.js's
  backdrop-click-close + WebKit-safe close-time refocus logic extracted
  into an exported wireDialogClose(dialog) helper, since Command
  Palette's dialog has no data-dialog-trigger button for
  initDialogTriggers()'s existing per-trigger loop to discover (it opens
  via a global shortcut instead). Verified behavior-preserving for
  Modal/Slide-over by running the full pre-existing suite before and
  after: 1731/1752 passed, 21 skipped, unchanged skip count, both
  modal.spec.ts and slide-over.spec.ts fully green.
Known gaps documented (carried over, unchanged, not addressed this bump):
  - Component Catalog → Data Display & Listings → Lists: still not
    implemented as its own component; the `text-xs text-neutral-500`
    metadata pattern remains an uncorrected latent AAA gap (see v1.5.0's
    report for detail).
Rationale: feature 008 (Combobox, Command Palette) was implemented
against these patterns as proposed Phase 1 design docs
(specs/008-advanced-forms-primitives/data-model.md, contracts/*.md,
research.md), per the same "propose in Phase 1, ratify what shipped"
sequence used for v1.4.0/v1.5.0/v1.6.0. Two `/speckit-analyze` passes
caught and fixed real gaps before and during implementation: a CRITICAL
Combobox gating-condition bug that would have made the "No results"
state unreachable (an earlier draft gated the popover's open call on
"query non-empty AND at least one match," directly contradicting
FR-004); a HIGH missing `aria-expanded` sync requirement; a CRITICAL
cross-artifact inconsistency where research.md/a contract claimed
overlay.js's close/backdrop logic was reused "verbatim" for Command
Palette when the actual per-trigger-loop implementation structurally
could not reach a trigger-less dialog, corrected via the
wireDialogClose(dialog) extraction described above; and a real
`popovertarget` HTML-spec misuse (inert on `type="text"` inputs) caught
before shipping. A code-reviewer agent pass found 0 CRITICAL/HIGH issues
(verdict APPROVE) and two optional, non-blocking notes (documented in
tasks.md T019, not carried into this amendment). A real functional bug
was also found and fixed during implementation via a standalone debug
script: the Command Palette's search input was missing its `id`
attribute, silently breaking `document.getElementById()` and disabling
the entire shortcut feature until fixed. This is a MINOR bump: one new
catalog section plus a behavior-preserving internal refactor, no
principle text changed.
Templates requiring updates (this MINOR bump):
  ✅ specs/008-advanced-forms-primitives/data-model.md (already documents
     these corrections as findings; this amendment folds them back into
     the ratified source of truth)
  ✅ specs/008-advanced-forms-primitives/contracts/*.md (already reflect
     the final, corrected, shipped state)
  ⚠ Lists' `metadata` token remains a known, documented, NOT-yet-corrected
     gap — unchanged from v1.5.0, still tracked, not silently dropped

SYNC IMPACT REPORT (v1.6.0 — see below for the v1.5.0/v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.5.0 → 1.6.0
Modified principles: None
Added sections:
  - Component Catalog → Application & Navigation → Pagination (NEW entry),
    reflecting feature 007-application-shell-primitives's shipped pattern.
    Zero JavaScript; current page via `aria-current="page"` on
    `bg-brand-dark text-white`; Previous/Next are genuinely-disabled
    native `<button disabled>` at boundaries and real `<a href>` when
    enabled (a dead `<button>` masquerading as an enabled control was a
    real HIGH code-review finding, corrected pre-ratification); ellipsis
    `text-neutral-600` (not `-500` — `aria-hidden` exempts assistive
    technology, not sighted low-vision users who still read the glyph).
Corrected sections:
  - Component Catalog → Application & Navigation → Sidebar: active-item
    background corrected from `bg-brand text-white` (4.83:1, fails AAA)
    to `bg-brand-dark text-white` (7.90:1) — this ratified-since-v1.0.0
    pattern had never actually been implemented/tested until feature 007,
    which computed the WCAG relative-luminance formula directly and found
    the same class of gap Button primary already avoided. Dark-theme
    resting item text corrected from `text-neutral-400` (6.99:1, fails
    AAA by a hair) to `text-neutral-300` (12.04:1), same root cause.
  - Component Catalog → Application & Navigation → Navbar/Header: documents
    the mobile menu now ships as a native `<details>`/`<summary>` element
    (zero JavaScript, reusing Accordion's disclosure mechanism rather than
    the Popover API — no light-dismiss/floating-positioning need exists
    for a menu that pushes content down) and a `supports-[backdrop-filter]`
    fallback for the sticky header's translucency.
Known gaps documented (carried over, unchanged, not addressed this bump):
  - Component Catalog → Data Display & Listings → Lists: still not
    implemented as its own component; the `text-xs text-neutral-500`
    metadata pattern remains an uncorrected latent AAA gap (see v1.5.0's
    report for detail).
Rationale: feature 007 (Pagination, Sidebar, Navbar) was implemented
against these patterns as proposed Phase 1 design docs
(specs/007-application-shell-primitives/data-model.md, contracts/*.md,
research.md), per the same "propose in Phase 1, ratify what shipped"
sequence used for v1.4.0 and v1.5.0. Phase 0 research computed the WCAG
relative-luminance formula directly (not assumed) and found TWO real,
previously-undiscovered AAA contrast failures in this constitution's own
ratified-but-never-verified Sidebar pattern — the same "ratified but
never empirically verified" class of bug Breadcrumbs had before v1.4.0
and Lists still has, undiscovered until a feature actually implements
the pattern. A `/speckit-analyze` pass also caught a CRITICAL
Principle V gap (missing `active:` states across every interactive
element in a first draft) and an unsound AAA exemption reasoning for
Pagination's ellipsis, both corrected before implementation. A
code-reviewer agent pass caught one real HIGH-severity bug (a dead,
non-functional `<button>` posing as an enabled Pagination control) and
one LOW vestigial-class note (Navbar's mobile `<details>` carrying an
unused `group` class copied from Accordion), both fixed. This is a MINOR
bump: one new catalog entry, two corrected token pairings, no principle
text changed.
Templates requiring updates (this MINOR bump):
  ✅ specs/007-application-shell-primitives/data-model.md (already
     documents these corrections as findings; this amendment folds them
     back into the ratified source of truth)
  ✅ specs/007-application-shell-primitives/contracts/*.md (already
     reflect the final, corrected, shipped state)
  ⚠ Lists' `metadata` token remains a known, documented, NOT-yet-corrected
     gap — unchanged from v1.5.0, still tracked, not silently dropped

SYNC IMPACT REPORT (v1.5.0 — see below for the v1.4.0/v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.4.0 → 1.5.0
Modified principles: None
Added sections:
  - Base Semantic Palette: one new token, `status.info-strong` (#1E40AF,
    8.72:1 against white) — `status.info` existed since v1.0.0 but had no
    text-safe `-strong` companion, unlike success/warning/error.
  - Component Catalog → Data Display & Listings → Avatar, Card, Alert/Banner
    (NEW entries), reflecting feature 006-data-display-primitives's shipped
    patterns. Avatar's fallback reuses the existing ratified Lists avatar
    size for its "large" variant. Card has no native-element precedent (a
    proposed pattern, like Accordion/Tabs/Dropdown Menu in v1.4.0) reusing
    the Modals panel's `rounded-lg`/`border-neutral-200` pair and
    `.btn-primary`'s `hover:shadow-md` transition. Alert/Banner reuses
    Badge's exact severity formula for success/error/warning and extends
    it to `info` via the new `info-strong` token; explicitly carries no
    `role="status"`/`aria-live`/`role="alert"`, unlike Toast, since it is
    static page content, not a transient announcement.
Corrected sections: None this bump (see the "KNOWN GAP" note added under
  Lists below, which documents rather than fixes a discovered issue).
Known gaps documented (not corrected — out of scope for this feature):
  - Component Catalog → Data Display & Listings → Lists: the ratified
    `metadata` pattern (`text-xs text-neutral-500`) failed a real
    axe-core AAA scan (4.83:1) the first time it was actually used
    (feature 006's Card composed demo) — Lists itself has never shipped
    as its own component, so this entry is left uncorrected here and
    flagged as a required fix for whichever future feature ships Lists,
    the same "ratified but never empirically verified" pattern Breadcrumbs
    had before v1.4.0/feature 005.
Rationale: feature 006 (Avatar, Card, Alert/Banner) was implemented
against these patterns as proposed Phase 1 design docs
(specs/006-data-display-primitives/data-model.md, contracts/*.md), per
the same "propose in Phase 1, ratify what shipped" sequence used for
v1.4.0's Navigation & Disclosure section. Two `/speckit-analyze` passes
plus a code-reviewer agent pass caught and fixed real gaps before and
during implementation: an unverified "11.58:1" Avatar-contrast figure
that was actually 9.37:1 (still AAA-compliant, but the wrong number would
have been ratified verbatim if uncaught); a missing check-contrast.mjs
coverage entry for the new neutral-700/neutral-100 pairing; Alert's
`info` severity initially bypassing the already-ratified `status.info`
token in favor of an ad-hoc `brand-light`/`brand-dark` treatment,
corrected to extend the token properly instead. This is a MINOR bump: one
new token plus new catalog guidance, no principle text changed.
Templates requiring updates (this MINOR bump):
  ✅ specs/006-data-display-primitives/data-model.md (already documents
     these corrections as findings; this amendment folds them back into
     the ratified source of truth)
  ✅ specs/006-data-display-primitives/contracts/*.md (already reflect the
     final, corrected, shipped state)
  ⚠ Lists' `metadata` token is a known, documented, NOT-yet-corrected gap
     — tracked above, not silently deferred

SYNC IMPACT REPORT (v1.4.0 — see below for the v1.3.4/v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.3.4 → 1.4.0
Modified principles: None
Added sections:
  - Component Catalog → Navigation & Disclosure (NEW section): Accordion/
    Disclosure, Tabs, and Dropdown Menu, reflecting feature
    005-navigation-disclosure-primitives's shipped patterns. Accordion
    uses native <details>/<summary> (zero JS, including the exclusive
    single-open-at-a-time variant via the native shared `name`
    attribute). Tabs is this project's second component (after
    Modal/Slide-over/Toast) requiring custom JavaScript, since no native
    element covers the WAI-ARIA Tabs pattern's roving-tabindex/arrow-key
    keyboard model. Dropdown Menu uses the native Popover API
    (`popover="auto"`) for open/close/light-dismiss/top-layer — the same
    relationship `<dialog>` has to Modal/Slide-over — with a small JS
    module for arrow-key roving focus, `aria-expanded` syncing, and
    Tab-closes-the-menu (WAI-ARIA APG Menu Button convention).
Corrected sections (existing content fixed, not newly added):
  - Component Catalog → Application & Navigation → Breadcrumbs: resting/
    active link color corrected from the originally speculative
    `text-neutral-500` (never empirically verified since no feature had
    implemented Breadcrumbs until now) to `text-neutral-600`, plus
    documents the `active:text-neutral-700` state and notes that
    `disabled:` is a technical impossibility for `<a>` elements (Tailwind's
    `disabled:` variant targets the `:disabled` CSS pseudo-class, which
    never matches an anchor), not a state Principle V exempts Breadcrumbs
    from needing.
Rationale: feature 005 (Breadcrumbs, Accordion/Disclosure, Tabs, Dropdown
Menu) was implemented against these patterns as *proposed* Phase 1 design
docs (specs/005-navigation-disclosure-primitives/data-model.md,
contracts/*.md) since — unlike Modal/Slide-over/Toast in feature 003,
which had a pre-existing ratified Overlays/Modals/Feedback catalog entry
to build against — Accordion/Tabs/Dropdown Menu had no prior catalog
section at all, and Breadcrumbs' existing entry (speculatively ratified in
v1.2.1) had never actually been implemented or tested. Two full
`/speckit-analyze` passes plus a code-reviewer agent pass caught and fixed
real gaps before and during implementation (Principle V state-completeness
hedges, a real WCAG AAA contrast failure in the Breadcrumbs/Tabs resting
color, a Dropdown Menu focus-visible outline that would have silently
dropped the mandated outline for a background highlight alone) — this
amendment ratifies what actually shipped and was verified, per the
"propose in Phase 1, ratify what shipped" sequence already used for
genuinely new patterns in prior features (e.g. v1.3.0's `-strong` status
tokens). This is a MINOR bump: new catalog guidance added (Navigation &
Disclosure), plus a correction to already-ratified content (Breadcrumbs) —
no principle text changed.
Templates requiring updates (this MINOR bump):
  ✅ specs/005-navigation-disclosure-primitives/data-model.md (already
     documents these corrections as findings; this amendment folds them
     back into the ratified source of truth)
  ✅ specs/005-navigation-disclosure-primitives/contracts/*.md (already
     reflect the final, corrected, shipped state)
  ⚠ No other spec/plan/tasks documents reference the stale
     `text-neutral-500` Breadcrumbs value that need correcting

SYNC IMPACT REPORT (v1.3.4 — see below for the v1.3.3/v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.3.3 → 1.3.4
Modified principles: None
Added sections:
  - Alignment Grid & Spacing → Border radius: adds `rounded-full` (9999px)
    as a ratified token for pills/circles (toggle tracks/dots, avatars),
    alongside the existing sm/md/lg scale.
  - tailwind.config.ts: `borderRadius.full = "9999px"`, so
    `scripts/audit-tokens.mjs`'s dynamically-derived allowlist accepts it.
Rationale: a third `/speckit-analyze` pass on feature
002-form-primitives-round-2 (with tasks.md now present) found that
contracts/toggle.contract.md's `rounded-full` track/dot styling had no
ratified radius token backing it — the constitution's border-radius scale
and tailwind.config.ts's borderRadius block only defined sm/md/lg. This
would have failed scripts/audit-tokens.mjs (Principle IV) the moment the
contract was implemented, contradicting plan.md's G3 "PASS" claim and
tasks.md's T012 "expected: 0" note — caught before any component code was
written. `rounded-full` is a categorically different, well-understood
Tailwind keyword (fully rounded, not a step on the 4/8/12px scale) already
implied by the existing "avatars" prose in the Data Display section, so
ratifying it formally is a natural completion of the existing scale, not a
new design direction. This is a PATCH bump: one new token value, no
principle changed, no existing token altered.
Templates requiring updates (this PATCH):
  ✅ tailwind.config.ts — borderRadius.full added
  ⚠ specs/002-form-primitives-round-2/plan.md — G3 row should note this
    amendment once applied
  ⚠ specs/002-form-primitives-round-2/tasks.md — T012 note should
    reference the resolved gap

SYNC IMPACT REPORT (v1.3.3 — see below for the v1.3.2/v1.3.1/v1.3.0 reports this extends)
Version change: 1.3.2 → 1.3.3
Modified principles: None
Added sections: None (no new tokens)
Corrected sections:
  - Component Catalog → Forms, Validation & Inputs → Checkboxes/radios:
    updated from stale `rounded` (raw, non-ratified radius) to
    `rounded-sm` (the actual ratified token feature 001's Checkbox
    ships), added the full focus-visible/disabled state set and the
    peer/peer-disabled label-dimming pattern that shipped but was never
    reflected back into the catalog, and documented Radio's native-shape/
    shared-`name` grouping for feature 002.
  - Component Catalog → Forms, Validation & Inputs → Toggles/switches:
    added the `ring-1 ring-inset ring-neutral-500` boundary and
    disabled-dimming pattern from feature 002's Toggle contract, with the
    contrast rationale (1.24:1 fill alone vs. 4.83:1 with the ring).
Rationale: `/speckit-analyze` on feature 002-form-primitives-round-2
found the ratified catalog entries for Checkboxes/radios and Toggles/
switches had drifted from what actually shipped (feature 001's Checkbox)
or was about to ship (feature 002's Toggle) — the catalog is meant to be
the single source of truth, and letting contracts silently diverge from
it defeats that purpose even when, as here, no principle is violated
(WCAG 1.4.11 is AA, not part of Principle II's AAA mandate). This is a
PATCH bump: documentation-only corrections to already-ratified tokens,
no principle or token change.
Templates requiring updates: None (governance/catalog text only).

SYNC IMPACT REPORT (v1.3.2 — see below for the v1.3.1/v1.3.0 reports this extends)
Version change: 1.3.1 → 1.3.2
Modified principles: None
Added sections:
  - Governance → Adopted External Skills: records `frontend-design`
    (Anthropic, official `claude-plugins-official` marketplace, Apache 2.0)
    as vetted under Principle VII and available for use.
Rationale: closes the TODO(SKILL_REFS) follow-up carried since v1.0.0 —
the original request referenced a `frontend-design` skill that did not
exist under that exact name at the time. It is now available (enabled in
this environment's `.claude/settings.json`), and was verified against all
four Principle VII criteria before being recorded as adopted: official
Anthropic publisher and marketplace (trustworthy, actively maintained),
plain-instruction skill content with no scripts or obfuscated behavior
(safe), directly serves this project's stated goal of avoiding templated
UI defaults (relevant), Apache License 2.0 (compatible). This is a PATCH
bump: documentation-only, no principle or token changed.
Templates requiring updates: None (governance note only).

SYNC IMPACT REPORT (v1.3.1 — see below for the v1.3.0 report this extends)
Version change: 1.3.0 → 1.3.1
Modified principles: None
Added sections: None (no new tokens)
Corrected sections:
  - Component Catalog → Data Display & Listings → Badges: background color
    switched from raw Tailwind default-palette classes (`bg-green-50`,
    `bg-red-50`, `bg-amber-50` — never part of the ratified palette) to
    `bg-success/5`, `bg-error/5`, `bg-warning/5` (existing status tokens via
    Tailwind's opacity modifier).
Rationale: a second `/speckit-analyze` pass (post-v1.3.0, pre-implementation)
on feature 001-primitive-components found that the v1.3.0 fix corrected the
Badge's text/ring colors but missed that the background colors were also raw
palette classes never added to this constitution — a Principle IV violation.
Verified via the WCAG relative-luminance formula that `bg-success/5` /
`bg-error/5` / `bg-warning/5` (composited over white) still pass AAA with the
`-strong` text tokens on top (7.11–8.72:1, comfortable margin above 7:1).
This is a PATCH bump: no new token, no principle change, only a corrected
Tailwind class reference to already-ratified tokens.
Templates requiring updates (this PATCH):
  ✅ specs/001-primitive-components/contracts/badge.contract.md
  ✅ specs/001-primitive-components/spec.md (User Story 3 AC1 stale example)
  ✅ specs/001-primitive-components/data-model.md (Badge validation rules stale example)
  ✅ specs/001-primitive-components/plan.md (Constitution Check G3 note)

SYNC IMPACT REPORT (v1.3.0)
Version change: 1.2.1 → 1.3.0
Modified principles: None (no principle text changed)
Added sections:
  - Base Semantic Palette: three new tokens under `status` —
    `success-strong` (#065F46), `error-strong` (#991B1B),
    `warning-strong` (#78350F) — calibrated text-safe variants of the
    existing success/error/warning tokens.
Corrected sections (existing content fixed, not newly added):
  - Component Catalog → Data Display & Listings → Badges: text color
    switched from `text-success`/`text-error`/`text-warning` to the new
    `-strong` tokens; ring color switched from raw Tailwind palette
    classes (`ring-green-600/20`, `ring-red-600/10`, `ring-amber-600/10`)
    to the ratified `ring-success/20`, `ring-error/10`, `ring-warning/10`.
  - Component Catalog → Forms, Validation & Inputs → Inline errors:
    text color switched from `text-error` to `text-error-strong`.
Removed sections: None
Rationale for this amendment: `/speckit-analyze` on feature
001-primitive-components (2026-07-08) found that the ratified
success/error/warning tokens, as prescribed for text-over-tint use in the
Badge and inline-error patterns, fail the Principle II AAA contrast gate
(7:1) — measured via the WCAG relative-luminance formula at 2.42:1
(success on green-50), 3.44:1 (error on red-50), 2.07:1 (warning on
amber-50), and 3.76:1 (error text on white). The three new `-strong`
tokens pass AAA in every context measured (7.34–9.72:1 range). The
existing DEFAULT success/error/warning values are unchanged and remain
valid for non-text uses (icons, dots, rings via opacity modifier). The
Badge ring-color correction additionally resolves a pre-existing
Principle IV tension: the raw `ring-green-600/20`-style classes used a
different hue calibration than this project's own status tokens and were
never added to the ratified palette.
Templates requiring updates:
  ✅ .specify/templates/plan-template.md — no edit required
  ✅ .specify/templates/spec-template.md — no edit required
  ✅ .specify/templates/tasks-template.md — no edit required
  ✅ .specify/templates/checklist-template.md — no edit required
  ✅ .claude/skills/speckit-*/SKILL.md (11 files) — no edit required
  ✅ specs/001-primitive-components/contracts/badge.contract.md — updated
    to reference the new `-strong`/ring tokens
  ✅ specs/001-primitive-components/contracts/text-input.contract.md —
    updated to reference `text-error-strong`
  ✅ specs/001-primitive-components/contracts/button.contract.md — updated
    to `bg-brand-dark` (unrelated AAA fix, same remediation pass)
  ✅ specs/001-primitive-components/spec.md — FR-002 (added disabled state),
    FR-007/US3-AC2 (removed incorrect `aria-checked` requirement for the
    native Checkbox), version reference updated to v1.3.0
  ✅ specs/001-primitive-components/plan.md — Constitution Check gate table
    corrected (G1/G3 remediation noted, G4 re-scoped to FR-004)
Follow-up TODOs:
  - RESOLVED (carried from v1.2.0/v1.2.1): the `find-skills` gap is
    formally defined as Principle VII's behavior protocol.
  - TODO(SKILL_REFS): `frontend-design`, referenced in the original
    v1.0.0 request, remains unresolved — still not present under that
    exact name.
-->

# Professional Design System Constitution
<!-- HTML/CSS + Tailwind CSS component library, tokens, and AI governance rules -->

## Core Principles

### I. Cognitive Ergonomics & Visual Hierarchy
Every layout MUST be designed to reduce cognitive load and guide the user's eye
predictably:
- **Fitts's Law**: primary action elements (save, continue, confirm) MUST have a
  click target of at least 44x44px and be positioned in the natural reading flow.
- **Strict visual hierarchy**: typographic weight contrast (`font-bold` vs.
  `font-normal`) and semantic color usage MUST guide the user toward the primary
  action before secondary ones — never two actions of equal visual weight
  competing for the same attention.
- **Reduced mental load**: related information MUST be grouped into clear
  cards/sections, with enough white space (`gap-*`, `space-y-*`) to avoid visual
  fatigue.

**Rationale**: design system interfaces power products used repeatedly; small,
recurring cognitive friction compounds into abandonment and user error at scale.

### II. Absolute Semantic Accessibility (WCAG 2.2 AAA) (NON-NEGOTIABLE)
No component is considered complete without AAA-level accessibility:
- **Dynamic contrast**: every text-over-color-background combination MUST pass the
  AAA contrast test, using the correct tokens (`text-neutral-900` on light
  backgrounds, `text-white` on dark backgrounds — never arbitrary colors).
- **Mandatory state attributes**: `aria-expanded` on dropdowns/modals,
  `aria-checked` on custom inputs, `aria-invalid="true"` on fields with errors,
  `aria-live="polite"` on dynamic notifications/loaders.
- **Focus management**: modals and slide-overs MUST trap keyboard focus within the
  active element and return it to the original trigger on close. Visually hidden
  interactive elements MUST receive `aria-hidden="true"` or `tabindex="-1"`.

**Rationale**: accessibility is not an optional feature of a design system — it is
the contractual guarantee that every product built on top of it is usable by
anyone, including screen-reader and keyboard-only users.

**Curated-theme exception precedent** (added v1.14.0, feature 017): this
catalog's fixed 21-token semantic schema uses `*-strong` status colors and
`brand-dark` in two roles at once — ink-colored text read directly against
the page, and a solid fill behind white text (Indicator, Button primary) —
that agree in direction for a light theme but provably invert for a
sufficiently dark one (page-background lightness and ink-text lightness
swap which end of the scale they sit at). No single token value can satisfy
both roles simultaneously for such a theme without splitting the schema
into separate ink/fill tokens per semantic color — a materially larger
cross-component rework, not a color-value iteration. The default ("light")
theme and every future default/primary theme MUST still pass this
Principle's AAA bar with zero exceptions. For the curated theme collection
(see "Theming & Multi-Palette Architecture" below) ONLY, a documented,
individually-named, reasoned exception in `scripts/check-contrast.mjs`'s
`KNOWN_THEME_CONTRAST_GAPS` allowlist is permitted in place of a genuine
pass — never a silent or blanket failure. This mirrors the pre-existing
`DECORATIVE_ARIA_HIDDEN_TOKENS`/`ICON_FILL_TEXT_TOKENS` exemption
precedent (v1.13.0/feature 016) for the identical kind of documented,
reasoned exception applied to a different constraint class.

### III. Tailwind-Only Architecture (Zero Parallel CSS)
The entire ecosystem MUST run exclusively on the Tailwind CSS utility API.
Parallel custom `.css` files (outside of Tailwind's theme configuration) are
FORBIDDEN. Any styling need that appears to require custom CSS MUST first be
resolved via `theme()`, `@layer`, or Tailwind configuration tokens before being
considered an exception — and exceptions require documented justification.

**Rationale**: a single source of truth for styling avoids two competing design
languages (utilities + loose CSS) and keeps bundle size and maintenance
predictable.

### IV. Design Token Discipline (Zero Hardcoding) (NON-NEGOTIABLE)
Raw Tailwind palette classes (`bg-blue-600`, `text-gray-800`, `rounded-xl`, etc.)
are FORBIDDEN in any final component. Every color, border radius, and typographic
scale MUST reference a semantic token defined in the "Design Foundations" section
below (`bg-brand`, `text-neutral-800`, `rounded-lg`). Any raw class usage MUST be
automatically intercepted and converted to the equivalent token before code
approval.

**Rationale**: semantic tokens are what makes the design system swappable
(rebrand, dark mode, white-label) without rewriting components; raw palette usage
scattered through the code silently breaks that guarantee.

### V. Interactive State Completeness (NON-NEGOTIABLE)
Every interactive `<button>` or `<a>` MUST explicitly declare the following
variants: `hover:`, `active:`, `focus-visible:outline focus-visible:outline-2
focus-visible:outline-offset-2 focus-visible:outline-brand`, and
`disabled:opacity-50 disabled:cursor-not-allowed`. Any interactive element that
does not declare this full set of states MUST be rejected before being merged
into the design system.

**Rationale**: incomplete states are the most common cause of interfaces that
"look done" in Figma but fail in real usage (the user cannot tell if a button is
disabled, focusable, or has already been clicked).

### VI. Project Language Policy (NON-NEGOTIABLE)
All project artifacts — source code, comments, variable/class/component names,
technical documentation (specs, plans, tasks, commit messages, PRs, this
constitution) — MUST be written in English. This applies uniformly across the
codebase and every file under `.specify/` and `.claude/skills/`.

All AI agent communication directed at the user (chat responses, summaries,
reports, explanations) MUST be written in Brazilian Portuguese (PT-BR),
regardless of the language of the underlying project artifacts being discussed.

**Rationale**: English-only project artifacts keep the codebase compatible with
tooling, Tailwind UI conventions, upstream libraries, and future international
contributors. PT-BR-only agent communication keeps the working relationship with
the local team clear and frictionless — the two requirements are independent and
both non-negotiable.

### VII. Autonomous Skill Acquisition Protocol (NON-NEGOTIABLE)
Whenever the AI agent faces a task that falls outside its current domain
knowledge — no locally installed skill or available skill in its catalog covers
the subject — the agent MUST behave as the `find-skills` capability: actively
search for external skills/plugins (marketplaces, skill repositories, GitHub)
that are safe, trustworthy, robust, and genuinely relevant to this project's
context (an HTML/CSS + Tailwind CSS design system).

Before adopting or installing any external skill, the agent MUST verify, at
minimum:
- **Source trustworthiness**: known publisher/maintainer, active maintenance,
  no signs of abandonment or malicious intent.
- **Safety**: no destructive, obfuscated, or unreviewable behavior; the skill's
  instructions and any scripts it runs MUST be readable and inspected before use.
- **Relevance**: the skill MUST directly serve this project's design system,
  accessibility, or Tailwind/HTML tooling needs — not be adopted speculatively.
- **License compatibility**: the skill's license MUST NOT impose obligations
  incompatible with this project.

Installing a new skill is a persistent change to the project's environment and
MUST be treated with the same care as adding a dependency: the agent MUST inform
the user which skill it intends to install and why, per Principle VI in PT-BR,
before or immediately after installation — silent, unannounced skill
installation is FORBIDDEN.

**Rationale**: a design system project accumulates edge-case needs (new a11y
audit tools, icon libraries, animation patterns) faster than any fixed skill set
can anticipate. Without this protocol the agent either stalls on unfamiliar
tasks or improvises unsafely; with it, the agent has a bounded, auditable way to
extend its own capability without compromising trust or project hygiene.

## Design Foundations: Tokens, Typography & Grid

### Base Semantic Palette
```json
{
  "brand": { "light": "#E6F0FF", "DEFAULT": "#0066FF", "dark": "#004BB3" },
  "neutral": {
    "50": "#F9FAFB", "100": "#F3F4F6", "200": "#E5E7EB", "300": "#D1D5DB",
    "400": "#9CA3AF", "500": "#6B7280", "600": "#4B5563", "700": "#374151",
    "800": "#1F2937", "900": "#111827"
  },
  "status": {
    "success": "#10B981", "warning": "#F59E0B", "error": "#EF4444", "info": "#3B82F6",
    "success-strong": "#065F46", "warning-strong": "#78350F", "error-strong": "#991B1B",
    "info-strong": "#1E40AF"
  }
}
```
This table is the single source of truth for color. Any new color token MUST be
added here before being used in components.

The `-strong` status variants exist specifically for text rendered directly on
a light tint background (e.g. Badge labels, inline error messages) — the base
success/warning/error values are calibrated for non-text uses (icons, dots,
rings) and do not pass WCAG 2.2 AAA contrast as text in that context. Any
component rendering status-colored text over a light background MUST use the
`-strong` variant; the base variant remains correct for rings, icon fills, and
other non-text decoration. `info-strong` (#1E40AF, 8.72:1 against white,
computed via the WCAG relative-luminance formula — the same method used for
every other `-strong` token) was added in feature 006 (Alert/Banner's `info`
severity) — `status.info` itself had existed since v1.0.0 but had no
text-safe `-strong` companion, unlike success/warning/error.

### Typography & Text Scale
- Family: `font-sans` (Inter, system-ui, sans-serif), with `antialiased` always
  active.
- `font-mono` (ui-monospace, SFMono-Regular, Menlo, monospace) — added in
  feature 014 for Kbd, this catalog's first ratified monospace stack. A
  standard, dependency-free system stack (no new font file/CDN link, unlike
  Inter's own pre-existing font-delivery gap tracked separately). Reserved
  for keyboard-shortcut display; not a general body-copy alternative.
- `text-xs` (12px, `font-normal`/`font-medium`) — captions, metadata, micro-text.
- `text-sm` (14px, `font-normal`/`font-semibold`) — default body copy, input
  labels, table items.
- `text-base` (16px, `font-normal`/`font-medium`) — long-form reading, articles,
  paragraphs.
- `text-lg` / `text-xl` (18px/20px, `font-semibold`) — subtitles, card headers.
- `text-2xl` to `text-4xl` (24px–36px, `font-bold`) — page titles, dashboards,
  highlighted statistics.

### Alignment Grid & Spacing
- Vertical/horizontal spacing follows Tailwind's 8px scale (`space-y-2` = 8px,
  `space-y-4` = 16px, `space-y-8` = 32px).
- Table and complex grid gaps use `gap-4` (16px) or `gap-6` (24px).
- A 4px exception is allowed ONLY for micro-adjustments (icon+text spacing,
  internal padding of small badges).
- Border radius: `rounded-sm` (4px, inputs/checkboxes/small tags), `rounded-md`
  (8px, buttons/dropdowns/secondary navigation), `rounded-lg` (12px, cards/
  modals/panels/primary containers), `rounded-full` (9999px, pills/circles —
  toggle tracks and dots, avatars; any fully-rounded element, not a step on
  the 4/8/12px scale above).

## Theming & Multi-Palette Architecture

Shipped in feature 017 (Curated Theme Presets). This is a NEW top-level
architectural layer, not a Component Catalog entry — it changes how every
existing and future component receives its color values, not any single
component's markup.

**Mechanism**: every color in the Base Semantic Palette above is delivered
as a CSS custom property on `:root`/`[data-theme="..."]`
(`src/styles/themes.css`), expressed as a space-separated RGB triplet and
consumed via Tailwind's opacity-modifier-compatible pattern
(`rgb(var(--color-brand) / <alpha-value>)`), so utilities like `bg-success/5`
continue to work identically across every theme. Runtime switching is a
single `data-theme` attribute on `<html>` (never a class, never a
per-section attribute) — `src/scripts/theme-switcher.js` resolves the
active theme (`localStorage` key `pds-theme`, namespaced since this is the
first feature in this catalog to use `localStorage` at all) and applies it
as early as possible via a bare `<script type="module">` with zero inline
logic, this catalog's established convention. `localStorage` access MUST be
wrapped in `try/catch` in both read and write directions (a real,
non-exotic environment — blocked storage, sandboxed third-party iframe
embedding, some private-browsing configurations — throws rather than
failing silently); a persistence failure MUST degrade to in-memory-only
theme application for that session, never block `applyTheme()` from
running at all. An unrecognized/corrupted stored value MUST fall back to
the `"light"` default theme, never apply an unknown `data-theme` value that
resolves to nothing (FR-006).

**Zero-markup-change guarantee**: because every previously-shipped
component already referenced semantic token names (Principle IV) rather
than raw palette classes, re-theming requires editing ONLY
`src/styles/themes.css` (adding a `[data-theme="..."]` block) and
`shared/design-tokens.ts` (adding a `THEMES` array entry) — zero changes to
any component's `.html`/`.tsx` file. This was verified empirically via a
real 2-theme proof-of-concept including opacity-modifier utilities
(`bg-success/5`) before scaling to the full collection (research.md R1),
not assumed from the token architecture alone.

**Curated theme collection**: 43 named themes across 7 mood families
(`MOOD_FAMILIES` in `shared/design-tokens.ts`) — Light Professional (9),
Warm/Organic Light (6), Nature/Earth (5), Cool/Tech Minimal (6), Dark
Moody/Professional (7), Dark Vibrant/Expressive (6), Distinctive/
Characterful (4). Every theme's palette is sourced from a real, named,
externally-verifiable reference — DaisyUI v5's built-in theme set,
Bootswatch's Bootstrap theme set, and standalone community projects (Nord,
Dracula, Gruvbox, Everforest, Tokyo Night, Rose Pine, Catppuccin) — never
algorithmically generated (e.g. hue-rotated) or invented, per the original
request's explicit "not AI-generated-looking" bar. Each theme's
`sourceReference` field in `shared/design-tokens.ts` documents its exact
provenance and any derivation notes. OKLCH-space source values were
converted to sRGB via a real browser engine (Chromium canvas 2D context
pixel readback), not hand-rolled color-space math, to guarantee
spec-correct conversion. `"light"` is the sole default theme (FR-006) —
the pre-existing v1.0.0–v1.13.0 palette re-expressed as a theme entry
verbatim, a pure architectural refactor with zero visual change.

**Accessibility verification at scale**: `scripts/check-contrast.mjs`'s
existing `PAIRINGS`/`RING_PAIRINGS` structure (theme-independent, by token
name) runs once per theme rather than being hand-verified per theme. The
`KNOWN_THEME_CONTRAST_GAPS` allowlist (see Principle II's "Curated-theme
exception precedent" above) is the permanent, load-bearing mechanism for
any future theme addition whose derived colors cannot clear the AAA/WCAG
1.4.11 bar under the fixed 21-token schema's dual-role constraint — every
entry MUST be individually named (`"themeId:pairingName"`) and reasoned,
never a blanket per-theme or per-pairing suppression. A code-review pass
(feature 017 Phase 8, T074) found and corrected one categorization
inaccuracy in this allowlist's own explanatory comments (Bootswatch
Quartz's 21 entries were mis-attributed to an ordinary neutral-ramp
"tuning" close-miss category when most measure far below that band; the
real cause is Quartz's own mid-luminance purple page background forcing
its derived `neutral-900` to resolve to white instead of dark ink — the
same "components assume `neutral-900` is always dark" structural conflict
as dark themes, just triggered by an atypically-toned light theme) — a
precedent that this allowlist's categorization comments MUST describe the
actual measured root cause, not be assumed to fit the nearest existing
bucket.

**Known gap — `packages/react`'s published styles never defined default
token values — RESOLVED** (found during feature 020, fixed during the
Claude Design sync following feature 023): `packages/react/
src/styles.css`'s compiled output only ever *consumed* the `--color-*`
custom properties (`rgb(var(--color-x) / <alpha-value>)`) — only
`src/styles/themes.css` (the static gallery) actually *defined* their
`:root`/`[data-theme]` values. Any real consumer of
`@professional-design-system/react` who didn't separately author an
equivalent `:root` block got every component (most visibly, every Chart
type — solid black series) rendered with unset/invalid theme colors.
This had silently affected every React-harness demo page since feature
017 Phase 1, undetected because the pre-existing visual baselines
predate that refactor and CI has been down since 2026-07-12. Found for
real (not merely suspected) when a Claude Design sync's PieChart preview
capture rendered every slice black. Fixed by adding the default/light
theme's full `:root` token block (verbatim from `src/styles/
themes.css`) directly into `packages/react/src/styles.css` — the
package still ships no theme-switching mechanism of its own, this is
strictly the baseline so any component reading these tokens at runtime
(currently only Chart) renders correctly out of the box. See
`.design-sync/NOTES.md`'s 2026-07-13 entry for the full account.

**Gallery-wide theme preview** (feature 021): the main component gallery
(`index.html`) carries its own theme-selection `<select>` (grouped by
`MOOD_FAMILIES` via `<optgroup>`, `src/scripts/gallery-theme-selector.js`)
so every shipped component card can be previewed under any curated theme
from that one page, without navigating to the dedicated Theme Gallery
page (`theme-gallery.html`, feature 017's own richer per-theme
card/swatch browsing experience, which this complements rather than
replaces). Introduces no new persistence mechanism or theme data — it
reads `THEMES`/`MOOD_FAMILIES` and calls `selectTheme()`/`KNOWN_THEME_IDS`
verbatim from the existing feature 017 modules, so a selection made here
and a selection made on the dedicated Theme Gallery page always agree on
next view (same `pds-theme` `localStorage` key).

**Sitewide rollout** (feature 025): verified directly (not assumed)
that only `index.html` and `theme-gallery.html` of this catalog's 78
static gallery pages actually loaded `theme-switcher.js` — every other
individual component demo page silently ignored the persisted theme
entirely (always rendered the default, un-themed look) and had no
selector control at all. Rolled the identical 3-snippet pattern (the
`<head>`-level `theme-switcher.js` activation script, the
`#gallery-theme-select` markup block, and the `gallery-theme-selector.js`
wiring script — all copied verbatim from `index.html`, zero new
scripts/markup/logic) out to all 77 remaining pages via a small,
idempotent script (`scripts/apply-theme-rollout.mjs`), gated by a
completeness check (`scripts/check-theme-rollout.mjs`) confirming all
77/77 pass. **This is now a required convention for every new static
gallery page**, alongside the CSP meta tag, `page-shell` body class,
and back-link every page already carries — a future feature adding a
new component demo page MUST include all 3 snippets from the start,
not retrofit them later. `theme-gallery.html` is deliberately exempt —
it already has its own, richer, feature-017-native theme-picker UI
(`theme-gallery.js`), not the generic dropdown, which fully satisfies
the same underlying capability.

**Curated theme batch 2** (feature 027): 5 new themes — `aurora`,
`obsidian`, `linen`, `graphite`, `nebula` — added to the existing
43-theme `THEMES` collection (feature 017's architecture, zero new
mechanism), bringing the total to 48. Each theme's aesthetic direction
was independently derived from a real, browser-rendered design-
language analysis (`getdesign.md/<slug>/design-md` pages from the
`VoltAgent/awesome-claude-design` index — plain `fetch()` only returns
an unhydrated SPA shell, verified; the page's own "DESIGN.md" preview
toggle must be clicked in a real browser to extract the actual
frontmatter) — real hex values and real component-token structure,
never invented, matching feature 017's own "real published values,
never approximated" bar. The inspiring company for each theme is
recorded only in `specs/027-claude-design-inspired-themes/research.md`
as an internal research artifact — never in shipped code, comments,
or theme names/descriptions, which use generic mood-based naming
(`sourceReference` describes derivation methodology, not company
identity) per this feature's own resolved naming decision. All 5
themes fit an existing `MOOD_FAMILIES` category (`aurora` → Distinctive/
Characterful, `obsidian` → Dark Moody/Professional, `linen` → Warm/
Organic Light, `graphite` → Cool/Tech Minimal, `nebula` → Dark Vibrant/
Expressive) — no 8th category was needed.

Two real corrections found during implementation (not assumed away):
(1) `nebula`'s `brand` token does NOT use its source's literal near-
black primary color, which sat almost exactly as dark as this theme's
own `neutral-50` and would have rendered brand text/borders/fills
nearly invisible against the page — the same "dark theme needs its own
visible brand register" issue this catalog's `forest`/`dracula` themes
already document; a real, visibly-distinct accent tier from the same
source was used instead. (2) `obsidian`/`nebula`'s semantic `*-strong`
tokens do NOT reuse the light-default theme's values verbatim (which
fail contrast against a dark canvas) — they follow `forest`'s own
proven inverted-lightness convention for dark themes (`*-strong`
lighter than `*`, suited to the ink-on-page text role, accepting that
Indicator's white-on-`*-strong` solid-fill role then fails — the same
documented, deliberate trade-off `forest`/`dracula`/`business` already
make). The remaining contrast gaps this batch's 2 dark themes and 3
light themes surfaced (`KNOWN_THEME_CONTRAST_GAPS`) are the same
recurring pairing categories already accepted throughout this file for
`forest`/`dracula`/`business`/`rosepine`/`catppuccin`/`quartz`/`aqua`/
`nord` — an inherent limitation of the fixed 21-token schema for
sufficiently dark or high-chroma themes, not unique to this batch.

This feature's confirmatory research (checking whether the same source
collection surfaces any component-catalog gap feature 018 missed)
concluded no genuine new component-type gap — every component role the
5 fetched sources document (buttons, text inputs, feature/pricing
cards, nav bars, footers, badges/pills, code blocks) already has a
shipped equivalent; the only non-1:1 items (illustrated sticker
mascots, hero mesh gradients) are visual treatments of existing
surfaces, not distinct component types, and are out of scope for a
theme-tokens feature.

**Prism — a synthesized theme, not a source-mapped one** (feature
036): 1 new theme, `prism`, added to the existing 48-theme `THEMES`
collection, bringing the total to 49. Unlike every prior curated batch
(feature 017's DaisyUI/Bootswatch mapping, feature 027's per-company
mapping), Prism introduces a new derivation *category* this section
now documents: synthesizing ONE new palette across a representative,
cross-category sample of real sources, rather than mapping one theme
per source. 7 real sites from the `VoltAgent/awesome-design-md`
GitHub collection (Claude, Supabase, Vercel, Stripe, Airbnb, Linear,
Spotify — 7 of that collection's 10 categories) were sampled directly
(each site's own `design-md/<slug>/DESIGN.md` file, real hex values,
not the collection's prose-only README). `brand` was derived via
circular-mean hue averaging (linear RGB averaging across hues this far
apart on the wheel produces visual mud — a real, documented reason to
use the circular method instead, not an arbitrary choice), converging
on ~190° (cyan-teal); `success`/`warning`/`error`/`info` via linear-RGB
averaging of the hue-coherent semantic clusters within the same
sample. The initial `HSL(190°,70%,50%)` `brand` value failed this
catalog's own live contrast checks (2.28:1 against a 3:1/4.5:1 bar);
two rounds of L-only adjustment (50%→40%→34%, same hue/saturation)
cleared every non-text check. Result: exactly ONE documented gap
(`KNOWN_THEME_CONTRAST_GAPS`) — Sidebar's fixed dark-item-on-
`neutral-900` pairing (5.78:1, need 7:1), a structural conflict this
fixed 21-token schema already imposes on roughly 20 of the other 48
themes (light and dark alike), not specific to Prism's derivation.
Fits the existing "Light Professional" `MOOD_FAMILIES` category as its
10th member — no 8th category was needed. Full derivation, per-site
citations, and math: `specs/036-prism-color-scheme/research.md`.

**Per-Source Theme Batch — 70 real-company-derived themes** (feature
038): 70 new themes added to the existing 49-theme `THEMES` collection,
bringing the total to 119. Unlike Prism's (feature 036) synthesis-
from-scratch approach, this batch generalizes feature 017/027's per-
source-mapped method to 70 further real sites from the `VoltAgent/
awesome-design-md` collection: each theme's `brand` anchor is that
site's own real, documented `primary` color — except 14 sites (e.g.
Figma, Spacex, Uber) whose `primary` is a real, common pattern for
minimalist tech brands: functionally monochrome (literal black or
white). For these, the pipeline used that same site's own OTHER
documented chromatic color instead (e.g. Figma's `accent-magenta`
`#FF3D8B`, Spacex's own `link-blue-fallback` `#0000EE`) rather than
inventing a hue from unstable near-zero-chroma math. Only 5 sites
(Ollama, Raycast, Resend, Runwayml, Warp) document zero chromatic
color anywhere in their entire palette; these fall back to this
catalog's own base `"light"` brand value (`#0066FF`), honestly
recorded per-theme in `sourceReference` rather than the boilerplate
used for the other 65 real-value-sourced themes. `neutral-50`/
`neutral-900` derive from each site's own real canvas/ink anchors; the
`neutral-100`–`800` ramp is OKLCH-interpolated per feature 017's
established method; semantic roles use each site's own documented
colors where present, else this catalog's existing defaults.

**Amended per-source derivation rule — collision-breaking hue
rotation** (v1.35.0, pre-authorized ahead of this feature's
implementation so the rule change wasn't retroactive): processing all
70 themes in a fixed order against every already-placed theme (same
canvas polarity) found 37 real near-duplicate collisions — common
tech/fintech blue and automotive/luxury dark-with-accent patterns
recurring naturally across 70 real companies, not a derivation flaw.
Each collision is resolved with a deterministic +27° OKLCH hue
rotation (repeated until clear), re-deriving only the brand-dependent
tokens (`brand`/`brand-dark`/`brand-light`); the independently-sourced
neutral ramp and semantic tokens are never touched by this step. This
is distinct from — and narrower than — Prism's synthesis-from-scratch
exception: every feature 038 theme still starts from one real, cited,
per-site anchor; hue-rotation only nudges that real anchor's hue to
break a collision against an already-placed theme, never substitutes
for sourcing a real value in the first place, and is never applied to
a theme that doesn't already have one.

Mood family distribution across the full 119-theme collection: Light
Professional (49), Warm/Organic Light (16), Nature/Earth (13), Cool/
Tech Minimal (8), Dark Moody/Professional (9), Dark Vibrant/Expressive
(19), Distinctive/Characterful (5) — no 8th category was needed
(confirms feature 027's prior finding). All 119 ids verified
programmatically unique. Accessibility: `scripts/check-contrast.mjs`'s
existing pairing structure surfaced 355 new contrast gaps across this
batch, every one individually documented in
`KNOWN_THEME_CONTRAST_GAPS` (`"themeId:pairingName"`, real measured
ratio noted inline) — the same recurring structural categories
(dual-role Indicator/Tooltip/Progress white-on-brand pairings,
close-miss neutral-ramp tuning on Badge/Alert soft backgrounds,
Sidebar dark-item-on-`neutral-900`) already accepted throughout this
file for the pre-existing 49 themes, not unique to this batch's
derivation. Full per-theme derivation table with real per-site
citations: `specs/038-per-source-theme-batch/research.md` R6.

## Component Catalog & Tailwind UI Patterns

Any component copied from Tailwind UI MUST undergo immediate refactoring for zero
class waste and full compliance with the tokens above before entering the
catalog.

### Layout & Structure Primitives (feature 028)

Closes feature 018's own component-gap inventory's "Layout &
Structure" category from 0/9 to 9/9 — the only category in that
105-candidate inventory with zero shipped candidates before this
feature — bringing the catalog to 87 total components. Ships Stack,
Group, Center (spacing/alignment, US1), Container, Paper (width/
surface, US2), Grid, SimpleGrid, Flex (responsive arrangement, US3),
and AppShell (page-shell composition, US4). Every primitive reuses an
already-ratified token (space-y-*/gap-* scale, the existing max-width/
padding convention, Card's surface/shadow tokens, this catalog's
4-breakpoint responsive rule) — zero new design tokens introduced.

Two Tailwind built-in class-name collisions avoided before shipping
(verified directly against Tailwind's own generated utilities, not
assumed): `Group` renders `.group-row`, not `.group` (Tailwind's own
`group-hover:`/`group-focus:` state-scoping utility already claims
that name); `Container` renders `.container-page`, not `.container`
(Tailwind's own breakpoint-keyed max-width utility). Same class of
bug as `.collapse` → `.collapse-item` (feature 023).

**AppShell composition correction, found during planning, not
assumed**: reading `src/components/sidebar/sidebar.html` and its
`.sidebar` class directly revealed Sidebar has no mobile-collapse
mechanism of its own — a fixed-width flex column with zero responsive
classes and zero toggle script (only Navbar has real responsive
behavior, a native `<details>/<summary>` menu). AppShell's own
mobile behavior is therefore a pure CSS reflow (`.app-shell-body`'s
`flex-col lg:flex-row` — sidebar stacks above main content below
1024px), not a reuse of a collapse behavior that doesn't exist. A
genuine collapsible sidebar drawer remains a future enhancement to
Sidebar itself, out of this feature's scope.

**Recurring bug class found again during this feature's own T017-
style full-catalog regression gate**: `tests/e2e/gallery-showcase.
spec.ts` (feature 026) hardcoded "78 components" and a fixed
`CATEGORIES` list — both broken by this feature's 9 additions and new
category. Fixed (count → 87, `["layout", "Layout & Structure"]`
added). This is the same recurring "catalog-wide count assertion
needs updating on growth" bug already found once for feature 027's
`gallery-theme-selector.spec.ts` (43 → 48) — a pattern worth watching
for any future feature that adds components or categories to the
root gallery.

### Feedback Primitives (feature 029)

Closes feature 018's component-gap inventory's "Feedback" category
from 0% to 4/5 shipped, bringing the catalog to 91 total components:
RingProgress, SemiCircleProgress (US1, circular/semi-circular SVG
progress with a shared stroke-dashoffset mechanism), Notification
Center (US2, a bell trigger with an unread-count badge opening a
panel of past notifications via the native Popover API), and Password
Strength Meter (US3, live strength feedback reusing Progress's
existing fill mechanism). Each reuses an already-ratified primitive
rather than inventing a parallel one: Indicator's badge classes and
Dropdown Menu's native Popover API wiring for Notification Center;
Progress's `.progress-track`/`.progress-fill` verbatim for Password
Strength Meter.

**De-duplication finding, not silently dropped**: the inventory's 5th
Feedback candidate, "Notification" (item 47), is explicitly excluded
— verified directly against `src/styles/tailwind.css`'s real `.toast`/
`.toast-stack` classes and `src/scripts/toast.js`, which already cover
transient notification messages. Shipping a second, redundant
notification primitive under a different name would fragment the
catalog rather than extend it.

**New naming-collision variant found and fixed, not just a Tailwind
CSS collision this time**: an initial `.ring-progress`/
`.ring-progress-track`/`.ring-progress-fill*` naming choice failed
`npm run audit:tokens` with 15 violations, but the collision wasn't
with Tailwind's *generated CSS* (the usual failure mode behind
`.group` → `.group-row`, `.container` → `.container-page`, `.collapse`
→ `.collapse-item`) — it was with the **audit script's own
Tailwind-utility-prefix detection heuristic**, which treats any class
starting with `ring-` as an application of Tailwind's real
`ring-{color}` utility and flags the remainder as an unratified color
token (`progress`, `progress-track`, etc.). Same root cause (reusing a
live Tailwind utility prefix in a custom class name), different
detection surface. Fixed by renaming to `.circular-progress`/
`.circular-progress-track`/`.circular-progress-fill*` throughout
`tailwind.css`, both HTML components, `src/scripts/circular-progress.js`
(renamed from `ring-progress.js`, exporting `initCircularProgress`),
and the contract doc — `npm run audit:tokens` then passed clean.

**Real accessibility bug found by axe, not assumed away**: Password
Strength Meter's progress track originally used
`aria-labelledby="password-strength-label"` pointing at a `<span>`
that is empty until the user types — axe's `aria-progressbar-name`
rule correctly flags a labelledby reference to an empty node as no
accessible name at all. Fixed by giving the progressbar a static
`aria-label="Password strength"` (always non-empty) and keeping the
dynamic level text as a separate `aria-live="polite"` span, announced
on change rather than serving as the name itself. Applied to both the
static HTML and the React wrapper.

**Test-timing lesson, consistent with `progress.spec.ts`'s own
established pattern**: `.progress-fill` and `.circular-progress-fill`
both carry a 300ms CSS transition. Asserting against
`getComputedStyle()`/`boundingBox()` immediately after a script/React
re-render reads a value mid-transition and is flaky. `tests/e2e/
feedback-primitives.spec.ts` instead reads the raw CSSOM-assigned
value directly (`el.style.strokeDashoffset` / `el.style.width`),
matching how `progress.spec.ts` already reads `el.style.width` rather
than a computed or measured value.

**Recurring stale-count bug caught again by this feature's own T022
full-catalog regression gate**: `gallery-showcase.spec.ts`'s SC-002
test still hardcoded "87 components" (feature 028's number) — no
category label needed adding this time, since all 4 new primitives
joined the existing "Overlays, Modals & Feedback" section rather than
opening a new one. Fixed (87 → 91). Third occurrence of this exact
bug class (after features 027 and 028) — any future feature that adds
components to the root gallery should expect to make this same fix.

### Consent & System Messaging Primitives (feature 030)

Closes feature 018's component-gap inventory's "Consent & System
Messaging" category from 0% to 5/5 — the second category (after
Layout & Structure, feature 028) to reach 100%, bringing the catalog
to 96 total components: Session Timeout Modal (US1, an idle-timeout
warning composing Modal's exact `<dialog>` mechanism with this
catalog's first `setInterval`-driven countdown), Offline Banner, 2FA
Reminder Banner, Maintenance/Announcement Bar (US2, all three content/
layout variants of Alert), and Dark Mode Toggle (US3, a Toggle wrapper
bound to the `light`/`dim` theme pair). Zero new design tokens or
themes — every primitive reuses an already-shipped mechanism (Modal,
Alert, Toggle, `theme-switcher.js`).

**Scope decision, documented not assumed**: Dark Mode Toggle's dark
counterpart is `dim`, not a literal `"dark"` theme — verified directly
against `shared/design-tokens.ts`'s `THEMES` array, which has no theme
named `"dark"` (the catalog's theming system is a 48-entry curated
palette selector, feature 017, not a light/dark binary). `dim` was
chosen as DaisyUI's own general-purpose dark theme, the most
defensible non-arbitrary pick among the 8 themes sharing the "Dark
Moody/Professional" `moodFamily`.

**Real CSS bug found by running against a live browser, not assumed
clean**: the native `hidden` attribute does not reliably hide `.alert`
— its `@apply flex` gives it an author-origin `display: flex`
declaration that the CSS cascade lets win over the browser's UA-origin
`[hidden] { display: none }` default (author styles always outrank UA
styles as a cascade origin, regardless of selector specificity). Every
prior `.alert`/Toast dismissal in this catalog only ever permanently
removes the element (`alert.js`/`toast.js` both call `.remove()`), so
this collision never surfaced before — Offline Banner is the first
component needing to show/hide the SAME element repeatedly based on
live browser state. Fixed via direct CSSOM `style.display` assignment
(the same pattern `progress.js`/`circular-progress.js` already use for
this project's CSP), which — being inline style — outranks any
class-based `display` declaration. Worth watching for in any future
primitive that toggles visibility on an existing `@apply`-styled
element rather than adding or removing it from the DOM.

**React package architecture correction, found by checking precedent
before writing, not assumed**: an early draft of Dark Mode Toggle's
React wrapper imported a nonexistent `selectTheme`/`KNOWN_THEME_IDS`
from a `../lib/theme` module — `packages/react/src` has no port of the
static site's `theme-switcher.js` at all (grepping the whole package
for `localStorage`/`documentElement` found exactly one precedent,
`useChartColors.ts`, which only ever *reads* global theme state via a
`MutationObserver`, never writes `localStorage`). Fixed by having
`DarkModeToggle.tsx` port only the minimal `light`/`dim`/`pds-theme`-
key logic it needs directly, matching `useChartColors`'s read-only
observer pattern for the read side and adding a small, self-contained
write side — no fake cross-file import, no dependency on the static
site's 48-theme `THEMES` array.

**Toggle click-target bug avoided by checking precedent first, not
discovered by test failure**: `Toggle`'s markup wraps a visually-hidden
(`sr-only`) checkbox with an overlapping `.toggle-track` span, which
intercepts pointer events aimed at the input directly — this
catalog's own `toggle.spec.ts` already established the fix (click the
wrapping `<label>`, not the input), which Dark Mode Toggle's markup
and tests follow via a `data-testid` on the label.

### Navigation Micro-Patterns (feature 031)

Closes feature 018's component-gap inventory's "Navigation
micro-patterns" category from 1/6 (Avatar Group, feature 023) to
6/6 — the third category (after Layout & Structure, feature 028, and
Consent & System Messaging, feature 030) to reach 100%, bringing the
catalog to 101 total components: Team/Workspace Switcher, Language
Switcher (US1, both composing Dropdown Menu's exact panel mechanics —
Language Switcher is a pure content variant of the same
`ContextSwitcher` React component, not a second one), Back-to-Top
Button, Scroll Progress Bar (US2, one shared rAF-throttled scroll
listener driving both), and Onboarding Tour/Coachmark (US3, this
catalog's first multi-step sequencing UI, reusing Popover's exact
positioning mechanism per step). Zero new design tokens — every
primitive reuses an already-shipped mechanism (Dropdown Menu, Avatar,
Progress, Popover).

**Scope discipline, repeating an established pattern**: Back-to-Top
ships only the minimal scroll-threshold visibility logic it needs, NOT
a standalone "Affix" primitive — the inventory's own note points at a
different, not-yet-built category item, the identical situation
feature 030 already handled for Session Timeout Modal/Countdown Timer.

**Real gallery-count bug found by this feature's own regression gate,
a new variant of the recurring pattern**: an initial combined "Scroll
Progress Bar & Back-to-Top" gallery card broke the "one card per
inventory item" convention feature 030 established (`SystemBanner`
covers 2 inventory items in one React component, but still ships 2
separate demo pages/cards) — merging both into one card left the
gallery's demo-link count at 100, not the expected 101, caught by
`gallery-showcase.spec.ts`'s own SC-002 count assertion. Fixed by
splitting into 2 cards (both linking to the same combined
`scroll-feedback.html` demo page) — implementation sharing is fine,
but each inventory item still needs its own discoverable gallery
entry.

**Test-fixture height bug found by running against a live browser, not
assumed**: the Scroll Progress Bar/Back-to-Top demo page's initial
content was only ~94px scrollable at 1440×900 — nowhere near
Back-to-Top's 400px show/hide threshold — so `scrollIntoViewIfNeeded()`
(which scrolls only the minimum distance to bring an element into
view) never came close to crossing it, and the progress percentage
never grew meaningfully. Fixed by adding real height (standard-scale
`h-96` spacer elements, not arbitrary-value utilities) to the demo
page and scrolling directly to `document.documentElement.scrollHeight`
in tests instead of relying on `scrollIntoViewIfNeeded()`.

### Overlays (feature 032)

Closes feature 018's component-gap inventory's "Overlays" category
from 0% to 3/6, bringing the catalog to 104 total components: Affix
(US1, general-purpose scroll-threshold pinning infrastructure —
distinct from Back-to-Top's own one-off inline logic, feature 031,
which stays unchanged), LoadingOverlay (US2, a container-scoped
blocking spinner overlay reusing Spinner's exact markup verbatim), and
Bottom Sheet (US3, reusing Slide-over's exact native `<dialog>`
mechanism with bottom-edge instead of right-edge anchoring). The other
3 inventory items are explicitly excluded, not silently dropped:
Drawer (verified identical to the existing Slide-over by reading its
real CSS directly), Dialog Manager (a JS-API layer, not a visual
component), and Popover Combobox variant (confirmed Mantine-internal,
not a standalone pattern this catalog needs). Zero new design tokens.

**Three real CSS bugs found by running against a live browser, not
assumed clean, all in the same general family as feature 030's Offline
Banner finding**:

1. **LoadingOverlay repeated the exact `.alert`-style `hidden`-vs-
   `display:flex` collision** — `.loading-overlay`'s own `@apply flex`
   beat the native `[hidden]` UA default the same way `.alert` did in
   feature 030, despite an early draft of this contract explicitly
   (and wrongly) claiming no collision risk existed. Fixed identically
   — direct CSSOM `style.display` assignment, not the `hidden`
   attribute/IDL property.
2. **Bottom Sheet's `<dialog>` centered itself instead of anchoring to
   the bottom edge** — the native `<dialog>` UA stylesheet's own
   `inset: 0` / `margin: auto` defaults (the same class of default this
   catalog's `.dropdown-menu-panel`/`.popover-panel` already had to
   reset) left `top` at its UA value of `0` alongside this class's own
   `bottom-0`, so with no explicit height the auto margins centered the
   box vertically. Fixed with an explicit `top: auto; margin: 0` reset.
3. **A flex-shrink gotcha in the overflow test fixture**: `.bottom-
   sheet-panel` is `flex flex-col` (identical structure to Slide-over's
   own panel) — flex items shrink to fit their container by default, so
   a fixed-height spacer div used to force overflow in the test page
   was silently squeezed down instead of overflowing and triggering the
   panel's own `overflow-y-auto` scroll. Fixed with `shrink-0` on the
   demo's own content children — a fixture-level fix, not a change to
   the shared `.bottom-sheet-panel` class (which Slide-over also uses
   unmodified, and could in principle hit the identical gotcha with
   sufficiently long real content — noted for any future feature that
   touches Slide-over's own overflow behavior).

### Data Display Composables (feature 033)

Brings feature 018's component-gap inventory's "Data Display" category
from 4/16 (ColorSwatch/Spoiler/Highlight/Code, feature 023) to 8/16,
bringing the catalog to 108 total components: ThemeIcon (US1, an icon
in a colored circle reusing Badge's exact per-color opacity/ring
convention and Avatar's exact size scale), Blockquote (US2, existing
typography tokens only), BackgroundImage (US2, content overlaid on an
image with a legible-contrast scrim reusing the existing Modal/
Slide-over backdrop-darkening convention), and Watermark (US3, a pure
CSS repeating-background technique via a generated SVG data URI, no
new dependency). Zero new design tokens.

**Deliberate partial category closure, not a full 16/16 sweep**: the
category's other 8 items stay explicitly out of this feature's scope
— 5 genuinely-new-pattern candidates (OverflowList, RollingNumber,
PickList/Transfer, Gallery, Compare) deferred to a future feature
rather than combined into one oversized batch (this session's
established 4-5-item sizing precedent), plus TreeTable and QRCode
already deferred per feature 018's own notes (TreeTable cross-
references the deferred interactive Data Table gap; QRCode needs a
new client-side dependency).

**A real CSP gap found by checking existing precedent, not the
generic per-page template**: Watermark's generated SVG rendered as a
`data:` URI, and this catalog's generic per-page CSP template
(`default-src 'self'`, no `img-src`) blocks `data:` sources by
fallback. Grepping the existing catalog found the exact fix already in
use — Avatar/Card/List/Aspect Ratio all ship an `img-src 'self'
data:;` CSP variant for their own `data:`-URI placeholder images;
`background-image.html`/`watermark.html` use that same variant.

**Also corrected before shipping, not assumed**: an early research
draft assumed ThemeIcon's `info`/`brand` color variants would come
from Badge directly — checking Badge's real markup found it ships
only 4 variants (success/error/warning/neutral, no info/brand).
Fixed by sourcing `info`'s values from Alert's own `.alert-info` and
`brand`'s from Button's existing `brand-light`/`brand-dark` pair —
both already-ratified tokens, just not previously surfaced through
Badge specifically.

This feature shipped clean on the first full test pass — the ONLY
batch this session with zero real implementation bugs found during
its own regression gate, consistent with the inventory's own "trivial
CSS composition" buildability signal for every item in it.

### Data Display Patterns (feature 034)

Brings feature 018's component-gap inventory's "Data Display" category
from 8/16 (feature 033) to 13/16 — its practical ceiling without
absorbing TreeTable's Data Table dependency or QRCode's new client-
side dependency — bringing the catalog to 113 total components:
OverflowList (US1, this catalog's first ResizeObserver usage),
RollingNumber (US2, an rAF-driven numeric tween, reusing the
rAF-throttle pattern already established for scroll listeners),
PickList/Transfer (US2, a dual-list composed entirely of List/Checkbox/
ActionIcon reused verbatim), Gallery (US3, reusing Modal's exact
native `<dialog>` mechanism with full-screen geometry), and Compare
(US3, a native `<input type="range">` — Slider's exact existing
component — driving a CSS `clip-path`). Zero new design tokens.

**A genuinely subtle, reproducible bug found only by running against a
live browser, not caught by code review alone**: OverflowList's first
draft re-measured each item's (and the "+N more" chip's) `offsetWidth`
on every `render()` call, including calls made after a PRIOR render
had already hidden some items via `display:none`. A hidden element's
`offsetWidth` is always 0, so any item hidden by an earlier pass would
be measured as "0px wide" on the next pass, trivially "fit," get
un-hidden, and the whole computation would cascade into showing every
item regardless of real width — reproduced concretely (a 356px-wide
row of chips rendering fully "fit" inside a 200px container) and
confirmed to recur on every subsequent resize event too, not just
component initialization. Fixed by measuring each item's natural width
exactly ONCE, before anything is ever hidden, and reusing the cached
value for every future fit calculation — applied identically to both
the static-HTML script and the React port, since the React version had
the same underlying vulnerability (re-reading `el.offsetWidth` from
refs whose `display` had already been toggled by a previous render).

**A real accessibility bug found by the keyboard/focus-return test
failing, not assumed correct**: Gallery's first draft used bare
`<img>` elements as `[data-gallery-thumb]` triggers — an `<img>` has
no native focusability, so neither keyboard activation nor
`wireDialogClose()`'s focus-return-to-trigger worked. Fixed by
wrapping each thumbnail in a real `<button>` (matching every other
overlay trigger in this catalog), on both surfaces — the React
contract's own first draft had a parallel bug (hardcoding the
focus-return ref to always point at the FIRST thumbnail regardless of
which one was actually clicked), also fixed before shipping.

**Also found and fixed**: a literal `style="width: ...px"` attribute in
an early OverflowList demo draft, which is blocked by this project's
CSP the same as any other inline style — replaced with a Tailwind
arbitrary-value utility class (`w-[200px]`), compiled to a real
stylesheet rule at build time, not an inline attribute.

### Configurable Social Login Buttons (feature 035)

A new `SocialLoginGroup` component — outside feature 018's inventory
(verified via a graphify query before drafting the spec: no social-
login/OAuth-button candidate exists in that 105-item catalog), bringing
the catalog to 114 total components. A single, ordered `providers`
array renders 5 brand-governed presets (Google, Apple, Facebook,
Microsoft, GitHub) plus an open custom-entry mechanism for any other
identity provider (demonstrated with Instagram, TikTok, Discord).
Presentation and a selection callback only — no OAuth redirect, token
exchange, or network call of the component's own; the host application
owns the real authentication flow, the same posture every other
component in this catalog takes toward its own domain (Toast never
queues a real notification backend, Password Strength Meter never
calls a real API).

**A real, computed accessibility finding, not assumed**: this
feature's central design decision was resolving a genuine tension
between provider brand mandates and this catalog's non-negotiable
Principle II (WCAG AAA). Computed directly via the WCAG relative-
luminance formula: Facebook's official solid blue-fill button
(`#1877F2` background, white text) measures **4.24:1** — failing AAA's
7:1 gate, and barely failing even AA's 4.5:1. A representative custom
brand color (Instagram's magenta, `#E1306C`) fails AAA against
*either* black or white text (4.34:1 / 4.84:1) — there is no safe text
color for that background at all. Resolution: every preset and every
custom entry defaults to this catalog's existing AAA-verified
`neutral-50`/`neutral-900` surface, confining brand color to the icon
glyph only (never the button's own fill or text) — which also matches
how Google/Microsoft/GitHub's own official button kits recommend
presenting their mark in the first place. Apple and GitHub's own
black/near-black/white brand fills remain safe as an optional
alternate appearance specifically because both extremes clear AAA at
roughly 17-21:1 regardless of what text sits on them.

**A new, deliberately non-theme-reactive token category**: the 5
presets' brand colors (`providerBrand` in `shared/design-tokens.ts`)
are the first tokens in this catalog kept structurally OUTSIDE the
21-token, 42-curated-theme-reactive semantic palette — a provider's
brand mark must render identically regardless of which curated theme
the host app has selected, which is the opposite of what every other
token in this file exists to do. Documented as a named, reasoned
exception in Complexity Tracking (specs/035-social-login-buttons/
plan.md), the same governance shape this constitution already uses for
`KNOWN_THEME_CONTRAST_GAPS` and `ICON_FILL_TEXT_TOKENS`/
`DECORATIVE_ARIA_HIDDEN_TOKENS` — a documented, individually-named
exception in place of a silent gap, applied here to a new constraint
class (external brand-color fixedness) rather than a contrast
shortfall.

**Also found and fixed during implementation, before any of it
shipped**: an early draft of the custom-entry example icons (Instagram/
TikTok/Discord) used a literal inline `style="background-color: ..."`
attribute — blocked by this project's CSP the same as any other inline
style. Fixed by moving the accent color into the `<svg>` itself (a
`fill` presentation attribute on a background `<circle>`, exactly like
the Facebook preset's icon already does), which needs no Tailwind
class or inline style at all. A second, unrelated bug in the same
demo page — a helper caption using `text-neutral-500` (4.83:1,
sub-AAA) instead of this catalog's established `text-neutral-600`
(7.56:1) for body copy — was caught by the dedicated Playwright a11y
test itself failing, not assumed correct, and fixed before the suite
was accepted as green.

**A separate, larger pre-existing gap found while scoping this
feature's foundational work, tracked as its own follow-up rather than
fixed here**: `packages/react/src/styles.css` — which duplicates
`src/styles/tailwind.css`'s `@layer components` block verbatim, since
the two are independently compiled Tailwind builds — had silently
stopped receiving that duplication starting with feature 028's Layout
& Structure primitives and never caught back up through feature 034,
leaving roughly 40 React components shipping with zero compiled CSS in
the published `@professional-design-system/react` package. This
feature's own Phase 2 explicitly re-verified its own duplication step
to avoid repeating that gap, but remediating the historical ~40-
component backlog is out of this feature's scope.

### Gallery Presentation & Discoverability (feature 026)

The root gallery (`index.html`) was originally a flat, uncategorized
grid of identically-styled cards — verified directly (not assumed) to
be a direct, unintentional match for this project's own documented
Anti-Template Policy banned patterns ("default card grids with uniform
spacing and no hierarchy," "safe gray-on-white styling with one
decorative accent color"). Redesigned into: an opening section stating
concrete, verifiable claims (component count, dual-surface guarantee,
WCAG AAA commitment, curated theme count — never marketing copy); a
zero-JavaScript quick-jump `<nav>` (native anchor links) to 8 category
sections, 6 of which are this catalog's own existing Component Catalog
categories below (Application & Navigation, Forms/Validation & Inputs,
Data Display & Listings, Overlays/Modals & Feedback, Navigation &
Disclosure, Advanced Forms & Interaction), plus **Composed Examples**
(the 3 page-level composition demos, never meant to be discovered
alongside atomic components) and **Theming** (the dedicated Theme
Gallery page); and a visually-distinct "flagship" treatment (2-column
card span + a one-line "why this matters" note) for Data Table, Chart,
Command Palette, and the curated theme system — this catalog's four
largest engineering investments, made concrete in the grid itself
rather than only asserted in prose. Zero components were dropped,
duplicated, or had their underlying markup/behavior changed — this is
a presentation-layer reorganization only (all 78 "View full demo →"
links verified to still resolve correctly).

**New every-page convention**: every individual component demo page
now wraps its existing `<h1>`/intro `<p>`/theme-selector block (feature
025) in a `.demo-page-header` bottom-border treatment — applied
uniformly to all 77 pages via a scripted, idempotent rollout
(`scripts/apply-demo-page-polish.mjs`, mirroring feature 025's
`apply-theme-rollout.mjs` pattern exactly), not 77 bespoke redesigns.
This is now a required convention for every future new static gallery
page, alongside the CSP meta tag, `page-shell` body class, back-link,
and feature 025's theme-activation/selector snippets. One real
implementation-time correction: the wrapper was first drafted with a
`bg-neutral-50` tint and a `-mx-6`/`px-6` bleed, but `page-shell`
itself already sets `bg-neutral-50` (the tint would have been
invisible) and uses `p-8`, not `px-6` (the bleed math would have been
wrong) — caught by checking `src/styles/tailwind.css` directly rather
than assuming, and simplified to a border-only treatment needing
neither.

**T017 full-catalog regression gate finding**: the rollout script's
header-anchoring regex assumed every page's `<h1>` precedes its live
component demo — true for 76 of 77 pages, but Navbar's demo must
render first in `<body>` for its `position: sticky` behavior to be
meaningfully demonstrated, so the regex swallowed the live navbar into
the wrapper div and broke its stickiness. Fixed directly in
`src/components/navbar/navbar.html`; confirmed via a programmatic
sweep that no other page shares this demo-before-`<h1>` shape. Any
future scripted, catalog-wide rollout of this kind should check for
this shape explicitly rather than assume it away.

### Homepage Component Showcase (feature 037)

Feature 026's category grid still described every component in prose
only — no card showed what the component actually looked like. This
feature replaced all 114 text-only cards with cards that render a
real, `inert`-wrapped excerpt of that component's own existing static
markup, sized into a content-driven bento grid (large/wide/standard,
based on each component's real rendered footprint, not decoration) and
grouped under the same 10 categories feature 026 already established.
The hero's flat 4-stat strip became a "proof wall" — 5 real, layered,
gently-rotated component fragments staged beside the headline,
proving "everything here is live UI" before any stat is read; the 4
stats moved to a quieter supporting row (and one, corrected: the
theme count had drifted to a stale hardcoded "40+" — this catalog
actually ships 49).

**New `inert`-wrapped-preview pattern**: since a native `<a>` cannot
validly contain interactive descendants, and FR-001 required every
card to embed the component's *real* markup (which for ~30 components
is itself interactive — buttons, inputs, toggles), every preview
excerpt is wrapped in a container carrying the HTML `inert` attribute
— removing it from the tab order and accessibility tree natively,
zero JS, so the outer whole-card `<a>` remains the only focusable
element. Components normally shown via a trigger (Modal, Toast,
Slide-over, Command Palette, Dropdown Menu, Popover, Context Menu,
Menubar, Tooltip, Notification Center, Session Timeout Modal) render
their real markup in a frozen, already-open visual state instead of a
live trigger invocation — this catalog's `KNOWN_THEME_CONTRAST_GAPS`-
style honesty precedent applied to a *behavioral* constraint instead
of a color one: documented and worked around, never silently faked
with a screenshot.

**Two real, pre-existing technical constraints surfaced, not
invented**: Chart ships React-only (no static-HTML rendering path
exists for Recharts at all, already documented on that component's own
demo page) and Data Table's static demo page renders entirely via a
JS call into empty containers (no static markup exists to excerpt for
either). Both cards use a compact, real-token-based static
approximation instead of a live excerpt, each clearly labeled in a
code comment as a documented exception — not a silent gap.

**Real bugs found and fixed during implementation** (via an actual
browser screenshot review, not just the automated suite): (1) literal
`<a>` tags nested inside preview markup (Breadcrumbs'/Pagination's own
real links) caused the browser's HTML tree-construction algorithm to
auto-close the OUTER whole-card `<a>` the instant it hit the first
nested one — silently breaking card structure for every affected card
(the nested content rendered as unstyled siblings outside the card
entirely). `inert` prevents focus/pointer interaction but does
**not** prevent this parse-level auto-closing, since anchor-in-anchor
is a distinct HTML validity rule from generic interactive-content
nesting — fixed by using `<span>` for decorative nested link-styled
text instead of a real `<a>`. (2) A genuine AAA violation (6.86:1,
below 7:1) from placing existing secondary text color
(`text-neutral-600`) against the new hero/preview surface tone
(`bg-neutral-100`, one step darker than this catalog's proven-safe
`bg-neutral-50` canvas) — fixed by darkening to `text-neutral-700`
(9.37:1) for that specific surface. (3) `.card-elevated` was used
standalone in two preview excerpts without its required base `.card`
class, silently omitting its own background — fixed by pairing both
classes, matching every other real usage of that class in this
catalog.

### Advanced Form Inputs Batch (feature 039)

10 components closing feature 018's inventory candidates #10-27
(TagsInput, Autocomplete, Mentions, Cascader, TreeSelect, InputMask,
JsonInput, RangeSlider, FloatLabel, and an interactive mode for the
existing Rating component), bringing the catalog to 123 total
components. Every item reuses an already-shipped mechanism rather
than inventing a new one: `shared/multi-select/index.ts`'s
`filterOptions` for Autocomplete/Mentions' suggestion lists, Combobox's
single-select commit semantics for Autocomplete, TreeView's native
`<details>`/`<summary>` disclosure verbatim for TreeSelect, Dropdown
Menu's panel mechanics for Cascader, and the existing Slider's exact
`.slider` class for RangeSlider's two rows.

**Real finding — Rating never had a React port before this feature**:
the plan assumed an existing `packages/react/src/Rating/Rating.tsx`
to extend; none existed (Rating had been static-HTML-only since
feature 016). `Rating.tsx` is therefore a new file shipping BOTH the
pre-existing read-only/decorative rendering (default, `interactive:
false`, byte-for-byte behavior-equivalent to the static surface) and
the new interactive mode, discovered only once the build actually
tried to import it — not assumed correct from the plan alone.

**Real finding — decorative `aria-hidden` markup cannot become
interactive by adding a click handler**: Rating's existing star row
is `aria-hidden="true"` (decorative reinforcement only, the real value
conveyed via adjacent text). Interactive Rating uses a genuinely
different, separate markup — a native radio group (one real
`<input type="radio">` per star value, the standard accessible
star-rating pattern) — rather than attaching interactivity to
already-hidden markup, which would remain invisible to assistive
technology regardless of what script runs on it.

**Real finding — the classic "two overlapping range inputs" dual-
slider technique fails WCAG 2.5.8**: an initial RangeSlider draft
stacked two full-width native range inputs at an identical absolute
position (the standard technique for dual-thumb sliders, since no
native cross-browser dual-thumb control exists). Automated a11y
scanning (axe-core's target-size/target-offset checks) correctly
flagged a real conflict: both bounding boxes are perfectly identical
regardless of where each thumb visually renders, so the measured gap
between the two targets is 0px — a genuine hit-testing ambiguity, not
a tool false-positive (confirmed by also breaking a real Playwright
pointer interaction against the same clipped-element workaround
attempted first). Resolved by rendering two genuinely separate rows
(never overlapping in the DOM/layout) instead of trying to patch the
overlap with `clip-path` — the simpler fix that avoids the whole
problem class rather than one that manages it.

**Real finding — Tailwind's `:placeholder-shown` support silently
breaks in modern Firefox**: FloatLabel's floated/resting label state
was originally CSS-only, driven by `:focus` and
`:not(:placeholder-shown)`. Tailwind auto-generates an additional
`:-moz-placeholder` fallback selector for any `:placeholder-shown`
usage in this file, hand-written or compiled from a utility class
alike (confirmed directly in the compiled CSS output, not assumed).
`:-moz-placeholder` no longer exists in current Firefox, and an
unrecognized pseudo-class inside `:not()` makes Firefox treat the
whole `:not(...)` as unconditionally true — floating every label
regardless of actual fill state, caught only by a real cross-browser
Playwright run (chromium/webkit passed, firefox failed identically
whether the selector was Tailwind-generated or hand-written). Fixed by
toggling a plain `data-filled` attribute from the field's real
`.value` (a small, justified script on the static surface; a direct
prop-derived attribute on the React surface) instead of relying on
`:placeholder-shown` at all — focus state remains CSS-only, since
`:focus` itself was never affected.

**Real finding — a follow-up Principle V compliance pass (requested
explicitly, after the feature's own suite was already green) caught 2
real gaps this feature's own test suite did not**: `.cascader-trigger`
and `.tree-select-trigger` are real `<button>` elements but had only
inherited `.form-input`'s text-field-style `focus:ring-2`, missing
`hover:`, `active:`, and `disabled:opacity-50 disabled:cursor-not-
allowed` entirely, and `.tags-input-tag-remove` was missing `active:`.
Neither gap fails any automated check this catalog runs today
(Playwright's a11y scan checks ARIA/contrast, not Principle V's
specific state-declaration completeness) — both were caught only by
re-reading the compiled CSS directly against the Principle's literal
text. Fixed to the same `hover:/active:/focus-visible:/disabled:`
set every other button in this catalog declares.
- **Sidebar**: `bg-neutral-900`/`text-neutral-300` (dark — corrected from the
  originally speculative `text-neutral-400`; this pattern had never actually
  been implemented until feature 007, whose real axe-core/WCAG-formula
  measurement found 6.99:1, failing AAA by a hair, `text-neutral-300` clears
  it at 12.04:1) or `bg-white text-neutral-700` with `border-r
  border-neutral-200` (light). Active: `bg-brand-dark text-white` (also
  corrected — the originally speculative `bg-brand text-white` measured
  4.83:1, the same AAA gap Button primary already avoids; `bg-brand-dark`
  clears it at 7.90:1), `aria-current="page"`. Hover: `bg-neutral-100`/
  `bg-neutral-800` with `transition-colors duration-150`, `active:bg-
  neutral-200`/`active:bg-neutral-700` (press state, Principle V).
- **Navbar/Header**: `sticky top-0 z-40`, `backdrop-blur-md bg-white/80` with
  a `supports-[backdrop-filter]` fallback to an opaque background where the
  filter isn't supported, `border-b border-neutral-200`. Hamburger button
  restricted to `lg:hidden` with an expanded touch target; the mobile menu
  itself is a native `<details>`/`<summary>` element (zero JavaScript,
  reusing Accordion's disclosure mechanism — no light-dismiss/floating-
  positioning need exists for a menu that pushes content down, unlike
  Dropdown Menu's Popover-API requirement).
- **Pagination**: zero JavaScript. Current page `bg-brand-dark text-white`
  + `aria-current="page"` (the Sidebar active-item pairing, reused
  verbatim). Previous/Next are native `<button disabled>` at their
  respective boundaries (genuinely disabled, not just styled) and real
  `<a href>` elements when enabled — an enabled control MUST be a real,
  navigable anchor, never a `<button>` with no `href`/handler standing in
  for one (a dead button masquerading as enabled was a real code-review
  finding, corrected before ratification). Page links `text-neutral-600`,
  `hover:bg-neutral-100`, `active:bg-neutral-100`. Ellipsis `text-
  neutral-600 aria-hidden="true"` (not `-500` — `aria-hidden` exempts
  content from assistive technology, not from sighted low-vision users who
  still read the glyph visually, so the AAA floor still applies).
- **Stepper/Steps**: shipped in feature 015
  (`.stepper`/`.stepper-step`/`.stepper-step-completed`/
  `.stepper-step-current`/`.stepper-step-upcoming`/`.stepper-circle`,
  `src/components/stepper/stepper.html`) as **presentational-only in this
  feature** — no click-to-navigate interactivity beyond what a natural
  link/button per step would already provide (a documented, deliberate
  scope decision, not an oversight). Reuses Pagination's exact
  `bg-brand-dark text-white` current/completed-item pairing verbatim
  (7.90:1, re-verified rather than assumed identical just because both
  are "the current one in a sequence"). The connector line between
  circles is `background-color` on a `::after` pseudo-element
  (`bg-neutral-200` upcoming / `bg-brand-dark` completed) — purely
  decorative, matching this catalog's already-accepted
  low-contrast-decorative-border exception (Card/Divider/List's
  `border-neutral-200`), not a new WCAG 1.4.11 gap. `aria-current="step"`
  on the current step only (not `"page"` — a step is not a page).
- **Breadcrumbs**: `text-sm text-neutral-600` (corrected from the originally
  speculative `text-neutral-500` — feature 005 was the first to actually
  implement and test this pattern, and a real axe-core AAA scan measured
  4.83:1 against the required 7:1; `text-neutral-600` clears it at 7.56:1),
  `active:text-neutral-700`, dividers `text-neutral-300` or a minimum
  `h-5 w-5` Chevron icon. Current item: `text-neutral-900 font-medium` +
  `aria-current="page"` (rendered as non-interactive `<span>`, never a
  "disabled" `<a>` — Tailwind's `disabled:` variant cannot target an anchor
  element regardless of utility applied, a technical constraint rather
  than a state this component is exempt from providing).

### Flagship App Showcase (feature 042)

A new, standalone `showcase/` npm workspace — NOT part of
`tests/react-harness/` (that directory's own header comment states
"dev-only harness, never published"; a real, published, marketing-facing
page sharing that build would blur two concerns with very different
change-risk profiles). Composes 21 real, already-shipped components
(Sidebar, Navbar, Avatar, AvatarGroup, Breadcrumbs, Tabs, CommandPalette,
DropdownMenu, ActionIcon, Button, Card, Badge, RollingNumber, DataTable,
Pagination, LineChart, Toast, NotificationCenter, Modal, DarkModeToggle,
ContextSwitcher) into one realistic SaaS dashboard screen, deployed under
`/showcase/` via `deploy-pages.yml`'s existing `rewrite-base-path.mjs`
mechanism. Fictional-but-plausible sample data only (`showcase/src/data/
sample-data.ts`) — never implies a real backend or real user data.

Four real defects found and fixed during implementation, not merely
assumed:

1. **Modal/Slide-over dark-theme text contrast (WCAG violation)**:
   `.modal-panel`/`.slide-over-panel` set `bg-neutral-50` but never an
   explicit `text-neutral-900` — relying on CSS inheritance from the
   page's own themed ancestor. A native `<dialog>` shown via
   `showModal()` receives the UA stylesheet's own default `color`
   (`CanvasText`, ~black) on the `<dialog>` element itself, which wins
   over the real ancestor's color despite `.modal-panel` remaining a
   normal DOM descendant — undetected until this feature nested a Modal
   inside a dark theme for the first time. Consumer content that
   doesn't set its own explicit text color (e.g. a plain `<dl>/<dd>`)
   silently rendered black-on-dark-navy. Fixed by adding explicit
   `text-neutral-900` to both classes (both `src/styles/tailwind.css`
   and `packages/react/src/styles.css`, which duplicate these classes
   by design per feature 004's research.md). The `<dialog>` element
   itself also had no explicit `background-color`, exposing a thin
   white sliver at the rounded panel's edges in dark themes — fixed
   with `bg-transparent` on `.modal-dialog`/`.slide-over-dialog`.
2. **DarkModeToggle vs. the full theme `<select>` — two independent
   write paths to the same `data-theme` attribute**: this is the first
   page to pair DarkModeToggle (light/dim only, feature 030's own scope)
   with the full 119-theme selector (`gallery-theme-selector.js`,
   reused verbatim via `@import` + dynamic script import for FR-004).
   The `<select>` only sets its own value once on init; it never
   observes external `data-theme` changes, so toggling DarkModeToggle
   silently desynced the dropdown from the theme actually applied.
   Fixed with a small `MutationObserver` local to the showcase (not a
   shared-component change, since no other page pairs these two
   controls).
3. **`useCommandPalette`'s `execute()` calls `onExecute()` before
   closing the dialog**: a consumer action that synchronously
   manipulates the rest of the page (e.g. clicking a Tabs trigger to
   reveal a section) has no effect, since everything outside an open
   modal `<dialog>` is inert per spec. Fixed by deferring such
   `onExecute` bodies to `requestAnimationFrame` after the dialog has
   actually closed — not a hook-level fix, since most consumers'
   `onExecute` callbacks don't touch the rest of the page and need no
   deferral.
4. **Recharts' `ResizeObserver`-driven redraw is asynchronous**:
   measuring `document.documentElement.scrollWidth` immediately after
   `page.goto()` on a narrow viewport can transiently catch the chart's
   `<svg>` at its pre-resize width, intermittently failing a
   no-horizontal-overflow check in WebKit specifically. Fixed at the
   test level (`page.waitForFunction` polling the chart's own rendered
   width) rather than the component, since the actual rendered chart is
   always eventually correct — this was a test-timing gap, not a
   product bug.

Also fixed as part of this feature (research.md R5): `src/components/
chart/chart.html`'s pre-existing `href="http://localhost:5174/chart.html"`
— dead on any deployed environment (confirmed directly against the live
site) — now points at `/showcase/index.html`. And: a link hardcoded as
`href="/index.html"` inside a React component compiles into the JS
bundle, which `scripts/rewrite-base-path.mjs` (feature 039) does NOT
rewrite (it only walks `.html` files) — the showcase's own "back to
catalog" link would have 404'd under the Pages subpath in production.
Fixed by deriving the link from Vite's own `import.meta.env.BASE_URL`
at runtime instead of hardcoding a root-absolute path.

### Forms, Validation & Inputs
- **Text inputs/selects/textareas**: `block w-full rounded-md border-0 py-1.5
  text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300
  placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-brand
  sm:text-sm sm:leading-6`.
- **Checkboxes/radios**: `h-4 w-4 rounded-sm border-neutral-300 text-brand
  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
  focus-visible:outline-brand disabled:opacity-50 disabled:cursor-not-allowed`;
  adjacent label uses `cursor-pointer` and, when the input may be disabled,
  `peer`/`peer-disabled:opacity-50` so the label dims with it. Radio uses
  the native circular shape of `type="radio"` (no `rounded-*` class needed
  or applied). Grouped radios share a `name` attribute for native mutual
  exclusivity.
- **Toggles/switches**: `transition-colors duration-200 ease-in-out` between
  `bg-neutral-200` and `bg-brand` on the track, plus a state-invariant
  `ring-1 ring-inset ring-neutral-500` boundary (the fill alone measures
  1.24:1 against a white page — below the 3:1 WCAG 1.4.11 non-text
  threshold; the ring clears 4.83:1); inner dot `h-5 w-5 transform
  rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`,
  dimming together with the track via `peer-disabled:opacity-50` on both.
- **Inline errors**: `text-xs text-error-strong mt-1 font-medium` directly
  below the input (AAA-safe text variant); the parent input additionally
  receives `ring-error focus:ring-error` (non-text use — base token is
  correct here).
- **Textarea**: shipped as a real component in feature 014
  (`src/components/textarea/textarea.html`), closing the gap this entry's
  own "Text inputs/selects/textareas" wording had implied without a
  standalone component ever existing — the same class of "documented but
  never shipped" gap Table had before feature 012. Reuses the Text
  inputs/selects pattern above verbatim; the only differences are
  `resize-y` (never bare `resize`, which permits horizontal resize and
  breaks responsive layouts) and a `rows="4"` default.
- **Button Group / Segmented Control**: shipped in feature 014
  (`.button-group`/`.button-group-segment`,
  `src/components/button-group/button-group.html`) as **zero
  JavaScript** — visually-hidden native `<input type="radio">` elements
  sharing one `name` attribute, each paired with a `<label>` styled as a
  connected segment (`first:rounded-l-md last:rounded-r-md` on the outer
  segments, `-ml-px` collapsing adjacent borders to a single 1px line).
  Native radio-group behavior (arrow keys move the checked segment,
  skipping disabled ones; Tab enters/exits the whole group as one stop)
  is free from the browser. This REUSES Accordion's native shared-`name`
  exclusivity mechanism (feature 009) rather than porting Tabs' custom
  roving-tabindex widget — the explicit precedent going forward: when a
  native form control already solves an exclusivity/selection problem,
  prefer it over a hand-rolled ARIA widget. Active segment
  `bg-brand-dark text-white` (7.90:1, the same Sidebar/Pagination
  active-item pairing, re-verified rather than assumed since contrast
  ratios are colors-only and don't change by context). Disabled segment
  `opacity-50 cursor-not-allowed` on the label, driven by
  `input:disabled +`.
- **Slider (Range)**: shipped in feature 015 (`.slider`,
  `src/components/slider/slider.html`) as native `<input type="range">`
  — **zero JavaScript**. Fill/thumb driven by Tailwind's `accent-*`
  utility (`accent-brand-dark` on `bg-neutral-200`), confirmed via
  `CSS.supports()` to be supported across Chromium/Firefox/WebKit,
  chosen over hand-rolled `::-webkit-slider-thumb`/`::-moz-range-thumb`
  vendor-prefixed pseudo-elements (each only supported in one engine
  family). Reuses Progress's exact fill/track pairing verbatim (6.38:1,
  confirmed identical colors before citing the number, not re-computed).
  Native keyboard support (arrow keys, Home/End, Page Up/Down) is free
  from the browser.
- **File Input/Upload**: shipped in feature 015 (`.file-drop-zone`/
  `.file-input-native`, `src/components/file-input/file-input.html`,
  `src/scripts/file-input.js`) as a native `<input type="file">`
  (opacity-0, `absolute inset-0`) layered under a styled drop-zone
  wrapper — click-to-browse works natively. The native input MUST be
  first in the DOM inside `.file-drop-zone` (a real bug found during
  implementation: the general-sibling combinator `~` only matches
  elements AFTER the reference element, so an input placed last made the
  mandated focus-visible rule permanently unmatchable); the icon/text
  MUST be wrapped in one `.file-drop-zone-content` sibling so the
  focus-visible/disabled rules produce one cohesive outline/opacity
  change instead of one per child. The selected filename is displayed via
  `src/scripts/file-input.js`'s `change`-event listener (the native input
  is visually transparent, so its own browser filename chrome is never
  seen) — the only genuinely new interactivity this component needs.
  Real drag-and-drop (`dragenter`/`dragover`/`drop` handling) is
  explicitly deferred as a documented future enhancement, not silently
  dropped — a materially larger JS surface than reading the `change`
  event's own `.files` list. **Contrast correction found during
  implementation**: the helper text originally used `text-neutral-500`
  (measures 4.83:1, clears AA but fails this catalog's AAA 7:1 floor) —
  `neutral-500` is ratified in this catalog ONLY for icon-fill/non-text
  use, never small body text; fixed with `text-neutral-600` (already
  used for every other small helper/caption text in this catalog).
- **ColorPicker/ColorInput**: shipped in feature 016 (`.color-input`,
  `src/components/color-input/color-input.html`) as a native
  `<input type="color">` — **zero JavaScript**, explicitly rejecting a
  custom JS-driven color-swatch picker (the native element already
  provides a full OS-level picker UI, complete keyboard operability, and
  a real hex `value` at zero JavaScript and zero additional
  accessibility surface to get wrong). `border`/`ring`/`shadow` utilities
  apply to the input's own box identically across all three engines, but
  a real cross-context finding: `appearance-none` is REQUIRED for those
  utilities' `box-shadow` to actually render — an isolated inline-`style`
  test computed `box-shadow` correctly without it, but a real
  class-based rule was silently suppressed by the element's default
  `appearance: auto` swatch-box rendering until `appearance-none` was
  added. Explicit `h-10 w-16` normalizes each engine's differing default
  intrinsic size (Chromium 50×27, Firefox 64×32, WebKit 44×23). WebKit
  additionally excludes this input type from the natural Tab sequence
  entirely (confirmed on a bare, unstyled element, ruling out any
  CSS/markup cause) — accepted as a genuine engine limitation, the same
  class as PinInput's Firefox clipboard-event gap (feature 015).
- **Localized Identifier/Contact Fields**: shipped in feature 019 — 11
  masked, self-validating components (`CpfInput`, `CnpjInput`, `CepInput`,
  `PhoneBrInput`, `TituloEleitorInput`, `PisPasepInput`,
  `VehiclePlateInput`, `IbanInput`, `CardNumberInput`, `PhoneIntlInput`,
  under `packages/react/src/*Input/`, plus static twins under
  `src/components/*-input/`) spanning Brazilian documents/contacts (CPF,
  CNPJ, CEP, phone), extended Brazilian identifiers (Título de Eleitor,
  PIS/PASEP, vehicle plate), and international codes (IBAN, card number,
  international phone). Every check-digit/checksum algorithm (CPF/CNPJ/
  Título/PIS-PASEP modulo-11, IBAN mod-97, Luhn) lives in one
  framework-agnostic `shared/validators/` module — the static
  `src/scripts/localized-inputs.js` wiring and every React component
  import the exact same functions, mirroring `shared/design-tokens.ts`'s
  established single-source-of-truth pattern; no new npm dependency was
  needed (Principle VII not triggered — every algorithm is self-contained
  arithmetic). Each component reuses `TextInput`'s exact `.text-input`/
  `aria-invalid`/`aria-describedby` markup unchanged, extended with an
  `aria-live="polite"` error region (FR-019) so a validity change is
  announced without interrupting ongoing typing. A shared
  `useValidatedInput()` hook (React) and a shared `wireField()`/
  `wirePhoneIntlField()` pair (static) both implement the identical
  timing rule: a value is only ever evaluated for pass/fail once it
  reaches its code type's expected length or the field blurs, and an
  empty non-required field is never reported invalid. **A real
  round-trip bug was found and fixed during implementation**:
  `PhoneIntlInput`'s first draft had `format()` prepend the selected
  country's calling code into the input's own displayed value (e.g. "+1
  1234567890"), which then fed back into `format()`/`validate()` on the
  next keystroke — the calling code's own digits got counted as part of
  the national number, inflating the digit count and producing false
  "wrong length" rejections on a second keystroke. Fixed by making the
  calling code purely a separate, non-editable display element (never
  part of the `<input>`'s value), restoring idempotency. Título de
  Eleitor's implementation documents an honest simplification: it uses
  the standard, most commonly published TSE modulo-11 algorithm without
  an additional special-case adjustment some references describe for the
  São Paulo/Minas Gerais state codes, since that adjustment could not be
  verified with full confidence against an authoritative source.

### Data Display & Listings
- **Tables**: shipped as a real component in feature 012 (`.data-table`/
  `.data-table-header-cell`/`.data-table-cell`/`.data-table-row-zebra`,
  `src/components/table/table.html`), closing the "documented but never
  built" gap flagged by feature 011. Header `bg-neutral-100 text-left
  text-xs font-semibold text-neutral-700 uppercase tracking-wider
  px-6 py-3` (9.37:1 AAA against `bg-neutral-100` — corrected from the
  originally-ratified but wrong `bg-neutral-50`/`text-neutral-600`/
  "7.23:1" figures, feature 020: the header cell has always actually sat
  on `bg-neutral-100`, and paired with `-600` that measures 6.86:1,
  failing AAA); cells `text-sm text-neutral-900 px-6 py-4 max-w-xs
  truncate` (16.98-17.74:1 AAA) — header uses `py-3`, body cells use
  `py-4` (a deliberate, denser header convention, not an inconsistency). Rows with optional zebra striping
  (`.data-table-row-zebra`'s `even:bg-neutral-50`) and `divide-y
  divide-neutral-200`. Class names are `.data-table*`, not `.table*`:
  Tailwind's own core `display` plugin defines `.table { display: table
  }`, `.table-cell { display: table-cell }`, and `.table-row { display:
  table-row }` as core utilities — the identical class of collision
  bug feature 011 found for Lists' `.list-item`, caught here before
  implementation by checking `corePlugins.js` first. The horizontally-
  scrollable wrapper (`overflow-x-auto`) requires `tabindex="0"`,
  `role="region"`, and a descriptive `aria-label` per axe-core's
  `scrollable-region-focusable` rule — a real violation found only at
  narrow (320px) viewports where the table genuinely overflows, not at
  wider ones; this is applied unconditionally since static markup can't
  detect actual overflow at runtime, a documented, accepted tradeoff.
- **Data Table**: shipped in feature 022, closing the "interactive/
  sortable Data Table" gap flagged deferred since feature 014. Advanced,
  customizable, dual-surface (`src/scripts/data-table.js` + React
  `packages/react/src/DataTable/{DataTable,DataTableToolbar,
  DataTableRowActions,DataTableForm,DataTableEmptyState}.tsx`), built on
  the plain Table pattern above (`.data-table*` classes, unchanged) rather
  than a parallel markup convention. Sort, global + per-column filter, and
  pagination are pure functions in `shared/data-table/{sorting,filtering,
  pagination}.ts`, consumed identically by both surfaces — the same
  shared-core convention `shared/validators/` established in feature 019,
  not a new pattern. Multi-row selection (`shared/data-table/selection.ts`
  — `{ids: Set<string>, scope: "page" | "all-matching"}`) surfaces an
  in-flow bulk-actions toolbar (not a floating one) once any row is
  checked, with a page-vs-all-matching-rows link once the dataset spans
  more than one page. CRUD is fully opt-in per table instance
  (`crud: {create?, edit?, delete?}`) — when a flag is off, its affordance
  (button, row action) is absent entirely, not disabled, per this
  catalog's established absent-vs-disabled convention. Create/edit reuses
  the Modal pattern (Overlays section below) plus TextInput/Select's
  existing error-message convention for validation; delete requires a
  confirm step via the same Modal. Column visibility is a native
  `<details>/<summary>` disclosure (this catalog's zero-JS-friendly
  convention, matching Accordion and TreeView) rather than a bespoke
  dropdown — its checkbox-panel is `absolute left-0 sm:left-auto
  sm:right-0` (not simply `right-0`): anchoring only to the right edge
  pushed the panel off-screen to the left at 320px whenever the
  `<summary>` trigger sits left-of-center, a real bug found only by the
  320px Playwright project, not by any wider viewport. TanStack Table was
  evaluated per Principle VII (specs/022-advanced-data-table/research.md
  R1) and deliberately not adopted — hand-rolled state matches this
  catalog's existing from-scratch precedent (Combobox, Dropdown Menu) and
  a table of this scope didn't justify a new runtime dependency.
- **Badges**: success `bg-success/5 text-success-strong ring-1 ring-inset
  ring-success/20`; error `bg-error/5 text-error-strong ring-1 ring-inset
  ring-error/10`; warning `bg-warning/5 text-warning-strong ring-1 ring-inset
  ring-warning/10`; neutral `bg-neutral-50 text-neutral-600 ring-1 ring-inset
  ring-neutral-500/10`. Background and ring both use the base status token via
  Tailwind's opacity modifier (`/5` background, `/20` or `/10` ring); text uses
  the AAA-safe `-strong` variant. All three are already-ratified tokens — no
  raw palette classes anywhere in the pattern.
- **Lists**: shipped as a real component in feature 011 (`.list`/
  `.list-row`/`.list-row-interactive`/`.list-row-title`/
  `.list-row-metadata`, `src/components/list/list.html`). Avatars reuse
  `.avatar-img`/`.avatar-fallback`/`avatar-lg` verbatim (no new avatar
  CSS); title `text-sm font-semibold text-neutral-900`; metadata `text-xs
  text-neutral-600` (corrected — see below); interactive row
  `hover:bg-neutral-50 active:bg-neutral-100 focus-visible:outline
  focus-visible:outline-2 focus-visible:-outline-offset-2
  focus-visible:outline-brand`, wrapped in a single `<a href
  tabindex="0">` (native link semantics; `tabindex="0"` is required
  because WebKit/Safari's default keyboard-access setting otherwise
  excludes `<a>` from the sequential Tab order — confirmed empirically,
  not assumed). Container `.list` uses `divide-y divide-neutral-200
  overflow-hidden rounded-md border border-neutral-200 bg-white` — the
  `overflow-hidden` is required so a hover/focus background on the
  first/last row clips to the container's rounded corners rather than
  squaring off past them. Class names are `.list-row*`, not
  `.list-item*`: Tailwind's own core `display` plugin defines a
  `.list-item { display: list-item }` utility, and since `@layer
  utilities` is later than `@layer components` in the cascade, a
  same-named component class would have its `display: flex` silently
  overridden — a real bug caught during feature 011's implementation,
  not a hypothetical.
  **CORRECTED GAP** (found by feature 006, fixed by feature 011): this
  entry previously specified `text-xs text-neutral-500` for metadata,
  and Lists had never been implemented as its own standalone component
  — when the ratified metadata pattern was actually used for the first
  time (Card's composed demo, feature 006), a real axe-core scan failed
  it at 4.83:1 (AAA requires 7:1). Feature 011 corrected the token to
  `text-neutral-600` (7.56:1, AAA-compliant, verified via the WCAG
  relative-luminance formula) at the source and shipped the component —
  the same class of "ratified but never empirically verified" gap
  Breadcrumbs had before feature 005. (Table had the identical
  "documented but never built" gap — resolved by feature 012, see the
  Tables entry above.)
- **Avatar**: `.avatar-img` — `rounded-full object-cover` (image variant).
  `.avatar-fallback` — `bg-neutral-100 text-neutral-700 font-medium
  rounded-full` (initials fallback; 9.37:1 AAA, computed via the WCAG
  relative-luminance formula). Two sizes: `h-8 w-8 text-xs` (small,
  dense-list contexts) and `h-10 w-10 text-sm` (large — the same size
  already ratified above for Lists' own avatars, reused verbatim, not
  reinvented).
- **Card**: `.card` — `rounded-lg border border-neutral-200 bg-white p-6
  shadow-sm` (the `rounded-lg`/`border-neutral-200` pair reused verbatim
  from the Modals panel pattern below). Optional `.card-elevated` —
  `transition-shadow duration-150 hover:shadow-md` (the exact transition
  already shipped in `.btn-primary` since feature 001).
- **Alert/Banner**: `.alert` — `flex items-start gap-3 rounded-md p-4`, no
  `role="status"`/`aria-live`/`role="alert"` (static page content,
  distinct from Toast below, which is a transient announcement). Four
  severities follow one formula, `bg-{status}/5 ring-1 ring-inset
  ring-{status}/20-or-10 text-{status}-strong`: success/error/warning
  reuse Badges' exact pattern above verbatim; info — `bg-info/5 ring-1
  ring-inset ring-info/20 text-info-strong` (the `info-strong` token added
  above). Message text `text-neutral-900` (matching Toast's message
  treatment below). Optional dismiss control reuses `close-icon-btn`
  verbatim (Overlays section below) — no new interactive class.
- **Divider/Separator**: shipped in feature 014
  (`src/components/divider/divider.html`). `.divider` — `border-t
  border-neutral-200`, reused verbatim for BOTH the semantic `<hr>`
  thematic-break case and the non-semantic horizontal `role="separator"`
  `<div>` case used inside flex/grid layouts (no second class needed for
  that variant — only orientation, not semantics, changes the box model).
  `.divider-vertical` — `h-full w-px self-stretch bg-neutral-200`, for
  vertical breaks inside toolbars; always non-semantic (`role="separator"
  aria-orientation="vertical"`), since no semantic HTML element for a
  vertical thematic break exists.
- **Kbd**: shipped in feature 014 (`.kbd`,
  `src/components/kbd/kbd.html`) for inline keyboard-shortcut display —
  `rounded-sm border-neutral-300 bg-neutral-50 font-mono text-xs
  text-neutral-700 shadow-sm` (9.86:1 AAA, computed via the WCAG
  relative-luminance formula). Real `<kbd>` element, no ARIA needed
  (native semantics already communicate "this represents keyboard
  input"). Requires `font-mono` (Design Foundations, above) — Command
  Palette's pre-existing inline ⌘K/Ctrl+K markup (feature 008) was
  updated to adopt this shared class rather than continuing to duplicate
  the same utility string.
- **Skeleton**: shipped in feature 014 (`.skeleton` +
  `.skeleton-text`/`.skeleton-avatar-sm`/`.skeleton-avatar-lg`/
  `.skeleton-card`, `src/components/skeleton/skeleton.html`) as a loading
  placeholder — `animate-pulse bg-neutral-200`, avatar presets reusing
  Avatar's exact `h-8 w-8`/`h-10 w-10` sizes and the card preset reusing
  Card's `rounded-lg` verbatim, so a skeleton-to-real-content swap never
  shifts layout. **This is the first `motion-reduce:` handling this
  codebase has ever ratified** — no prior mechanism existed (confirmed by
  grep, not assumed) since every previously-shipped animation was a
  one-shot state-change transition, not a continuous/looping one.
  `motion-reduce:animate-none` (Tailwind's built-in variant, not a raw
  media query) is the established pattern for any future continuous
  animation.
- **Empty State**: shipped in feature 014
  (`src/components/empty-state/empty-state.html`) as **this catalog's
  first purely compositional entry — no new CSS class**. Centered `flex
  flex-col items-center gap-3 py-12 text-center` wrapper; `aria-hidden`
  icon; a real `<h2>`/`<h3>` heading (never a styled `<div>` standing in
  for one); `text-neutral-600` description; optional `.btn-primary`
  action. Built entirely from already-ratified utilities/classes —
  confirmed empirically during implementation that no new class was
  needed, rather than assumed either way going in.
- **AspectRatio**: shipped in feature 015
  (`src/components/aspect-ratio/aspect-ratio.html`) as **this catalog's
  second purely compositional entry — no new CSS class**, matching
  Empty State's precedent. Plain `aspect-[16/9]`/`aspect-square`/
  `aspect-[4/3]` Tailwind utilities backed by the standard `aspect-ratio`
  CSS property (confirmed supported across the full target engine
  matrix). Constrains embedded media to a fixed ratio, preventing layout
  shift as the media loads; the contained element still needs its own
  real `alt`/accessible name — AspectRatio itself adds no new
  accessibility requirement.
- **Indicator**: shipped in feature 015 (`.indicator-wrapper`/
  `.indicator`/`.indicator-error`/`.indicator-success`/
  `.indicator-warning`/`.indicator-info`/`.indicator-neutral`/
  `.indicator-dot`, `src/components/indicator/indicator.html`) as a
  small overlay badge positioned via plain `relative`/`absolute`
  (confirmed empirically that CSS Anchor Positioning is unneeded — an
  Indicator overlays its own direct parent, never a separate top-layer
  element like Tooltip/Popover). Genuinely distinct from the standalone
  Badge component. **Real contrast defect caught before shipping, not
  assumed transferable from Badge**: Badge's own pattern is a 5%-opacity
  tint + `text-{status}-strong`, never `text-white` on the *base* status
  color — the base colors were never calibrated for solid-fill +
  white-text use. Computed directly: `text-white` on the base
  `bg-success`/`bg-warning`/`bg-error`/`bg-info`/`bg-neutral-500`
  measures 2.54:1 / 2.15:1 / 3.76:1 / 3.68:1 / 4.83:1 — all fail this
  catalog's AAA 7:1 floor, four of five fail even AA 4.5:1. Fixed with
  the `-strong` variants (already ratified for Badge/Alert text) as
  solid fills instead: 7.68:1 / 9.07:1 / 8.31:1 / 8.72:1 against white,
  and `neutral-700` (10.31:1) replacing `neutral-500` for the same
  reason — all clear AAA comfortably. The lesson generalizes: re-verify
  the actual computed ratio any time a new component reuses a
  "similar-sounding" existing token in a structurally different way
  (solid fill vs. tint), not just when the token name matches. The badge
  itself is `aria-hidden="true"`; the host's own accessible name (a
  visually-hidden sibling span) MUST include the count/status value for
  the count/status variant.
- **DataList**: shipped in feature 015
  (`src/components/data-list/data-list.html`) as **this catalog's third
  purely compositional entry — no new CSS class**. Real semantic
  `<dl>`/`<dt>`/`<dd>` key-value pairs styled with the same
  `text-sm font-medium text-neutral-900` (label) /
  `text-sm text-neutral-600` (value) pairing already used throughout
  Forms and Empty State — `<dt>`/`<dd>` natively associate each term with
  its description, no ARIA needed.
- **Timeline**: shipped in feature 015 (`.timeline`/`.timeline-item`/
  `.timeline-content`, `src/components/timeline/timeline.html`) as
  **zero JavaScript** — a real `<ol>` (chronological order is
  semantically meaningful) of dated events, each with a real
  `<time datetime="...">` timestamp. Reuses Avatar's
  `.avatar-fallback`/`.avatar-sm` classes verbatim for each event's
  actor. The connecting line (`::before` pseudo-element, `bg-neutral-200`)
  is the same accepted decorative-border exception as Stepper's connector
  and Card/Divider/List — not a new contrast gap.
- **Stat/Metric Card**: shipped in feature 015
  (`src/components/stat-card/stat-card.html`) as **pure composition of
  the existing `.card` class + typography tokens — no new CSS class**,
  confirmed empirically rather than assumed. Trend indicator reuses
  `text-success-strong`/`text-error-strong` verbatim (identical
  text-on-white usage context Badge already established, no new pairing
  to verify). Decorative trend arrows are `aria-hidden="true"`; the
  actual percentage/direction is conveyed in real text, never the glyph
  alone.
- **TreeView**: shipped in feature 016 (`.tree-view`/`.tree-view-summary`/
  `.tree-view-children`/`.tree-view-leaf`,
  `src/components/tree-view/tree-view.html`) as recursively nested native
  `<details>/<summary>` — **zero JavaScript, zero ARIA attributes**.
  Confirmed via a real Chrome DevTools Protocol accessibility-tree
  inspection (not assumed from HTML-AAM spec docs): `<summary>` is
  exposed with role `DisclosureTriangle`, `focusable=true`, and an
  `expanded` property tracking that exact `<details>` element's own
  `open` state independently of any ancestor — a nested branch's own
  collapsed/expanded state is genuinely its own. `<ul>`-nested `<li>`
  elements automatically expose a `level` property matching visual
  nesting depth, with no `aria-level` needed. Leaf nodes render as plain
  `<li>` text with no `<details>` wrapper — a node with nothing to expand
  MUST NOT show a disclosure affordance.
- **Rating**: shipped in feature 016 (`.rating`/`.rating-stars`/
  `.rating-star-filled`/`.rating-star-empty`/`.rating-value`,
  `src/components/rating/rating.html`) as a **read-only display only**
  (a clickable/settable rating input is explicitly deferred, not
  partially built). The real numeric value (e.g. "4.2 out of 5") is
  always visible text — the single source of truth; star glyphs are
  `aria-hidden="true"` decorative reinforcement, rounded to the nearest
  whole star for the visual only (no SVG clip-path/gradient partial-fill
  hack). **Contrast note**: `text-warning` (filled stars, 2.15:1) and
  `text-neutral-300` (empty stars) both fail even the AA 3:1 non-text
  floor as raw figures, but since both are `aria-hidden` with the real
  value always separately present as text, this is the same class of
  already-accepted decorative-element exception as Stepper's/Timeline's
  connector lines (feature 015). This required a genuinely NEW exemption
  category in `scripts/check-contrast.mjs`,
  `DECORATIVE_ARIA_HIDDEN_TOKENS` — distinct from the existing
  `ICON_FILL_TEXT_TOKENS` (which requires clearing the lower 3:1 floor
  via a `RING_PAIRINGS` entry): `text-warning` fails even that lower bar,
  so a stricter category was added for tokens confirmed to be inside an
  `aria-hidden` element with the real information always separately
  rendered as text.
- **Charts**: shipped in feature 020 — six Recharts-based chart types
  (`LineChart`, `BarChart`, `AreaChart` with a `stacked` variant,
  `PieChart` with a `donut` variant, `RadarChart`, `RadialChart`) plus two
  shared, chart-type-independent primitives (`ChartTooltip`, `ChartLegend`)
  under `packages/react/src/Chart/`, closing the "Chart" gap this
  constitution has flagged deferred since feature 014. **This catalog's
  first component shipped React-only** — Recharts has no
  framework-independent rendering path, so there is no zero-JavaScript
  static HTML twin; `src/components/chart/chart.html` is a cross-reference
  page linking to the React demo instead of duplicating it (spec.md
  Assumptions, a deliberate, documented exception to the dual-shipping
  convention every prior feature followed). Every chart's color palette is
  read live from the existing `--color-*` custom properties via a new
  `useChartColors()` hook (`getComputedStyle`, an 8-token ordered sequence
  — `brand`/`success`/`warning`/`error`/`info`/`brand-dark`/
  `success-strong`/`info-strong`, all already-ratified, zero new tokens),
  re-evaluated on a `MutationObserver` watching `data-theme` — the same
  mechanism that lets Tailwind `className` utilities re-theme, just reached
  via JS since Recharts requires literal color props on its own internally-
  rendered SVG, not `className`. Every chart renders an `sr-only`
  `ChartDataTable` (reusing feature 012's `.data-table*` classes) as its
  non-visual data equivalent, and a `ChartEmptyState` (reusing feature
  014's empty-state recipe) for a zero-row dataset. `isAnimationActive`
  is gated by a new `usePrefersReducedMotion()` hook. A `ChartFrame`
  wrapper scopes `role="img"` to only the chart visualization itself —
  an early draft's `role="img"` on the same element as `ChartLegend`'s
  interactive `<button>`s tripped a real axe-core `no-focusable-content`
  violation, fixed by moving Legend/DataTable to siblings of the
  `role="img"` node rather than descendants. `ChartLegend` uses real
  `<button>` elements with the full Principle V state set, not Recharts'
  own non-interactive default legend. Recharts' entrance animation sweeps
  in progressively from 0° to its final state — a screenshot or assertion
  taken before that settles will see a partial chart, not a rendering bug;
  tests emulate `prefers-reduced-motion: reduce` for deterministic,
  instant renders instead.
  **Extended in feature 024** with the 5 remaining native Recharts
  chart-container components — `ComposedChart` (bar/line/area combined,
  with an opt-in secondary Y-axis via `yAxisId`, per-series), `ScatterChart`
  (each series owns its own `{x, y}` point array — the one chart type in
  this catalog with no shared `data` prop), `FunnelChart` (same prop
  shape as `PieChart` — no multi-series concept), `Treemap` (recursive
  `{name, value?, children?}` nodes), and `Sankey` (index-addressed
  `nodes`/`links`) — completing full coverage of all 11 native Recharts
  chart types. Every new type reuses the exact shared chrome above
  verbatim — zero new dependencies, zero new tokens, zero new mechanism.
  `Treemap`/`Sankey` deliberately have no `ChartLegend` (a "toggle a
  node" interaction doesn't map onto a hierarchy or a flow graph the way
  it does onto a handful of series) — both still expose `ChartFrame`'s
  accessible data-table toggle, fed a flattened `{name, value}`
  representation. A real, currently-shipping bug was found and fixed
  during this feature's implementation (not specific to the 5 new chart
  types — it affected all 6 of feature 020's original types too):
  `packages/react/src/styles.css` never defined the `--color-*` CSS
  custom properties `useChartColors()` reads at runtime, so every chart
  in this catalog rendered every series in solid black for any real
  consumer of the npm package — discovered via the Claude Design sync's
  PieChart preview capture (not this feature's own testing, since the
  React harness's existing dev-server setup happened to mask it). Fixed
  by shipping the default theme's `:root` token block (verbatim from
  `src/styles/themes.css`) in the package's own stylesheet.

### Overlays, Modals & Feedback
- **Modals**: backdrop `fixed inset-0 bg-neutral-500/75 transition-opacity`;
  dialog box `relative transform overflow-hidden rounded-lg bg-white px-4 pb-4
  pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6`.
- **Slide-overs**: right-side entry animation with `transform transition
  ease-in-out duration-500`; `h-full` with `max-w-md`.
- **Toasts/banners**: `fixed top-4 right-4 z-50`, semantic icon on the left,
  explicit close button on the right (`text-neutral-400 hover:text-neutral-500`).
- **Tooltip**: shipped in feature 014
  (`.tooltip-wrapper`/`.tooltip`/`.tooltip-top`,
  `src/components/tooltip/tooltip.html`) as **zero JavaScript** —
  visibility is purely `:hover`/`:focus-within` driven (opacity
  transition, `delay-300` before appearing), positioned via CSS Anchor
  Positioning (`anchor-name`/`position-anchor`/`anchor()`, the same
  cross-engine-verified mechanism as Dropdown Menu) but deliberately
  WITHOUT the Popover API — a tooltip is non-interactive and must never
  contain focusable content (WAI-ARIA tooltip pattern), unlike
  Popover/Dropdown Menu/Combobox's click-triggered dismissible panels.
  **Ratified CSP constraint**: this project's `style-src 'self'` (no
  `unsafe-inline`) silently blocks inline `style="anchor-name:..."` HTML
  attributes — confirmed empirically (a real, previously-undiscovered
  bug: `anchor-name` computed to `none` and the tooltip rendered at the
  wrong position, uncaught by any test that only asserted opacity, not
  actual placement). Fixed via 4 pre-declared numbered
  `.tooltip-anchor-N`/`.tooltip-target-N` class pairs in the stylesheet
  (same-origin rules, unaffected by `style-src`) — any future component
  needing a per-instance CSS custom property MUST use this
  numbered-class technique or a JS-driven CSSOM assignment (see
  Progress, below), never an inline `style` attribute.
- **Progress**: shipped in feature 014
  (`.progress-track`/`.progress-fill`/`.progress-fill-indeterminate`,
  `src/components/progress/progress.html`). `role="progressbar"` with
  `aria-valuenow`/`aria-valuemin`/`aria-valuemax` (indeterminate variant
  omits `aria-valuenow`). Track `bg-neutral-200`, fill `bg-brand-dark`
  (6.38:1 against the track, clearing WCAG 1.4.11's 3:1 non-text floor
  with over double the required margin — computed via the WCAG
  relative-luminance formula, not assumed from Sidebar's unrelated
  text-contrast pairing). Indeterminate fill gated by
  `motion-reduce:animate-none`. Fill width is driven by a small script
  (`src/scripts/progress.js`, `element.style.width` set directly via the
  CSSOM from a `data-value` attribute) rather than a static inline
  `style="width:..."` — the same CSP constraint Tooltip hit (above), but
  fixed with a script instead of numbered classes since a percentage is
  a continuous 0–100 value space, not a small boundable set. Direct
  CSSOM property assignment (`el.style.foo = ...`) is NOT subject to the
  `style-src` check that blocks the inline HTML attribute — the same
  distinction Dropdown Menu's `trigger.style.anchorName = ...` already
  relied on, now made explicit for future components to reuse.
- **Spinner/Loader**: shipped in feature 015
  (`.spinner`/`.spinner-sm`/`.spinner-lg`,
  `src/components/spinner/spinner.html`) as **zero JavaScript** — an SVG
  with `animate-spin` (Tailwind's built-in utility) `text-brand-dark`,
  distinct from Progress's linear/determinate-capable bar. Sizes reuse
  Avatar's exact `h-8 w-8`/`h-10 w-10` scale for visual consistency.
  `role="status"` + `aria-label="Loading"` (no visible text label
  competing for space, but assistive technology still announces the
  loading state). Gated by `motion-reduce:animate-none`, reusing
  Skeleton's precedent (feature 014) for the same class of continuous/
  looping animation.

### Navigation & Disclosure
- **Accordion/Disclosure**: native `<details>`/`<summary>` — zero JavaScript,
  including the single-open-at-a-time ("exclusive") variant, via the native
  shared `name` attribute (HTML Living Standard's exclusive accordion group
  mechanism), not custom JS. Trigger `text-neutral-900`, `hover:text-neutral-700`,
  `active:text-neutral-600`, standard focus-visible ring. Chevron icon
  `text-neutral-400`, rotated via `group-open:rotate-180` (the `<details>`
  element carries `group`). Content `text-neutral-600`. Item divider
  `border-neutral-200`.
- **Tabs**: WAI-ARIA Tabs pattern (roving tabindex, Left/Right/Home/End
  arrow-key navigation) — this project's second component (after
  Modal/Slide-over/Toast) requiring custom JavaScript, since no native
  element covers this keyboard model. Unselected `text-neutral-600`,
  `hover:text-neutral-700 hover:border-neutral-300`, `active:text-neutral-800`,
  selected `border-brand text-neutral-900`, disabled
  `disabled:opacity-50 disabled:cursor-not-allowed` (the literal pattern
  every disabled declaration in this project uses — never a custom color
  substitute). Tab list `border-b border-neutral-200`, `overflow-x-auto`
  for narrow-viewport overflow (scrolls rather than wrapping or truncating,
  preserving the single-row tab metaphor).
- **Dropdown Menu**: native Popover API (`popover="auto"`) provides
  open/close/light-dismiss/top-layer for free — the same relationship
  `<dialog>` has to Modal/Slide-over. A small JS module handles what it
  doesn't: arrow-key roving focus among items, `aria-expanded` syncing on
  the trigger, and Tab-closes-the-menu (WAI-ARIA APG Menu Button
  convention). The panel is anchored under its trigger via **CSS Anchor
  Positioning** (`anchor-name`/`position-anchor`/`anchor()`), each
  instance assigned a unique anchor name at init time — `position:
  absolute` alone does **not** anchor a Popover-API-shown element to its
  DOM ancestor, since promoting an element to the top layer resets its
  containing block to the viewport (a real, previously-shipped bug found
  and corrected in feature 010; verified via `CSS.supports()` that all
  three target browser engines natively support Anchor Positioning
  before adopting it). Panel `bg-white shadow-lg ring-1 ring-neutral-300 rounded-md`.
  Item `text-neutral-900`, `hover:bg-neutral-50`, `active:bg-neutral-100`,
  focus-visible layers `bg-neutral-50` together with — never instead of —
  the standard focus-visible outline (the bg alone does not satisfy this
  principle's outline mandate), disabled `disabled:opacity-50
  disabled:cursor-not-allowed`.
- **Popover**: shipped in feature 014 (`.popover-panel`,
  `src/components/popover/popover.html`, `src/scripts/popover.js`) — a
  generic-content variant of Dropdown Menu's exact mechanism above
  (`popover="auto"` + Anchor Positioning, unique anchor-name per
  instance), but hosting arbitrary content instead of a fixed
  `role="menuitem"` list, so no roving-focus/item-list logic is carried
  over. Two things ARE carried over from Dropdown Menu's `toggle`
  listener: `aria-expanded` sync, and close-path `trigger.focus()`
  (any component hosting real interactive content must return focus
  somewhere sane on close). Adds `position-try-fallbacks: flip-block,
  flip-inline` on `.popover-panel` for viewport-edge repositioning —
  **new coverage Dropdown Menu itself never had** (Dropdown Menu's own
  contract explicitly documents viewport-edge positioning as out of
  scope); verified `position-try-fallbacks` support directly via
  `CSS.supports()` across all three target engines before adopting it,
  the same discipline as Anchor Positioning itself in feature 010. Also
  ships a `MutationObserver` closing the panel if its trigger is removed
  from the DOM while open (native `popover="auto"` panels do not
  auto-close on trigger removal, and an unhandled removed-trigger would
  leave an orphaned floating panel with no way to dismiss it).
- **Context Menu**: shipped in feature 014 (`src/scripts/context-menu.js`,
  `src/components/context-menu/context-menu.html`), reusing Dropdown
  Menu's `.dropdown-menu-panel`/`.dropdown-menu-item` classes verbatim
  but **forking** (not reusing verbatim) its JS: CSS Anchor Positioning
  can only anchor to a real DOM element, never a synthetic cursor
  coordinate, so on `contextmenu` (with `event.preventDefault()` to
  suppress the native browser menu) the panel's `style.left`/`style.top`
  are set imperatively from `event.clientX`/`event.clientY`, clamped
  against `window.innerWidth`/`innerHeight` minus the panel's own
  measured `offsetWidth`/`offsetHeight` so it never renders off-screen.
  Arrow-key roving focus and toggle-driven focus-init (first item on
  open)/focus-return (to the right-clicked target on close) ARE copied
  verbatim from Dropdown Menu, since neither depends on the positioning
  mechanism. **Precedent for future forks**: positioning logic forks
  when the anchor target genuinely differs (element vs. cursor point);
  interaction/focus logic doesn't need to, and shouldn't be
  re-derived, when the underlying widget semantics are identical.
- **Menubar**: shipped in feature 016 (`.menubar`/`.menubar-trigger`,
  `src/components/menubar/menubar.html`, `src/scripts/menubar.js`) as a
  horizontal, keyboard-navigable application menu bar — distinct from
  Navbar (site navigation) and Dropdown Menu (single trigger). Composes
  Dropdown Menu's existing `initDropdownMenus()` **completely
  unmodified** for every top-level trigger's panel mechanics (open/
  close/in-panel-arrow-keys/focus-return) — confirmed its `anchorCounter`
  pattern already handles multiple independent trigger+panel instances
  with zero changes needed. The one genuinely new script,
  `menubar.js`, adds only the roving-tabindex-between-triggers layer
  (adapted from Tabs), attached to the `[data-menubar]` CONTAINER rather
  than each trigger (a real finding: opening a panel moves focus into
  its first item, so a per-trigger listener stops seeing ArrowRight/
  ArrowLeft — the container-level listener catches the key bubbling up
  from inside an open panel, since a popover's top-layer promotion is
  paint-only, not a DOM-tree relocation). **A genuinely tricky rapid-
  keypress race condition was found via code review (HIGH) and fixed
  across two iterations**: the Popover API's `toggle` event is queued,
  not synchronous, and `dropdown-menu.js`'s own unconditional close-time
  `trigger.focus()` (reused unmodified) could still fire against a
  STALE transition regardless of any staleness guard `menubar.js`
  applied to its own reactions. The eventual fix collapses a two-call
  `hidePopover()`-then-`showPopover()` sequence into a SINGLE
  `showPopover()` call — confirmed empirically that showing a sibling
  `popover="auto"` panel already closes the currently-open one as one
  atomic native operation with a guaranteed event order — plus a
  `generation`/`settledGeneration` guard that ignores a keypress arriving
  before an earlier transition's final focus placement has completed,
  rather than trying to out-race `dropdown-menu.js`'s unmodifiable
  close-handler after the fact.

### Advanced Forms & Interaction
- **Combobox**: a from-scratch WAI-ARIA 1.2 combobox — native
  `<input list>`/`<datalist>` was verified insufficient (no ARIA
  combobox/listbox/option roles, no styling control over the suggestion
  popup, inconsistent cross-browser substring-matching behavior, no
  disabled-option or "No results" support) rather than assumed adequate.
  `role="combobox"` on the input with `aria-controls`/
  `aria-activedescendant`/`aria-autocomplete="list"`; `role="listbox"`
  on the popup, hosted via the Popover API (`popover="auto"`, the same
  mechanism Dropdown Menu already established), anchored under the input
  via **CSS Anchor Positioning** (`anchor-name`/`position-anchor`/
  `anchor()`, the identical mechanism and fix as Dropdown Menu's panel —
  `position: absolute` alone does not anchor a Popover-API-shown element
  to its DOM ancestor; a real, previously-shipped bug found and corrected
  in feature 010). Options
  `text-neutral-900`, `hover:bg-neutral-50`, `active:bg-neutral-100`,
  keyboard-active `bg-neutral-100` (reusing Dropdown Menu's exact item
  states, not `bg-brand` — a transient keyboard-focus indicator, not a
  persistent "selected/current" state). Matched substrings render via
  `<mark>` with `font-semibold` on the *same* `text-neutral-900`, not a
  new background highlight color — sidesteps introducing any new,
  unverified contrast pairing entirely. Disabled options use
  `aria-disabled="true"` (never the `disabled` attribute — a `<li>` is
  not a form control) with `opacity-50` plus explicit
  `hover:bg-transparent active:bg-transparent` suppression so a disabled
  row never highlights. `:focus-visible` is intentionally absent from
  option rows: `aria-activedescendant` keeps real DOM focus on the input
  at all times, so the pseudo-class cannot structurally match a row that
  never receives focus — the input's own focus ring is the single focus
  indicator for the entire composite widget, not a gap in Principle V.
- **Command Palette**: reuses Modal's `<dialog>`/`showModal()` chrome
  verbatim (`rounded-lg`/`shadow-xl`/`sm:max-w-lg`) plus this project's
  first document-level global keyboard shortcut — a `keydown` listener
  checking `(event.metaKey || event.ctrlKey) && event.key.toLowerCase()
  === "k"`, guarded against firing while another `<dialog open>` already
  exists. Shares its filter/`aria-activedescendant`/match-highlighting
  model with Combobox (independently implemented per component, not
  imported — the two contexts' DOM/dialog-vs-popover mechanics differ
  enough that the ~45 lines of shared pure logic were judged not worth a
  third shared module, per code review). `overlay.js`'s backdrop-click-
  close and WebKit-safe close-time refocus logic is exposed as an
  exported `wireDialogClose(dialog)` helper (extracted from
  `initDialogTriggers()`'s per-trigger loop, which cannot discover a
  dialog with no `data-dialog-trigger` button) and called once for this
  dialog — Modal/Slide-over's own wiring is unchanged. **Updated in
  feature 014**: its inline ⌘K/Ctrl+K markup now uses the shared `.kbd`
  class (above) instead of duplicating the same utility string inline.
- **PinInput/OTP**: shipped in feature 015 (`.pin-input-box`,
  `src/components/pin-input/pin-input.html`, `src/scripts/pin-input.js`)
  as a segmented one-character-per-box numeric input, built from real,
  separate `<input>` elements (never a single input with visual tricks)
  so each box is genuinely focusable and screen-reader-navigable. Needed
  its own new small JS module — no existing script handled multi-box
  focus distribution — providing per-box numeric filtering with
  auto-advance, Backspace-retreat on an empty box, and paste-splitting
  across the remaining boxes starting from whichever box receives the
  paste (non-numeric content rejected, excess length truncated). Reuses
  TextInput's exact ring/focus treatment (`ring-neutral-300`,
  `focus:ring-brand`) rather than inventing a new focus idiom. Real
  `<fieldset>`/`<legend>` grouping with a per-box `aria-label` (e.g.
  "Digit 1"), since no single visible label covers all boxes.

### Component Catalog Expansion (Batch 1, Feature 023)

A curated, 14-component slice of feature 018's 105-candidate gap
inventory, selected for reusing an existing mechanism already in this
catalog rather than requiring a new interaction pattern. Shipped
dual-surface (static HTML/vanilla JS + React), zero new dependencies,
zero new design tokens.

- **NumberInput**: TextInput's shell + two side-by-side stepper
  buttons (not stacked — a stacked pair measured a 24×14px hit target,
  failing WCAG 2.2's 2.5.8 Target Size; side-by-side at 24×24 passes).
  Clamps to `[min, max]` on blur, not per keystroke; each stepper
  disables individually at its bound.
- **PasswordInput**: TextInput's shell + a show/hide toggle button
  whose `aria-label` names the action it performs NEXT ("Show
  password"/"Hide password"), preserving value and caret position
  across toggles.
- **MultiSelect**: extends Combobox's filterable-listbox mechanism with
  multiple concurrent selections rendered as removable chips. Uses
  `popover="manual"`, not Combobox's `popover="auto"` — MultiSelect
  opens on focus/click of an input outside the popover's own subtree,
  and an `auto` popover's light-dismiss algorithm closes it on that
  same click's `pointerdown` before the `click` handler runs (Combobox
  never hits this since it only opens while typing).
- **ActionIcon**: an icon-only Button variant with a mandatory
  `aria-label` (required at the TypeScript level on the React surface,
  not merely documented).
- **CopyButton**: reuses Button verbatim; writes to the clipboard via
  the native async Clipboard API, showing a temporary "Copied"
  confirmation or a distinct failure state (never silently reporting
  success on a rejected write).
- **SplitButton**: a primary action segment + a second segment reusing
  Dropdown Menu's exact Popover-API mechanism (`useDropdownMenu`) —
  not a new popup pattern.
- **AvatarGroup**: overlapping `.avatar-img`/`.avatar-fallback` chips
  with a "+N" overflow indicator shown only when membership exceeds the
  configured limit — never a "+0" or hidden placeholder otherwise.
- **Highlight**: wraps case-insensitive substring matches in `<mark>`,
  reusing Combobox's existing `.combobox-option mark` treatment
  (`bg-transparent font-semibold`) rather than inventing a new
  highlight color.
- **Code**: inline and block variants sharing Kbd's `font-mono` token;
  a distinct component from Kbd (keyboard-input semantics vs. code
  display).
- **ColorSwatch**: a caller-colored chip with a mandatory `.sr-only`
  text alternative (never color alone, per Principle II). The static
  surface applies the color via the CSSOM
  (`element.style.backgroundColor`), not an inline `style` attribute —
  every page's `style-src 'self'` CSP (no page ever uses
  `'unsafe-inline'`) renders an inline-styled background transparent.
- **NavLink**: reuses Sidebar's exact active-item classes
  (`[aria-current="page"]` → `bg-brand-dark text-white`) as a
  standalone component usable outside a full Sidebar layout.
- **Anchor**: the simplest component in this batch — a single styled
  inline `<a>` using the ratified `text-brand-dark` link token.
- **Collapse**: a single, independent native `<details>/<summary>`
  disclosure — Accordion's identical mechanism minus the "close
  siblings" group behavior. Named `.collapse-item`, not `.collapse`:
  Tailwind's own core utilities define `.collapse { visibility:
  collapse }`, which would silently override a same-named
  component-layer class — the same class of collision bug feature 011
  found for Lists' `.list-item` and feature 012 found for Table's
  `.data-table*`, caught here before implementation.
- **Spoiler**: Collapse's mechanism + a pre-open `line-clamp-*`
  truncation. Its clamped preview lives INSIDE `<summary>`, not as a
  sibling — a closed `<details>` renders only its `<summary>` and hides
  every other child, so a truncated preview cannot be a sibling of it.
  Shows no "Show more" control at all when the content doesn't actually
  exceed the clamp threshold.

### Known Catalog Gaps (deliberately deferred, not silently dropped)
- **Date Picker/Calendar, interactive/sortable Data Table, Carousel,
  Chart, Scroll Area, Resizable panels**: evaluated during feature 014's
  research phase (a shadcn/ui + Radix UI Primitives comparison surfaced
  these as genuine gaps against common component-library baselines) but
  deliberately deferred — unlike feature 014's ten shipped components,
  each of these requires a substantially new interaction pattern with no
  existing mechanism in this catalog to extend or reuse. Flagged here for
  whichever future feature takes them on, matching this constitution's
  established practice of recording deferred gaps explicitly (e.g. Table
  was recorded this way before feature 012 built it). **Still deferred as
  of feature 015** — none of these ten components address this list.
- **TreeView, Rating, Menubar, ColorPicker/ColorInput, HoverCard**:
  evaluated during feature 015's research phase (a 10-major-design-system
  comparison — shadcn/ui, Radix UI, MUI, Ant Design, Chakra UI, Mantine,
  Carbon, Polaris, Primer, Fluent 2 — surfaced these as the next tier of
  genuine gaps). **TreeView, Rating, Menubar, and ColorPicker/ColorInput
  have now shipped in feature 016** (see their Component Catalog entries
  above) — each was genuinely buildable by reusing an existing mechanism
  (native `<details>/<summary>` for TreeView, Dropdown Menu's panel
  mechanics for Menubar, a native `<input type="color">` for
  ColorPicker), not the "substantially new interaction pattern" barrier
  that still applies to the remainder of this list. **HoverCard remains
  deferred** — still judged redundant with this catalog's existing
  Tooltip+Popover combination, not a complexity deferral.
- Remaining deferred, unaddressed by feature 016: **Date Picker/Calendar,
  interactive/sortable Data Table, Carousel, Chart, Scroll Area,
  Resizable panels, HoverCard** — each still requires a substantially new
  interaction pattern (or, for HoverCard, is redundant with an existing
  combination) with no existing mechanism in this catalog to extend or
  reuse. Flagged here for whichever future feature takes them on.
- **Chart has now shipped in feature 020** (see Component Catalog → Data
  Display & Listings → Charts above) — the "substantially new interaction
  pattern" barrier was cleared by adopting Recharts rather than
  hand-rolling SVG/Canvas rendering, a deliberate, documented exception to
  this catalog's zero-new-dependency norm (Principle VII diligence
  recorded in specs/020-recharts-chart-primitives/plan.md's Constitution
  Check) rather than inventing the pattern from scratch. **Still deferred
  as of feature 020**: Date Picker/Calendar, interactive/sortable Data
  Table, Carousel, Scroll Area, Resizable panels, HoverCard.
- **Interactive/sortable Data Table has now shipped in feature 022** (see
  Component Catalog → Data Display & Listings → Data Table above) — unlike
  Chart, no new dependency was needed: sort/filter/paginate/selection are
  hand-rolled pure functions built on the existing plain-Table markup,
  and TanStack Table was evaluated and deliberately not adopted (see the
  Data Table entry). **Still deferred as of feature 022**: Date
  Picker/Calendar, Carousel, Scroll Area, Resizable panels, HoverCard.
- **Chart's Recharts chart-type coverage is now complete as of feature
  024** (see Component Catalog → Data Display & Listings → Charts
  above) — all 11 native Recharts top-level chart components are
  shipped (6 from feature 020, 5 from feature 024: ComposedChart,
  ScatterChart, FunnelChart, Treemap, Sankey). Candlestick is explicitly
  NOT a gap — Recharts has no native Candlestick component, correcting
  an imprecise mention in feature 020's own Assumptions (see feature
  024's spec.md Assumptions). **Still deferred as of feature 024**: Date
  Picker/Calendar, Carousel, Scroll Area, Resizable panels, HoverCard.

## Distribution & Ecosystem Standards

Publishing `packages/react/` as a real, externally-installable npm package
(feature 048 verified this for the first time, using a throwaway project
genuinely outside this monorepo rather than trusting in-workspace usage)
introduces a distinct category of non-negotiable rules, separate from the
Core Principles above: once a version is public, other teams' code depends
on it, and this section exists so that dependency is never silently broken.

- **Semantic Versioning is NON-NEGOTIABLE.** Any change to an existing
  component's public prop API, removal of an exported component/type, or a
  behavior change a consumer could reasonably depend on MUST bump the MAJOR
  version. New components or additive, backward-compatible props MUST bump
  MINOR. Everything else (bug fixes, internal refactors with no observable
  API change) is PATCH. `docs/PUBLISHING.md` (feature 048) documents the
  mechanical steps; this principle is *why* those steps matter, not just
  the runbook.
- **Every published version MUST have a changelog entry** (`packages/react/
  CHANGELOG.md`, Keep a Changelog format, established in feature 048)
  written in consumer-relevant terms — what changed and why it matters to
  someone installing the package, not an internal commit-message dump. An
  empty or missing entry for a published version is a release-process
  defect, not a documentation nicety.
- **The published package's own README/CHANGELOG/LICENSE MUST stay current
  with what's actually shipped** — feature 048 found the package had none
  of the three, and the monorepo root's own usage snippet had silently
  gone stale (citing a component count from an earlier version) for
  several features running. Any feature that changes the package's public
  surface MUST update `packages/react/README.md` in the same change, not
  as a follow-up.
- **TypeScript is REQUIRED for any published package.** Already true for
  `packages/react/` (full `.d.ts` generation via `tsup`) — recorded here so
  it stays true if this catalog ever ships a second published package.
- **Framework scope is an explicit, accepted boundary, not an oversight.**
  This catalog currently publishes React only. A consumer on Vue, Angular,
  or a no-framework stack cannot use `packages/react/` today, and closing
  that gap (e.g. a Web Components port) is real, substantial work — it
  MUST be a deliberate future feature with its own spec if there's genuine
  multi-framework demand, never something silently promised or implied by
  documentation that doesn't say so.
- **A real `npm publish` to the public registry is a human-authorized
  action, never an autonomous one.** It is irreversible (a published
  version cannot be unpublished after npm's 72-hour window) and public.
  Feature 048 established the precedent: an AI agent may build, verify
  (via `npm pack` + install into a project outside the workspace — a
  faithful stand-in that exercises the same module-resolution and
  `exports`-map behavior a registry install would), and prepare every
  step up to publishing, but the actual `npm publish` command is run by a
  human holding real registry credentials, following `docs/PUBLISHING.md`.

**Rationale**: this project's own Component Catalog Quality & 2026
Modernization audit (feature 044) and this section's own trigger (feature
048) both found the same underlying pattern — a hand-maintained artifact
(a CSS subset, a README, a changelog) silently drifting from its source of
truth because nothing forced it to stay current. SemVer discipline and
mandatory changelog entries are the same fix applied one level up: the
package's *version history*, not just its code, must never silently drift
from what's actually true.

## Governance

**Authority**: this constitution supersedes any individual style practice or
preference. No component is merged into the design system if it violates any of
the Core Principles (I–VII) above.

**Automated AI Validation**: the AI agent is strictly forbidden from approving or
generating HTML code that violates:
1. **Missing interactive states** (Principle V) — summary rejection.
2. **Hardcoded classes** (Principle IV) — automatic interception and conversion
   to the equivalent semantic token before approval.
3. **Non-English project artifacts** (Principle VI) — any code, comment, or
   documentation file written in a language other than English MUST be flagged
   and corrected before approval; this does not apply to the agent's own
   responses to the user, which MUST remain in PT-BR.
4. **Redundant or "dirty" code** — duplicated utility classes or poorly
   structured layouts MUST be cleaned up (prefer `space-y`/`gap` over manual
   repeated spacing on sibling elements) before approval.
5. **Unsafe or unannounced skill installation** (Principle VII) — any external
   skill adopted without passing the trustworthiness/safety/relevance/license
   checks, or installed without informing the user, MUST be rejected/reverted.

**Adopted External Skills** (Principle VII): skills vetted and available for
use in this project —
- `frontend-design` (Anthropic, `claude-plugins-official` marketplace,
  Apache License 2.0) — distinctive visual/UX design guidance (palette,
  typography, layout choices that avoid templated defaults). Resolves the
  TODO(SKILL_REFS) carried since v1.0.0. Verified 2026-07-08: official
  publisher and marketplace, plain-instruction content with no
  scripts/obfuscation, directly relevant to this project's anti-templated-UI
  goal, Apache 2.0 license compatible.

**Repository**: this project's canonical remote is
https://github.com/jonyfs/professional-design-system — constitution amendments,
component contributions, and issue tracking are expected to flow through this
repository once it is populated. The repository is PUBLIC (changed from
private 2026-07-18, a deliberate, explicitly-confirmed decision, to allow
GitHub Pages to serve this catalog as a live example site — GitHub's Free
plan does not support Pages on private repositories at all, confirmed
directly via a real, rejected API call before the visibility change, not
assumed).

**Live deployment & semantic versioning**: `.github/workflows/deploy-pages.yml`
publishes the static site (`npm run build`'s `dist/` output) to
https://jonyfs.github.io/professional-design-system/ via GitHub Pages,
triggered only via `workflow_run` after `.github/workflows/ci.yml`'s own
"CI" workflow reports a `success` conclusion on `main` — never an
independent `on: push` trigger, which would race CI's own result and could
publish a commit CI was still in the process of failing. `scripts/
rewrite-base-path.mjs` runs after the build, rewriting every root-absolute
`href`/`src` the static HTML source uses (verified directly: Vite's own
build only prefixes `<script>`/`<link>` tags it recognizes as part of its
module graph with `base`, never arbitrary `<a href="/...">` cross-page
navigation links, which would otherwise 404 under the Pages project
subpath) — the 122+ source HTML files themselves stay root-absolute for
local dev, only the built `dist/` output is rewritten. After a successful
Pages deploy, a `version` job auto-bumps the PATCH semantic version in
`package.json`/`packages/react/package.json` (kept in sync), commits with
`[skip ci]` (preventing the bump commit from re-triggering CI, and by
extension this same Pages workflow, into a loop), tags it (`vX.Y.Z`), and
creates a GitHub Release — MINOR/MAJOR bumps remain a manual, deliberate
commit. This is the project's now-standing policy: every successful
CI + Pages deploy on `main` corresponds to exactly one new semantic
version.

**Amendment Procedure**: changes to this constitution require (a) an explicit
proposal of the principle/section being changed, (b) justification recorded in
the Sync Impact Report at the top of this file, and (c) verification that
dependent templates (`plan-template.md`, `spec-template.md`, `tasks-template.md`,
`checklist-template.md`, and the commands under `.claude/skills/specjedi-*/`)
remain consistent.

**Versioning Policy** (Semantic Versioning):
- **MAJOR**: removal or backward-incompatible redefinition of an existing
  principle/section.
- **MINOR**: addition of a new principle or material expansion of an existing
  section.
- **PATCH**: wording fixes, clarifications, non-semantic adjustments.

**Compliance Review**: every component or PR review touching HTML/Tailwind MUST
verify compliance with the Core Principles before approval, including the
English-only artifact requirement in Principle VI. Complexity that violates a
principle requires explicit justification documented in the corresponding
feature plan (`Complexity Tracking` in `plan-template.md`).

**Version**: 1.39.1 | **Ratified**: 2026-07-07 | **Last Amended**: 2026-07-19
