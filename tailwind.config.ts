import type { Config } from "tailwindcss";
import {
  colors,
  borderRadius,
  fontFamily,
  transitionDuration,
  transitionTimingFunction,
} from "./shared/design-tokens";

// Semantic token theme, mapped 1:1 to .specify/memory/constitution.md (v1.3.1)
// "Design Foundations: Tokens, Typography & Grid". Do not add raw palette
// colors here — every color a component needs must be a named semantic token
// from the constitution's Base Semantic Palette (Principle IV).
//
// Values live in shared/design-tokens.ts (feature 004) so this config and
// packages/react/tailwind.config.ts can't silently drift from each other.
export default {
  // src/scripts/**/*.js added for feature 017's theme-gallery.js: the
  // first script in this catalog to GENERATE markup with class names
  // (.theme-card-swatches/.theme-card-swatch) that never appear as
  // literal text in any scanned .html file — without this, Tailwind's
  // content-based tree-shaking silently drops those two @layer
  // components rules from the compiled CSS entirely (found by visually
  // inspecting a rendered theme card: the swatch elements existed in the
  // DOM with the correct CSSOM-set background-color, but rendered at
  // zero size because their own rule literally wasn't in the stylesheet).
  content: [
    "./index.html",
    "./src/**/*.html",
    "./src/scripts/**/*.js",
    "./tests/e2e/fixtures/*.html",
  ],
  theme: {
    extend: { colors, borderRadius, fontFamily, transitionDuration, transitionTimingFunction },
  },
  plugins: [],
} satisfies Config;
