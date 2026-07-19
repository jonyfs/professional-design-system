# @professional-design-system/react

React + TypeScript components for [professional-design-system](https://github.com/jonyfs/professional-design-system) — 137 components (buttons, forms, navigation, overlays, data display, and Recharts-based charts), built with `tsup` (ESM + CJS + `.d.ts`) and shipped with a self-contained, pre-compiled stylesheet.

## Install

```bash
npm install @professional-design-system/react
```

Requires React 18 (`^18.0.0` peer dependency — React 19 is not yet declared as supported; if you're on 19, `npm install --legacy-peer-deps` currently works in practice but is not an officially verified combination).

## Usage

```tsx
import { Button, Modal } from "@professional-design-system/react";
import "@professional-design-system/react/styles.css";

function Example() {
  return <Button variant="primary">Save</Button>;
}
```

Every component's props are typed and exported (`ButtonProps`, `ModalProps`, etc.) — see [`src/index.ts`](./src/index.ts) for the full barrel export, or each component's own `.tsx` file for its prop JSDoc.

## Setup requirements (read this before filing an issue)

- **The stylesheet is a separate import.** `import "@professional-design-system/react/styles.css"` must run once, anywhere in your app's entry point. It is fully self-contained pre-compiled CSS — no Tailwind installation is required in your project, and none of its classes need a build step of yours to resolve.
- **Theming is runtime, via a `data-theme` attribute, not a prop.** Every component reads its colors from CSS custom properties scoped under `[data-theme="..."]` selectors on `<html>`. To switch themes at runtime:

  ```js
  document.documentElement.dataset.theme = "dim"; // or any of the 43 curated theme ids
  ```

  With no `data-theme` attribute set, components render the default ("light") theme. There is no React prop or context provider for this — it is a plain DOM attribute, so it works identically whether your app uses React state, a cookie, `localStorage`, or `prefers-color-scheme` to decide which theme to apply.
- **`Modal`/`SlideOver` accept a `triggerRef` prop** (recommended when the trigger is a `<Button>`) so focus reliably returns to the trigger on close across browsers, including WebKit, which does not focus a `<button>` on mouse click the way Chromium/Firefox do.

## Build from source

```bash
npm run build --workspace packages/react
npm run typecheck --workspace packages/react
```

`tests/react-harness/` (in the monorepo, not part of this package) is a dev-only Vite app used exclusively to exercise these components under Playwright — it has no bearing on this package's published runtime behavior.

## Publishing

See [`docs/PUBLISHING.md`](https://github.com/jonyfs/professional-design-system/blob/main/docs/PUBLISHING.md) in the monorepo for the versioning and publish process.

## Changelog

See [`CHANGELOG.md`](./CHANGELOG.md).

## License

MIT © professional-design-system contributors — see [`LICENSE`](./LICENSE).
