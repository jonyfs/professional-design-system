# Data Model: Motion-Timing Design Tokens

No application data model. One new token-system entity, matching the existing shape of `colors`/`borderRadius`/`fontFamily`:

## Motion-timing token

- **Represents**: a named duration or easing-curve value in `shared/design-tokens.ts`, consumed via `tailwind.config.ts`'s `theme.extend` the same way every other token category already is.
- **Fields**: `transitionDuration.fast` (150ms), `transitionDuration.normal` (300ms), `transitionTimingFunction["out-expo"]` (cubic-bezier(0.16, 1, 0.3, 1)).
- **Validation rule**: `scripts/audit-tokens.mjs` flags any `duration-*`/`ease-*` Tailwind class in shipped markup whose suffix isn't one of these named values, mirroring `borderRadius`'s existing `rounded-*` check.
