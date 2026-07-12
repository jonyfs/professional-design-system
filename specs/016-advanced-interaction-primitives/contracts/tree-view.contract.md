# Component Contract: TreeView

## Markup contract

```html
<ul class="tree-view">
  <li>
    <details open>
      <summary class="tree-view-summary">src</summary>
      <ul class="tree-view-children">
        <li>
          <details open>
            <summary class="tree-view-summary">components</summary>
            <ul class="tree-view-children">
              <li>
                <details>
                  <summary class="tree-view-summary">form</summary>
                  <ul class="tree-view-children">
                    <li class="tree-view-leaf">text-input.html</li>
                    <li class="tree-view-leaf">select.html</li>
                  </ul>
                </details>
              </li>
              <li class="tree-view-leaf">button.html</li>
              <li class="tree-view-leaf">badge.html</li>
            </ul>
          </details>
        </li>
        <li class="tree-view-leaf">styles.css</li>
      </ul>
    </details>
  </li>
  <li class="tree-view-leaf">README.md</li>
</ul>
```

Four levels of nesting shown above (`src` → `components` → `form` → its
leaves) — spec.md's own Edge Cases section names "4+ levels" explicitly as
a case to verify, not merely 3 (a `/speckit-analyze` finding, F1).

```css
.tree-view {
  @apply space-y-1 text-sm text-neutral-900;
}
.tree-view-children {
  @apply mt-1 space-y-1 border-l border-neutral-200 pl-4;
}
.tree-view-summary {
  @apply cursor-pointer select-none rounded-sm px-1 py-0.5 marker:text-neutral-400
    hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2
    focus-visible:outline-offset-2 focus-visible:outline-brand;
}
.tree-view-leaf {
  @apply px-1 py-0.5 pl-5 text-neutral-600;
}
```

Recursively nested native `<details>/<summary>`, zero JavaScript (research.md
R1) — confirmed via a real Chromium accessibility-tree inspection (Chrome
DevTools Protocol's `Accessibility.getFullAXTree`) that `<summary>` is
exposed with role `DisclosureTriangle`, `focusable=true`, and an `expanded`
property tracking that exact `<details>` element's own `open` state
independently of any ancestor — a nested branch's own collapsed/expanded
state is genuinely its own, not coupled to its parent. `<ul>`-nested `<li>`
elements automatically expose a `level` property matching visual nesting
depth. No ARIA attribute is added anywhere; native semantics were found
fully sufficient. Indentation is `border-l border-neutral-200 pl-4` per
nesting level (the connector line is the same accepted decorative-border
exception as Stepper/Timeline, not a new contrast gap). Leaf nodes
(`.tree-view-leaf`) render as plain `<li>` text with no `<details>`
wrapper and no disclosure affordance — a node with nothing to expand MUST
NOT show one (spec.md Edge Cases).

**Contrast note on `marker:text-neutral-400`** (a `/speckit-analyze`
finding, F2): the native disclosure-triangle marker glyph is decorative
only — the same class of accepted decorative-color exception as Rating's
star glyphs (research.md R2) and Stepper's/Timeline's connector lines
(feature 015 research.md R7) — the branch's real expand/collapse state is
carried by the browser's own native semantics (R1), never by the marker's
color alone. `neutral-400` is not scored in the same way `check-
contrast.mjs`'s `PAIRINGS`/`RING_PAIRINGS` arrays score text/ring pairings
(it is not currently one of that script's tracked `BASE_TOKENS`, a
pre-existing gap this feature inherits rather than introduces — the same
token is already used unaudited elsewhere in this catalog, e.g. Empty
State's icon, List's chevron).

## Required classes (Principle V gate)

| State | Required utility |
|---|---|
| focus-visible (on `<summary>`) | `focus-visible:outline outline-2 outline-offset-2 outline-brand` |

Leaf nodes are non-interactive — no state suffixes apply to
`.tree-view-leaf`.

## Required attributes

- `<details open>` on any branch that should render pre-expanded; omit
  `open` for a pre-collapsed default
- No custom ARIA attributes — confirmed unnecessary via R1

## Token allowlist used

`text-neutral-900`, `text-neutral-600`, `text-neutral-400`,
`border-neutral-200`, `outline-brand` — all already-ratified, reused
verbatim. No new tokens.

## Acceptance mapping

- FR-001, FR-002, SC-001 → `tests/e2e/tree-view.spec.ts`
