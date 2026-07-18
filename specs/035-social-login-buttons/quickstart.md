# Quickstart: Configurable Social Login Buttons

## Prerequisites

- `npm install` at repo root (workspace install covers `packages/react`)
- Dev server for the static surface: `npm run dev`
- React harness: existing `tests/react-harness` Vite setup

## Validate US1 — brand-compliant top providers (P1)

1. Open `src/components/social-login/social-login.html` in the dev server.
2. Confirm the Google, Apple, and GitHub buttons render with their real
   brand mark, approved CTA text, and (Apple) a black/white monochrome
   fill with no other color applied.
3. In the React harness, render:
   ```tsx
   <SocialLoginGroup providers={["google", "apple", "github"]} onProviderSelect={console.log} />
   ```
   and confirm the same visual result plus a logged provider id on click.
4. Run `npx playwright test tests/e2e/social-login-buttons.spec.ts` —
   the accessibility check (axe-core) must report zero violations for
   every layout mode.

## Validate US2 — one config array drives the group (P2)

1. Re-render the same React harness page with `providers={["github"]}`
   only — confirm exactly one button appears, no leftover markup from
   the removed entries.
2. Pass `disabledProviderIds={["github"]}` and `loadingProviderIds={["google"]}`
   — confirm only those two buttons reflect the state change; the
   third remains fully interactive.

## Validate US3 — providers without a mandated spec (P3)

1. In the harness, add a custom entry:
   ```tsx
   providers={["google", "apple", { id: "instagram", label: "Continue with Instagram", icon: <InstagramIcon />, color: "#E1306C", onSelect: () => {} }]}
   ```
2. Confirm the Instagram button shares the exact height/padding/radius
   of the Google/Apple buttons, with the brand color visible only in
   the icon's accent, never the button surface (research.md R1).

## Contrast verification (Constitution Check gate)

Run `npm run audit:contrast` — must report zero new findings. The
default `neutral` appearance reuses this catalog's existing audited
`neutral-50`/`neutral-900` pairing, so no new pairing is introduced;
confirm this by grepping the audit output for `social-login` (expect
no entries, since nothing new needs auditing per research.md R4).

## Expected outcome

- All 5 built-in presets plus at least 3 example custom entries render
  correctly in both `stacked` and `compact` modes (SC-004).
- Zero axe-core violations in either mode (SC-002).
- Every button reachable and activatable via Tab + Enter/Space alone (SC-003).
- Changing the `providers` array is the only edit needed to change
  which buttons appear or their order (SC-005).
