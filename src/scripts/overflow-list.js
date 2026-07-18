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
// real width — a real, reproducible bug, not a hypothetical one (it
// was triggered by this component's OWN two-pass initialization
// sequence, and would have recurred on every subsequent resize event
// too, since items visible/hidden state persists across renders).
// Fixed by measuring each item's natural width exactly ONCE, before
// anything is ever hidden, and reusing that cached value for every
// future fit calculation — the chip content changes ("+N more" text
// varies), so its widest plausible width (assuming the full item
// count could overflow) is measured once and reused too, a safe,
// deterministic upper-bound estimate that never needs to be
// re-measured against a state that render() itself may have altered.
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
        // item shows ONLY the "+N more" indicator with the full count).
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
