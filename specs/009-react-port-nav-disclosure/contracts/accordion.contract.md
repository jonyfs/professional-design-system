# Component Contract: Accordion (React)

## Props

```tsx
export interface AccordionItemData {
  id: string;
  trigger: string;
  content: ReactNode;
  defaultOpen?: boolean;
}

export interface AccordionProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  items: AccordionItemData[];
  exclusive?: boolean;
}
```

## Rendered markup

```tsx
const groupName = useId(); // stable per Accordion instance (research.md R1)

<div className="divide-y divide-neutral-200 border-t border-neutral-200" {...rest}>
  {items.map((item) => (
    <details
      key={item.id}
      className="group accordion-item"
      defaultOpen={item.defaultOpen}
      {...(exclusive ? { name: groupName } : {})}
    >
      <summary className="accordion-trigger">
        {item.trigger}
        <svg className="accordion-chevron" aria-hidden="true" viewBox="0 0 20 20" fill="currentColor">…</svg>
      </summary>
      <p className="accordion-content">{item.content}</p>
    </details>
  ))}
</div>
```

## Behavior wiring

None — zero React state. Exclusivity is the native `<details name>`
mechanism (research.md R1); disclosure toggling is native `<details>`
behavior. `useId()` only, no `useState`/`useEffect`.

## Required attributes (Principle II gate)

Same as the static contract: `group` class on `<details>` for
`group-open:rotate-180` chevron rotation; `<summary>` is natively
keyboard-operable (Enter/Space) with no ARIA additions needed.

## Token allowlist used

Identical to the static reference: `text-neutral-900` (trigger,
resting), `hover:text-neutral-700`, `active:text-neutral-600`,
`text-neutral-400` (chevron), `text-neutral-600` (content),
`border-neutral-200` (divider). No new tokens.

## Edge cases

- Two items both `defaultOpen` in an `exclusive` group: the first in
  array order wins (native browser behavior for a shared `name` group
  with more than one `open` attribute at parse time), matching spec.md's
  documented Edge Case.

## Acceptance mapping

- FR-002, FR-003, FR-006, FR-007, FR-008, FR-009 → this contract
- SC-001, SC-002, SC-004 → verified by `tests/e2e/react-accordion.spec.ts`
