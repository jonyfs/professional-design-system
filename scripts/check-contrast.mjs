#!/usr/bin/env node
// Principle II gate (Absolute Semantic Accessibility, AAA, NON-NEGOTIABLE):
// verifies every text/background token pairing this project's components
// actually use against the WCAG 2.2 AAA thresholds (7:1 normal text,
// 4.5:1 large text / UI components), using the `wcag-contrast` package.
//
// Pairings are declared explicitly below, one entry per real usage in
// contracts/*.md — this is not a generic linter, it is a checklist of the
// exact combinations this design system ships, so a new component MUST add
// its pairing here before being considered compliant.

import { hex } from "wcag-contrast";

const AAA_NORMAL = 7;
const AAA_LARGE_OR_UI = 4.5;

// Resolved from tailwind.config.ts (v1.3.1 constitution palette).
const TOKENS = {
  "brand-dark": "#004BB3",
  brand: "#0066FF",
  white: "#FFFFFF",
  "neutral-900": "#111827",
  "neutral-50": "#F9FAFB",
  "neutral-600": "#4B5563",
  "success-strong": "#065F46",
  "error-strong": "#991B1B",
  "warning-strong": "#78350F",
  // Backgrounds expressed as opacity-composited-over-white approximations,
  // matching what `bg-success/5` etc. render as against a white page.
  "success/5-on-white": "#F3FCF9",
  "error/5-on-white": "#FEF6F6",
  "warning/5-on-white": "#FEF9F0",
};

const PAIRINGS = [
  {
    name: "Button primary text (text-white on bg-brand-dark)",
    fg: "white",
    bg: "brand-dark",
    threshold: AAA_NORMAL,
  },
  {
    name: "Button secondary text (text-neutral-900 on white)",
    fg: "neutral-900",
    bg: "white",
    threshold: AAA_NORMAL,
  },
  {
    name: "Button secondary text hover (text-neutral-900 on bg-neutral-50)",
    fg: "neutral-900",
    bg: "neutral-50",
    threshold: AAA_NORMAL,
  },
  {
    name: "Text Input label/value (text-neutral-900 on white)",
    fg: "neutral-900",
    bg: "white",
    threshold: AAA_NORMAL,
  },
  {
    name: "Text Input error message (text-error-strong on white)",
    fg: "error-strong",
    bg: "white",
    threshold: AAA_NORMAL,
  },
  {
    name: "Badge success (text-success-strong on bg-success/5)",
    fg: "success-strong",
    bg: "success/5-on-white",
    threshold: AAA_NORMAL,
  },
  {
    name: "Badge error (text-error-strong on bg-error/5)",
    fg: "error-strong",
    bg: "error/5-on-white",
    threshold: AAA_NORMAL,
  },
  {
    name: "Badge warning (text-warning-strong on bg-warning/5)",
    fg: "warning-strong",
    bg: "warning/5-on-white",
    threshold: AAA_NORMAL,
  },
  {
    name: "Badge neutral (text-neutral-600 on bg-neutral-50)",
    fg: "neutral-600",
    bg: "neutral-50",
    threshold: AAA_NORMAL,
  },
  {
    name: "Checkbox label (text-neutral-900 on white)",
    fg: "neutral-900",
    bg: "white",
    threshold: AAA_NORMAL,
  },
  {
    name: "Button focus-visible outline (bg-brand on white, non-text UI boundary)",
    fg: "brand",
    bg: "white",
    threshold: AAA_LARGE_OR_UI,
  },
];

let failures = [];

for (const { name, fg, bg, threshold } of PAIRINGS) {
  const fgHex = TOKENS[fg];
  const bgHex = TOKENS[bg];
  if (!fgHex || !bgHex) {
    failures.push(`${name}: unknown token "${!fgHex ? fg : bg}" — add it to TOKENS`);
    continue;
  }
  const ratio = hex(fgHex, bgHex);
  if (ratio < threshold) {
    failures.push(
      `${name}: ${ratio.toFixed(2)}:1 — below required ${threshold}:1 (${fgHex} on ${bgHex})`,
    );
  }
}

if (failures.length > 0) {
  console.error(`\nContrast audit FAILED (Principle II, AAA) — ${failures.length} failure(s):\n`);
  for (const failure of failures) {
    console.error(`  ${failure}`);
  }
  console.error("");
  process.exit(1);
}

console.log(`Contrast audit passed — ${PAIRINGS.length} pairing(s) checked, all ≥ AAA threshold.`);
