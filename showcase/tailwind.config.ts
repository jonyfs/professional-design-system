import type { Config } from "tailwindcss";
import { colors, borderRadius, fontFamily } from "../shared/design-tokens";

// Same rationale as tests/react-harness/tailwind.config.ts: the
// package's compiled styles.css only contains classes used INSIDE the
// library's own components — this app's own page chrome (min-h-dvh,
// grid, gap-4...) needs its own Tailwind compilation, same as any real
// consumer app would need.
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: { colors, borderRadius, fontFamily },
  },
  plugins: [],
} satisfies Config;
