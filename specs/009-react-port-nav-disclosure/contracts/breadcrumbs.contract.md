# Component Contract: Breadcrumbs (React)

## Props

```tsx
export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface BreadcrumbsProps
  extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  items: BreadcrumbItem[];
  currentLabel: string;
}
```

## Rendered markup (equivalent to `src/components/breadcrumbs/breadcrumbs.html`)

```tsx
<nav aria-label="Breadcrumb" className="breadcrumb-nav" {...rest}>
  {items.map((item, i) => (
    <Fragment key={item.href}>
      <a href={item.href} className="breadcrumb-link">{item.label}</a>
      <svg className="breadcrumb-divider" aria-hidden="true" viewBox="0 0 20 20" fill="currentColor">…</svg>
    </Fragment>
  ))}
  <span aria-current="page" className="breadcrumb-current">{currentLabel}</span>
</nav>
```

## Required attributes (Principle II gate)

Identical to the static contract: `<nav aria-label="Breadcrumb">` distinct
landmark; ancestors are real `<a href>` elements; current page is a
non-interactive `<span aria-current="page">`, never a "disabled" `<a>`.

## Token allowlist used

Identical to the static reference: `text-neutral-600` (link, resting),
`text-neutral-700` (active), `text-neutral-900` (current, font-medium),
`text-neutral-300` (divider). No new tokens.

## Acceptance mapping

- FR-001, FR-006, FR-007, FR-008, FR-009 → this contract
- SC-001, SC-002 → verified by `tests/e2e/react-breadcrumbs.spec.ts`
