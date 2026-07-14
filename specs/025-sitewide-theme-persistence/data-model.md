# Phase 1 Data Model: Sitewide Theme Selector & Persistence

This feature introduces no new data entities — it is a rollout of
feature 017/021's existing entities to more pages.

## Gallery Page (scope entity, not a data entity)

- **path**: the static HTML file's location under `src/components/**/
  *.html`, or the root `index.html`.
- **has_activation_script**: boolean — whether `theme-switcher.js` is
  loaded in `<head>` (this feature's rollout target: false → true for
  77 pages).
- **has_selector_markup**: boolean — whether the `#gallery-theme-select`
  block is present (same rollout target).
- **has_selector_script**: boolean — whether
  `gallery-theme-selector.js` is loaded before `</body>` (same rollout
  target).

## Active Theme (existing entity, feature 017 — unchanged)

- **id**: the current theme's identifier, persisted in `localStorage`
  under the `pds-theme` key.
- Shared identically across every Gallery Page once this feature
  ships — the entity itself doesn't change, only how many pages
  observe/mutate it.
