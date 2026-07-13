// Single source of truth for this design system's ratified color, border-
// radius, and font-family tokens (.specify/memory/constitution.md's Base
// Semantic Palette). Both the root tailwind.config.ts (static gallery) and
// packages/react/tailwind.config.ts (React package) import this file rather
// than each declaring the same literals inline — a direct extraction, not a
// new schema, of what tailwind.config.ts already had (feature 004's
// research.md: two independently hand-typed copies of the same hex values
// is exactly the kind of drift this project's own /speckit-analyze passes
// have caught repeatedly).
//
// Values are RGB triplets (not hex) consumed via `rgb(var(--color-x) /
// <alpha-value>)` in tailwind.config.ts (feature 017 research.md R1). This
// is what lets `src/styles/themes.css` swap every token's actual color at
// runtime via a `[data-theme="..."]` custom-property block, while Tailwind
// opacity modifiers (`bg-success/5`) keep working correctly — a plain
// `var(--x)` without the RGB-tuple decomposition would break those
// modifiers. The "light" theme below is the pure-refactor baseline: same
// values as the previous hex literals, just re-expressed as RGB triplets.
export const colors = {
  brand: {
    light: "rgb(var(--color-brand-light) / <alpha-value>)",
    DEFAULT: "rgb(var(--color-brand) / <alpha-value>)",
    dark: "rgb(var(--color-brand-dark) / <alpha-value>)",
  },
  neutral: {
    50: "rgb(var(--color-neutral-50) / <alpha-value>)",
    100: "rgb(var(--color-neutral-100) / <alpha-value>)",
    200: "rgb(var(--color-neutral-200) / <alpha-value>)",
    300: "rgb(var(--color-neutral-300) / <alpha-value>)",
    400: "rgb(var(--color-neutral-400) / <alpha-value>)",
    500: "rgb(var(--color-neutral-500) / <alpha-value>)",
    600: "rgb(var(--color-neutral-600) / <alpha-value>)",
    700: "rgb(var(--color-neutral-700) / <alpha-value>)",
    800: "rgb(var(--color-neutral-800) / <alpha-value>)",
    900: "rgb(var(--color-neutral-900) / <alpha-value>)",
  },
  success: {
    DEFAULT: "rgb(var(--color-success) / <alpha-value>)",
    strong: "rgb(var(--color-success-strong) / <alpha-value>)",
  },
  warning: {
    DEFAULT: "rgb(var(--color-warning) / <alpha-value>)",
    strong: "rgb(var(--color-warning-strong) / <alpha-value>)",
  },
  error: {
    DEFAULT: "rgb(var(--color-error) / <alpha-value>)",
    strong: "rgb(var(--color-error-strong) / <alpha-value>)",
  },
  info: {
    DEFAULT: "rgb(var(--color-info) / <alpha-value>)",
    strong: "rgb(var(--color-info-strong) / <alpha-value>)",
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

// The complete set of --color-* custom properties every theme block in
// src/styles/themes.css MUST declare (feature 017 contracts/theme-tokens
// .contract.md's completeness requirement, enforced by
// scripts/check-contrast.mjs's T009a check). 21 properties total.
export const REQUIRED_THEME_PROPERTIES = [
  "--color-brand-light",
  "--color-brand",
  "--color-brand-dark",
  "--color-neutral-50",
  "--color-neutral-100",
  "--color-neutral-200",
  "--color-neutral-300",
  "--color-neutral-400",
  "--color-neutral-500",
  "--color-neutral-600",
  "--color-neutral-700",
  "--color-neutral-800",
  "--color-neutral-900",
  "--color-success",
  "--color-success-strong",
  "--color-warning",
  "--color-warning-strong",
  "--color-error",
  "--color-error-strong",
  "--color-info",
  "--color-info-strong",
];

// Feature 017 (Curated Theme Presets) — the hex source of truth for every
// theme's palette. scripts/check-contrast.mjs audits these hex values
// directly (loops PAIRINGS/RING_PAIRINGS per theme); src/styles/themes.css's
// RGB-triplet `[data-theme="..."]` blocks are hand-derived from these same
// values and MUST stay in sync (T009a's completeness check + the contrast
// audit are what catch drift, not a build-time codegen step — see
// research.md R1/R2 for why the CSS layer is authored directly rather than
// generated).
export interface ThemeTokens {
  "brand-light": string;
  brand: string;
  "brand-dark": string;
  "neutral-50": string;
  "neutral-100": string;
  "neutral-200": string;
  "neutral-300": string;
  "neutral-400": string;
  "neutral-500": string;
  "neutral-600": string;
  "neutral-700": string;
  "neutral-800": string;
  "neutral-900": string;
  success: string;
  "success-strong": string;
  warning: string;
  "warning-strong": string;
  error: string;
  "error-strong": string;
  info: string;
  "info-strong": string;
}

export interface ThemeDefinition {
  id: string;
  displayName: string;
  moodFamily: string;
  sourceReference: string;
  isDefault?: boolean;
  tokens: ThemeTokens;
}

export const THEMES: ThemeDefinition[] = [
  {
    id: "light",
    displayName: "Light",
    moodFamily: "Light Professional",
    sourceReference:
      "This design system's original, pre-existing default palette — the pure-refactor baseline for feature 017's architecture migration.",
    isDefault: true,
    tokens: {
      "brand-light": "#E6F0FF",
      brand: "#0066FF",
      "brand-dark": "#004BB3",
      // neutral-50 is the theme-invertible "surface/page background" role
      // (feature 017 research.md addendum, found during implementation:
      // nothing in the original 21 tokens controlled the page's own
      // background — every component hardcoded literal `bg-white` — which
      // would leave dark themes with dark accent colors on an unchanged
      // white page). Set to true white here so this retrofit is a zero-
      // visual-change rename for the pre-existing light theme; the
      // "subtle highlight, one step off the page background" role that
      // USED to live at neutral-50 (#F9FAFB) moved to neutral-100.
      "neutral-50": "#FFFFFF",
      "neutral-100": "#F3F4F6",
      "neutral-200": "#E5E7EB",
      "neutral-300": "#D1D5DB",
      "neutral-400": "#9CA3AF",
      "neutral-500": "#6B7280",
      "neutral-600": "#4B5563",
      "neutral-700": "#374151",
      "neutral-800": "#1F2937",
      "neutral-900": "#111827",
      success: "#10B981",
      "success-strong": "#065F46",
      warning: "#F59E0B",
      "warning-strong": "#78350F",
      error: "#EF4444",
      "error-strong": "#991B1B",
      info: "#3B82F6",
      "info-strong": "#1E40AF",
    },
  },
];
