# Phase 1 Data Model: Design System Primitive Components

This feature ships static UI markup with no persisted data. There are no
database entities. The "entities" below are the structural/state models each
component must implement, extracted from the functional requirements in
`spec.md`.

## Button

| Field | Type | Values | Notes |
|---|---|---|---|
| `variant` | enum | `primary`, `secondary` | Controls token mapping (`bg-brand` vs. outline/neutral treatment) |
| `state` | enum | `default`, `hover`, `active`, `focus-visible`, `disabled` | Mutually exclusive except `focus-visible` which can co-occur with `default`/`hover` |
| `label` | string | any | Must not overflow container (Edge Case: long label wraps/truncates) |

**Validation rules**: `disabled` state MUST NOT respond to click/keyboard
activation (FR-001). Every state listed MUST be visually distinct (SC-002).

## Text Input

| Field | Type | Values | Notes |
|---|---|---|---|
| `state` | enum | `default`, `focus`, `error`, `disabled` | `error` and `focus` are mutually exclusive from the user's point of view but the markup supports focusing an errored field |
| `value` | string | any | N/A (native input) |
| `errorMessage` | string \| null | any | Rendered directly below the input when `state === 'error'` |
| `ariaInvalid` | boolean | derived from `state === 'error'` | FR-007 |

**Validation rules**: when `errorMessage` is present, `aria-invalid="true"` and
an error-token ring MUST both be present (FR-002, FR-007). Error message MUST
remain visible even if a placeholder is also set (Edge Case).

## Badge

| Field | Type | Values | Notes |
|---|---|---|---|
| `variant` | enum | `success`, `error`, `warning`, `neutral` | Exactly these four (FR-003) — no fifth variant in this slice |
| `label` | string | any | Must wrap/truncate without breaking layout (Edge Case) |

**Validation rules**: each variant MUST use its designated token combination
from the constitution's Data Display section (e.g., `success` =
`bg-green-50 text-success ring-green-600/20`) — no raw palette class
substitution (FR-005, SC-004).

## Checkbox

| Field | Type | Values | Notes |
|---|---|---|---|
| `state` | enum | `unchecked`, `checked`, `focus-visible`, `disabled` | `disabled` can combine with either `checked` or `unchecked` (Edge Case) |
| `ariaChecked` | boolean | derived from `state` | FR-007 |

**Validation rules**: keyboard Space MUST toggle `state` between `checked`/
`unchecked` when focused and not disabled (FR-006). `disabled` + `checked`
MUST visually combine both states and remain non-interactive (Edge Case).

## Cross-cutting invariants (all four components)

- Every token referenced MUST exist in the constitution's Base Semantic
  Palette table — no new tokens are introduced by this feature (per spec
  Assumptions).
- Every text/background pairing MUST pass WCAG 2.2 AAA contrast (FR-008,
  SC-003) — enforced by `scripts/check-contrast.mjs`.
- No raw Tailwind palette class may appear in shipped markup (FR-005, SC-004)
  — enforced by `scripts/audit-tokens.mjs`.
