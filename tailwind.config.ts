import type { Config } from "tailwindcss";
import { colors, borderRadius, fontFamily } from "./shared/design-tokens";

// Semantic token theme, mapped 1:1 to .specify/memory/constitution.md (v1.3.1)
// "Design Foundations: Tokens, Typography & Grid". Do not add raw palette
// colors here — every color a component needs must be a named semantic token
// from the constitution's Base Semantic Palette (Principle IV).
//
// Values live in shared/design-tokens.ts (feature 004) so this config and
// packages/react/tailwind.config.ts can't silently drift from each other.
export default {
  content: ["./index.html", "./src/**/*.html", "./tests/e2e/fixtures/*.html"],
  theme: {
    extend: { colors, borderRadius, fontFamily },
  },
  plugins: [],
} satisfies Config;
