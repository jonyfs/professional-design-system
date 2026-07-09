# Contract: `packages/react` package shape

## `package.json`

```json
{
  "name": "@professional-design-system/react",
  "version": "0.1.0",
  "private": false,
  "type": "module",
  "module": "dist/index.mjs",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./styles.css": "./dist/styles.css"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "scripts": {
    "build": "tailwindcss -i ./src/styles.css -o ./dist/styles.css --minify && tsup",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "tailwindcss": "^3.4.14",
    "tsup": "^8.0.0",
    "typescript": "^5.6.3"
  }
}
```

`"private": false` deliberately — this package IS meant to be
publishable (even if not actually published to a registry during this
feature), since `design-sync`'s ingestion checks for a real
`module`/`main`/`exports` shape, and a `"private": true` package can
still satisfy that shape but the field itself signals intent accurately.

## `tsup.config.ts`

```ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  external: ["react", "react-dom"],
});
```

## `tailwind.config.ts` (package-local)

```ts
import type { Config } from "tailwindcss";
import { colors, borderRadius } from "../../shared/design-tokens";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: { colors, borderRadius },
  },
} satisfies Config;
```

Imports from `shared/design-tokens.ts` — the same object the root
`tailwind.config.ts` imports — per research.md's shared-token-source
decision. Neither config hand-types the hex values a second time.

## `src/index.ts` (barrel export)

```ts
export { Button } from "./Button/Button";
export type { ButtonProps } from "./Button/Button";
export { TextInput } from "./TextInput/TextInput";
export type { TextInputProps } from "./TextInput/TextInput";
export { Badge } from "./Badge/Badge";
export type { BadgeProps } from "./Badge/Badge";
export { Checkbox } from "./Checkbox/Checkbox";
export type { CheckboxProps } from "./Checkbox/Checkbox";
export { Radio } from "./Radio/Radio";
export type { RadioProps } from "./Radio/Radio";
export { Select } from "./Select/Select";
export type { SelectProps } from "./Select/Select";
export { Toggle } from "./Toggle/Toggle";
export type { ToggleProps } from "./Toggle/Toggle";
export { Modal } from "./Modal/Modal";
export type { ModalProps } from "./Modal/Modal";
export { Toast } from "./Toast/Toast";
export type { ToastProps } from "./Toast/Toast";
export { SlideOver } from "./SlideOver/SlideOver";
export type { SlideOverProps } from "./SlideOver/SlideOver";
```

Named exports only (data-model.md's cross-cutting invariant) — this is
exactly the shape `design-sync`'s converter walks to discover components
(PascalCase named `.d.ts` exports).

## Root `package.json` change

```json
{
  "workspaces": ["packages/*", "tests/react-harness"]
}
```

Added to the existing root `package.json` — the only change needed to
turn on npm workspaces; no other existing script/field changes.
`tests/react-harness` is listed explicitly (not covered by the
`packages/*` glob — it lives under `tests/`, not `packages/`) — found
missing by `/speckit-analyze`: an earlier draft of this contract only
declared `["packages/*"]`, which would have made `npm run dev --workspace
tests/react-harness` (quickstart.md) fail outright, and would have left
the harness's `dependencies: { "@professional-design-system/react":
"workspace:*" }` unresolvable — npm workspace-protocol dependency
resolution only works between declared workspace members.

## Acceptance mapping

- FR-001, FR-002, FR-007 → this contract
- SC-001, SC-002 → verified by `npm run build --workspace packages/react`
  producing the exact files this contract specifies, then a type-parsing
  check (quickstart.md) against the resulting `.d.ts`
