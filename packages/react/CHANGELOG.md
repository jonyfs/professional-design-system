# Changelog

All notable changes to `@professional-design-system/react` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- `LICENSE` (MIT), `README.md`, and this changelog — the package previously had none of the three, which blocked genuine external adoption (feature 048).
- `repository` field in `package.json` pointing to this monorepo's `packages/react` directory.

### Fixed

- **Runtime theme switching (`data-theme` attribute) now actually works.** Previously, `dist/styles.css` only ever shipped the default/light theme's color values (a deliberate scope decision from an earlier feature, documented in a since-removed comment) — switching `data-theme` silently did nothing for any npm consumer, even though the same mechanism works fully on the main component-catalog site. Found via feature 048's real external-consumption verification (a component installed and rendered in a project outside this monorepo, confirming `--color-brand-dark` was byte-identical between `data-theme="light"` and `data-theme="dim"`). Fixed by importing the full 43-theme stylesheet (`src/styles/themes.css`) instead of hand-copying a single theme's values — closes a real functional gap, not just a documentation one.

## [0.1.0]

Initial published state at the time feature 048 began verifying external consumption (no prior version had been formally released or changelogged). Covers 137 components across buttons, forms, navigation, overlays, data display, and Recharts-based charts, with:

- ESM + CJS + `.d.ts` builds via `tsup`.
- A self-contained, pre-compiled `dist/styles.css` (no consumer-side Tailwind build required).
- `^18.0.0` peer dependency on React and React DOM.
