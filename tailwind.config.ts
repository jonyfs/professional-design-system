import type { Config } from "tailwindcss";

// Semantic token theme, mapped 1:1 to .specify/memory/constitution.md (v1.3.1)
// "Design Foundations: Tokens, Typography & Grid". Do not add raw palette
// colors here — every color a component needs must be a named semantic token
// from the constitution's Base Semantic Palette (Principle IV).
export default {
  content: ["./index.html", "./src/**/*.html"],
  theme: {
    extend: {
      colors: {
        brand: {
          light: "#E6F0FF",
          DEFAULT: "#0066FF",
          dark: "#004BB3",
        },
        neutral: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
        success: {
          DEFAULT: "#10B981",
          strong: "#065F46",
        },
        warning: {
          DEFAULT: "#F59E0B",
          strong: "#78350F",
        },
        error: {
          DEFAULT: "#EF4444",
          strong: "#991B1B",
        },
        info: "#3B82F6",
      },
      borderRadius: {
        sm: "0.25rem", // 4px — inputs/checkboxes/small tags
        md: "0.5rem", // 8px — buttons/dropdowns/secondary navigation
        lg: "0.75rem", // 12px — cards/modals/panels/primary containers
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
