# Implementation Plan: Consent & System Messaging Primitives

**Branch**: `030-consent-system-messaging` | **Date**: 2026-07-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/030-consent-system-messaging/spec.md`

## Summary

Ship all 5 of feature 018's Consent & System Messaging candidates —
Session Timeout Modal, Offline/Connectivity Banner, 2FA/Verification
reminder banner, Maintenance/Announcement Bar, Dark Mode Toggle — the
only category besides Layout & Structure (feature 028) to reach 100%.
Each reuses an already-shipped mechanism (Modal, Alert, Toggle,
theme-switcher.js) with 3 small, genuinely new additions: this
catalog's first `setInterval`-driven display, first `online`/`offline`
event listener, and a derived (not separately persisted) toggle state.

## Technical Context

**Language/Version**: TypeScript 5.x / vanilla JS, matching this
catalog's existing stack

**Primary Dependencies**: None new — reuses existing Modal (`<dialog>`
+ `overlay.js`), Alert (`.alert`/`.alert-*`), Toggle (`.toggle-track`/
`.toggle-dot`), and `theme-switcher.js`'s persistence mechanism
(feature 017)

**Storage**: No new persistence — Dark Mode Toggle writes through the
SAME `pds-theme` `localStorage` key `theme-switcher.js` already owns
(research.md R5); everything else has no storage need

**Testing**: Playwright (visual + a11y across all 6 browser/viewport
projects), `npm run audit:tokens`/`audit:contrast`, matching every
prior feature's convention

**Target Platform**: Static HTML site + React package, both surfaces

**Project Type**: Web design system (dual-surface), existing
structure unchanged

**Performance Goals**: N/A — presentational primitives; the session
countdown's `setInterval` runs at 1Hz only while its modal is open,
torn down on close

**Constraints**: FR-006 (spec.md) — zero new tokens or themes; FR-007
— no state conveyed by color alone (countdown urgency, connectivity,
toggle state all need a text/attribute equivalent)

**Scale/Scope**: 5 new components, closing feature 018's Consent &
System Messaging category from 0% to 5/5

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle IV (zero new tokens)**: PASS — every primitive reuses
  existing brand/semantic/neutral tokens and the 2 already-shipped
  themes (`light`, `dim`); no new theme is introduced.
- **CSP compliance (style-src 'self')**: PASS — none of the 5
  primitives need any dynamically-computed inline style; the countdown
  and banners are plain text/attribute updates via `textContent`/
  `hidden`, not CSSOM style assignment.
- **Dual-surface shipping convention**: PASS — all 5 ship both
  surfaces. Dark Mode Toggle's React port does NOT import the static
  site's `theme-switcher.js` (a different package/bundle) — it ports
  the same minimal `light`/`dim`/`pds-theme`-key logic directly,
  verified against `packages/react/src`'s one existing precedent for
  reading global theme state (`useChartColors.ts`'s read-only
  `MutationObserver` pattern — see research.md R5 and the correction
  documented directly in contracts/dark-mode-toggle.contract.md).
- **De-duplication verified, not assumed**: PASS — none of the 5 items
  appear in feature 018's "Flagged for de-duplication review" list;
  the `dim` theme pairing decision is documented, not silently assumed.
- **WCAG AAA / no color-alone signaling**: PASS — FR-007 requires a
  text/attribute equivalent for every state; verified via a real
  contrast audit run during implementation, not assumed clean by
  construction.

No violations requiring justification — Complexity Tracking is empty.

## Project Structure

### Documentation (this feature)

```text
specs/030-consent-system-messaging/
├── plan.md              # This file
├── research.md          # Phase 0: countdown/online-offline/dark-theme-pairing decisions
├── data-model.md         # Phase 1: the 5 primitive entities
├── contracts/
│   ├── session-timeout-modal.contract.md
│   ├── system-banners.contract.md      # Offline Banner, 2FA reminder, Maintenance Bar
│   └── dark-mode-toggle.contract.md
├── quickstart.md         # Phase 1: validation steps
└── tasks.md              # Phase 2 (/speckit-tasks — not created by /speckit-plan)
```

### Source Code (repository root)

```text
src/
├── scripts/
│   ├── session-timeout-modal.js
│   ├── offline-banner.js
│   └── dark-mode-toggle.js
└── components/
    ├── session-timeout-modal/session-timeout-modal.html
    ├── offline-banner/offline-banner.html
    ├── two-factor-reminder-banner/two-factor-reminder-banner.html
    ├── maintenance-banner/maintenance-banner.html
    └── dark-mode-toggle/dark-mode-toggle.html

packages/react/src/
├── SessionTimeoutModal/SessionTimeoutModal.tsx
├── SystemBanner/SystemBanner.tsx        # 2FA reminder + Maintenance Bar (parametrized)
├── OfflineBanner/OfflineBanner.tsx
└── DarkModeToggle/DarkModeToggle.tsx

tests/e2e/
└── consent-system-messaging.spec.ts

tests/react-harness/
├── consent-system-messaging.html
└── src/consent-system-messaging-main.tsx
```

**Structure Decision**: Follows this catalog's existing per-component
convention. The 2FA reminder and Maintenance Bar share ONE React
component (`SystemBanner`, parametrized by severity/message/action/
fullWidth) since they're pure content/layout variants of the same
Alert reuse — not two near-identical copy-pasted components — but each
still gets its OWN static HTML demo page/gallery card, matching how
this catalog treats every inventory item as its own discoverable demo
regardless of implementation sharing underneath.

## Complexity Tracking

*No violations — this section is intentionally empty.*
