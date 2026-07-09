# Phase 1 Data Model: React Component Library

## `shared/design-tokens.ts`

The single source of truth both Tailwind configs import from
(research.md). Its exact shape is a **direct extraction** of the values
already in the root `tailwind.config.ts` — not new values, not a new
schema:

```ts
export const colors = {
  brand: { light: "#E6F0FF", DEFAULT: "#0066FF", dark: "#004BB3" },
  neutral: {
    50: "#F9FAFB", 100: "#F3F4F6", 200: "#E5E7EB", 300: "#D1D5DB",
    400: "#9CA3AF", 500: "#6B7280", 600: "#4B5563", 700: "#374151",
    800: "#1F2937", 900: "#111827",
  },
  success: { DEFAULT: "#10B981", strong: "#065F46" },
  warning: { DEFAULT: "#F59E0B", strong: "#78350F" },
  error: { DEFAULT: "#EF4444", strong: "#991B1B" },
  info: "#3B82F6",
};

export const borderRadius = {
  sm: "0.25rem", md: "0.5rem", lg: "0.75rem", full: "9999px",
};

export const fontFamily = {
  sans: ["Inter", "system-ui", "sans-serif"],
};
```

**`fontFamily` is included** (found missing by `/speckit-analyze`): the
static site applies `font-sans` at the body level (`.page-shell` in
`src/styles/tailwind.css`), which only resolves to Inter because the root
config's `theme.extend.fontFamily.sans` says so. Omitting `fontFamily`
from the shared module would have made the React package's `font-sans`
silently fall back to Tailwind's default sans stack — a real typography
regression against FR-004/SC-001 that no other artifact would have
caught until a visual diff flagged it. `shared/design-tokens.ts` is
therefore exhaustive of colors, radius, **and** font family — everything
both `theme.extend` blocks need.

**Root `tailwind.config.ts` is modified by this feature** (not just
`packages/react/tailwind.config.ts`) to import from this file instead of
declaring the same literals inline — see `plan.md`'s Project Structure
for the full modified-file list, corrected to include it.

## Package

| Field | Type | Notes |
|---|---|---|
| `name` | string | `@professional-design-system/react` (scoped, matches the root package's name) |
| `version` | string | `0.1.0` — independent from the root package's version |
| `exports` | map | `module`/`main`/`types` fields pointing at `dist/index.{mjs,js,d.ts}`; a `./styles.css` export for the compiled stylesheet |
| `peerDependencies` | map | `react`, `react-dom` `^18.0.0` — not bundled, the consumer supplies them |

**Validation rules**: `npm run build --workspace packages/react` MUST
produce a `dist/` populated with `index.mjs`, `index.js` (or whichever
formats `tsup.config.ts` declares), `index.d.ts`, and `styles.css`, before
this package is considered complete (FR-001/FR-007).

## Component (one row per shipped primitive)

Every component is a typed function component. The props column lists
only props beyond standard HTML attribute passthrough (`...rest` spread
onto the root element is assumed for all ten, matching how the HTML
contracts already accept arbitrary `data-testid`/`aria-*` attributes).

| Component | Props (beyond passthrough) | Source contract |
|---|---|---|
| `Button` | `variant?: 'primary' \| 'secondary'` (default `'primary'`); native `disabled`, `onClick`, `type` via passthrough | `001/contracts/button.contract.md` |
| `TextInput` | `label: string`; `error?: string` (renders the AAA-safe inline error and sets `aria-invalid`/`aria-describedby` when present); native `disabled`, `placeholder`, `value`, `onChange` via passthrough | `001/contracts/text-input.contract.md` |
| `Badge` | `variant: 'success' \| 'error' \| 'warning' \| 'neutral'`; `children` (label text) | `001/contracts/badge.contract.md` |
| `Checkbox` | `label: string`; native `checked`, `disabled`, `onChange` via passthrough | `001/contracts/checkbox.contract.md` |
| `Radio` | `label: string`, `name: string`, `value: string`; native `checked`, `disabled`, `onChange` via passthrough | `002/contracts/radio.contract.md` |
| `Select` | `label: string`; `error?: string`; `options: { value: string; label: string }[]`; native `disabled`, `value`, `onChange` via passthrough | `002/contracts/select.contract.md` |
| `Toggle` | `label: string`; native `checked`, `disabled`, `onChange` via passthrough | `002/contracts/toggle.contract.md` |
| `Modal` | `open: boolean`; `onClose: () => void`; `title: string`; `children` (body content); `hasFocusableContent?: boolean` (default `true` — `false` sets `tabindex="-1"` on the dialog itself, per the Edge Case) | `003/contracts/modal.contract.md` |
| `Toast` | `variant: 'success' \| 'error' \| 'info'`; `message: string`; `onDismiss: () => void` | `003/contracts/toast.contract.md` |
| `SlideOver` | Same shape as `Modal` (`open`, `onClose`, `title`, `children`, `hasFocusableContent?`) | `003/contracts/slide-over.contract.md` |

**Validation rules**:

- Every color/radius class used in a component's JSX MUST already exist
  in `shared/design-tokens.ts` — enforced by extending
  `scripts/audit-tokens.mjs` to scan `.tsx` `className` string literals
  (research.md).
- `Modal`/`SlideOver`'s `open`/`onClose` props drive the underlying native
  `<dialog>` via `useDialogTrigger` (research.md) — `open` triggers
  `showModal()`/`close()` imperatively inside a `useEffect`, matching
  `<dialog>`'s own imperative API rather than fighting it with a
  purely-declarative `open` HTML attribute (which does not, by itself,
  invoke the modal/focus-trap behavior — only `showModal()` does).
- `Toast`'s `onDismiss` is called once, from the close button's `onClick`
  — mirroring `toast.js`'s DOM-removal behavior, except the removal here
  is the consumer's own responsibility (typical React unidirectional data
  flow: the component doesn't remove itself from a list it doesn't own).

## Cross-cutting invariants

- Every component's default export is a **named** export from
  `packages/react/src/index.ts` (no default exports) — named exports are
  what `design-sync`'s converter discovers and lists (research.md cites
  the skill's own component-discovery mechanism, which walks named
  `.d.ts` exports).
- No component introduces a new color/radius token — `shared/
  design-tokens.ts` is exhaustive of what both Tailwind configs allow,
  ported unchanged from `tailwind.config.ts`'s existing `theme.extend`.
- `Modal`/`SlideOver`/`Toast` remain free of any third-party dialog/toast
  library dependency (research.md) — `react`/`react-dom` are the only
  runtime dependencies this package has at all.
