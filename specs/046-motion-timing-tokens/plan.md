# Implementation Plan: Motion-Timing Design Tokens

**Branch**: `046-motion-timing-tokens` | **Date**: 2026-07-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/046-motion-timing-tokens/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Add the one design-token category this catalog was missing — motion timing (duration + easing) — to close the gap two 2026 UX trends both explicitly called out ("structured variables" spanning color/spacing/typography/motion-timing/radius). `transitionDuration.fast/normal` and `transitionTimingFunction["out-expo"]` are added to `shared/design-tokens.ts` (reusing the exact values already documented in this project's own global coding-style rules), wired into both Tailwind configs the same way `borderRadius` already is, and `scripts/audit-tokens.mjs` is extended with a `duration-*`/`ease-*` check mirroring its existing `rounded-*` check — with zero retrofit of existing components' current ad-hoc values.

## Technical Context

**Language/Version**: TypeScript (`shared/design-tokens.ts`, `tailwind.config.ts`), Node.js (`scripts/audit-tokens.mjs`)

**Primary Dependencies**: Tailwind CSS (existing `theme.extend` mechanism) — no new dependency

**Storage**: N/A

**Testing**: `npm run audit:tokens` (extended, not replaced) is this feature's own regression gate; existing Playwright suite confirms zero visual/behavioral change

**Target Platform**: Same static site + `packages/react` workspace as every other token category

**Project Type**: Web design-system monorepo — token addition, no new workspace

**Performance Goals**: N/A — no runtime cost beyond two small CSS custom-property-equivalent Tailwind theme entries

**Constraints**: FR-004 (zero behavior change to existing shipped components — token category + detection only, no retrofit)

**Scale/Scope**: 2 files modified (`shared/design-tokens.ts`, `scripts/audit-tokens.mjs`), both Tailwind configs updated to import the new tokens

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle III (Tailwind-Only)**: PASS. Adds to the existing `theme.extend` mechanism — no parallel CSS.
- **Principle IV (Design Token Discipline, NON-NEGOTIABLE)**: PASS — this feature is a direct, positive extension of this exact principle: closing the one token category (motion timing) that wasn't yet centralized/audited, using the same allowlist-derivation mechanism already trusted for colors/radius.
- **Principle VI (Language)**: PASS. English source, PT-BR communication.
- **Principle VII (Skill Acquisition)**: PASS/N/A — no new dependency, skill, or service introduced.

**Result**: No violations.

## Project Structure

### Documentation (this feature)

```text
specs/046-motion-timing-tokens/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── checklists/requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
shared/design-tokens.ts           # MODIFIED — add transitionDuration, transitionTimingFunction
tailwind.config.ts                # MODIFIED — import + extend with the two new tokens
packages/react/tailwind.config.ts  # MODIFIED — same, kept in sync (existing convention)
scripts/audit-tokens.mjs          # MODIFIED — parseDurationAllowlist/parseTimingFunctionAllowlist
                                   # + duration-*/ease-* branch in checkClass()
```

**Structure Decision**: No new files or workspaces — this closes a gap in the existing, single-source-of-truth token system using the exact mechanism already proven for every other token category. No `contracts/` directory: no external interface is introduced.

## Complexity Tracking

*No entries — Constitution Check passed with no violations.*
