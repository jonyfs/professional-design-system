# Data Model: Feedback Primitives

## Circular Progress Primitive (2 instances: RingProgress, SemiCircleProgress)

- **value**: 0-100, clamped (spec.md Edge Cases)
- **size**: px diameter, default matching this catalog's existing
  medium-size convention
- **color**: brand or semantic (success/warning/error/info) — reuses
  existing tokens, no new ones
- **accessibleLabel**: text equivalent (e.g. "60% complete") — never
  conveyed by the arc alone (FR-007)
- **surfaces**: `src/components/<name>/<name>.html` + `packages/react/src/<Name>/<Name>.tsx`

## Notification Center

- **unreadCount**: integer driving Indicator's existing badge display
  (0 = badge hidden, matching Indicator's existing convention)
- **notifications**: list of `{ message, read: boolean, timestamp }` —
  static sample data for the demo (spec.md Assumptions), no new
  persistence
- **emptyState**: shown when `notifications` is empty (spec.md Edge Cases)
- **surfaces**: static HTML + React

## Password Strength Meter

- **value**: the password string (never logged, never persisted —
  presentation-only)
- **level**: computed `"empty" | "weak" | "fair" | "strong"` (research.md R5)
- **score**: 0-100 numeric, driving Progress's existing fill mechanism
- **accessibleLabel**: the level as text (e.g. "Weak"), never color alone
- **surfaces**: static HTML + React

## Relationships

```
RingProgress ──┐
               ├── share stroke-dashoffset/CSSOM mechanism (research.md R2/R3)
SemiCircleProgress ──┘

NotificationCenter ── composes ── Indicator (badge) + Dropdown Menu (panel)

PasswordStrengthMeter ── reuses ── Progress's .progress-track/.progress-fill
```

No new entity introduces a new design token, persisted state, or
backend/API dependency.
