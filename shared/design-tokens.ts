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

// The 7 mood-family categories research.md R3 curated the 42-theme
// selection from, in display order — the single source of truth both
// src/components/theme-gallery/theme-gallery.html's section headings AND
// every ThemeDefinition.moodFamily value must match exactly, so a typo in
// either place can't silently create an 8th "family" or leave a section
// permanently empty.
export const MOOD_FAMILIES = [
  "Light Professional",
  "Warm/Organic Light",
  "Nature/Earth",
  "Cool/Tech Minimal",
  "Dark Moody/Professional",
  "Dark Vibrant/Expressive",
  "Distinctive/Characterful",
] as const;

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
  {
    id: "corporate",
    displayName: "Corporate",
    moodFamily: "Light Professional",
    sourceReference:
      "DaisyUI v5's real, live-fetched corporate.css (packages/daisyui/src/themes/corporate.css) — primary/base/semantic OKLCH values used verbatim as anchors; the neutral-50..900 ramp is OKLCH-interpolated between the real base-100 and base-content anchors (research.md R6, eased t^0.8 for AAA headroom at the mid stops); brand-light/brand/brand-dark/*-strong are derived from the real primary/status OKLCH values by searching for the closest in-gamut lightness that clears this catalog's AAA/WCAG-1.4.11 thresholds against their actual shipped context (see the *-strong dual-role note on 'forest' below), converted to sRGB via a real browser engine (Chromium canvas + 2D context pixel readback, not hand-approximated OKLab math).",
    tokens: {
      "brand-light": "#DFE9F2",
      brand: "#0075C1",
      "brand-dark": "#005795",
      "neutral-50": "#FFFFFF",
      "neutral-100": "#D6D2D4",
      "neutral-200": "#B7B1B6",
      "neutral-300": "#9C959C",
      "neutral-400": "#837C85",
      "neutral-500": "#6B6570",
      "neutral-600": "#54505D",
      "neutral-700": "#3F3C4B",
      "neutral-800": "#2B2A3A",
      "neutral-900": "#181A2A",
      success: "#00A43B",
      "success-strong": "#006000",
      warning: "#FDC700",
      "warning-strong": "#7D4900",
      error: "#F85C60",
      "error-strong": "#A90020",
      info: "#0090B5",
      "info-strong": "#00597D",
    },
  },
  {
    id: "forest",
    displayName: "Forest",
    moodFamily: "Nature/Earth",
    sourceReference:
      "DaisyUI v5's real, live-fetched forest.css — same derivation method as Corporate above. A dark theme (base-100 L=20.84%, color-scheme: dark). KNOWN LIMITATION found during derivation, applies to every dark theme in this batch (forest/dracula/business): this catalog's fixed 21-token schema uses success/warning/error/info-strong (and brand-dark) in two roles that invert for a dark theme — ink-colored TEXT read directly against the page (Badge/Alert/Text-Input-error/Kbd/etc.) needs to be LIGHT on a dark page, but Indicator's solid-fill-behind-white-text usage needs the SAME token to stay DARK. One value can't satisfy both for a genuinely dark theme; the ink-on-page role won (Badge/Alert are far more widely used across this catalog), so Indicator's white-on-*-strong text fails AAA (and in some cases AA) for this theme specifically — a real, deliberate, documented trade-off, not an oversight. brand-dark is the one exception: derived toward the WHITE-TEXT role instead, since Button primary is this catalog's single most central component and must never render invisible white-on-light-fill text.",
    tokens: {
      "brand-light": "#EDF9EE",
      brand: "#1FB854",
      "brand-dark": "#006410",
      "neutral-50": "#1B1717",
      "neutral-100": "#353131",
      "neutral-200": "#4A4646",
      "neutral-300": "#5D5A5A",
      "neutral-400": "#706D6D",
      "neutral-500": "#838080",
      "neutral-600": "#959292",
      "neutral-700": "#A7A5A5",
      "neutral-800": "#B9B7B7",
      "neutral-900": "#CAC9C9",
      success: "#00A96E",
      "success-strong": "#33C386",
      warning: "#FFBE00",
      "warning-strong": "#FFC500",
      error: "#FF5861",
      "error-strong": "#FF8286",
      info: "#00B5FF",
      "info-strong": "#00BCFF",
    },
  },
  {
    id: "nord",
    displayName: "Nord",
    moodFamily: "Cool/Tech Minimal",
    sourceReference:
      "DaisyUI v5's real, live-fetched nord.css (its light re-interpretation, per research.md R6's explicit either-is-valid note) — same derivation method as Corporate above. The derived neutral-50 (#ECEFF4) and neutral-900 (#2E3440) converge almost exactly on the original standalone Nord project's own real published \"Snow Storm\"/\"Polar Night\" hex values (nordtheme.com/docs/colors-and-palettes), cross-validating the derivation method.",
    tokens: {
      "brand-light": "#DCE0E5",
      brand: "#476993",
      "brand-dark": "#324D6F",
      "neutral-50": "#ECEFF4",
      "neutral-100": "#C8CCD2",
      "neutral-200": "#AEB2BA",
      "neutral-300": "#979CA4",
      "neutral-400": "#828790",
      "neutral-500": "#6F757E",
      "neutral-600": "#5D636D",
      "neutral-700": "#4D525D",
      "neutral-800": "#3D434E",
      "neutral-900": "#2E3440",
      success: "#A3BE8D",
      "success-strong": "#3B5225",
      warning: "#EBCB8B",
      "warning-strong": "#624600",
      error: "#BF616A",
      "error-strong": "#832C39",
      info: "#B48EAD",
      "info-strong": "#5F3E5A",
    },
  },
  {
    id: "dracula",
    displayName: "Dracula",
    moodFamily: "Dark Vibrant/Expressive",
    sourceReference:
      "DaisyUI v5's real, live-fetched dracula.css (its own OKLCH re-expression, per research.md R6's explicit either-is-valid note) — same derivation method as Corporate above. The derived neutral-50 (#282A36) and brand DEFAULT (#FF79C6) converge almost exactly on the original standalone Dracula project's own real published background/pink hex values (draculatheme.com/contribute), cross-validating the derivation method. Same Indicator-vs-Badge dual-role limitation as 'forest' above (dark theme, ink-on-page role prioritized for *-strong).",
    tokens: {
      "brand-light": "#FFF0F7",
      brand: "#FF79C6",
      "brand-dark": "#962C6D",
      "neutral-50": "#282A36",
      "neutral-100": "#424B54",
      "neutral-200": "#58646A",
      "neutral-300": "#6E7C7D",
      "neutral-400": "#869290",
      "neutral-500": "#9DA7A3",
      "neutral-600": "#B4BCB6",
      "neutral-700": "#CBD0CA",
      "neutral-800": "#E2E4DE",
      "neutral-900": "#F8F8F3",
      success: "#51FA7B",
      "success-strong": "#59FF82",
      warning: "#F1FA8C",
      "warning-strong": "#F8FF93",
      error: "#FF5555",
      "error-strong": "#FFA79F",
      info: "#8BE9FD",
      "info-strong": "#92F0FF",
    },
  },
  {
    id: "business",
    displayName: "Business",
    moodFamily: "Dark Moody/Professional",
    sourceReference:
      "DaisyUI v5's real, live-fetched business.css — same derivation method as Corporate above. A dark theme (base-100 L=24.35%, color-scheme: dark). Same Indicator-vs-Badge dual-role limitation as 'forest' above (dark theme, ink-on-page role prioritized for *-strong).",
    tokens: {
      "brand-light": "#F0F6FC",
      brand: "#5D8FC6",
      "brand-dark": "#315A85",
      "neutral-50": "#202020",
      "neutral-100": "#3A3A3A",
      "neutral-200": "#4E4E4E",
      "neutral-300": "#626262",
      "neutral-400": "#747474",
      "neutral-500": "#868686",
      "neutral-600": "#989898",
      "neutral-700": "#AAAAAA",
      "neutral-800": "#BCBCBC",
      "neutral-900": "#CDCDCD",
      success: "#6BB187",
      "success-strong": "#7EC499",
      warning: "#DBAE5A",
      "warning-strong": "#E1B460",
      error: "#B94B3D",
      "error-strong": "#FF8F7E",
      info: "#0291D5",
      "info-strong": "#4DBEFF",
    },
  },
  {
    id: "cosmo",
    displayName: "Cosmo",
    moodFamily: "Light Professional",
    sourceReference:
      "Bootswatch's real, live-fetched cosmo/_variables.scss. Same derivation method as Corporate/Forest/Nord/Dracula/Business (feature 017 Phase 4). Neutral scale is Bootstrap's own real gray-100..900 (Bootswatch overrides none of them, so these are Bootstrap's framework defaults), used directly rather than OKLCH-interpolated.",
    tokens: {
      "brand-light": "#E7F0FA",
      brand: "#1573D5",
      "brand-dark": "#0051A0",
      "neutral-50": "#FFFFFF",
      "neutral-100": "#F8F9FA",
      "neutral-200": "#E9ECEF",
      "neutral-300": "#DEE2E6",
      "neutral-400": "#CED4DA",
      "neutral-500": "#ADB5BD",
      "neutral-600": "#868E96",
      "neutral-700": "#495057",
      "neutral-800": "#373A3C",
      "neutral-900": "#212529",
      success: "#3FB618",
      "success-strong": "#005F00",
      warning: "#FF7518",
      "warning-strong": "#A41800",
      error: "#FF0039",
      "error-strong": "#A50000",
      info: "#9954BB",
      "info-strong": "#752F94",
    },
  },
  {
    id: "flatly",
    displayName: "Flatly",
    moodFamily: "Light Professional",
    sourceReference:
      "Bootswatch's real, live-fetched flatly/_variables.scss. Same derivation method as Corporate/Forest/Nord/Dracula/Business (feature 017 Phase 4). Neutral scale is Bootstrap's own real gray-100..900. Note: Flatly's own primary ($blue override, #2c3e50) is a desaturated dark navy, not a vivid blue — used verbatim.",
    tokens: {
      "brand-light": "#ABADAF",
      brand: "#2C3E50",
      "brand-dark": "#2A3948",
      "neutral-50": "#FFFFFF",
      "neutral-100": "#F8F9FA",
      "neutral-200": "#ECF0F1",
      "neutral-300": "#DEE2E6",
      "neutral-400": "#CED4DA",
      "neutral-500": "#B4BCC2",
      "neutral-600": "#95A5A6",
      "neutral-700": "#7B8A8B",
      "neutral-800": "#343A40",
      "neutral-900": "#212529",
      success: "#18BC9C",
      "success-strong": "#006045",
      warning: "#F39C12",
      "warning-strong": "#8F3F00",
      error: "#E74C3C",
      "error-strong": "#AE0000",
      info: "#3498DB",
      "info-strong": "#005593",
    },
  },
  {
    id: "litera",
    displayName: "Litera",
    moodFamily: "Light Professional",
    sourceReference:
      "Bootswatch's real, live-fetched litera/_variables.scss. Same derivation method as Corporate/Forest/Nord/Dracula/Business (feature 017 Phase 4). Neutral scale is Bootstrap's own real gray-100..900.",
    tokens: {
      "brand-light": "#E8EFFA",
      brand: "#336FD7",
      "brand-dark": "#1D4DA2",
      "neutral-50": "#FFFFFF",
      "neutral-100": "#F8F9FA",
      "neutral-200": "#E9ECEF",
      "neutral-300": "#DDDDDD",
      "neutral-400": "#CED4DA",
      "neutral-500": "#ADB5BD",
      "neutral-600": "#868E96",
      "neutral-700": "#495057",
      "neutral-800": "#343A40",
      "neutral-900": "#212529",
      success: "#02B875",
      "success-strong": "#006125",
      warning: "#F0AD4E",
      "warning-strong": "#824600",
      error: "#D9534F",
      "error-strong": "#A11A21",
      info: "#17A2B8",
      "info-strong": "#005A6E",
    },
  },
  {
    id: "lumen",
    displayName: "Lumen",
    moodFamily: "Light Professional",
    sourceReference:
      "Bootswatch's real, live-fetched lumen/_variables.scss. Same derivation method as Corporate/Forest/Nord/Dracula/Business (feature 017 Phase 4). Neutral scale is Bootstrap's own real gray-100..900.",
    tokens: {
      "brand-light": "#E1EAEF",
      brand: "#007AA7",
      "brand-dark": "#00567A",
      "neutral-50": "#FFFFFF",
      "neutral-100": "#F6F6F6",
      "neutral-200": "#F0F0F0",
      "neutral-300": "#DEE2E6",
      "neutral-400": "#CED4DA",
      "neutral-500": "#ADB5BD",
      "neutral-600": "#999999",
      "neutral-700": "#555555",
      "neutral-800": "#333333",
      "neutral-900": "#222222",
      success: "#28B62C",
      "success-strong": "#006400",
      warning: "#FF851B",
      "warning-strong": "#9E2A00",
      error: "#FF4136",
      "error-strong": "#AE0000",
      info: "#75CAEB",
      "info-strong": "#005C79",
    },
  },
  {
    id: "zephyr",
    displayName: "Zephyr",
    moodFamily: "Light Professional",
    sourceReference:
      "Bootswatch's real, live-fetched zephyr/_variables.scss. Same derivation method as Corporate/Forest/Nord/Dracula/Business (feature 017 Phase 4). Neutral scale is Bootstrap's own real gray-100..900.",
    tokens: {
      "brand-light": "#DDE4F3",
      brand: "#3459E6",
      "brand-dark": "#2846B9",
      "neutral-50": "#FFFFFF",
      "neutral-100": "#F8F9FA",
      "neutral-200": "#E9ECEF",
      "neutral-300": "#DEE2E6",
      "neutral-400": "#CED4DA",
      "neutral-500": "#ADB5BD",
      "neutral-600": "#6C757D",
      "neutral-700": "#495057",
      "neutral-800": "#343A40",
      "neutral-900": "#212529",
      success: "#2FB380",
      "success-strong": "#006336",
      warning: "#F4BD61",
      "warning-strong": "#7A4900",
      error: "#DA292E",
      "error-strong": "#A70000",
      info: "#287BB5",
      "info-strong": "#00578F",
    },
  },
  {
    id: "silk",
    displayName: "Silk",
    moodFamily: "Light Professional",
    sourceReference:
      "DaisyUI v5's real, live-fetched silk.css. Same derivation method as Corporate/Forest/Nord/Dracula/Business (feature 017 Phase 4). DaisyUI's own primary here is a deliberately near-black, muted tone (premium/soft aesthetic per research.md), not a vivid brand hue — used verbatim; brand-dark nudged further per this catalog's standard AAA-vs-white-text derivation.",
    tokens: {
      "brand-light": "#878788",
      brand: "#1C1C29",
      "brand-dark": "#181822",
      "neutral-50": "#F7F5F3",
      "neutral-100": "#D7D4D2",
      "neutral-200": "#BFBDBA",
      "neutral-300": "#ABA8A5",
      "neutral-400": "#989592",
      "neutral-500": "#878480",
      "neutral-600": "#777370",
      "neutral-700": "#676360",
      "neutral-800": "#595551",
      "neutral-900": "#4B4743",
      success: "#AFD89E",
      "success-strong": "#345824",
      warning: "#EFC375",
      "warning-strong": "#714900",
      error: "#E9575A",
      "error-strong": "#A30121",
      info: "#78C8FF",
      "info-strong": "#005386",
    },
  },
  {
    id: "winter",
    displayName: "Winter",
    moodFamily: "Light Professional",
    sourceReference:
      "DaisyUI v5's real, live-fetched winter.css. Same derivation method as Corporate/Forest/Nord/Dracula/Business (feature 017 Phase 4).",
    tokens: {
      "brand-light": "#E7F2FF",
      brand: "#0069FF",
      "brand-dark": "#0047C9",
      "neutral-50": "#FFFFFF",
      "neutral-100": "#E2DCE0",
      "neutral-200": "#CCC2CB",
      "neutral-300": "#B6ADBA",
      "neutral-400": "#A199AB",
      "neutral-500": "#8C889E",
      "neutral-600": "#777891",
      "neutral-700": "#636984",
      "neutral-800": "#4E5B77",
      "neutral-900": "#394E6A",
      success: "#81CFD1",
      "success-strong": "#006163",
      warning: "#EFD7BC",
      "warning-strong": "#66523A",
      error: "#D17979",
      "error-strong": "#88383B",
      info: "#94E7FB",
      "info-strong": "#005E70",
    },
  },
  {
    id: "cupcake",
    displayName: "Cupcake",
    moodFamily: "Warm/Organic Light",
    sourceReference:
      "DaisyUI v5's real, live-fetched cupcake.css. Same derivation method as Corporate/Forest/Nord/Dracula/Business (feature 017 Phase 4).",
    tokens: {
      "brand-light": "#D5E1DE",
      brand: "#007E6B",
      "brand-dark": "#005849",
      "neutral-50": "#FAF7F5",
      "neutral-100": "#D7CBC7",
      "neutral-200": "#BEAAA8",
      "neutral-300": "#A78E90",
      "neutral-400": "#91757B",
      "neutral-500": "#7B5D6A",
      "neutral-600": "#66485B",
      "neutral-700": "#51354D",
      "neutral-800": "#3D2340",
      "neutral-900": "#291334",
      success: "#00BA7B",
      "success-strong": "#005D26",
      warning: "#EEAF00",
      "warning-strong": "#7B4000",
      error: "#FE1C55",
      "error-strong": "#A4000F",
      info: "#00A4F2",
      "info-strong": "#004D95",
    },
  },
  {
    id: "sandstone",
    displayName: "Sandstone",
    moodFamily: "Warm/Organic Light",
    sourceReference:
      "Bootswatch's real, live-fetched sandstone/_variables.scss. Same derivation method as Corporate/Forest/Nord/Dracula/Business (feature 017 Phase 4). Neutral scale is Bootswatch's own real gray-100..900. Uses $orange (not $yellow) for warning, per its own _variables.scss.",
    tokens: {
      "brand-light": "#CCD1D6",
      brand: "#325D88",
      "brand-dark": "#2E5275",
      "neutral-50": "#FFFFFF",
      "neutral-100": "#F8F9FA",
      "neutral-200": "#F8F5F0",
      "neutral-300": "#DFD7CA",
      "neutral-400": "#CED4DA",
      "neutral-500": "#98978B",
      "neutral-600": "#8E8C84",
      "neutral-700": "#495057",
      "neutral-800": "#3E3F3A",
      "neutral-900": "#212529",
      success: "#93C54B",
      "success-strong": "#325C00",
      warning: "#F47C3C",
      "warning-strong": "#9A2800",
      error: "#D9534F",
      "error-strong": "#A11A21",
      info: "#29ABE0",
      "info-strong": "#005586",
    },
  },
  {
    id: "garden",
    displayName: "Garden",
    moodFamily: "Warm/Organic Light",
    sourceReference:
      "DaisyUI v5's real, live-fetched garden.css. Same derivation method as Corporate/Forest/Nord/Dracula/Business (feature 017 Phase 4).",
    tokens: {
      "brand-light": "#E7CFD3",
      brand: "#C9004D",
      "brand-dark": "#89002B",
      "neutral-50": "#E9E7E7",
      "neutral-100": "#BEBDBD",
      "neutral-200": "#A09E9E",
      "neutral-300": "#858484",
      "neutral-400": "#6D6C6C",
      "neutral-500": "#575656",
      "neutral-600": "#434242",
      "neutral-700": "#302F2F",
      "neutral-800": "#1F1F1F",
      "neutral-900": "#100F0F",
      success: "#00A96E",
      "success-strong": "#005420",
      warning: "#FFBE00",
      "warning-strong": "#7A3400",
      error: "#F43949",
      "error-strong": "#950000",
      info: "#00B5FF",
      "info-strong": "#00438D",
    },
  },
  {
    id: "autumn",
    displayName: "Autumn",
    moodFamily: "Warm/Organic Light",
    sourceReference:
      "DaisyUI v5's real, live-fetched autumn.css. Same derivation method as Corporate/Forest/Nord/Dracula/Business (feature 017 Phase 4).",
    tokens: {
      "brand-light": "#C7B9B9",
      brand: "#8C0327",
      "brand-dark": "#7D1528",
      "neutral-50": "#F1F1F1",
      "neutral-100": "#C6C6C6",
      "neutral-200": "#A7A7A7",
      "neutral-300": "#8C8C8C",
      "neutral-400": "#747474",
      "neutral-500": "#5D5D5D",
      "neutral-600": "#494949",
      "neutral-700": "#363636",
      "neutral-800": "#242424",
      "neutral-900": "#141414",
      success: "#499380",
      "success-strong": "#005847",
      warning: "#E97F17",
      "warning-strong": "#8A2700",
      error: "#D40014",
      "error-strong": "#990000",
      info: "#44ADBB",
      "info-strong": "#005360",
    },
  },
  {
    id: "lemonade",
    displayName: "Lemonade",
    moodFamily: "Warm/Organic Light",
    sourceReference:
      "DaisyUI v5's real, live-fetched lemonade.css. Same derivation method as Corporate/Forest/Nord/Dracula/Business (feature 017 Phase 4).",
    tokens: {
      "brand-light": "#DFE7DA",
      brand: "#2E8100",
      "brand-dark": "#165B00",
      "neutral-50": "#F8FDEF",
      "neutral-100": "#CBD0C4",
      "neutral-200": "#ACB0A5",
      "neutral-300": "#90938B",
      "neutral-400": "#777A72",
      "neutral-500": "#60625C",
      "neutral-600": "#4B4D48",
      "neutral-700": "#373935",
      "neutral-800": "#252624",
      "neutral-900": "#151614",
      success: "#B9DCC6",
      "success-strong": "#3D5B49",
      warning: "#D7D3B0",
      "warning-strong": "#585435",
      error: "#AE8884",
      "error-strong": "#6B4945",
      info: "#B1D9E9",
      "info-strong": "#355966",
    },
  },
  {
    id: "caramellatte",
    displayName: "Caramellatte",
    moodFamily: "Warm/Organic Light",
    sourceReference:
      "DaisyUI v5's real, live-fetched caramellatte.css. Same derivation method as Corporate/Forest/Nord/Dracula/Business (feature 017 Phase 4). DaisyUI's own primary here is literal black (oklch(0% 0 0)) — used verbatim, matching its premium/restrained aesthetic per research.md.",
    tokens: {
      "brand-light": "#454545",
      brand: "#000000",
      "brand-dark": "#000000",
      "neutral-50": "#FFF7ED",
      "neutral-100": "#E7D4C0",
      "neutral-200": "#D7BAA0",
      "neutral-300": "#C8A285",
      "neutral-400": "#BA8C6C",
      "neutral-500": "#AE7756",
      "neutral-600": "#A16342",
      "neutral-700": "#954F2F",
      "neutral-800": "#883C1D",
      "neutral-900": "#7C2808",
      success: "#006044",
      "success-strong": "#005A3F",
      warning: "#FCB700",
      "warning-strong": "#814000",
      error: "#F0555A",
      "error-strong": "#A2001A",
      info: "#193AB7",
      "info-strong": "#1433B0",
    },
  },
];
