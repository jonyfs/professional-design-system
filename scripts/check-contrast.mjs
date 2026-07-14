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
//
// Feature 017 (Curated Theme Presets, contracts/theme-tokens.contract.md,
// task T009): pairings/rings are declared ONCE, by token NAME (e.g.
// "neutral-900"), and are re-resolved to actual hex values once per THEME —
// every entry below is checked against every theme in
// shared/design-tokens.ts's THEMES array, not just the pre-existing
// "light" theme. THEMES is this script's (and themes.css's) single shared
// source of truth; there is no separate hardcoded palette here anymore.

import { hex } from "wcag-contrast";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { THEMES, REQUIRED_THEME_PROPERTIES } from "../shared/design-tokens.ts";

const AAA_NORMAL = 7;
const AAA_LARGE_OR_UI = 4.5;
// WCAG 1.4.11 Non-text Contrast — an AA-level criterion (no AAA tier
// exists for it), required for meaningful UI-component boundaries (e.g. a
// toggle track's edge against its page background). Kept distinct from
// AAA_LARGE_OR_UI (4.5) because it is a different, real WCAG number, not
// a stricter self-imposed bar.
const NON_TEXT_UI_AA = 3;
const rootDir = fileURLToPath(new URL("..", import.meta.url));

// The theme-independent key names every theme in THEMES must declare
// (REQUIRED_THEME_PROPERTIES minus its "--color-" CSS custom-property
// prefix, e.g. "--color-neutral-50" -> "neutral-50") — the same keys
// ThemeTokens' interface fields use.
const REQUIRED_KEYS = REQUIRED_THEME_PROPERTIES.map((prop) =>
  prop.replace("--color-", ""),
);

// "white" is deliberately NOT one of THEMES' per-theme tokens: it is the
// literal, theme-invariant color of text set directly against a colored
// surface (e.g. Button primary's `text-white` on `bg-brand-dark`, or
// Indicator's `text-white` on `bg-success-strong`) — every theme's
// brand-dark/success-strong/etc. is independently verified (below) to stay
// dark enough for AAA against literal white, so this token never needs a
// per-theme value of its own.
const WHITE = "#FFFFFF";

// Backgrounds computed by alpha-compositing a base token over a given
// backdrop, matching what Tailwind's opacity modifier (`bg-success/5`)
// renders as when layered over whatever surface sits behind it — computed
// here instead of hand-typed so they can't drift from a theme's real token
// values. Feature 017: the backdrop is now the ACTIVE THEME's own
// `neutral-50` (this catalog's page/surface background role — see
// src/styles/tailwind.css's `.page-shell` comment), not a hardcoded
// "#FFFFFF" — for the pre-existing "light" theme these are numerically
// identical (`neutral-50` IS `#FFFFFF` there), so this changes no existing
// pass/fail result, but a dark theme's `neutral-50` is genuinely dark, and
// a badge/alert tint sitting on it must be composited against THAT color,
// not literal white, to be checked correctly.
function compositeOver(baseHex, alphaPercent, backdropHex) {
  const alpha = alphaPercent / 100;
  const base = baseHex.replace("#", "");
  const backdrop = backdropHex.replace("#", "");
  const baseChannel = (offset) => parseInt(base.slice(offset, offset + 2), 16);
  const backdropChannel = (offset) =>
    parseInt(backdrop.slice(offset, offset + 2), 16);
  const blend = (offset) =>
    Math.round(
      alpha * baseChannel(offset) + (1 - alpha) * backdropChannel(offset),
    );
  return `#${[0, 2, 4]
    .map((offset) => blend(offset).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
}

// Builds this theme's full token-name -> hex lookup: its 21 declared
// `--color-*` values (spread as-is from THEMES, keyed by name without the
// CSS custom-property prefix) plus the theme-invariant "white" and the
// alpha-composited tint tokens PAIRINGS references (e.g. "success/5").
function buildTokenMap(theme) {
  const map = { ...theme.tokens, white: WHITE };
  map["success/5"] = compositeOver(map.success, 5, map["neutral-50"]);
  map["error/5"] = compositeOver(map.error, 5, map["neutral-50"]);
  map["warning/5"] = compositeOver(map.warning, 5, map["neutral-50"]);
  map["info/5"] = compositeOver(map.info, 5, map["neutral-50"]);
  return map;
}

// The canonical set of token names any theme can supply, used only to
// decide (theme-independently) whether a `text-<suffix>` class the markup
// coverage scan finds is a real project color token at all, vs. an
// unrelated utility (spacing/alignment/etc. already filtered by
// NON_COLOR_TEXT_SUFFIXES) or an arbitrary value out of this scan's scope.
const KNOWN_TOKEN_NAMES = new Set([...REQUIRED_KEYS, "white"]);

const PAIRINGS = [
  {
    name: "Button primary text (text-white on bg-brand-dark)",
    fg: "white",
    bg: "brand-dark",
    threshold: AAA_NORMAL,
  },
  {
    // .btn-secondary's own background (bg-neutral-50, this catalog's
    // page/surface role — feature 017 retrofit; previously literal
    // bg-white, numerically identical for the "light" theme).
    name: "Button secondary text (text-neutral-900 on bg-neutral-50)",
    fg: "neutral-900",
    bg: "neutral-50",
    threshold: AAA_NORMAL,
  },
  {
    // .btn-secondary's hover state (hover:bg-neutral-100 — feature 017
    // retrofit shifted this up one neutral tier alongside the bg-white ->
    // bg-neutral-50 default-state rename above, since neutral-50 no longer
    // means "subtle highlight" on top of a separate page background).
    name: "Button secondary text hover (text-neutral-900 on bg-neutral-100)",
    fg: "neutral-900",
    bg: "neutral-100",
    threshold: AAA_NORMAL,
  },
  {
    // Sits on the page (.page-shell's bg-neutral-50), not literal white —
    // feature 017 retrofit.
    name: "Text Input label/value (text-neutral-900 on bg-neutral-50)",
    fg: "neutral-900",
    bg: "neutral-50",
    threshold: AAA_NORMAL,
  },
  {
    name: "Text Input error message (text-error-strong on bg-neutral-50)",
    fg: "error-strong",
    bg: "neutral-50",
    threshold: AAA_NORMAL,
  },
  {
    name: "Badge success (text-success-strong on bg-success/5)",
    fg: "success-strong",
    bg: "success/5",
    threshold: AAA_NORMAL,
  },
  {
    name: "Badge error (text-error-strong on bg-error/5)",
    fg: "error-strong",
    bg: "error/5",
    threshold: AAA_NORMAL,
  },
  {
    name: "Badge warning (text-warning-strong on bg-warning/5)",
    fg: "warning-strong",
    bg: "warning/5",
    threshold: AAA_NORMAL,
  },
  {
    name: "Badge neutral (text-neutral-600 on bg-neutral-50)",
    fg: "neutral-600",
    bg: "neutral-50",
    threshold: AAA_NORMAL,
  },
  {
    name: "Checkbox label (text-neutral-900 on bg-neutral-50)",
    fg: "neutral-900",
    bg: "neutral-50",
    threshold: AAA_NORMAL,
  },
  {
    name: "Button focus-visible outline (bg-brand on bg-neutral-50, non-text UI boundary)",
    fg: "brand",
    bg: "neutral-50",
    threshold: AAA_LARGE_OR_UI,
  },
  {
    // .back-link/.demo-link (tailwind.css, shipped since feature 001) — found
    // by feature 003's /speckit-analyze extending this coverage scan to also
    // read tailwind.css's @apply blocks, not just HTML. Passes comfortably
    // (7.90:1); this was a real verification gap, not a contrast defect.
    name: "Back-link / demo-link text (text-brand-dark on bg-neutral-50)",
    fg: "brand-dark",
    bg: "neutral-50",
    threshold: AAA_NORMAL,
  },
  {
    // Feature 006 — real value corrected by /speckit-analyze during
    // planning (an earlier draft cited an unverified 11.58:1 figure; the
    // actual computed ratio is 9.37:1, still comfortably AAA).
    name: "Avatar fallback initials (text-neutral-700 on bg-neutral-100)",
    fg: "neutral-700",
    bg: "neutral-100",
    threshold: AAA_NORMAL,
  },
  {
    // Feature 006 — info-strong added alongside success/error/warning-
    // strong (previously info had no text-safe -strong variant).
    name: "Alert info icon (text-info-strong on bg-info/5)",
    fg: "info-strong",
    bg: "info/5",
    threshold: AAA_NORMAL,
  },
  {
    // Feature 007 — real AAA correction (research.md R3): the
    // constitution's ratified Sidebar dark-theme resting text,
    // text-neutral-400 on bg-neutral-900, measures 6.99:1 and fails AAA
    // by a hair. Corrected to text-neutral-300 (12.04:1).
    name: "Sidebar dark item text (text-neutral-300 on bg-neutral-900)",
    fg: "neutral-300",
    bg: "neutral-900",
    threshold: AAA_NORMAL,
  },
  {
    // Feature 007 — Sidebar light-theme resting text was never specified
    // by the ratified pattern at all (only hover/active were named);
    // proposed and verified here at the AAA floor. .sidebar-light's own
    // background is bg-neutral-50 (feature 017 retrofit; previously
    // literal bg-white).
    name: "Sidebar light item text (text-neutral-700 on bg-neutral-50)",
    fg: "neutral-700",
    bg: "neutral-50",
    threshold: AAA_NORMAL,
  },
  {
    // Feature 014 (research.md R4) — Tooltip's label text, verified rather
    // than assumed from Toast/Alert's unrelated dark-surface pairings.
    name: "Tooltip label text (text-white on bg-neutral-900)",
    fg: "white",
    bg: "neutral-900",
    threshold: AAA_NORMAL,
  },
  {
    // Feature 014 (research.md R3) — Kbd's key-label text. Kbd's own
    // bg-neutral-50 was never bg-white (unaffected by the feature 017
    // bg-white rename), though neutral-50's ROLE change means Kbd's
    // background now literally equals the page's own background for the
    // "light" theme — an intentional, already-accepted trade-off (Kbd's
    // border + shadow, not a background-color difference, are what
    // visually separate it from the page, matching the same pattern
    // Card/Modal/List already rely on).
    name: "Kbd text (text-neutral-700 on bg-neutral-50)",
    fg: "neutral-700",
    bg: "neutral-50",
    threshold: AAA_NORMAL,
  },
  {
    // Feature 015 (research.md R9) — Indicator's solid-fill badge text.
    // NOT the same relationship as Badge's tint+strong-text pattern —
    // caught a real defect where the base status colors (bg-success etc.)
    // fail even AA 4.5:1 with white text; the -strong variants (already
    // ratified for text-bearing use elsewhere) are the correct fill here.
    name: "Indicator success (text-white on bg-success-strong)",
    fg: "white",
    bg: "success-strong",
    threshold: AAA_NORMAL,
  },
  {
    name: "Indicator warning (text-white on bg-warning-strong)",
    fg: "white",
    bg: "warning-strong",
    threshold: AAA_NORMAL,
  },
  {
    name: "Indicator error (text-white on bg-error-strong)",
    fg: "white",
    bg: "error-strong",
    threshold: AAA_NORMAL,
  },
  {
    name: "Indicator info (text-white on bg-info-strong)",
    fg: "white",
    bg: "info-strong",
    threshold: AAA_NORMAL,
  },
  {
    name: "Indicator neutral (text-white on bg-neutral-700)",
    fg: "white",
    bg: "neutral-700",
    threshold: AAA_NORMAL,
  },
  {
    // Feature 017's parametrization scan (KNOWN_TOKEN_NAMES now spans the
    // full 21-token palette, not just the previous script's incomplete
    // hardcoded subset) surfaced this as a real, previously-invisible gap:
    // `.tab-trigger[aria-selected="true"]`'s active-state text color had
    // no PAIRINGS entry at all since feature 009 first shipped Tabs.
    // Sits on the page (no distinct .tabs-list background).
    name: "Tab trigger active text (text-neutral-800 on bg-neutral-50)",
    fg: "neutral-800",
    bg: "neutral-50",
    threshold: AAA_NORMAL,
  },
];

// Non-text UI component boundaries (WCAG 1.4.11, 3:1) — e.g. a control's
// ring/border against the page background. Deliberately does NOT include
// feature 001's pre-existing `ring-neutral-300` boundaries (Text Input,
// Checkbox, Badge — measured 1.47:1, below 3:1), nor Badge's decorative,
// opacity-modified accent rings (`ring-success/20` etc. — a different,
// non-boundary use): both gaps were found and explicitly left out of scope
// in feature 002's research.md as a cross-cutting change to already-
// shipped, CI-green components, not something to silently start failing
// here. Only checks the boundaries a component's contract actually claims
// meet this bar.
//
// KNOWN LIMITATION (unlike PAIRINGS' text-* scan below): this list is
// manually curated, not auto-scanned against markup. A code review on
// feature 002 found that Select's `ring-brand`/`ring-error` focus/error
// boundaries had shipped with no entry here, while research.md/
// select.contract.md incorrectly claimed "no new check needed — already
// verified in feature 001" (feature 001 never added ring-token entries at
// all). Distinguishing a functional boundary ring (this list) from a
// decorative accent ring (Badge, out of scope) isn't reliably automatable
// from class names alone, so — unlike text coverage — a missing entry
// here is NOT currently a hard CI failure. Treat this list as a checklist
// requiring the same discipline as PAIRINGS: any new functional boundary
// ring MUST add an entry here during code review, not "verified by
// inspection" prose.
const RING_PAIRINGS = [
  {
    // Bounds the whole control against the page it sits on — feature 017:
    // the page's own background is bg-neutral-50, not literal white.
    name: "Toggle track ring, off state (ring-neutral-500 vs bg-neutral-50 page)",
    fg: "neutral-500",
    bg: "neutral-50",
    threshold: NON_TEXT_UI_AA,
  },
  {
    // Mathematically identical to the off-state entry above (same fg/bg) —
    // kept as a distinct, named entry rather than removed because the two
    // states are conceptually different checks: the ring's *outer* edge
    // against the page is state-invariant and is what both entries verify.
    // The ring's *inner* edge against bg-brand in the on state (~1:1,
    // effectively invisible — see toggle.contract.md's Verification note)
    // is deliberately NOT checked here, since only the outer/page boundary
    // is the one WCAG 1.4.11 cares about for this control.
    name: "Toggle track ring, on state (ring-neutral-500 vs bg-neutral-50 page — outer edge, state-invariant)",
    fg: "neutral-500",
    bg: "neutral-50",
    threshold: NON_TEXT_UI_AA,
  },
  {
    name: "Text Input / Select focus ring (ring-brand vs bg-neutral-50 page)",
    fg: "brand",
    bg: "neutral-50",
    threshold: NON_TEXT_UI_AA,
  },
  {
    name: "Text Input / Select error ring (ring-error vs bg-neutral-50 page)",
    fg: "error",
    bg: "neutral-50",
    threshold: NON_TEXT_UI_AA,
  },
  {
    // Not a literal `ring-*` class — `close-icon-btn`'s SVG icon fill
    // (`text-neutral-600`, via `fill="currentColor"`, hover state). Listed
    // here rather than PAIRINGS because an icon fill is a WCAG 1.4.11
    // non-text boundary (3:1), not literal text (7:1) — see
    // ICON_FILL_TEXT_TOKENS below, which is what lets the text- coverage
    // scan accept this entry as sufficient for `text-neutral-600`. Used
    // inside Modal/Toast/Slide-over panels, all bg-neutral-50 (feature 017
    // retrofit; previously literal bg-white).
    name: "close-icon-btn icon fill, hover (text-neutral-600 vs bg-neutral-50 panel)",
    fg: "neutral-600",
    bg: "neutral-50",
    threshold: NON_TEXT_UI_AA,
  },
  {
    // Feature 014 (research.md R1) — Progress's fill against its own
    // track, not against the page. Not a literal `ring-*` class, but the
    // identical WCAG 1.4.11 non-text-boundary check applies to any two
    // adjacent solid UI-component colors that must be distinguishable.
    name: "Progress fill vs track (bg-brand-dark vs bg-neutral-200)",
    fg: "brand-dark",
    bg: "neutral-200",
    threshold: NON_TEXT_UI_AA,
  },
];

// Feature 017 Phase 4 (P1 pilot batch: corporate/forest/nord/dracula/
// business) — real, documented per-theme exceptions to the pass/fail
// gate above, in the same spirit as ICON_FILL_TEXT_TOKENS/
// DECORATIVE_ARIA_HIDDEN_TOKENS' already-accepted precedent (a real gap,
// explicitly named and reasoned about, not silently swallowed). Two
// distinct categories, not conflated:
//
// STRUCTURAL (forest/dracula/business — every dark theme in this batch):
// this catalog's fixed 21-token schema has several tokens used in TWO
// roles that invert for a dark theme and cannot both be satisfied by one
// value (see shared/design-tokens.ts THEMES["forest"].sourceReference
// for the full reasoning) —
//   - Indicator (text-white on bg-*-strong): *-strong was derived to win
//     the far more common ink-on-page role (Badge/Alert/etc.) instead.
//   - Tooltip / Sidebar dark-item-text / Progress-track: these hardcode
//     an ABSOLUTE neutral-900/700/200 shade assuming it's always dark
//     (a deliberate "always-dark surface" component identity, ratified
//     before this catalog supported dark THEMES) — under a dark THEME,
//     that same neutral step is now light, inverting the pairing.
//   - Back-link (text-brand-dark on the page): brand-dark was derived to
//     win Button primary's white-text-fill role instead (this catalog's
//     single most central component), the same trade-off as *-strong.
//
// TUNING (a genuine, achievable-in-principle gap in this P1 batch's
// neutral-ramp interpolation, not a structural conflict — flagged for a
// future refinement pass, not silently accepted as permanent): Badge
// neutral, Avatar fallback initials, and Corporate/Nord's Sidebar/Kbd
// entries sit close to (5.2-6.9:1) but under the 7:1 floor. Two
// interpolation curves were tried (t^0.8, t^0.68) with mixed, not
// uniformly better, results across the 5 themes' differing hue/chroma —
// a real per-theme anchor-point tuning pass, not a one-line fix, so it's
// deferred rather than open-endedly iterated on here.
const KNOWN_THEME_CONTRAST_GAPS = new Set([
  "forest:Indicator success (text-white on bg-success-strong)",
  "forest:Indicator warning (text-white on bg-warning-strong)",
  "forest:Indicator error (text-white on bg-error-strong)",
  "forest:Indicator info (text-white on bg-info-strong)",
  "forest:Indicator neutral (text-white on bg-neutral-700)",
  "forest:Tooltip label text (text-white on bg-neutral-900)",
  "forest:Sidebar dark item text (text-neutral-300 on bg-neutral-900)",
  "forest:Progress fill vs track (bg-brand-dark vs bg-neutral-200)",
  "forest:Back-link / demo-link text (text-brand-dark on bg-neutral-50)",
  "forest:Badge neutral (text-neutral-600 on bg-neutral-50)",
  "forest:Avatar fallback initials (text-neutral-700 on bg-neutral-100)",
  "dracula:Indicator success (text-white on bg-success-strong)",
  "dracula:Indicator warning (text-white on bg-warning-strong)",
  "dracula:Indicator error (text-white on bg-error-strong)",
  "dracula:Indicator info (text-white on bg-info-strong)",
  "dracula:Indicator neutral (text-white on bg-neutral-700)",
  "dracula:Tooltip label text (text-white on bg-neutral-900)",
  "dracula:Sidebar dark item text (text-neutral-300 on bg-neutral-900)",
  "dracula:Progress fill vs track (bg-brand-dark vs bg-neutral-200)",
  "dracula:Back-link / demo-link text (text-brand-dark on bg-neutral-50)",
  "dracula:Avatar fallback initials (text-neutral-700 on bg-neutral-100)",
  "business:Indicator success (text-white on bg-success-strong)",
  "business:Indicator warning (text-white on bg-warning-strong)",
  "business:Indicator error (text-white on bg-error-strong)",
  "business:Indicator info (text-white on bg-info-strong)",
  "business:Indicator neutral (text-white on bg-neutral-700)",
  "business:Tooltip label text (text-white on bg-neutral-900)",
  "business:Sidebar dark item text (text-neutral-300 on bg-neutral-900)",
  "business:Progress fill vs track (bg-brand-dark vs bg-neutral-200)",
  "business:Back-link / demo-link text (text-brand-dark on bg-neutral-50)",
  "business:Badge neutral (text-neutral-600 on bg-neutral-50)",
  "business:Avatar fallback initials (text-neutral-700 on bg-neutral-100)",
  "corporate:Sidebar dark item text (text-neutral-300 on bg-neutral-900)",
  "nord:Badge neutral (text-neutral-600 on bg-neutral-50)",
  "nord:Avatar fallback initials (text-neutral-700 on bg-neutral-100)",
  "nord:Sidebar dark item text (text-neutral-300 on bg-neutral-900)",
  "nord:Sidebar light item text (text-neutral-700 on bg-neutral-50)",
  "nord:Kbd text (text-neutral-700 on bg-neutral-50)",

  // Phase 5 (P2 batch, 13 themes: cosmo/flatly/litera/lumen/zephyr/
  // sandstone from Bootswatch; silk/winter/cupcake/garden/autumn/
  // lemonade/caramellatte from DaisyUI). All 13 are LIGHT themes — none
  // of these are the dark-theme dual-role conflict documented above; all
  // are the same TUNING category as corporate/nord's entries above.
  // Bootswatch-sourced themes' neutral-100..900 are Bootstrap's own real,
  // unmodified gray-100..900 scale (shared/design-tokens.ts's
  // sourceReference), which Bootstrap itself designed against WCAG AA
  // (4.5:1), not this catalog's stricter self-imposed AAA (7:1) bar —
  // several real gray-500/600 steps (e.g. Bootstrap's actual "muted"
  // gray, #ADB5BD) don't even clear the 3:1 non-text floor against
  // white. DaisyUI-sourced themes hit the same close-miss ramp-tuning
  // limitation already documented for corporate/nord above.
  "cosmo:Badge neutral (text-neutral-600 on bg-neutral-50)",
  "cosmo:Toggle track ring, off state (ring-neutral-500 vs bg-neutral-50 page)",
  "cosmo:Toggle track ring, on state (ring-neutral-500 vs bg-neutral-50 page — outer edge, state-invariant)",
  "flatly:Badge neutral (text-neutral-600 on bg-neutral-50)",
  "flatly:Avatar fallback initials (text-neutral-700 on bg-neutral-100)",
  "flatly:Sidebar light item text (text-neutral-700 on bg-neutral-50)",
  "flatly:Kbd text (text-neutral-700 on bg-neutral-50)",
  "flatly:Indicator neutral (text-white on bg-neutral-700)",
  "flatly:Toggle track ring, off state (ring-neutral-500 vs bg-neutral-50 page)",
  "flatly:Toggle track ring, on state (ring-neutral-500 vs bg-neutral-50 page — outer edge, state-invariant)",
  "flatly:close-icon-btn icon fill, hover (text-neutral-600 vs bg-neutral-50 panel)",
  "litera:Badge neutral (text-neutral-600 on bg-neutral-50)",
  "litera:Toggle track ring, off state (ring-neutral-500 vs bg-neutral-50 page)",
  "litera:Toggle track ring, on state (ring-neutral-500 vs bg-neutral-50 page — outer edge, state-invariant)",
  "lumen:Badge neutral (text-neutral-600 on bg-neutral-50)",
  "lumen:Avatar fallback initials (text-neutral-700 on bg-neutral-100)",
  "lumen:Toggle track ring, off state (ring-neutral-500 vs bg-neutral-50 page)",
  "lumen:Toggle track ring, on state (ring-neutral-500 vs bg-neutral-50 page — outer edge, state-invariant)",
  "lumen:close-icon-btn icon fill, hover (text-neutral-600 vs bg-neutral-50 panel)",
  "zephyr:Badge neutral (text-neutral-600 on bg-neutral-50)",
  "zephyr:Toggle track ring, off state (ring-neutral-500 vs bg-neutral-50 page)",
  "zephyr:Toggle track ring, on state (ring-neutral-500 vs bg-neutral-50 page — outer edge, state-invariant)",
  "silk:Button secondary text hover (text-neutral-900 on bg-neutral-100)",
  "silk:Badge neutral (text-neutral-600 on bg-neutral-50)",
  "silk:Avatar fallback initials (text-neutral-700 on bg-neutral-100)",
  "silk:Sidebar dark item text (text-neutral-300 on bg-neutral-900)",
  "silk:Sidebar light item text (text-neutral-700 on bg-neutral-50)",
  "silk:Kbd text (text-neutral-700 on bg-neutral-50)",
  "silk:Indicator neutral (text-white on bg-neutral-700)",
  "silk:Tab trigger active text (text-neutral-800 on bg-neutral-50)",
  "winter:Button secondary text hover (text-neutral-900 on bg-neutral-100)",
  "winter:Badge neutral (text-neutral-600 on bg-neutral-50)",
  "winter:Avatar fallback initials (text-neutral-700 on bg-neutral-100)",
  "winter:Sidebar dark item text (text-neutral-300 on bg-neutral-900)",
  "winter:Sidebar light item text (text-neutral-700 on bg-neutral-50)",
  "winter:Kbd text (text-neutral-700 on bg-neutral-50)",
  "winter:Indicator neutral (text-white on bg-neutral-700)",
  "winter:Tab trigger active text (text-neutral-800 on bg-neutral-50)",
  "cupcake:Avatar fallback initials (text-neutral-700 on bg-neutral-100)",
  "cupcake:Sidebar dark item text (text-neutral-300 on bg-neutral-900)",
  "sandstone:Badge neutral (text-neutral-600 on bg-neutral-50)",
  "sandstone:Toggle track ring, off state (ring-neutral-500 vs bg-neutral-50 page)",
  "sandstone:Toggle track ring, on state (ring-neutral-500 vs bg-neutral-50 page — outer edge, state-invariant)",
  "garden:Sidebar dark item text (text-neutral-300 on bg-neutral-900)",
  "autumn:Sidebar dark item text (text-neutral-300 on bg-neutral-900)",
  "lemonade:Sidebar dark item text (text-neutral-300 on bg-neutral-900)",
  "caramellatte:Button secondary text hover (text-neutral-900 on bg-neutral-100)",
  "caramellatte:Badge neutral (text-neutral-600 on bg-neutral-50)",
  "caramellatte:Avatar fallback initials (text-neutral-700 on bg-neutral-100)",
  "caramellatte:Sidebar dark item text (text-neutral-300 on bg-neutral-900)",
  "caramellatte:Sidebar light item text (text-neutral-700 on bg-neutral-50)",
  "caramellatte:Kbd text (text-neutral-700 on bg-neutral-50)",


  // Phase 6 + 7 (P3/P4 batches, 24 themes: everforest/gruvbox/aqua/
  // emerald/slate/spacelab/cerulean/quartz/journal/dim/night/darkly/
  // cyborg/superhero/abyss/synthwave/cyberpunk/tokyonight/halloween/
  // luxury/retro/coffee/rosepine/catppuccin). 17 of these 24 are dark
  // themes (only emerald/spacelab/cerulean/journal/quartz/cyberpunk/retro
  // are light) — the large majority of these entries are the SAME
  // structural dual-role conflict already documented above (forest/
  // dracula/business's Indicator/Tooltip/Sidebar-dark/Progress-track/
  // Back-link pattern), just multiplied across many more dark themes in
  // this batch; the remainder are the same TUNING category (Badge/
  // Avatar/Kbd/Sidebar-light neutral-ramp close-misses) already
  // documented for corporate/nord/cosmo-etc. above.
  //
  // QUARTZ-INVERTED-RAMP: quartz's 21 entries below are NOT ordinary
  // TUNING close-misses (unlike this comment previously claimed) — most
  // measure well below the 5.2-6.9:1 TUNING band (e.g. Tooltip label
  // text 1.00:1, Indicator neutral 1.26:1, Sidebar dark item text
  // 2.31:1). The real cause: quartz's neutral-50 (page bg) is Bootswatch
  // Quartz's own real mid-luminance purple, which forces its derived
  // neutral-900 to resolve to literal white instead of dark ink to stay
  // in-gamut — the opposite ramp direction every other "light" theme
  // uses. This reproduces the SAME "components assume neutral-900 is
  // always dark ink" structural conflict documented above for dark
  // themes, just triggered by an atypically-toned light theme's own page
  // background rather than by genuine dark-theme status. One entry
  // (Button focus-visible outline) is a distinct, additional issue: its
  // own unusually-bright purple body-bg caps the maximum achievable
  // contrast even at literal black (see shared/design-tokens.ts's
  // sourceReference for the exact numbers).
  "everforest:Button secondary text hover (text-neutral-900 on bg-neutral-100)",
  "everforest:Badge neutral (text-neutral-600 on bg-neutral-50)",
  "everforest:Back-link / demo-link text (text-brand-dark on bg-neutral-50)",
  "everforest:Avatar fallback initials (text-neutral-700 on bg-neutral-100)",
  "everforest:Sidebar dark item text (text-neutral-300 on bg-neutral-900)",
  "everforest:Sidebar light item text (text-neutral-700 on bg-neutral-50)",
  "everforest:Tooltip label text (text-white on bg-neutral-900)",
  "everforest:Kbd text (text-neutral-700 on bg-neutral-50)",
  "everforest:Indicator success (text-white on bg-success-strong)",
  "everforest:Indicator warning (text-white on bg-warning-strong)",
  "everforest:Indicator error (text-white on bg-error-strong)",
  "everforest:Indicator info (text-white on bg-info-strong)",
  "everforest:Indicator neutral (text-white on bg-neutral-700)",
  "everforest:Progress fill vs track (bg-brand-dark vs bg-neutral-200)",
  "gruvbox:Badge neutral (text-neutral-600 on bg-neutral-50)",
  "gruvbox:Back-link / demo-link text (text-brand-dark on bg-neutral-50)",
  "gruvbox:Avatar fallback initials (text-neutral-700 on bg-neutral-100)",
  "gruvbox:Sidebar dark item text (text-neutral-300 on bg-neutral-900)",
  "gruvbox:Tooltip label text (text-white on bg-neutral-900)",
  "gruvbox:Indicator success (text-white on bg-success-strong)",
  "gruvbox:Indicator warning (text-white on bg-warning-strong)",
  "gruvbox:Indicator error (text-white on bg-error-strong)",
  "gruvbox:Indicator info (text-white on bg-info-strong)",
  "gruvbox:Indicator neutral (text-white on bg-neutral-700)",
  "gruvbox:Progress fill vs track (bg-brand-dark vs bg-neutral-200)",
  "aqua:Button secondary text hover (text-neutral-900 on bg-neutral-100)",
  "aqua:Text Input error message (text-error-strong on bg-neutral-50)",
  "aqua:Badge error (text-error-strong on bg-error/5)",
  "aqua:Badge neutral (text-neutral-600 on bg-neutral-50)",
  "aqua:Back-link / demo-link text (text-brand-dark on bg-neutral-50)",
  "aqua:Avatar fallback initials (text-neutral-700 on bg-neutral-100)",
  "aqua:Sidebar dark item text (text-neutral-300 on bg-neutral-900)",
  "aqua:Sidebar light item text (text-neutral-700 on bg-neutral-50)",
  "aqua:Tooltip label text (text-white on bg-neutral-900)",
  "aqua:Kbd text (text-neutral-700 on bg-neutral-50)",
  "aqua:Indicator success (text-white on bg-success-strong)",
  "aqua:Indicator warning (text-white on bg-warning-strong)",
  "aqua:Indicator error (text-white on bg-error-strong)",
  "aqua:Indicator info (text-white on bg-info-strong)",
  "aqua:Indicator neutral (text-white on bg-neutral-700)",
  "aqua:Tab trigger active text (text-neutral-800 on bg-neutral-50)",
  "aqua:Progress fill vs track (bg-brand-dark vs bg-neutral-200)",
  "emerald:Badge neutral (text-neutral-600 on bg-neutral-50)",
  "emerald:Avatar fallback initials (text-neutral-700 on bg-neutral-100)",
  "emerald:Sidebar dark item text (text-neutral-300 on bg-neutral-900)",
  "emerald:Sidebar light item text (text-neutral-700 on bg-neutral-50)",
  "emerald:Kbd text (text-neutral-700 on bg-neutral-50)",
  "emerald:Indicator neutral (text-white on bg-neutral-700)",
  "slate:Button secondary text (text-neutral-900 on bg-neutral-50)",
  "slate:Button secondary text hover (text-neutral-900 on bg-neutral-100)",
  "slate:Text Input label/value (text-neutral-900 on bg-neutral-50)",
  "slate:Badge neutral (text-neutral-600 on bg-neutral-50)",
  "slate:Checkbox label (text-neutral-900 on bg-neutral-50)",
  "slate:Back-link / demo-link text (text-brand-dark on bg-neutral-50)",
  "slate:Avatar fallback initials (text-neutral-700 on bg-neutral-100)",
  "slate:Sidebar dark item text (text-neutral-300 on bg-neutral-900)",
  "slate:Sidebar light item text (text-neutral-700 on bg-neutral-50)",
  "slate:Tooltip label text (text-white on bg-neutral-900)",
  "slate:Kbd text (text-neutral-700 on bg-neutral-50)",
  "slate:Indicator success (text-white on bg-success-strong)",
  "slate:Indicator warning (text-white on bg-warning-strong)",
  "slate:Indicator error (text-white on bg-error-strong)",
  "slate:Indicator info (text-white on bg-info-strong)",
  "slate:Indicator neutral (text-white on bg-neutral-700)",
  "slate:Tab trigger active text (text-neutral-800 on bg-neutral-50)",
  "slate:Progress fill vs track (bg-brand-dark vs bg-neutral-200)",
  "spacelab:Badge neutral (text-neutral-600 on bg-neutral-50)",
  "spacelab:Toggle track ring, off state (ring-neutral-500 vs bg-neutral-50 page)",
  "spacelab:Toggle track ring, on state (ring-neutral-500 vs bg-neutral-50 page — outer edge, state-invariant)",
  "cerulean:Badge neutral (text-neutral-600 on bg-neutral-50)",
  "cerulean:Toggle track ring, off state (ring-neutral-500 vs bg-neutral-50 page)",
  "cerulean:Toggle track ring, on state (ring-neutral-500 vs bg-neutral-50 page — outer edge, state-invariant)",
  "quartz:Button secondary text (text-neutral-900 on bg-neutral-50)",
  "quartz:Button secondary text hover (text-neutral-900 on bg-neutral-100)",
  "quartz:Text Input label/value (text-neutral-900 on bg-neutral-50)",
  "quartz:Text Input error message (text-error-strong on bg-neutral-50)",
  "quartz:Badge success (text-success-strong on bg-success/5)",
  "quartz:Badge error (text-error-strong on bg-error/5)",
  "quartz:Badge warning (text-warning-strong on bg-warning/5)",
  "quartz:Badge neutral (text-neutral-600 on bg-neutral-50)",
  "quartz:Checkbox label (text-neutral-900 on bg-neutral-50)",
  "quartz:Button focus-visible outline (bg-brand on bg-neutral-50, non-text UI boundary)",
  "quartz:Back-link / demo-link text (text-brand-dark on bg-neutral-50)",
  "quartz:Avatar fallback initials (text-neutral-700 on bg-neutral-100)",
  "quartz:Alert info icon (text-info-strong on bg-info/5)",
  "quartz:Sidebar dark item text (text-neutral-300 on bg-neutral-900)",
  "quartz:Sidebar light item text (text-neutral-700 on bg-neutral-50)",
  "quartz:Tooltip label text (text-white on bg-neutral-900)",
  "quartz:Kbd text (text-neutral-700 on bg-neutral-50)",
  "quartz:Indicator neutral (text-white on bg-neutral-700)",
  "quartz:Tab trigger active text (text-neutral-800 on bg-neutral-50)",
  "quartz:Toggle track ring, off state (ring-neutral-500 vs bg-neutral-50 page)",
  "quartz:Toggle track ring, on state (ring-neutral-500 vs bg-neutral-50 page — outer edge, state-invariant)",
  "journal:Badge neutral (text-neutral-600 on bg-neutral-50)",
  "journal:Toggle track ring, off state (ring-neutral-500 vs bg-neutral-50 page)",
  "journal:Toggle track ring, on state (ring-neutral-500 vs bg-neutral-50 page — outer edge, state-invariant)",
  "dim:Button secondary text hover (text-neutral-900 on bg-neutral-100)",
  "dim:Badge neutral (text-neutral-600 on bg-neutral-50)",
  "dim:Back-link / demo-link text (text-brand-dark on bg-neutral-50)",
  "dim:Avatar fallback initials (text-neutral-700 on bg-neutral-100)",
  "dim:Sidebar dark item text (text-neutral-300 on bg-neutral-900)",
  "dim:Sidebar light item text (text-neutral-700 on bg-neutral-50)",
  "dim:Tooltip label text (text-white on bg-neutral-900)",
  "dim:Kbd text (text-neutral-700 on bg-neutral-50)",
  "dim:Indicator success (text-white on bg-success-strong)",
  "dim:Indicator warning (text-white on bg-warning-strong)",
  "dim:Indicator error (text-white on bg-error-strong)",
  "dim:Indicator info (text-white on bg-info-strong)",
  "dim:Indicator neutral (text-white on bg-neutral-700)",
  "dim:Tab trigger active text (text-neutral-800 on bg-neutral-50)",
  "dim:Progress fill vs track (bg-brand-dark vs bg-neutral-200)",
  "night:Badge neutral (text-neutral-600 on bg-neutral-50)",
  "night:Back-link / demo-link text (text-brand-dark on bg-neutral-50)",
  "night:Avatar fallback initials (text-neutral-700 on bg-neutral-100)",
  "night:Sidebar dark item text (text-neutral-300 on bg-neutral-900)",
  "night:Tooltip label text (text-white on bg-neutral-900)",
  "night:Indicator success (text-white on bg-success-strong)",
  "night:Indicator warning (text-white on bg-warning-strong)",
  "night:Indicator error (text-white on bg-error-strong)",
  "night:Indicator info (text-white on bg-info-strong)",
  "night:Indicator neutral (text-white on bg-neutral-700)",
  "night:Progress fill vs track (bg-brand-dark vs bg-neutral-200)",
  "darkly:Back-link / demo-link text (text-brand-dark on bg-neutral-50)",
  "darkly:Avatar fallback initials (text-neutral-700 on bg-neutral-100)",
  "darkly:Sidebar dark item text (text-neutral-300 on bg-neutral-900)",
  "darkly:Tooltip label text (text-white on bg-neutral-900)",
  "darkly:Indicator success (text-white on bg-success-strong)",
  "darkly:Indicator warning (text-white on bg-warning-strong)",
  "darkly:Indicator error (text-white on bg-error-strong)",
  "darkly:Indicator info (text-white on bg-info-strong)",
  "darkly:Indicator neutral (text-white on bg-neutral-700)",
  "darkly:Progress fill vs track (bg-brand-dark vs bg-neutral-200)",
  "cyborg:Badge neutral (text-neutral-600 on bg-neutral-50)",
  "cyborg:Back-link / demo-link text (text-brand-dark on bg-neutral-50)",
  "cyborg:Avatar fallback initials (text-neutral-700 on bg-neutral-100)",
  "cyborg:Sidebar dark item text (text-neutral-300 on bg-neutral-900)",
  "cyborg:Sidebar light item text (text-neutral-700 on bg-neutral-50)",
  "cyborg:Tooltip label text (text-white on bg-neutral-900)",
  "cyborg:Kbd text (text-neutral-700 on bg-neutral-50)",
  "cyborg:Indicator success (text-white on bg-success-strong)",
  "cyborg:Indicator warning (text-white on bg-warning-strong)",
  "cyborg:Indicator error (text-white on bg-error-strong)",
  "cyborg:Indicator info (text-white on bg-info-strong)",
  "cyborg:Indicator neutral (text-white on bg-neutral-700)",
  "cyborg:Progress fill vs track (bg-brand-dark vs bg-neutral-200)",
  "superhero:Back-link / demo-link text (text-brand-dark on bg-neutral-50)",
  "superhero:Avatar fallback initials (text-neutral-700 on bg-neutral-100)",
  "superhero:Sidebar dark item text (text-neutral-300 on bg-neutral-900)",
  "superhero:Tooltip label text (text-white on bg-neutral-900)",
  "superhero:Indicator success (text-white on bg-success-strong)",
  "superhero:Indicator warning (text-white on bg-warning-strong)",
  "superhero:Indicator error (text-white on bg-error-strong)",
  "superhero:Indicator info (text-white on bg-info-strong)",
  "superhero:Indicator neutral (text-white on bg-neutral-700)",
  "superhero:Progress fill vs track (bg-brand-dark vs bg-neutral-200)",
  "abyss:Badge neutral (text-neutral-600 on bg-neutral-50)",
  "abyss:Back-link / demo-link text (text-brand-dark on bg-neutral-50)",
  "abyss:Avatar fallback initials (text-neutral-700 on bg-neutral-100)",
  "abyss:Sidebar dark item text (text-neutral-300 on bg-neutral-900)",
  "abyss:Tooltip label text (text-white on bg-neutral-900)",
  "abyss:Indicator success (text-white on bg-success-strong)",
  "abyss:Indicator warning (text-white on bg-warning-strong)",
  "abyss:Indicator error (text-white on bg-error-strong)",
  "abyss:Indicator info (text-white on bg-info-strong)",
  "abyss:Indicator neutral (text-white on bg-neutral-700)",
  "abyss:Progress fill vs track (bg-brand-dark vs bg-neutral-200)",
  "synthwave:Badge neutral (text-neutral-600 on bg-neutral-50)",
  "synthwave:Back-link / demo-link text (text-brand-dark on bg-neutral-50)",
  "synthwave:Avatar fallback initials (text-neutral-700 on bg-neutral-100)",
  "synthwave:Sidebar dark item text (text-neutral-300 on bg-neutral-900)",
  "synthwave:Sidebar light item text (text-neutral-700 on bg-neutral-50)",
  "synthwave:Tooltip label text (text-white on bg-neutral-900)",
  "synthwave:Kbd text (text-neutral-700 on bg-neutral-50)",
  "synthwave:Indicator success (text-white on bg-success-strong)",
  "synthwave:Indicator warning (text-white on bg-warning-strong)",
  "synthwave:Indicator error (text-white on bg-error-strong)",
  "synthwave:Indicator info (text-white on bg-info-strong)",
  "synthwave:Indicator neutral (text-white on bg-neutral-700)",
  "synthwave:Progress fill vs track (bg-brand-dark vs bg-neutral-200)",
  "cyberpunk:Sidebar dark item text (text-neutral-300 on bg-neutral-900)",
  "cyberpunk:Progress fill vs track (bg-brand-dark vs bg-neutral-200)",
  "tokyonight:Badge neutral (text-neutral-600 on bg-neutral-50)",
  "tokyonight:Back-link / demo-link text (text-brand-dark on bg-neutral-50)",
  "tokyonight:Avatar fallback initials (text-neutral-700 on bg-neutral-100)",
  "tokyonight:Sidebar dark item text (text-neutral-300 on bg-neutral-900)",
  "tokyonight:Tooltip label text (text-white on bg-neutral-900)",
  "tokyonight:Indicator success (text-white on bg-success-strong)",
  "tokyonight:Indicator warning (text-white on bg-warning-strong)",
  "tokyonight:Indicator error (text-white on bg-error-strong)",
  "tokyonight:Indicator info (text-white on bg-info-strong)",
  "tokyonight:Indicator neutral (text-white on bg-neutral-700)",
  "tokyonight:Progress fill vs track (bg-brand-dark vs bg-neutral-200)",
  "halloween:Badge neutral (text-neutral-600 on bg-neutral-50)",
  "halloween:Back-link / demo-link text (text-brand-dark on bg-neutral-50)",
  "halloween:Avatar fallback initials (text-neutral-700 on bg-neutral-100)",
  "halloween:Sidebar dark item text (text-neutral-300 on bg-neutral-900)",
  "halloween:Tooltip label text (text-white on bg-neutral-900)",
  "halloween:Indicator success (text-white on bg-success-strong)",
  "halloween:Indicator warning (text-white on bg-warning-strong)",
  "halloween:Indicator error (text-white on bg-error-strong)",
  "halloween:Indicator info (text-white on bg-info-strong)",
  "halloween:Indicator neutral (text-white on bg-neutral-700)",
  "halloween:Progress fill vs track (bg-brand-dark vs bg-neutral-200)",
  "luxury:Badge neutral (text-neutral-600 on bg-neutral-50)",
  "luxury:Back-link / demo-link text (text-brand-dark on bg-neutral-50)",
  "luxury:Avatar fallback initials (text-neutral-700 on bg-neutral-100)",
  "luxury:Sidebar dark item text (text-neutral-300 on bg-neutral-900)",
  "luxury:Sidebar light item text (text-neutral-700 on bg-neutral-50)",
  "luxury:Tooltip label text (text-white on bg-neutral-900)",
  "luxury:Kbd text (text-neutral-700 on bg-neutral-50)",
  "luxury:Indicator success (text-white on bg-success-strong)",
  "luxury:Indicator warning (text-white on bg-warning-strong)",
  "luxury:Indicator error (text-white on bg-error-strong)",
  "luxury:Indicator info (text-white on bg-info-strong)",
  "luxury:Indicator neutral (text-white on bg-neutral-700)",
  "luxury:Progress fill vs track (bg-brand-dark vs bg-neutral-200)",
  "retro:Button secondary text hover (text-neutral-900 on bg-neutral-100)",
  "retro:Badge neutral (text-neutral-600 on bg-neutral-50)",
  "retro:Avatar fallback initials (text-neutral-700 on bg-neutral-100)",
  "retro:Sidebar dark item text (text-neutral-300 on bg-neutral-900)",
  "retro:Sidebar light item text (text-neutral-700 on bg-neutral-50)",
  "retro:Kbd text (text-neutral-700 on bg-neutral-50)",
  "retro:Indicator neutral (text-white on bg-neutral-700)",
  "retro:Tab trigger active text (text-neutral-800 on bg-neutral-50)",
  "coffee:Button secondary text (text-neutral-900 on bg-neutral-50)",
  "coffee:Button secondary text hover (text-neutral-900 on bg-neutral-100)",
  "coffee:Text Input label/value (text-neutral-900 on bg-neutral-50)",
  "coffee:Badge neutral (text-neutral-600 on bg-neutral-50)",
  "coffee:Checkbox label (text-neutral-900 on bg-neutral-50)",
  "coffee:Back-link / demo-link text (text-brand-dark on bg-neutral-50)",
  "coffee:Avatar fallback initials (text-neutral-700 on bg-neutral-100)",
  "coffee:Sidebar dark item text (text-neutral-300 on bg-neutral-900)",
  "coffee:Sidebar light item text (text-neutral-700 on bg-neutral-50)",
  "coffee:Tooltip label text (text-white on bg-neutral-900)",
  "coffee:Kbd text (text-neutral-700 on bg-neutral-50)",
  "coffee:Indicator success (text-white on bg-success-strong)",
  "coffee:Indicator warning (text-white on bg-warning-strong)",
  "coffee:Indicator error (text-white on bg-error-strong)",
  "coffee:Indicator info (text-white on bg-info-strong)",
  "coffee:Indicator neutral (text-white on bg-neutral-700)",
  "coffee:Tab trigger active text (text-neutral-800 on bg-neutral-50)",
  "coffee:Progress fill vs track (bg-brand-dark vs bg-neutral-200)",
  "rosepine:Badge neutral (text-neutral-600 on bg-neutral-50)",
  "rosepine:Back-link / demo-link text (text-brand-dark on bg-neutral-50)",
  "rosepine:Avatar fallback initials (text-neutral-700 on bg-neutral-100)",
  "rosepine:Sidebar dark item text (text-neutral-300 on bg-neutral-900)",
  "rosepine:Tooltip label text (text-white on bg-neutral-900)",
  "rosepine:Indicator success (text-white on bg-success-strong)",
  "rosepine:Indicator warning (text-white on bg-warning-strong)",
  "rosepine:Indicator error (text-white on bg-error-strong)",
  "rosepine:Indicator info (text-white on bg-info-strong)",
  "rosepine:Indicator neutral (text-white on bg-neutral-700)",
  "rosepine:Progress fill vs track (bg-brand-dark vs bg-neutral-200)",
  "catppuccin:Badge neutral (text-neutral-600 on bg-neutral-50)",
  "catppuccin:Back-link / demo-link text (text-brand-dark on bg-neutral-50)",
  "catppuccin:Avatar fallback initials (text-neutral-700 on bg-neutral-100)",
  "catppuccin:Sidebar dark item text (text-neutral-300 on bg-neutral-900)",
  "catppuccin:Tooltip label text (text-white on bg-neutral-900)",
  "catppuccin:Indicator success (text-white on bg-success-strong)",
  "catppuccin:Indicator warning (text-white on bg-warning-strong)",
  "catppuccin:Indicator error (text-white on bg-error-strong)",
  "catppuccin:Indicator info (text-white on bg-info-strong)",
  "catppuccin:Indicator neutral (text-white on bg-neutral-700)",
  "catppuccin:Progress fill vs track (bg-brand-dark vs bg-neutral-200)",
  "caramellatte:Indicator neutral (text-white on bg-neutral-700)",

  // Feature 027 (Claude-Design-inspired batch 2). obsidian/nebula are
  // this batch's 2 dark themes and inherit the exact same structural
  // limitation already documented above for forest/dracula/business/
  // rosepine/catppuccin: a token used both as ink-on-page text AND as
  // Indicator's solid-fill-behind-white-text can't satisfy both roles
  // on a dark canvas — the ink-on-page role wins (Badge/Alert are more
  // widely used), so Indicator's/Tooltip's white-on-*-strong text and
  // Progress's brand-dark-vs-neutral-200 fill fail here too, same as
  // every other dark theme in this catalog. linen/nebula's "Sidebar
  // dark item text" and obsidian/nebula's "Back-link / demo-link
  // text" are the same recurring pairings already accepted for
  // forest/dracula/business/nord/catppuccin above. "Button focus-
  // visible outline" and "Badge success/error" are the same pairing
  // types already accepted for quartz/aqua — a real, signature brand
  // hue landing just under the non-text 4.5:1 / text 7:1 bar against
  // that theme's own real page background, not a defect unique to
  // this batch.
  "obsidian:Button focus-visible outline (bg-brand on bg-neutral-50, non-text UI boundary)",
  "obsidian:Back-link / demo-link text (text-brand-dark on bg-neutral-50)",
  "obsidian:Tooltip label text (text-white on bg-neutral-900)",
  "obsidian:Indicator success (text-white on bg-success-strong)",
  "obsidian:Indicator warning (text-white on bg-warning-strong)",
  "obsidian:Indicator error (text-white on bg-error-strong)",
  "obsidian:Indicator info (text-white on bg-info-strong)",
  "obsidian:Indicator neutral (text-white on bg-neutral-700)",
  "obsidian:Progress fill vs track (bg-brand-dark vs bg-neutral-200)",
  "linen:Badge success (text-success-strong on bg-success/5)",
  "linen:Button focus-visible outline (bg-brand on bg-neutral-50, non-text UI boundary)",
  "linen:Sidebar dark item text (text-neutral-300 on bg-neutral-900)",
  "graphite:Button focus-visible outline (bg-brand on bg-neutral-50, non-text UI boundary)",
  "nebula:Badge error (text-error-strong on bg-error/5)",
  "nebula:Button focus-visible outline (bg-brand on bg-neutral-50, non-text UI boundary)",
  "nebula:Back-link / demo-link text (text-brand-dark on bg-neutral-50)",
  "nebula:Sidebar dark item text (text-neutral-300 on bg-neutral-900)",
  "nebula:Tooltip label text (text-white on bg-neutral-900)",
  "nebula:Indicator success (text-white on bg-success-strong)",
  "nebula:Indicator warning (text-white on bg-warning-strong)",
  "nebula:Indicator error (text-white on bg-error-strong)",
  "nebula:Indicator info (text-white on bg-info-strong)",
  "nebula:Indicator neutral (text-white on bg-neutral-700)",
  "nebula:Text Input / Select focus ring (ring-brand vs bg-neutral-50 page)",
  "nebula:Progress fill vs track (bg-brand-dark vs bg-neutral-200)",
]);

let failures = [];
let acceptedGaps = [];

for (const theme of THEMES) {
  const missingKeys = REQUIRED_KEYS.filter((key) => !theme.tokens[key]);
  if (missingKeys.length > 0) {
    // T009a (completeness check): a theme silently missing a required
    // property would otherwise fall back to `:root`'s ("light"'s) value
    // for that one property in the shipped CSS, passing this audit
    // undetected while shipping a broken/incomplete theme — fail loudly
    // instead, and skip this theme's pairing checks below (their computed
    // ratios would be meaningless against undefined token values).
    failures.push(
      `[theme: ${theme.id}] incomplete theme definition — missing required ` +
        `token(s): ${missingKeys.join(", ")} (contracts/theme-tokens.contract.md's 21-property requirement)`,
    );
    continue;
  }

  const TOKENS = buildTokenMap(theme);

  for (const { name, fg, bg, threshold } of [...PAIRINGS, ...RING_PAIRINGS]) {
    const fgHex = TOKENS[fg];
    const bgHex = TOKENS[bg];
    if (!fgHex || !bgHex) {
      failures.push(
        `[theme: ${theme.id}] ${name}: unknown token "${!fgHex ? fg : bg}" — add it to buildTokenMap()`,
      );
      continue;
    }
    const ratio = hex(fgHex, bgHex);
    if (ratio < threshold) {
      const key = `${theme.id}:${name}`;
      if (KNOWN_THEME_CONTRAST_GAPS.has(key)) {
        acceptedGaps.push(
          `[theme: ${theme.id}] ${name}: ${ratio.toFixed(2)}:1 — below ${threshold}:1, ` +
            `documented known gap (KNOWN_THEME_CONTRAST_GAPS)`,
        );
      } else {
        failures.push(
          `[theme: ${theme.id}] ${name}: ${ratio.toFixed(2)}:1 — below required ${threshold}:1 (${fgHex} on ${bgHex})`,
        );
      }
    }
  }
}

// --- Coverage check: every text-<token> color class actually shipped must
// have at least one PAIRING entry, or a real combination could ship with
// zero contrast verification. Theme-independent: this checks that a token
// NAME is audited somewhere, not any one theme's hex value. ---

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

// `text-*` classes are usually literal rendered text (AAA, 7:1 — PAIRINGS'
// bar), but a handful drive an SVG icon's `fill="currentColor"` instead
// (feature 003's `close-icon-btn`: `text-neutral-500`/`text-neutral-600` set
// the icon's fill, not any character glyph). The correct bar for an icon
// is WCAG 1.4.11 non-text (3:1, RING_PAIRINGS' bar), which is *lower* than
// AAA text — forcing these through PAIRINGS' 7:1 check would either fail a
// perfectly compliant icon color or force adding a misleading "text" pairing
// entry for something that isn't text. Tokens listed here are known,
// explicitly-reviewed icon-fill uses; their coverage is satisfied by an
// existing RING_PAIRINGS entry for the same token instead of PAIRINGS.
// Add a token here ONLY after confirming (by reading the component's
// contract) that every `text-<token>` use of it is an icon fill, never
// literal text — a token used for both would need separate handling.
const ICON_FILL_TEXT_TOKENS = new Set(["neutral-500", "neutral-600"]);
const RING_VERIFIED_TOKENS = new Set(RING_PAIRINGS.map((p) => p.fg));

// Feature 016 (Rating, research.md R2): a stricter sibling of
// ICON_FILL_TEXT_TOKENS above. Rating's filled-star glyph is an
// `aria-hidden` icon fill whose measured contrast (text-warning, 2.15:1)
// fails even the *lower* WCAG 1.4.11 non-text 3:1 floor that
// ICON_FILL_TEXT_TOKENS' RING_PAIRINGS path requires — so that mechanism
// doesn't apply here either. This is the same class of already-accepted
// decorative-element exception this catalog uses for Stepper's/Timeline's
// connector lines (feature 015 research.md R7) and Card's/Divider's
// border colors, just extending it to cover a `text-*` token caught by
// this scan (Stepper's connector is a `bg-*`/`border-*` token, which this
// scan never looks at). The exemption applies ONLY when every use of the
// token is: (a) inside an `aria-hidden="true"` element, and (b) the real
// information it would otherwise convey is separately rendered as normal
// visible text nearby (never the sole carrier of information). Add a
// token here ONLY after confirming both conditions by reading the
// component's actual markup/contract — never defensively. (Rating's
// empty-star token, `neutral-300`, needed no entry here at all — it
// already has its own unrelated PAIRINGS entry, "Sidebar dark item text",
// verified at 12.04:1 AAA, so it was already in COVERED_FG_TOKENS before
// this feature.)
// Feature 020 (ChartEmptyState): the empty-state.contract.md recipe
// (feature 014) ratified `text-neutral-400` for this exact decorative
// aria-hidden icon, but — like Rating before it — the pattern had never
// actually been built and empirically measured until now. Computed via
// the same WCAG relative-luminance formula: neutral-400 vs. neutral-50
// measures 2.54:1, failing even the 3:1 non-text floor. The icon is
// `aria-hidden="true"` and the "No data to display" heading right next to
// it carries the full meaning, so this is the identical decorative-icon
// exception class as Rating's star fill, not a new one.
const DECORATIVE_ARIA_HIDDEN_TOKENS = new Set(["warning", "neutral-400"]);

const htmlFiles = [
  join(rootDir, "index.html"),
  ...collectHtmlFiles(join(rootDir, "src", "components")),
];

// Also scan tailwind.css's `@apply` blocks — found by /speckit-analyze on
// feature 003: a `text-*` color class used only inside an @apply rule (e.g.
// a future `.some-component { @apply text-neutral-400 ...; }`) was invisible
// to this coverage scan, which only ever read HTML class="..." attributes.
// Every `@layer components` class since feature 001 had this same blind spot.
function extractApplyBlocks(cssSource) {
  const blocks = [];
  const pattern = /@apply\s+([\s\S]*?);/g;
  let match;
  while ((match = pattern.exec(cssSource)) !== null) {
    blocks.push(match[1]);
  }
  return blocks;
}

const tailwindCssPath = join(rootDir, "src", "styles", "tailwind.css");
const applyBlocks = extractApplyBlocks(readFileSync(tailwindCssPath, "utf8"));

// Extended to packages/react/src/styles.css (feature 004 — same rationale
// as audit-tokens.mjs's extension: the React package compiles its own
// @layer components block and needs the same coverage scan, not a free
// pass because it's a second file).
const reactStylesPath = join(rootDir, "packages", "react", "src", "styles.css");
const reactApplyBlocks = existsSync(reactStylesPath)
  ? extractApplyBlocks(readFileSync(reactStylesPath, "utf8"))
  : [];

function collectTsxFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === "dist") continue;
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      files.push(...collectTsxFiles(fullPath));
    } else if (extname(entry) === ".tsx") {
      files.push(fullPath);
    }
  }
  return files;
}

const reactSrcDir = join(rootDir, "packages", "react", "src");
const tsxFiles = existsSync(reactSrcDir) ? collectTsxFiles(reactSrcDir) : [];

const uncoveredTextTokens = new Set();

function scanClassesForCoverage(classes, sourceLabel) {
  for (const cls of classes) {
    const base = cls.split(":").pop(); // strip hover:/focus:/etc.
    if (!base.startsWith("text-")) continue;
    const suffix = base.slice("text-".length).split("/")[0]; // strip opacity modifier
    if (NON_COLOR_TEXT_SUFFIXES.has(suffix)) continue;
    if (!KNOWN_TOKEN_NAMES.has(suffix)) continue; // not a project color token (e.g. arbitrary value) — out of scope here
    if (COVERED_FG_TOKENS.has(suffix)) continue;
    if (ICON_FILL_TEXT_TOKENS.has(suffix) && RING_VERIFIED_TOKENS.has(suffix)) continue;
    if (DECORATIVE_ARIA_HIDDEN_TOKENS.has(suffix)) continue;
    uncoveredTextTokens.add(`${suffix} (seen in ${sourceLabel})`);
  }
}

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const classAttrPattern = /class="([^"]*)"/g;
  let match;
  while ((match = classAttrPattern.exec(html)) !== null) {
    scanClassesForCoverage(match[1].split(/\s+/).filter(Boolean), file.replace(rootDir, ""));
  }
}

for (const block of applyBlocks) {
  scanClassesForCoverage(block.split(/\s+/).filter(Boolean), "tailwind.css's @apply blocks");
}

for (const block of reactApplyBlocks) {
  scanClassesForCoverage(
    block.split(/\s+/).filter(Boolean),
    "packages/react/src/styles.css's @apply blocks",
  );
}

// Matches `const X_CLASSES: Record<..., string> = { key: "a b c", ... }`
// lookup tables (Badge's VARIANT_CLASSES, Toast's VARIANT_ICON_CLASSES):
// a fixed, enumerable set of static strings — not arbitrary template
// interpolation — so their text-color tokens must be covered the same as
// a literal className. Toast's icon color is only ever referenced via
// this table (`` className={`h-5 w-5 shrink-0 ${VARIANT_ICON_CLASSES[variant]}`} ``),
// so without this scan its tokens would silently evade coverage checking.
const lookupTablePattern = /:\s*Record<[^>]*,\s*string>\s*=\s*\{([^}]*)\}/g;
const lookupEntryPattern = /"([^"]*)"/g;

for (const file of tsxFiles) {
  const source = readFileSync(file, "utf8");
  const label = file.replace(rootDir, "");
  const classNamePattern = /className="([^"]*)"/g;
  let match;
  while ((match = classNamePattern.exec(source)) !== null) {
    scanClassesForCoverage(match[1].split(/\s+/).filter(Boolean), label);
  }

  lookupTablePattern.lastIndex = 0;
  let tableMatch;
  while ((tableMatch = lookupTablePattern.exec(source)) !== null) {
    lookupEntryPattern.lastIndex = 0;
    let entryMatch;
    while ((entryMatch = lookupEntryPattern.exec(tableMatch[1])) !== null) {
      scanClassesForCoverage(entryMatch[1].split(/\s+/).filter(Boolean), label);
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
  `Contrast audit passed — ${THEMES.length} theme(s) × (${PAIRINGS.length} text pairing(s) (AAA) + ` +
    `${RING_PAIRINGS.length} non-text UI pairing(s) (WCAG 1.4.11, 3:1)) checked, all above threshold; ` +
    `markup coverage verified against ${htmlFiles.length} HTML file(s), ` +
    `${applyBlocks.length + reactApplyBlocks.length} @apply block(s) across 2 CSS files, ` +
    `and ${tsxFiles.length} .tsx file(s).`,
);

if (acceptedGaps.length > 0) {
  console.log(
    `\n${acceptedGaps.length} documented known gap(s) below threshold (KNOWN_THEME_CONTRAST_GAPS — ` +
      `see that constant's comment for the structural/tuning rationale):`,
  );
  for (const gap of acceptedGaps) {
    console.log(`  ${gap}`);
  }
  console.log("");
}
