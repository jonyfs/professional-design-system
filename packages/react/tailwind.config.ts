import type { Config } from "tailwindcss";
import { colors, borderRadius, fontFamily } from "../../shared/design-tokens";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  // `.toast-stack` is a consumer-facing layout utility per
  // contracts/003-overlays-modal-toast/toast.contract.md — it's meant to be
  // applied to the CONSUMER's own multi-toast wrapper div, so no component
  // inside packages/react/src ever references it itself. Tailwind's content
  // scanner only retains @layer components classes it can find a literal
  // usage of within `content` above; without a usage, it silently drops
  // the rule as unused (found by the harness's toast-stack layout
  // rendering with no flex/gap applied — `display: block` instead of
  // `flex`, confirmed the compiled CSS had no `.toast-stack` rule at all).
  //
  // Same root cause hits `sidebar-{light,dark}` / `sidebar-item-{light,dark}`:
  // Sidebar.tsx builds them via a template literal (`sidebar-${theme}`), so
  // the scanner never sees the literal class names and purges all four from
  // dist/styles.css — found via the Claude Design sync's preview capture
  // (Sidebar's dark-theme preview rendered identically to light), confirmed
  // by grepping the compiled CSS. This was a real, currently-shipping bug:
  // every consumer passing `theme="dark"` (or explicit `theme="light"`) got
  // an unstyled sidebar in production, not just a sync-preview artifact.
  safelist: ["toast-stack", "sidebar-light", "sidebar-dark", "sidebar-item-light", "sidebar-item-dark"],
  theme: {
    extend: { colors, borderRadius, fontFamily },
  },
  plugins: [],
} satisfies Config;
