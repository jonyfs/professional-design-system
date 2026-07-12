// Single source of truth for this design system's ratified color, border-
// radius, and font-family tokens (.specify/memory/constitution.md's Base
// Semantic Palette). Both the root tailwind.config.ts (static gallery) and
// packages/react/tailwind.config.ts (React package) import this file rather
// than each declaring the same literals inline — a direct extraction, not a
// new schema, of what tailwind.config.ts already had (feature 004's
// research.md: two independently hand-typed copies of the same hex values
// is exactly the kind of drift this project's own /speckit-analyze passes
// have caught repeatedly).

export const colors = {
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
  info: {
    DEFAULT: "#3B82F6",
    strong: "#1E40AF",
  },
};

export const borderRadius = {
  sm: "0.25rem", // 4px — inputs/checkboxes/small tags
  md: "0.5rem", // 8px — buttons/dropdowns/secondary navigation
  lg: "0.75rem", // 12px — cards/modals/panels/primary containers
  full: "9999px", // pills/circles — toggle tracks/dots, avatars
};

export const fontFamily = {
  sans: ["Inter", "system-ui", "sans-serif"],
  mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
};
