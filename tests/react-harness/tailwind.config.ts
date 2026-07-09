import type { Config } from "tailwindcss";
import { colors, borderRadius, fontFamily } from "../../shared/design-tokens";

// The harness's OWN Tailwind build — separate from packages/react's.
// The package's compiled styles.css only contains classes used INSIDE the
// library's components (.btn-primary, etc.); the harness demo pages use
// plain Tailwind utilities for their own page layout/chrome (mt-8, flex,
// gap-4...), which need their own compilation, same as any real consumer
// app would need its own Tailwind setup. Same shared token source as
// every other config in this repo — no separate hand-typed values.
export default {
  content: ["./*.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: { colors, borderRadius, fontFamily },
  },
  plugins: [],
} satisfies Config;
