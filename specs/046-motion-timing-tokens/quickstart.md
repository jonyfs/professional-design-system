# Quickstart: Validating Motion-Timing Design Tokens

## 1. Confirm the tokens exist and resolve (SC-001)

1. `grep -n "transitionDuration\|transitionTimingFunction" shared/design-tokens.ts tailwind.config.ts packages/react/tailwind.config.ts`
2. **Expected**: both tokens defined once in `shared/design-tokens.ts`, imported into both Tailwind configs' `theme.extend`.
3. Use a `duration-fast`/`ease-out-expo` class in a scratch HTML snippet and confirm Tailwind's build resolves it to `150ms`/`cubic-bezier(0.16, 1, 0.3, 1)`.

## 2. Confirm zero behavior change (SC-002)

1. Run `npm run audit:tokens` before and after this feature lands.
2. **Expected**: identical result (0 violations) — no existing component's ad-hoc duration/easing class is retrofitted, so none newly pass or fail.
3. Run `npm run test:e2e` (or a representative sample) — confirm no new visual-regression diffs.

## 3. Confirm the audit can detect a raw motion-timing value (SC-003)

1. Temporarily add a class like `duration-[275ms]` (or any suffix not in the new allowlist) to a scratch HTML file under `src/components/`.
2. Run `npm run audit:tokens`.
3. **Expected**: a violation is reported, in the same format/style as an existing raw-color or raw-radius violation.
4. Revert the scratch change.
