# Phase 0 Research: Form Primitives — Round 2

## Decision: Radio reuses Checkbox's exact token vocabulary — verified, not assumed

**Rationale**: The plan's premise ("no new tokens") was explicitly verified
rather than carried over from feature 001 by assumption, since an unverified
assumption is exactly what caused feature 001's AAA contrast bug. Radio's
only rendered content is: the input itself (`border-neutral-300`,
`text-brand` for the checked-dot color via native `accent`/`text-*`
mapping — a non-text UI use, same reasoning already applied to Checkbox in
feature 001) and its label (`text-neutral-900` on white). Both pairings are
already in `scripts/check-contrast.mjs`'s `PAIRINGS` (`neutral-900` on
`white`, already AAA at 17.74:1) or are non-text uses not subject to the
7:1 text rule. **No new PAIRINGS entry required for Radio.**

**Alternatives considered**: A custom `role="radiogroup"` widget with
JS-driven arrow-key handling — rejected; native `<input type="radio">`
sharing a `name` attribute already provides grouping, mutual exclusivity,
and arrow-key navigation with zero JS, consistent with feature 001's
native-semantics-first precedent (FR-005/FR-006).

## Decision: Select reuses Text Input's exact token vocabulary — verified

**Rationale**: Select's rendered content is the option text
(`text-neutral-900` on white — already AAA-verified), the ring boundary
(`ring-neutral-300`/`ring-brand`/`ring-error` — non-text, same as Text
Input), and the error message (`text-error-strong` on white — already
AAA-verified at 8.31:1 in `check-contrast.mjs`). **No new PAIRINGS entry
required for Select.**

**Alternatives considered**: A custom-styled dropdown (div-based listbox
with JS) for more visual control over the option list — rejected; native
`<select>` guarantees correct keyboard operation (arrow keys, type-ahead,
Escape) and screen-reader support with zero JS, and per-OS native styling
of the open option list is an accepted, expected pattern (not a design
system layering concern) — consistent with FR-005/FR-006 and feature 001's
precedent of preferring native controls.

## Decision: Toggle gets a `ring-neutral-500` boundary — a real gap found, not silently reproduced

**Rationale**: The constitution's ratified Toggle/Switch catalog pattern
(`bg-neutral-200`/`bg-brand` track, `bg-white` dot with only a `shadow` for
definition) was checked for non-text UI component contrast (WCAG 1.4.11,
3:1) before being copied into a new component, per this plan's explicit
"verify, don't assume" directive. Measured via the same WCAG relative-
luminance formula used throughout this project:

- `bg-neutral-200` (#E5E7EB) vs. white page background: **1.24:1**
- This project's own existing `ring-neutral-300` boundary (Text Input,
  Checkbox, Badge from feature 001): **1.47:1**

Both are well below the 3:1 non-text-UI-component threshold. This is **not**
a Principle II violation — that principle's literal text mandates AAA only
for "text-over-color-background combination[s]," and WCAG 1.4.11 is an
AA-level criterion with no AAA tier, so nothing NON-NEGOTIABLE is broken.
But a track that is nearly invisible against a white page is a real,
avoidable perceivability defect for a "professional" component, and this is
a brand-new component with no prior ring color to preserve compatibility
with.

**Decision**: Toggle's track uses `ring-1 ring-inset ring-neutral-500`
(4.83:1 vs. white — clears 3:1) in both off and on states, layered under
the existing `bg-neutral-200`/`bg-brand` fill. `neutral-500` is already a
ratified token (feature 001's own Base Semantic Palette) — no constitution
amendment needed, purely a contract-level choice, same as feature 001's
Button fix (`bg-brand` → `bg-brand-dark`) which also resolved a contrast
gap using an already-ratified token rather than adding a new one.

**Out of scope, flagged for follow-up**: Text Input/Checkbox/Badge's
existing `ring-neutral-300` boundaries (1.47:1) have the same underlying
gap. Changing them is a cross-cutting accessibility-hardening change to
already-shipped, CI-green components from a different feature, and is
deliberately **not** bundled into this feature. Recommend a dedicated future
feature/constitution amendment if the project wants to close this gap
project-wide.

**Alternatives considered**: Darkening the `neutral-200` token itself
project-wide — rejected, since `neutral-200` is used successfully elsewhere
(e.g. Badge's neutral variant background) where this contrast concern
doesn't apply, and changing a shared token ripples further than this
feature's scope justifies. A drop-shadow-only boundary (the literal ratified
catalog pattern) — rejected per the measurement above; shadows have no
WCAG-measurable contrast guarantee and render inconsistently across
browsers/OS-level shadow rendering.

## Decision: `rounded-full` ratified as a border-radius token (constitution v1.3.4)

**Rationale**: A third `/speckit-analyze` pass (after `tasks.md` existed)
found that `toggle.contract.md`'s pill-shaped track and circular dot both
require `rounded-full`, but the constitution's ratified border-radius scale
— and `tailwind.config.ts`'s `borderRadius` extend block, which
`scripts/audit-tokens.mjs` derives its allowlist from — only defined
`sm`/`md`/`lg`. This would have failed the Principle IV gate the moment the
contract was implemented, contradicting this plan's own G3 "PASS" claim.
This is a genuinely different gap from the color-token verification earlier
in this document — that covered color allowlist entries, not radius.

**Decision**: Amend the constitution to v1.3.4, adding `rounded-full`
(9999px) to the ratified radius scale alongside sm/md/lg, and add
`borderRadius.full = "9999px"` to `tailwind.config.ts`. `rounded-full` is a
categorically different, universally-understood Tailwind keyword (fully
rounded, not a step on the 4/8/12px scale) already implied by the existing
"avatars" prose in the Data Display section — ratifying it formally
completes the existing scale rather than introducing a new design
direction.

**Alternatives considered**: Restyling Toggle to avoid `rounded-full` (e.g.
a large but finite `rounded-lg` track) — rejected; a pill-shaped switch is
the universally-recognized pattern for this control, and approximating it
with a finite radius would look visibly wrong at the track's rounded ends
for no real benefit, given the token addition is low-risk and reusable.

## Decision: Visual regression baselines generated only via CI, never locally

**Rationale**: Feature 001's CI run failed twice before succeeding — first
because macOS-generated (`-darwin.png`) baselines don't exist for Linux CI,
then because baselines generated via a local Docker
`mcr.microsoft.com/playwright` container still didn't bit-match the real
`ubuntu-latest` GitHub-hosted runner (small font/antialiasing differences,
84 false failures). The only environment that reliably reproduces CI's
render output is CI itself.

**Decision**: For this feature, new Linux baselines are generated by
triggering the existing `.github/workflows/update-snapshots.yml`
(`workflow_dispatch`), downloading its `updated-snapshots` artifact, and
committing those files directly — skipping the local/Docker generation step
entirely this time.

**Alternatives considered**: Generating locally on macOS and accepting CI
will regenerate-and-fail-once — rejected as wasteful (a known-bad first CI
run every time); investing in a fully pinned/reproducible Docker image
matching the exact runner image GitHub uses — deferred as disproportionate
effort for a project this size; the `workflow_dispatch` approach already
exists and costs one workflow run.

## Resolved unknowns

All Technical Context items are resolved above; no `NEEDS CLARIFICATION`
remains for Phase 1.
