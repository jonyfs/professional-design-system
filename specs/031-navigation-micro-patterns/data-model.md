# Data Model: Navigation Micro-Patterns

## Switcher Option (Team/Workspace, Language)

| Field | Type | Notes |
|---|---|---|
| `label` | string | Display text (workspace/language name) |
| `avatarInitials` | string (Team switcher only) | 2-letter fallback, reusing `.avatar-fallback` |
| `isCurrent` | boolean | Derived from which option was last selected, not stored separately |

No persistence — resets to the initial "current" option on reload
(spec.md Assumptions), consistent with this catalog's other
Dropdown-Menu-based demos.

## Scroll Position State (Back-to-Top, Scroll Progress Bar)

| Field | Type | Notes |
|---|---|---|
| `scrollPercent` | number (0-100) | `(scrollY / (scrollHeight - clientHeight)) * 100`, clamped |
| `pastThreshold` | boolean | `scrollY > 400` (Back-to-Top's visibility gate) |

Both derived live from `window.scrollY`/`document.documentElement`,
computed on one shared throttled scroll listener — no persistence, no
independent state.

## Tour Step (Onboarding Tour)

| Field | Type | Notes |
|---|---|---|
| `target` | element reference | The page element this step highlights |
| `title` | string | Step heading |
| `description` | string | Step body text |
| `index` | number (1-indexed) | Position in the fixed sequence |

Demo-defined, static (3-4 steps against the demo page's own elements)
— not dynamically generated or persisted across steps/reloads
(spec.md Assumptions).
