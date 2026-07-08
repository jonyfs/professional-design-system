# Phase 1 Data Model: Form Primitives — Round 2

This feature ships static UI markup with no persisted data. The "entities"
below are the structural/state models each component must implement,
extracted from the functional requirements in `spec.md`.

## Radio Group

| Field | Type | Values | Notes |
|---|---|---|---|
| `name` | string | shared across a group's options | Native grouping mechanism — all options in one logical group share it |
| `state` | enum | `default`, `checked`, `focus-visible`, `disabled` | `disabled` can combine with either `default` or `checked` |
| `label` | string | any | Must wrap without breaking input/label alignment (Edge Case) |

**Validation rules**: within a group (same `name`), at most one option MAY
be `checked` at a time — enforced natively, not by application logic
(FR-001). `disabled` options MUST NOT become checked via click or keyboard
(FR-001, FR-005).

## Select

| Field | Type | Values | Notes |
|---|---|---|---|
| `state` | enum | `default`, `focus`, `error`, `disabled` | Same shape as Text Input's state model (feature 001) |
| `options` | list of strings | any | Native `<option>` elements |
| `errorMessage` | string \| null | any | Rendered directly below the select when `state === 'error'` |
| `ariaInvalid` | boolean | derived from `state === 'error'` | FR-006 |
| `ariaDescribedBy` | string \| null | the error message element's `id` | Required alongside `ariaInvalid` — links the select to its error text for assistive tech, per `select.contract.md`'s Required Attributes table |

**Validation rules**: when `errorMessage` is present, `aria-invalid="true"`
and an error-token ring MUST both be present (FR-002, FR-006). The
placeholder/first-option text MUST remain visible even when the field is
simultaneously unselected and invalid (Edge Case).

## Toggle

| Field | Type | Values | Notes |
|---|---|---|---|
| `state` | enum | `off`, `on`, `focus-visible`, `disabled` | `disabled` can combine with either `off` or `on` (Edge Case) |
| `ariaChecked` | boolean | derived from `state` | Exposed via native `<input type="checkbox">` `checked` state — no redundant ARIA, same precedent as feature 001's Checkbox (FR-006) |

**Validation rules**: Space or click toggles `state` between `off`/`on` when
focused and not disabled (FR-003, FR-005). `disabled` + `on` MUST visually
combine both states and remain non-interactive (Edge Case).

## Cross-cutting invariants (all three components)

- Every color token referenced MUST exist in the constitution's Base
  Semantic Palette table — no new *color* tokens are introduced by this
  feature (verified in research.md, not assumed). One new *radius* token
  (`rounded-full`, for Toggle's pill track/dot) was needed and ratified via
  constitution amendment to v1.3.4 before implementation — caught by a
  third `/speckit-analyze` pass, not assumed away either.
- Every text/background pairing MUST pass WCAG 2.2 AAA contrast (FR-007,
  SC-003) — already covered by `scripts/check-contrast.mjs`'s existing
  `PAIRINGS` (no new entries needed; see research.md).
- Toggle's track additionally carries a `ring-neutral-500` boundary for
  non-text 3:1 contrast (research.md finding) — not a Principle II
  requirement, but a deliberate quality decision for this new component.
- No raw Tailwind palette class may appear in shipped markup (FR-004,
  SC-004) — enforced by `scripts/audit-tokens.mjs` (no changes needed).
