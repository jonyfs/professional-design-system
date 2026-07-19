# Quickstart: Verifying External Package Consumption

Runnable validation steps proving User Story 1/2's Independent Tests and Success Criteria SC-001 through SC-005. Run from the repo root unless noted.

## §1: Build and pack the current package state

```bash
npm run build --workspace packages/react
npm run typecheck --workspace packages/react
npm pack --workspace packages/react --pack-destination /tmp
# Produces something like /tmp/professional-design-system-react-0.1.0.tgz
```

**Expected outcome**: build and typecheck both succeed with no errors; a `.tgz` tarball is produced.

## §2: Create a throwaway external consumer project (outside this repo's workspaces)

```bash
cd /tmp   # or this session's scratchpad — anywhere NOT under this repo
npm create vite@latest external-consumer-verify -- --template react-ts
cd external-consumer-verify
npm install
npm install /tmp/professional-design-system-react-0.1.0.tgz
```

**Expected outcome**: installation succeeds. `npm ls react react-dom` inside this new project shows only the versions this project itself declared (React 18.x) — confirming the package's peer-dependency declaration didn't pull in a conflicting duplicate React copy.

## §3: Import and render a component (FR-001, SC-001)

Edit the scaffold's `src/App.tsx`:

```tsx
import { Button, Modal } from "@professional-design-system/react";
import "@professional-design-system/react/styles.css";

function App() {
  return <Button variant="primary">It works</Button>;
}

export default App;
```

```bash
npm run dev
```

**Expected outcome**: opening the dev server in a browser shows a correctly-styled button (brand color, correct padding/radius/typography) — not an unstyled HTML `<button>`. No console errors about missing modules or unresolved imports.

## §4: Exercise theming and interactive states (Acceptance Scenario 3)

In the browser console:

```js
document.documentElement.dataset.theme = "dim";
```

**Expected outcome**: the button re-colors to its dark-theme variant with no reload — proving the runtime `data-theme` mechanism works identically outside the monorepo. Hovering/focusing the button shows its designed hover/focus states, matching this repo's own showcase.

## §5: Confirm CSS is genuinely self-contained for non-Tailwind consumers (Edge Case)

```bash
grep -c "@tailwind\|@apply\|@layer" node_modules/@professional-design-system/react/styles.css
```

**Expected outcome**: `0` — confirms the installed stylesheet has zero unprocessed Tailwind at-rules; a consumer project with no Tailwind CSS installed at all still gets correct styling (research.md R6).

## §6: Confirm documentation matches reality (FR-004, SC-004)

```bash
node -e "console.log(Object.keys(require('/tmp/external-consumer-verify/node_modules/@professional-design-system/react/dist/index.cjs')).length)"
```

**Expected outcome**: the printed export count matches the count stated in `packages/react/README.md` and the root `README.md`'s "React package" section — no stale figures.

## §7: Confirm the publish runbook is followable (FR-006, SC-005)

Read `docs/PUBLISHING.md` start to finish without running the final `npm publish` step (which requires real registry credentials this session doesn't hold) — confirm every step up to that point (version bump, changelog update, build, typecheck) is unambiguous and actually executable from a clean checkout.

## Cleanup

```bash
rm -rf /tmp/external-consumer-verify /tmp/professional-design-system-react-*.tgz
```

The external consumer project is a verification mechanism, not a shipped artifact (data-model.md) — it must not be committed to this repository.
