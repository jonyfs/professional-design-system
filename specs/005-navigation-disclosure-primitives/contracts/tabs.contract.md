# Component Contract: Tabs

## Markup contract

```html
<div data-testid="tabs" data-tabs>
  <div role="tablist" aria-label="Product information" class="tabs-list">
    <button
      type="button"
      role="tab"
      id="tab-details"
      aria-controls="panel-details"
      aria-selected="true"
      tabindex="0"
      class="tab-trigger"
      data-testid="tab-details"
    >
      Details
    </button>
    <button
      type="button"
      role="tab"
      id="tab-reviews"
      aria-controls="panel-reviews"
      aria-selected="false"
      tabindex="-1"
      class="tab-trigger"
      data-testid="tab-reviews"
    >
      Reviews
    </button>
    <button
      type="button"
      role="tab"
      id="tab-shipping"
      aria-controls="panel-shipping"
      aria-selected="false"
      tabindex="-1"
      class="tab-trigger"
      data-testid="tab-shipping"
    >
      Shipping
    </button>
  </div>
  <div id="panel-details" role="tabpanel" aria-labelledby="tab-details" tabindex="0" class="tab-panel" data-testid="panel-details">
    <p>Full product specifications and materials.</p>
  </div>
  <div id="panel-reviews" role="tabpanel" aria-labelledby="tab-reviews" tabindex="0" class="tab-panel" hidden data-testid="panel-reviews">
    <p>Customer reviews and ratings.</p>
  </div>
  <div id="panel-shipping" role="tabpanel" aria-labelledby="tab-shipping" tabindex="0" class="tab-panel" hidden data-testid="panel-shipping">
    <p>Shipping options and estimated delivery times.</p>
  </div>
</div>
```

## Behavior wiring (`src/scripts/tabs.js`)

```js
export function initTabs() {
  document.querySelectorAll("[data-tabs]").forEach((root) => {
    const tabs = Array.from(root.querySelectorAll('[role="tab"]'));
    const panels = tabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));

    function select(index) {
      tabs.forEach((tab, i) => {
        const selected = i === index;
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;
        panels[i].hidden = !selected;
      });
      tabs[index].focus();
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => select(index));
      tab.addEventListener("keydown", (event) => {
        const lastIndex = tabs.length - 1;
        if (event.key === "ArrowRight") select(index === lastIndex ? 0 : index + 1);
        else if (event.key === "ArrowLeft") select(index === 0 ? lastIndex : index - 1);
        else if (event.key === "Home") select(0);
        else if (event.key === "End") select(lastIndex);
        else return;
        event.preventDefault();
      });
    });
  });
}
```

Each `[data-tabs]` root is wired independently, so multiple Tabs instances
can coexist on one page with zero per-instance script. Note the wiring
*shape* differs from `overlay.js`'s `[data-dialog-trigger]` convention
(`/speckit-analyze` caught an earlier draft's inaccurate claim that these
matched): `overlay.js` wires per-*trigger*, with the attribute's value
naming a target dialog `id` to look up (`data-dialog-trigger="dialogId"`);
`tabs.js` wires per-*root-container*, using a presence-only flag
(`data-tabs`, no value) and discovering its tabs/panels by querying inside
that root. `dropdown-menu.js` (below) is actually closer to `tabs.js`'s
presence-only-flag shape than to `overlay.js`'s — the project has settled
into two conventions, not the one this earlier draft claimed.

## Required attributes (Principle II gate, FR-005/FR-006/FR-007)

| Behavior | Mechanism |
|---|---|
| Tab/panel association | `aria-controls` (tab → panel), `aria-labelledby` (panel → tab) |
| Selected state announced | `aria-selected="true"/"false"` on each tab |
| Roving tabindex (only selected tab in Tab order) | `tabindex="0"` on selected, `tabindex="-1"` on the rest — `tabs.js` |
| Arrow-key navigation | Left/Right move between adjacent tabs (wrapping), Home/End jump to first/last — `tabs.js` |
| Exactly one panel visible | `hidden` attribute toggled on non-selected panels — `tabs.js` |
| Panel reachable by Tab key after activation | `tabindex="0"` on every `tabpanel` (WAI-ARIA APG convention — lets a keyboard user Tab directly from the tab into its panel's content, or into the panel itself if the panel has no focusable children) |

## Required states (Principle V gate)

| Element | State | Required utility |
|---|---|---|
| `.tab-trigger` | resting (unselected) | `text-neutral-600` |
| `.tab-trigger` | hover | `hover:text-neutral-700 hover:border-neutral-300` |
| `.tab-trigger` | active | `active:text-neutral-800` |
| `.tab-trigger` | selected | `border-brand text-neutral-900` (via `[aria-selected="true"]` attribute selector, data-model.md) |
| `.tab-trigger` | focus-visible | `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand` |
| `.tab-trigger` | disabled | `disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-transparent` |

Resting color is `text-neutral-600`, not the originally-drafted
`text-neutral-500` — a real `@axe-core/playwright` scan against the
rendered page failed AAA (4.83:1); `text-neutral-600` measures 7.56:1 (see
data-model.md's AAA contrast correction note). `active:`/`disabled:` are
declared per Principle V's unconditional mandate for any `<button>`
(FR-013, corrected after `/speckit-analyze`) even though this slice's own
acceptance scenarios don't exercise either state directly — an earlier
draft of this contract omitted them on the reasoning that no scenario
needed them, which is exactly the "where applicable" hedge
`/speckit-analyze` found and spec.md's FR-013 no longer permits.
`disabled:` uses the literal `opacity-50`/`cursor-not-allowed` pattern
(not a custom color), matching the pattern every other disabled
declaration in this project uses without exception (a second
`/speckit-analyze` pass caught an earlier draft's unjustified deviation).

## Edge case — narrow-viewport tab-row overflow

Per spec.md's Edge Cases, on a narrow viewport where tab labels would
overflow `.tabs-list`'s container: `.tabs-list` allows horizontal
scrolling (`overflow-x-auto` + `flex` with no `flex-wrap`, so tabs stay on
one row and the row scrolls rather than wrapping — wrapping a `tablist`
would visually break the single-row tab metaphor the WAI-ARIA pattern
assumes) rather than truncating tab labels, keeping every tab's full label
readable and reachable via horizontal scroll or arrow-key navigation
(which still works identically regardless of scroll position).
`overflow-x-auto` is part of `.tabs-list`'s own canonical composition in
data-model.md, not just this prose — the two artifacts previously
disagreed (`/speckit-analyze` caught it) and now match.

## Token allowlist used

`text-neutral-600` (unselected tab, corrected from the originally-drafted
`text-neutral-500` after a real AAA contrast failure), `text-neutral-700`
(unselected tab hover), `text-neutral-900` (selected tab label), `border-brand` (selected
tab underline — non-textual reuse of the `brand` token, same pattern as
Toggle's `bg-brand`), `border-neutral-300` (unselected tab hover
underline), `border-neutral-200` (tab list baseline rule), `text-neutral-600`
(panel body copy). No raw palette classes (FR-011).

## Acceptance mapping

- FR-005, FR-006, FR-007, FR-011, FR-012, FR-013, FR-015 → this contract
- SC-001, SC-002, SC-003, SC-004, SC-005 → verified by
  `tests/e2e/tabs.spec.ts`, `scripts/audit-tokens.mjs`,
  `scripts/check-contrast.mjs`
