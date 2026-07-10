# Component Contract: Tabs (React)

## Props

```tsx
export interface TabData {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  tabs: TabData[];
  defaultSelectedId?: string;
}
```

## Behavior wiring

- `useState<string>` for `selectedId`, initialized to
  `defaultSelectedId` or the first non-disabled tab's `id`.
- `useRef<Record<string, HTMLButtonElement | null>>({})` for tab-button
  refs, so keyboard navigation can call `.focus()` explicitly (research.md
  R2 — a `tabIndex`/state update alone does not move real focus).
- `onKeyDown` on the tablist container:
  - `ArrowRight`/`ArrowLeft`: compute the next/previous non-disabled
    tab's `id` (wrapping at both ends) into a local variable, call
    `setSelectedId(nextId)`, then call `.focus()` on `tabRefs.current[nextId]`
    **using that same locally-computed `nextId`, not by re-reading the
    `selectedId` state variable** — React 18 batches `setSelectedId`'s
    update, so the `selectedId` closure value is still stale at the point
    `.focus()` would run if it re-read state instead of the local
    variable. All tab buttons stay mounted regardless of selection (only
    visual/`aria-selected`/`tabIndex` change), so this synchronous
    `.focus()` call is safe with no `useEffect` needed.
  - `Home`/`End`: same pattern — compute the first/last non-disabled
    tab's `id` locally, `setSelectedId`, then `.focus()` using the local
    id.
- Each tab button: `role="tab"`, `aria-selected={id === selectedId}`,
  `tabIndex={id === selectedId ? 0 : -1}` (roving tabindex, FR-004),
  native `disabled` for disabled tabs.
- Each panel: `role="tabpanel"`, rendered only (or visually hidden) when
  `id === selectedId`, matching the static reference's single-visible-
  panel behavior.

## Required attributes (Principle II gate)

`role="tablist"` on the container; `aria-controls`/`id` pairing between
each tab button and its panel, identical to
`contracts/005-navigation-disclosure-primitives/tabs.contract.md`.

## Required states (Principle V gate)

Identical to the static reference: unselected `text-neutral-600`,
`hover:text-neutral-700 hover:border-neutral-300`,
`active:text-neutral-800`; selected `border-brand text-neutral-900`;
disabled `disabled:opacity-50 disabled:cursor-not-allowed` (native
`disabled` attribute, not a custom state).

## Token allowlist used

Identical to the static reference — no new tokens.

## Acceptance mapping

- FR-004, FR-006, FR-007, FR-008, FR-009 → this contract
- SC-001, SC-002, SC-003, SC-004 → verified by `tests/e2e/react-tabs.spec.ts`
