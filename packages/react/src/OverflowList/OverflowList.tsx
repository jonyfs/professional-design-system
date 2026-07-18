import { useLayoutEffect, useRef, useState } from "react";

export interface OverflowListProps {
  items: string[];
  "data-testid"?: string;
}

// Feature 034 (contracts/overflow-list.contract.md) — this catalog's
// first ResizeObserver usage. Widths are cached once on mount, not
// re-read on every render — re-reading offsetWidth from an item
// already hidden via display:none from a previous render always
// measures 0, cascading into showing every item regardless of real
// width (a real bug found by running an earlier draft against a live
// browser).
export function OverflowList({ items, "data-testid": testId }: OverflowListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const moreRef = useRef<HTMLSpanElement>(null);
  const [visibleCount, setVisibleCount] = useState(items.length);
  const itemWidths = useRef<number[]>([]);
  const moreWidth = useRef(0);

  // useLayoutEffect, not useEffect: runs synchronously after DOM
  // mutation but before paint, so the optimistic "all visible" initial
  // guess never flashes before the real count is computed.
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    itemWidths.current = itemRefs.current.map((el) => el?.offsetWidth ?? 0);
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
