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
  safelist: ["toast-stack"],
  theme: {
    extend: { colors, borderRadius, fontFamily },
  },
  plugins: [],
} satisfies Config;
