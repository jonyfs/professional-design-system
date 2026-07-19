---

description: "Task list for Motion-Timing Design Tokens (feature 046)"
---

# Tasks: Motion-Timing Design Tokens

**Input**: Design documents from `/specs/046-motion-timing-tokens/`

## Phase 1: Setup

- [X] T001 Confirmed no motion-timing token exists today (zero matches for duration/easing token definitions across `shared/design-tokens.ts`/`tailwind.config.*`) — captured in research.md

## Phase 2: User Story 1 - Motion feels consistent because it comes from one shared source (P1)

- [X] T002 [US1] Added `transitionDuration` (`fast/moderate/normal/slow`) and `transitionTimingFunction` (`out`/`in-out`/`out-expo`) exports to `shared/design-tokens.ts` — **widened from the original 2-value plan** after discovering the audit would otherwise flag ~15 pre-existing occurrences (see research.md R1-addendum)
- [X] T003 [P] [US1] Imported and extended `theme.extend` with both tokens in `tailwind.config.ts`
- [X] T004 [P] [US1] Imported and extended `theme.extend` with both tokens in `packages/react/tailwind.config.ts`
- [X] T005 [US1] Extended `scripts/audit-tokens.mjs`: `parseTailwindKeyAllowlist` (generalized, reused for both new token objects) + `duration-*`/`ease-*` branches in `checkClass()`, grandfathering Tailwind's own default duration/easing scale as structural (research.md R1-addendum) so existing components produce zero new violations
- [X] T006 [US1] Executed `quickstart.md` §1-§3: `npm run audit:tokens` passes clean (0 violations, 137 .tsx files now scanned including feature 044's new components); deliberately added `duration-[275ms]`/`ease-[cubic-bezier(...)]` to a scratch component, confirmed both were correctly flagged, then reverted — audit passes clean again

**Checkpoint**: Motion-timing tokens exist, are wired into both Tailwind configs, and are enforced by the existing audit tool — with zero change to any shipped component's current behavior.

## Phase 3: Polish

- [ ] T007 Run `npm run verify` as a final combined check
- [ ] T008 [P] Run `graphify update .` to sync the knowledge graph
