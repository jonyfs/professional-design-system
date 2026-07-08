#!/usr/bin/env node
// Principle II gate (Absolute Semantic Accessibility, AAA, NON-NEGOTIABLE):
// verifies every text/background token pairing this project's components
// actually use against the WCAG 2.2 AAA thresholds (7:1 normal text,
// 4.5:1 large text / UI components), using the `wcag-contrast` package.
// Also checks non-text UI component boundaries (WCAG 1.4.11, 3:1 — an
// AA-level criterion, not itself part of Principle II's AAA mandate, but
// checked here so a documented claim like "this ring clears 3:1" is
// verified by tooling, not just prose) via a separate RING_PAIRINGS list.
//
// Pairings are declared explicitly below, one entry per real usage in
// contracts/*.md — this is not a generic linter, it is a checklist of the
// exact combinations this design system ships. Because a hand-maintained
// checklist can silently drift from the real markup, this script also scans
// the shipped component HTML for every `text-<token>` color class in use
// and fails loudly if any of them has no PAIRING entry — a new component (or
// a changed one) MUST add its pairing here before being considered
// compliant, and this check makes "forgot to" a hard failure instead of a
// silent gap. (The RING_PAIRINGS list is not similarly auto-scanned against
// markup — see its own comment for why.)

import { hex } from "wcag-contrast";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const AAA_NORMAL = 7;
const AAA_LARGE_OR_UI = 4.5;
// WCAG 1.4.11 Non-text Contrast — an AA-level criterion (no AAA tier
// exists for it), required for meaningful UI-component boundaries (e.g. a
// toggle track's edge against its page background). Kept distinct from
// AAA_LARGE_OR_UI (4.5) because it is a different, real WCAG number, not
// a stricter self-imposed bar.
const NON_TEXT_UI_AA = 3;
const rootDir = fileURLToPath(new URL("..", import.meta.url));

// Resolved from tailwind.config.ts (v1.3.1 constitution palette).
const BASE_TOKENS = {
  "brand-dark": "#004BB3",
  brand: "#0066FF",
  white: "#FFFFFF",
  "neutral-900": "#111827",
  "neutral-500": "#6B7280",
  "neutral-50": "#F9FAFB",
  "neutral-600": "#4B5563",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  "success-strong": "#065F46",
  "error-strong": "#991B1B",
  "warning-strong": "#78350F",
};

// Backgrounds computed by alpha-compositing a base token over white, matching
// what Tailwind's opacity modifier (`bg-success/5`) renders as against a
// white page — computed here instead of hand-typed so they can't drift from
// BASE_TOKENS if a token's hex ever changes.
function compositeOverWhite(baseHex, alphaPercent) {
  const alpha = alphaPercent / 100;
  const clean = baseHex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  const blend = (channel) => Math.round(alpha * channel + (1 - alpha) * 255);
  return `#${[blend(r), blend(g), blend(b)].map((c) => c.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}

const TOKENS = {
  ...BASE_TOKENS,
  "success/5-on-white": compositeOverWhite(BASE_TOKENS.success, 5),
  "error/5-on-white": compositeOverWhite(BASE_TOKENS.error, 5),
  "warning/5-on-white": compositeOverWhite(BASE_TOKENS.warning, 5),
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

// Non-text UI component boundaries (WCAG 1.4.11, 3:1) — e.g. a control's
// ring/border against the page background. Deliberately does NOT include
// feature 001's pre-existing `ring-neutral-300` boundaries (Text Input,
// Checkbox, Badge — measured 1.47:1, below 3:1): that gap was found and
// explicitly left out of scope in feature 002's research.md as a
// cross-cutting change to already-shipped, CI-green components, not
// something to silently start failing here. Only checks the boundaries a
// component's contract actually claims meet this bar.
const RING_PAIRINGS = [
  {
    name: "Toggle track ring, off state (ring-neutral-500 vs white page)",
    fg: "neutral-500",
    bg: "white",
    threshold: NON_TEXT_UI_AA,
  },
  {
    name: "Toggle track ring, on state (ring-neutral-500 vs white page — outer edge, state-invariant)",
    fg: "neutral-500",
    bg: "white",
    threshold: NON_TEXT_UI_AA,
  },
];

let failures = [];

for (const { name, fg, bg, threshold } of [...PAIRINGS, ...RING_PAIRINGS]) {
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

// --- Coverage check: every text-<token> color class actually shipped must
// have at least one PAIRING entry, or a real combination could ship with
// zero contrast verification. ---

function collectHtmlFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === "dist") continue;
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      files.push(...collectHtmlFiles(fullPath));
    } else if (extname(entry) === ".html") {
      files.push(fullPath);
    }
  }
  return files;
}

const NON_COLOR_TEXT_SUFFIXES = new Set([
  "xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl", "8xl", "9xl",
  "left", "center", "right", "justify", "start", "end",
  "nowrap", "ellipsis", "clip", "underline", "overline", "line-through",
  "no-underline", "uppercase", "lowercase", "capitalize", "normal-case",
  "italic", "not-italic", "wavy", "balance", "wrap", "pretty",
]);

// The exact set of tokens this project's PAIRINGS above already cover as a
// foreground color, so a token used only as a background/ring elsewhere
// (e.g. "brand-dark" as bg, not fg) doesn't false-positive here.
const COVERED_FG_TOKENS = new Set(PAIRINGS.map((p) => p.fg));

const htmlFiles = [
  join(rootDir, "index.html"),
  ...collectHtmlFiles(join(rootDir, "src", "components")),
];

const uncoveredTextTokens = new Set();

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const classAttrPattern = /class="([^"]*)"/g;
  let match;
  while ((match = classAttrPattern.exec(html)) !== null) {
    for (const cls of match[1].split(/\s+/).filter(Boolean)) {
      const base = cls.split(":").pop(); // strip hover:/focus:/etc.
      if (!base.startsWith("text-")) continue;
      const suffix = base.slice("text-".length).split("/")[0]; // strip opacity modifier
      if (NON_COLOR_TEXT_SUFFIXES.has(suffix)) continue;
      if (!(suffix in BASE_TOKENS)) continue; // not a project color token (e.g. arbitrary value) — out of scope here
      if (!COVERED_FG_TOKENS.has(suffix)) {
        uncoveredTextTokens.add(`${suffix} (seen in ${file.replace(rootDir, "")})`);
      }
    }
  }
}

if (uncoveredTextTokens.size > 0) {
  failures.push(
    `Coverage gap: the following text color token(s) are used in shipped markup with ` +
      `no PAIRINGS entry checking their contrast — add one before considering this compliant:\n` +
      [...uncoveredTextTokens].map((t) => `    - ${t}`).join("\n"),
  );
}

if (failures.length > 0) {
  console.error(`\nContrast audit FAILED (Principle II, AAA) — ${failures.length} failure(s):\n`);
  for (const failure of failures) {
    console.error(`  ${failure}`);
  }
  console.error("");
  process.exit(1);
}

console.log(
  `Contrast audit passed — ${PAIRINGS.length} text pairing(s) (AAA) + ${RING_PAIRINGS.length} ` +
    `non-text UI pairing(s) (WCAG 1.4.11, 3:1) checked, all above threshold; ` +
    `markup coverage verified against ${htmlFiles.length} file(s).`,
);
