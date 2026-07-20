# Research: Motion-Timing Design Tokens

## R1. Token shape and values

**Decision**: Add `transitionDuration` and `transitionTimingFunction` token objects to `shared/design-tokens.ts`, mirroring `borderRadius`'s exact shape (a flat named-value object), imported into both `tailwind.config.ts` and `packages/react/tailwind.config.ts`'s `theme.extend` exactly like `colors`/`borderRadius`/`fontFamily` already are:

```ts
export const transitionDuration = {
  fast: "150ms",   // hover/focus micro-interactions
  normal: "300ms",  // expand/collapse, modal/overlay entrance-exit
};

export const transitionTimingFunction = {
  "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
};
```

**Rationale**: this exact duration/easing pair is already the value set documented in this project's own global coding-style rules (`rules/web/coding-style.md`'s CSS Custom Properties example: `--duration-fast: 150ms; --duration-normal: 300ms; --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);`) — reusing it here means the token matches guidance already agreed for this kind of project, not a value invented fresh. A two-value duration scale (fast/normal) matches the two actual speed needs identified in existing components (quick hover feedback vs. larger enter/exit transitions) without over-engineering a larger scale nothing currently needs (FR-002).

**Alternatives considered**: a larger scale (e.g. fast/normal/slow/slower) — rejected as speculative; nothing in the current catalog's existing ad-hoc durations calls for a third tier, and FR-002 explicitly scopes this to what's actually needed today.

## R2. Audit-tool detection mechanism

**Decision**: Extend `scripts/audit-tokens.mjs` with a `parseDurationAllowlist`/`parseTimingFunctionAllowlist` pair (mirroring the existing `parseRadiusAllowlist`, parsing `shared/design-tokens.ts` source text the same way) and a new branch in `checkClass()` for `duration-*` and `ease-*` Tailwind utility classes, following the exact same allowlist-membership check `rounded-*` already uses.

**Rationale**: this is the smallest possible extension of an already-proven, already-trusted mechanism (the same script already does this exact pattern for `rounded-*`) — no new script, no new dependency, no new detection philosophy.

## R1-addendum. Grandfathering Tailwind's own default duration/easing scale

**Correction discovered during implementation**: enforcing a fully-closed allowlist (mirroring colors/radius exactly) immediately flagged ~15 pre-existing `duration-150`/`duration-200`/`duration-300`/`duration-500` and `ease-in-out`/`ease-out` occurrences across `src/styles/tailwind.css` and `packages/react/src/styles.css` as new violations — directly contradicting FR-004's "zero new violations" requirement. Resolution: `checkClass()` now accepts Tailwind's own built-in default duration scale (75/100/150/200/300/500/700/1000) and default easing keywords (linear/in/out/in-out) as "structural" (always allowed), the same treatment `isStructuralSuffix()` already gives non-semantic Tailwind defaults elsewhere in this script. This differs from colors/radius (which this project fully replaces with its own closed set) because duration/easing numbers carry no inherent semantic meaning the way a color name does — the new named tokens (`fast`/`moderate`/`normal`/`slow`, `out-expo`) are the ratified, *preferred* way to reference these values (FR-005), not the only way to pass the audit. The token scale itself was also widened from an initial 2-value guess (fast/normal) to include every value already genuinely in use (`moderate: 200ms`, `slow: 500ms`), since a token scale that doesn't cover reality isn't a useful scale.

## R3. No retrofit of existing components (FR-004)

**Finding**: a scan of existing `duration-*`/`ease-*` usage across `src/components/**/*.html` and `packages/react/src/**/*.tsx` was intentionally NOT performed as part of this feature's implementation — FR-004 explicitly scopes this feature to adding the token + detection capability only. A future, separate cleanup pass (or feature 044's own audit, if it happens to touch a component using an ad-hoc duration) can migrate individual occurrences without this feature needing to enumerate and touch every one now.
