# Feature Specification: Motion-Timing Design Tokens

**Feature Branch**: `046-motion-timing-tokens`

**Created**: 2026-07-18

**Status**: Draft

**Input**: User description: "olhe https://elements.envato.com/learn/ux-ui-design-trends para extrair o que pode ser aplicado neste projeto para melhorar a qualidade deste design system" (review the article and extract what can be applied to this project to improve the design system's quality)

**Context** (extracted directly from the source during this session): the article lists 7 trends for 2026 — AI-native UX transparency, calm interfaces, motion that explains structure, accessibility as core infrastructure, multimodal interactions, adaptive token-based design systems, and trust-driven UX. Cross-checked against this project's actual current state: **calm interfaces and accessibility-as-core-infrastructure are already fully met or exceeded** (Principle I's cognitive-load focus, Principle II's AAA bar, the existing `usePrefersReducedMotion` hook). **AI-native UX transparency, multimodal voice interaction, and trust-driven algorithmic transparency are out of scope** — these describe application-level product behavior (AI suggestion UI, voice command handling, algorithmic feed logic), not something a static component library owns. Two trends — "Motion That Explains Structure" and "Adaptive Token-Based Design Systems" — both explicitly call for "structured variables" covering "color, spacing, typography, motion timing, and border radius." A direct check of `shared/design-tokens.ts` and `tailwind.config.*` confirms color, spacing, typography, and border-radius are already first-class tokens — **but no motion-timing token (duration or easing) exists anywhere in the codebase** (confirmed via source search: zero matches for duration/easing token definitions). Every component that currently animates does so with ad-hoc Tailwind duration/easing utility classes, not a shared token — this is a genuine, previously-undocumented gap in an otherwise-complete token system.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Motion feels consistent because it comes from one shared source (Priority: P1)

A developer building or reviewing a component wants motion (hover transitions, expand/collapse, entrance/exit animations) to use the same shared duration/easing values every other component uses — the same way every component already shares one color palette and one spacing scale — instead of each component picking its own ad-hoc duration/easing utility class.

**Why this priority**: this is the concrete, previously-undiscovered gap the trend research surfaced — every other token category (color, spacing, typography, radius) is already centralized and audited (`scripts/audit-tokens.mjs`), but motion timing is the one category that silently isn't, so animations can drift out of sync between components with no gate to catch it.

**Independent Test**: Add a new component's hover/transition motion using only the new motion-timing tokens (no ad-hoc duration/easing utility class), and confirm the existing token-discipline audit can detect a raw, non-token duration/easing value the same way it already detects a raw color/spacing/radius value.

**Acceptance Scenarios**:

1. **Given** the design token system, **When** a developer needs a transition duration or easing curve, **Then** a documented motion-timing token exists for it — they are not left to invent an arbitrary value.
2. **Given** the existing token-discipline audit, **When** it runs against the full catalog, **Then** it is capable of flagging a raw/ad-hoc motion-timing value the same way it already flags raw color, spacing, and radius values.
3. **Given** a component that already animates correctly today, **When** this feature ships, **Then** its actual animation behavior/timing is unchanged — this introduces the missing token category and a way to detect drift going forward, it does not mandate retrofitting every existing component's exact duration values in this pass (that is future, incremental cleanup, not blocking this feature).

---

### Edge Cases

- What happens to a component whose current ad-hoc duration doesn't match any new token value exactly? It is not forced to change in this feature — the token category and detection capability are the deliverable; migrating every existing occurrence is explicitly out of scope here (see Assumptions) to avoid an unbounded, unrelated mass-edit.
- What happens for a user who has `prefers-reduced-motion` enabled? Motion-timing tokens must not conflict with or bypass the project's existing reduced-motion handling — the token defines timing when motion is allowed to run, not whether it runs.
- What happens if a component's animation is driven by a JS library (e.g. Recharts) rather than CSS transitions? The token still documents the canonical timing value that library's own duration prop should be set to, even though it can't be enforced via a CSS class the audit tool scans.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The design token system MUST define a motion-timing token category (duration scale and easing-curve scale), matching the same shared-source-of-truth model already used for color, spacing, typography, and border-radius tokens.
- **FR-002**: The motion-timing token scale MUST cover the range of durations/easing curves this catalog's components actually need today (at minimum: a "fast" micro-interaction speed for hover/focus feedback, and a "normal" speed for larger transitions like expand/collapse or modal entrance/exit) — not an arbitrary or unbounded number of values.
- **FR-003**: The existing token-discipline audit tooling MUST be capable of detecting a raw/ad-hoc motion-timing value (an inline arbitrary duration/easing not sourced from the new token) — extending its existing detection model to this new category, not building a separate, parallel checking mechanism.
- **FR-004**: This feature MUST NOT change the actual rendered animation behavior or timing of any existing shipped component — it adds the missing token category and its detection capability, and does not retrofit existing components' specific duration values.
- **FR-005**: The new motion-timing tokens MUST be documented alongside this project's other token categories, with the same level of rigor (what each value means, when to use "fast" vs "normal").

### Key Entities

- **Motion-timing token**: a named duration or easing-curve value (e.g. a "fast" and "normal" duration, a documented easing curve) in the shared design-token system, consumed the same way color/spacing/radius tokens already are.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A motion-timing token category exists and is discoverable in the same location as the project's other token categories.
- **SC-002**: The token-discipline audit's pass/fail result is unaffected for every currently-shipped component (zero new false positives, zero existing violations newly introduced) — confirming FR-004's "no behavior change" guarantee.
- **SC-003**: A raw/ad-hoc motion-timing value introduced after this feature ships is detectable by the existing audit tooling, verified with at least one deliberate test case.

## Assumptions

- "O que pode ser aplicado" (what can be applied) is interpreted as: adopt trends that surface a genuine, concrete, low-risk gap or improvement — not every trend in the source article. Several (AI-native transparency, multimodal voice input, trust-driven algorithmic behavior) describe application-level product behavior outside a static component library's scope; two (calm interfaces, accessibility infrastructure) are already met or exceeded by this project's existing constitution.
- Retroactively migrating every existing component's ad-hoc duration/easing class to the new tokens is explicitly out of scope for this feature — it introduces the missing token category and detection capability only, consistent with this session's other 2026-trend features' shared principle of fixing/adding genuine gaps without unrelated mass-refactoring.
- The new tokens are added to the same `shared/design-tokens.ts` / `tailwind.config.*` mechanism already used for every other token category — no new tooling or token format is introduced.
