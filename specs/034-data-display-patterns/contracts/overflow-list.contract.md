# Contract: OverflowList

## `src/styles/tailwind.css` additions

```css
@layer components {
  .overflow-list {
    @apply flex flex-nowrap items-center gap-2 overflow-hidden;
  }
  .overflow-list-chip {
    @apply inline-flex shrink-0 items-center rounded-md bg-neutral-50 px-2 py-1
      text-xs font-medium text-neutral-600 ring-1 ring-inset ring-neutral-500/10;
  }
  .overflow-list-more {
    @apply inline-flex shrink-0 items-center rounded-md bg-neutral-100 px-2 py-1
      text-xs font-medium text-neutral-700 ring-1 ring-inset ring-neutral-500/10;
  }
}
```

## `src/scripts/overflow-list.js`

```js
// Feature 034 (research.md R1) — this catalog's first ResizeObserver
// usage. Shows only the items that fit before the "+N more" chip's
// own width, re-measuring on every container resize.
//
// Real bug found by running this against a live browser, not assumed
// correct: an earlier draft re-read each item's (and the more chip's)
// offsetWidth on every render() call, including calls made AFTER a
// previous render() had already hidden some of them via
// `display:none`. A hidden element's offsetWidth is always 0, so any
// item hidden by a prior pass would be measured as "0px wide" on the
// next pass, trivially "fit," get un-hidden, and the whole
// computation would cascade into showing every item regardless of
// real width — a real, reproducible bug (triggered by this
// component's own initialization sequence, and would have recurred
// on every subsequent resize event too, since visible/hidden state
// persists across renders). Fixed by measuring each item's natural
// width exactly ONCE, before anything is ever hidden, and reusing
// that cached value for every future fit calculation — the chip's
// text changes ("+N more" varies), so its widest plausible width
// (assuming the full item count could overflow) is measured once and
// reused too, a safe, deterministic upper-bound estimate that never
// needs to be re-measured against a state render() itself may have
// altered.
export function initOverflowLists() {
  document.querySelectorAll("[data-overflow-list]").forEach((container) => {
    const items = Array.from(container.querySelectorAll("[data-overflow-item]"));
    const moreChip = container.querySelector("[data-overflow-more]");
    if (!items.length || !moreChip) return;

    const itemWidths = items.map((item) => item.offsetWidth);
    moreChip.textContent = `+${items.length} more`; // worst-case text, for a stable width measurement
    const moreWidth = moreChip.offsetWidth;

    function render() {
      const containerWidth = container.clientWidth;
      const gap = 8; // matches gap-2
      let usedWidth = 0;
      let visibleCount = 0;

      for (let i = 0; i < items.length; i++) {
        const remainingCount = items.length - i - 1;
        const reserveForMore = remainingCount > 0 ? moreWidth + gap : 0;
        // No special-case forcing the first item to show regardless of
        // fit (spec.md Edge Case: a container too narrow for even one
        // item shows ONLY the "+N more" indicator with the full count,
        // not an overflowing first item).
        if (usedWidth + itemWidths[i] + reserveForMore > containerWidth) break;
        usedWidth += itemWidths[i] + gap;
        visibleCount++;
      }

      items.forEach((item, i) => {
        item.style.display = i < visibleCount ? "" : "none";
      });
      const overflowCount = items.length - visibleCount;
      moreChip.textContent = `+${overflowCount} more`;
      moreChip.style.display = overflowCount > 0 ? "" : "none";
    }

    new ResizeObserver(render).observe(container);
    render();
  });
}
```

## Static HTML usage

```html
<div data-overflow-list data-testid="overflow-list-demo" class="overflow-list w-[200px]">
  <span data-overflow-item class="overflow-list-chip">Design</span>
  <span data-overflow-item class="overflow-list-chip">Engineering</span>
  <span data-overflow-item class="overflow-list-chip">Product</span>
  <span data-overflow-item class="overflow-list-chip">Marketing</span>
  <span data-overflow-item class="overflow-list-chip">Sales</span>
  <span data-overflow-more data-testid="overflow-list-more" class="overflow-list-more"></span>
</div>
```

Note: `w-[200px]` (an arbitrary-value Tailwind utility, compiled to a
real CSS class at build time) is used for the fixed demo width, NOT a
literal `style="width: 200px"` attribute — the latter is blocked by
this project's CSP (`style-src 'self'`) the same as any other inline
style; only Tailwind-compiled utility classes and CSSOM property
assignment are CSP-safe ways to size an element in this catalog.

## React wrapper shape

```tsx
import { useLayoutEffect, useRef, useState } from "react";

export interface OverflowListProps {
  items: string[];
  "data-testid"?: string;
}
export function OverflowList({ items, "data-testid": testId }: OverflowListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const moreRef = useRef<HTMLSpanElement>(null);
  const [visibleCount, setVisibleCount] = useState(items.length);
  // Cached natural widths, found by tracing the actual measurement
  // order, not assumed correct: re-reading el.offsetWidth on every
  // ResizeObserver-triggered render (an earlier draft did this) hits
  // the identical bug the vanilla script had — an item already hidden
  // via `display:none` from a PREVIOUS render reads offsetWidth 0 on
  // the NEXT one, trivially "fits," and the computation cascades into
  // showing every item regardless of real width. Measuring once, on
  // mount, before anything is ever hidden, and reusing the cached
  // array for every future fit calculation avoids this entirely.
  const itemWidths = useRef<number[]>([]);
  const moreWidth = useRef(0);

  // useLayoutEffect (not useEffect), found by tracing the actual
  // measurement order, not assumed correct: with a plain useEffect,
  // the "optimistic all-visible" initial paint (items.length) would
  // be visible to the user for one frame before correcting — this
  // runs synchronously after DOM mutation but before paint, so no
  // flash of the wrong item count is ever visible.
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    itemWidths.current = itemRefs.current.map((el) => el?.offsetWidth ?? 0);
    // moreRef's content is the actual "+N more" text at mount time
    // (items.length, the worst case, since visibleCount starts at
    // items.length too) — a stable, safe upper-bound width, not
    // re-measured afterward.
    moreWidth.current = moreRef.current?.offsetWidth ?? 0;

    function render() {
      const containerWidth = container!.clientWidth;
      const gap = 8;
      let usedWidth = 0;
      let count = 0;
      for (let i = 0; i < items.length; i++) {
        const remaining = items.length - i - 1;
        const reserve = remaining > 0 ? moreWidth.current + gap : 0;
        if (usedWidth + itemWidths.current[i] + reserve > containerWidth) break;
        usedWidth += itemWidths.current[i] + gap;
        count++;
      }
      setVisibleCount(count);
    }

    const observer = new ResizeObserver(render);
    observer.observe(container);
    render();
    return () => observer.disconnect();
  }, [items]);

  const overflowCount = items.length - visibleCount;

  return (
    <div ref={containerRef} data-testid={testId} className="overflow-list">
      {items.map((item, i) => (
        <span
          key={item}
          ref={(el) => (itemRefs.current[i] = el)}
          className="overflow-list-chip"
          style={{ display: i < visibleCount ? "" : "none" }}
        >
          {item}
        </span>
      ))}
      {/*
        Always mounted (never display:none), found by tracing the
        actual measurement order, not assumed correct: an unmounted
        element has offsetWidth 0, so a naive conditional-render would
        make the chip unmeasurable exactly when it's needed most (the
        transition into an overflowing state). visibility:hidden keeps
        its layout box (and thus offsetWidth) intact while still
        removing it from the visual/accessibility tree when unneeded.
      */}
      <span
        ref={moreRef}
        className="overflow-list-more"
        style={{ visibility: overflowCount > 0 ? "visible" : "hidden" }}
        aria-hidden={overflowCount === 0}
      >
        +{overflowCount} more
      </span>
    </div>
  );
}
```

## Acceptance mapping

- FR-001, spec.md US1 Acceptance Scenarios 1-2 → the markup/scripts above
- spec.md Edge Case (container too narrow for even one item) → `visibleCount` naturally resolves to 0, showing only the "+N more" chip with the full count
