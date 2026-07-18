// Batch theme derivation for feature 038 (70 per-source themes).
// Reads /tmp/final_extraction.json (real hex anchors + short factual
// labels extracted from each site's own DESIGN.md), derives a full
// 21-token ThemeTokens palette per site via the same OKLCH-interpolation
// + real-WCAG-contrast-formula pipeline proven in feature 036 (Prism),
// and iterates lightness on the brand anchor until the same two
// non-text checks (3:1 focus ring, 4.5:1 button outline) and the
// success/warning/error/info -strong text checks (7:1) clear.

import fs from "node:fs";

function hexToRgb(hex) {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbToHex([r, g, b]) {
  const c = (v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
  return "#" + c(r) + c(g) + c(b);
}
function srgbToLinear(c) {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function linearToSrgb(c) {
  const v = c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  return v * 255;
}
function rgbToOklab([r, g, b]) {
  const [lr, lg, lb] = [srgbToLinear(r), srgbToLinear(g), srgbToLinear(b)];
  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;
  const l_ = Math.cbrt(l), m_ = Math.cbrt(m), s_ = Math.cbrt(s);
  return [
    0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_,
  ];
}
function oklabToRgb([L, a, b]) {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  const lr = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const lb = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;
  return [linearToSrgb(lr), linearToSrgb(lg), linearToSrgb(lb)];
}
function oklabToOklch([L, a, b]) {
  const C = Math.sqrt(a * a + b * b);
  let H = (Math.atan2(b, a) * 180) / Math.PI;
  if (H < 0) H += 360;
  return [L, C, H];
}
function oklchToOklab([L, C, H]) {
  const hr = (H * Math.PI) / 180;
  return [L, C * Math.cos(hr), C * Math.sin(hr)];
}
function hexToOklch(hex) {
  return oklabToOklch(rgbToOklab(hexToRgb(hex)));
}
function oklchToHex(oklch) {
  return rgbToHex(oklabToRgb(oklchToOklab(oklch)));
}
function relLuminance([r, g, b]) {
  const [R, G, B] = [r, g, b].map(srgbToLinear);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}
function contrastRatio(hex1, hex2) {
  const L1 = relLuminance(hexToRgb(hex1));
  const L2 = relLuminance(hexToRgb(hex2));
  const [lighter, darker] = L1 > L2 ? [L1, L2] : [L2, L1];
  return (lighter + 0.05) / (darker + 0.05);
}
function darken(hex, amount) {
  const [L, C, H] = hexToOklch(hex);
  return oklchToHex([Math.max(0, L - amount), C, H]);
}
function lighten(hex, amount) {
  const [L, C, H] = hexToOklch(hex);
  return oklchToHex([Math.min(1, L + amount), C, H]);
}
function interpolateNeutrals(hex50, hex900, steps) {
  const c50 = hexToOklch(hex50);
  const c900 = hexToOklch(hex900);
  return steps.map((t) => {
    const te = Math.pow(t, 0.8);
    const L = c50[0] + (c900[0] - c50[0]) * te;
    const C = c50[1] + (c900[1] - c50[1]) * te;
    let H = c50[1] < 0.001 ? c900[2] : c50[2] + (c900[2] - c50[2]) * te;
    return oklchToHex([L, C, H]);
  });
}

const DEFAULT_SEMANTIC = {
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",
};

function pick(colors, keys, fallback) {
  for (const k of keys) if (colors[k]) return colors[k];
  return fallback;
}

function chromaOf(hex) {
  const [, C] = hexToOklch(hex);
  return C;
}

// When a site's own documented "primary" is functionally monochrome
// (near-zero OKLCH chroma — a real, common pattern: Figma/Ollama/Cal/
// Intercom/Expo/Webflow/Nike/Minimax all document literal black/near-
// black as {colors.primary}), inflating a "hue" from near-zero chroma
// is numerically unstable (hue is undefined at C=0 — tiny rounding
// differences produce arbitrary, unrelated hues across unrelated
// sites). Real fix: search the SAME site's own other documented colors
// for a genuinely chromatic one (its real link/accent/brand-* color —
// every one of these sites still documents at least one real accent
// used for links, warnings, or secondary CTAs) and use that as the
// `brand` anchor instead. Only fall back to this catalog's own default
// brand (#0066FF, the base "light" theme's own value) if a site
// documents literally zero chromatic colors anywhere (verified case:
// ollama, sanity's yaml block — both genuinely monochrome-only).
function pickBrandAnchor(colors) {
  const primary = colors["primary"];
  if (primary && chromaOf(primary) > 0.03) return { hex: primary, source: "primary" };
  // search all documented colors for the most saturated real one
  let best = null, bestC = 0.03, bestKey = null;
  for (const [k, hex] of Object.entries(colors)) {
    if (k === "primary" || k === "on-primary" || k === "canvas") continue;
    const c = chromaOf(hex);
    if (c > bestC) { bestC = c; best = hex; bestKey = k; }
  }
  if (best) return { hex: best, source: bestKey };
  // Genuinely monochrome site (zero chromatic color documented anywhere,
  // e.g. ollama) — explicit, honest fallback to this catalog's own base
  // "light" theme brand value (spec.md Edge Cases: missing roles fall
  // back to this catalog's existing defaults), never an invented hue.
  return { hex: "#0066FF", source: "FALLBACK_DEFAULT" };
}

function deriveTheme(slug, colors) {
  const isLightCanvas = (hex) => relLuminance(hexToRgb(hex)) > 0.5;

  const brandAnchor = pickBrandAnchor(colors);
  let brand = brandAnchor.hex;
  let canvasRaw = pick(colors, ["canvas", "canvas-soft", "on-primary", "on-dark"], null);
  let inkRaw = pick(colors, ["ink", "body", "charcoal"], null);

  // Decide polarity: if we have BOTH a canvas and ink candidate, use them;
  // else infer from brand's own lightness bucket (rare fallback).
  let canvas, ink;
  if (canvasRaw && isLightCanvas(canvasRaw)) {
    canvas = "#FFFFFF";
    ink = inkRaw && !isLightCanvas(inkRaw) ? inkRaw : "#141414";
  } else if (canvasRaw && !isLightCanvas(canvasRaw)) {
    canvas = "#0A0A0A";
    ink = inkRaw && isLightCanvas(inkRaw) ? inkRaw : "#F5F5F5";
  } else {
    // no explicit canvas found — default to light (majority pattern
    // already established across features 017/027/036), ink dark.
    canvas = "#FFFFFF";
    ink = inkRaw && !isLightCanvas(inkRaw) ? inkRaw : "#141414";
  }
  const isLight = isLightCanvas(canvas);

  // Brand lightness: nudge into a workable band for a UI accent
  // (avoid pure-black/pure-white "brand" values, which read as ink/canvas
  // rather than an accent) — clamp OKLCH L into [0.30, 0.70] before AAA
  // iteration, preserving hue/chroma.
  let [bL, bC, bH] = hexToOklch(brand);
  bL = Math.min(0.70, Math.max(0.30, bL));
  brand = oklchToHex([bL, bC, bH]);

  // Iteratively darken (light theme) or lighten (dark theme) brand until
  // it clears the two real non-text checks against canvas.
  let brandFinal = brand;
  for (let i = 0; i < 40; i++) {
    const ratio = contrastRatio(brandFinal, canvas);
    if (ratio >= 4.6) break;
    brandFinal = isLight ? darken(brandFinal, 0.02) : lighten(brandFinal, 0.02);
  }
  let brandDark = isLight ? darken(brandFinal, 0.20) : lighten(brandFinal, 0.20);
  // Button primary text is white-on-brand-dark regardless of overall theme
  // polarity (this catalog's existing forest/dracula precedent: brand-dark
  // is derived toward the white-text-readable role specifically, since
  // Button primary is the single most central component). Iterate toward
  // whichever direction increases white-text contrast.
  for (let i = 0; i < 60; i++) {
    if (contrastRatio("#FFFFFF", brandDark) >= 4.6) break;
    const darker = darken(brandDark, 0.02);
    const lighter = lighten(brandDark, 0.02);
    brandDark = contrastRatio("#FFFFFF", darker) > contrastRatio("#FFFFFF", lighter) ? darker : lighter;
  }
  const brandLight = isLight ? lighten(brandFinal, 0.30) : darken(brandFinal, 0.30);

  // neutral-50/900
  const neutral50 = isLight ? canvas : canvas;
  const neutral900 = isLight ? ink : ink;
  const tValues = [0.10, 0.22, 0.34, 0.46, 0.58, 0.70, 0.82, 0.94];
  const neutrals = interpolateNeutrals(neutral50, neutral900, tValues);

  // Semantic anchors: use real if present, else this catalog's own default
  const semBase = {
    success: pick(colors, ["semantic-success", "success"], DEFAULT_SEMANTIC.success),
    warning: pick(colors, ["semantic-warning", "warning"], DEFAULT_SEMANTIC.warning),
    error: pick(colors, ["semantic-error", "error"], DEFAULT_SEMANTIC.error),
    info: pick(colors, ["semantic-info", "info", "link"], DEFAULT_SEMANTIC.info),
  };
  function deriveStrong(base) {
    let cur = base;
    for (let i = 0; i < 40; i++) {
      const ratio = contrastRatio(cur, neutral50);
      if (isLight ? ratio >= 7.1 : contrastRatio(cur, neutral50) >= 7.1) break;
      cur = isLight ? darken(cur, 0.02) : lighten(cur, 0.02);
    }
    return cur;
  }
  const successStrong = deriveStrong(semBase.success);
  const warningStrong = deriveStrong(semBase.warning);
  const errorStrong = deriveStrong(semBase.error);
  const infoStrong = deriveStrong(semBase.info);

  const tokens = {
    "brand-light": brandLight,
    brand: brandFinal,
    "brand-dark": brandDark,
    "neutral-50": neutral50,
    "neutral-100": neutrals[0],
    "neutral-200": neutrals[1],
    "neutral-300": neutrals[2],
    "neutral-400": neutrals[3],
    "neutral-500": neutrals[4],
    "neutral-600": neutrals[5],
    "neutral-700": neutrals[6],
    "neutral-800": neutrals[7],
    "neutral-900": neutral900,
    success: semBase.success,
    "success-strong": successStrong,
    warning: semBase.warning,
    "warning-strong": warningStrong,
    error: semBase.error,
    "error-strong": errorStrong,
    info: semBase.info,
    "info-strong": infoStrong,
  };

  // Verification report (approximate — final gate is the real audit:contrast.mjs)
  const checks = {
    inkOnCanvas: contrastRatio(neutral900, neutral50),
    brandVsCanvas: contrastRatio(brandFinal, canvas),
    whiteOnBrandDark: contrastRatio("#FFFFFF", brandDark),
    successStrongOnCanvas: contrastRatio(successStrong, neutral50),
    warningStrongOnCanvas: contrastRatio(warningStrong, neutral50),
    errorStrongOnCanvas: contrastRatio(errorStrong, neutral50),
    infoStrongOnCanvas: contrastRatio(infoStrong, neutral50),
  };

  const raw = {
    brandRawHex: brandAnchor.hex.toUpperCase(),
    brandSourceKey: brandAnchor.source,
    canvasRawHex: canvasRaw ? canvasRaw.toUpperCase() : null,
    inkRawHex: inkRaw ? inkRaw.toUpperCase() : null,
  };

  return { slug, isLight, tokens, checks, raw };
}

const extraction = JSON.parse(fs.readFileSync("/tmp/final_extraction.json", "utf8"));
const results = {};
for (const [slug, data] of Object.entries(extraction)) {
  results[slug] = deriveTheme(slug, data.colors);
}

// De-duplication pass (spec.md FR-008 / Edge Cases): several sites
// document zero real accent color anywhere (genuinely monochrome —
// ollama, spacex, uber, raycast, resend, warp, runwayml) and therefore
// all fall back to the identical catalog default; several OTHERS
// independently document genuinely similar real blues/reds (common,
// expected when 70 real companies are sampled — tech/fintech blue is
// extremely common). Either way, no two shipped themes may be
// materially indistinguishable. Process in a fixed order, track every
// already-placed (hue, sat, light) per canvas-polarity group, and
// rotate a colliding theme's hue in fixed +27° increments (chosen to
// avoid ever landing back on a "nice round" hue that could re-collide)
// until clear of every previously-placed theme — re-deriving only the
// brand-dependent tokens (brand/brand-dark/brand-light), never the
// independently-derived neutral ramp or semantic tokens.
function tooClose(a, b) {
  const dh = Math.min(Math.abs(a.H - b.H), 360 - Math.abs(a.H - b.H));
  // Only a true near-duplicate if hue, chroma, AND lightness are all
  // close simultaneously — two themes can share a hue family (e.g. both
  // "blue") while looking genuinely distinct at different chroma/
  // lightness (a pale sky blue vs. a deep navy). OKLCH L is 0-1, C is
  // roughly 0-0.4 in practice for these brand accents.
  return dh < 6 && Math.abs(a.C - b.C) < 0.05 && Math.abs(a.L - b.L) < 0.08;
}

const order = Object.keys(results).sort();
const placed = { light: [], dark: [] };
let nudgeCount = 0;
for (const slug of order) {
  const r = results[slug];
  const group = r.isLight ? placed.light : placed.dark;
  let [L, C, H] = hexToOklch(r.tokens.brand);
  let collided = false;
  let guard = 0;
  while (group.some((p) => tooClose({ L, C, H }, p)) && guard < 30) {
    H = (H + 27) % 360;
    collided = true;
    guard++;
  }
  if (collided) {
    nudgeCount++;
    const newBrand = oklchToHex([L, C, H]);
    // Re-derive brand-dependent tokens only, same method as deriveTheme.
    const canvas = r.tokens["neutral-50"];
    let brandFinal = newBrand;
    for (let i = 0; i < 40; i++) {
      if (contrastRatio(brandFinal, canvas) >= 4.6) break;
      brandFinal = r.isLight ? darken(brandFinal, 0.02) : lighten(brandFinal, 0.02);
    }
    let brandDark = r.isLight ? darken(brandFinal, 0.20) : lighten(brandFinal, 0.20);
    for (let i = 0; i < 60; i++) {
      if (contrastRatio("#FFFFFF", brandDark) >= 4.6) break;
      const darker = darken(brandDark, 0.02);
      const lighter = lighten(brandDark, 0.02);
      brandDark = contrastRatio("#FFFFFF", darker) > contrastRatio("#FFFFFF", lighter) ? darker : lighter;
    }
    const brandLight = r.isLight ? lighten(brandFinal, 0.30) : darken(brandFinal, 0.30);
    r.tokens.brand = brandFinal;
    r.tokens["brand-dark"] = brandDark;
    r.tokens["brand-light"] = brandLight;
    r.nudged = true;
  }
  group.push({ L, C, H });
}
console.log("Nudged for distinctness:", nudgeCount, "of", order.length);

fs.writeFileSync("/tmp/derived_themes.json", JSON.stringify(results, null, 1));

let lowChecks = 0;
for (const [slug, r] of Object.entries(results)) {
  const bad = Object.entries(r.checks).filter(([k, v]) => (k.includes("Strong") ? v < 6.9 : k === "inkOnCanvas" ? v < 6.9 : v < 3));
  if (bad.length) { lowChecks++; console.log(slug, "flags:", bad); }
}
console.log("Total derived:", Object.keys(results).length, "with residual flags:", lowChecks);
