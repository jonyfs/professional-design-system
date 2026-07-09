import type { Config } from "tailwindcss";
import { colors, borderRadius, fontFamily } from "../../shared/design-tokens";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: { colors, borderRadius, fontFamily },
  },
  plugins: [],
} satisfies Config;
