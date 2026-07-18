import fs from "node:fs";

function hexToRgb(hex) {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbToHsl([r,g,b]) {
  r/=255; g/=255; b/=255;
  const max=Math.max(r,g,b), min=Math.min(r,g,b);
  let h=0, s=0, l=(max+min)/2;
  if (max !== min) {
    const d = max-min;
    s = l > 0.5 ? d/(2-max-min) : d/(max+min);
    if (max===r) h = ((g-b)/d + (g<b?6:0));
    else if (max===g) h = (b-r)/d + 2;
    else h = (r-g)/d + 4;
    h *= 60;
  }
  return [h, s*100, l*100];
}

const derived = JSON.parse(fs.readFileSync("/tmp/derived_themes.json", "utf8"));
const names = JSON.parse(fs.readFileSync("/tmp/name_assignment.json", "utf8"));

// Mood family: 7 existing families, assign by polarity + saturation/hue character
function moodFamily(t, nameInfo) {
  const isLight = t.isLight;
  const [h,s] = rgbToHsl(hexToRgb(t.tokens.brand));
  if (isLight) {
    if (s < 25) return "Cool/Tech Minimal";
    if (h >= 20 && h < 70) return "Warm/Organic Light";
    if (h >= 70 && h < 170) return "Nature/Earth";
    return "Light Professional";
  } else {
    if (s > 70) return "Dark Vibrant/Expressive";
    return "Dark Moody/Professional";
  }
}

let tsBlocks = [];
let cssBlocks = [];
let researchRows = [];

const order = Object.keys(derived).sort();
for (const slug of order) {
  const t = derived[slug];
  const nameInfo = names[slug];
  const id = nameInfo.name;
  const displayName = id.charAt(0).toUpperCase() + id.slice(1);
  const family = moodFamily(t, nameInfo);
  const tk = t.tokens;

  const isFallback = t.raw.brandSourceKey === "FALLBACK_DEFAULT";
  const brandProvenance = isFallback
    ? `this site's own DESIGN.md documents no chromatic color anywhere (literal monochrome brand) -- the brand accent is this catalog's own existing default (#0066FF, the base 'light' theme's value), never an invented hue; canvas/ink/semantic anchors below are still this site's own real documented values where present`
    : t.raw.brandSourceKey === "primary"
      ? `brand accent from this site's own documented 'primary' (${t.raw.brandRawHex})`
      : `this site's own documented 'primary' is functionally monochrome, so the brand accent instead uses this site's own real '${t.raw.brandSourceKey}' color (${t.raw.brandRawHex})`;
  const tsLines = [
    `  {`,
    `    id: "${id}",`,
    `    displayName: "${displayName}",`,
    `    moodFamily: "${family}",`,
    `    sourceReference:`,
    `      "Feature 038 — ${brandProvenance}; canvas/ink anchors ${t.raw.canvasRawHex || t.raw.inkRawHex ? "from " + slug + "'s own DESIGN.md" : "using this catalog's own defaults (undocumented on this site)"}; OKLCH-interpolated neutral ramp; semantic roles from the source where documented, else this catalog's own defaults. Raw pre-derivation anchors: brand ${t.raw.brandRawHex}, canvas ${t.raw.canvasRawHex ?? "n/a"}, ink ${t.raw.inkRawHex ?? "n/a"} (specs/038-per-source-theme-batch/research.md R6). Company name is research provenance only, never the shipped theme name.",`,
    `    tokens: {`,
    `      "brand-light": "${tk["brand-light"].toUpperCase()}",`,
    `      brand: "${tk.brand.toUpperCase()}",`,
    `      "brand-dark": "${tk["brand-dark"].toUpperCase()}",`,
    `      "neutral-50": "${tk["neutral-50"].toUpperCase()}",`,
    `      "neutral-100": "${tk["neutral-100"].toUpperCase()}",`,
    `      "neutral-200": "${tk["neutral-200"].toUpperCase()}",`,
    `      "neutral-300": "${tk["neutral-300"].toUpperCase()}",`,
    `      "neutral-400": "${tk["neutral-400"].toUpperCase()}",`,
    `      "neutral-500": "${tk["neutral-500"].toUpperCase()}",`,
    `      "neutral-600": "${tk["neutral-600"].toUpperCase()}",`,
    `      "neutral-700": "${tk["neutral-700"].toUpperCase()}",`,
    `      "neutral-800": "${tk["neutral-800"].toUpperCase()}",`,
    `      "neutral-900": "${tk["neutral-900"].toUpperCase()}",`,
    `      success: "${tk.success.toUpperCase()}",`,
    `      "success-strong": "${tk["success-strong"].toUpperCase()}",`,
    `      warning: "${tk.warning.toUpperCase()}",`,
    `      "warning-strong": "${tk["warning-strong"].toUpperCase()}",`,
    `      error: "${tk.error.toUpperCase()}",`,
    `      "error-strong": "${tk["error-strong"].toUpperCase()}",`,
    `      info: "${tk.info.toUpperCase()}",`,
    `      "info-strong": "${tk["info-strong"].toUpperCase()}",`,
    `    },`,
    `  },`,
  ];
  tsBlocks.push(tsLines.join("\n"));

  function toRgbTriplet(hex) {
    const [r,g,b] = hexToRgb(hex);
    return `${r} ${g} ${b}`;
  }
  const cssLines = [
    `[data-theme="${id}"] {`,
    `  --color-brand-light: ${toRgbTriplet(tk["brand-light"])}; /* ${tk["brand-light"].toUpperCase()} */`,
    `  --color-brand: ${toRgbTriplet(tk.brand)}; /* ${tk.brand.toUpperCase()} */`,
    `  --color-brand-dark: ${toRgbTriplet(tk["brand-dark"])}; /* ${tk["brand-dark"].toUpperCase()} */`,
    `  --color-neutral-50: ${toRgbTriplet(tk["neutral-50"])}; /* ${tk["neutral-50"].toUpperCase()} */`,
    `  --color-neutral-100: ${toRgbTriplet(tk["neutral-100"])}; /* ${tk["neutral-100"].toUpperCase()} */`,
    `  --color-neutral-200: ${toRgbTriplet(tk["neutral-200"])}; /* ${tk["neutral-200"].toUpperCase()} */`,
    `  --color-neutral-300: ${toRgbTriplet(tk["neutral-300"])}; /* ${tk["neutral-300"].toUpperCase()} */`,
    `  --color-neutral-400: ${toRgbTriplet(tk["neutral-400"])}; /* ${tk["neutral-400"].toUpperCase()} */`,
    `  --color-neutral-500: ${toRgbTriplet(tk["neutral-500"])}; /* ${tk["neutral-500"].toUpperCase()} */`,
    `  --color-neutral-600: ${toRgbTriplet(tk["neutral-600"])}; /* ${tk["neutral-600"].toUpperCase()} */`,
    `  --color-neutral-700: ${toRgbTriplet(tk["neutral-700"])}; /* ${tk["neutral-700"].toUpperCase()} */`,
    `  --color-neutral-800: ${toRgbTriplet(tk["neutral-800"])}; /* ${tk["neutral-800"].toUpperCase()} */`,
    `  --color-neutral-900: ${toRgbTriplet(tk["neutral-900"])}; /* ${tk["neutral-900"].toUpperCase()} */`,
    `  --color-success: ${toRgbTriplet(tk.success)}; /* ${tk.success.toUpperCase()} */`,
    `  --color-success-strong: ${toRgbTriplet(tk["success-strong"])}; /* ${tk["success-strong"].toUpperCase()} */`,
    `  --color-warning: ${toRgbTriplet(tk.warning)}; /* ${tk.warning.toUpperCase()} */`,
    `  --color-warning-strong: ${toRgbTriplet(tk["warning-strong"])}; /* ${tk["warning-strong"].toUpperCase()} */`,
    `  --color-error: ${toRgbTriplet(tk.error)}; /* ${tk.error.toUpperCase()} */`,
    `  --color-error-strong: ${toRgbTriplet(tk["error-strong"])}; /* ${tk["error-strong"].toUpperCase()} */`,
    `  --color-info: ${toRgbTriplet(tk.info)}; /* ${tk.info.toUpperCase()} */`,
    `  --color-info-strong: ${toRgbTriplet(tk["info-strong"])}; /* ${tk["info-strong"].toUpperCase()} */`,
    `}`,
  ];
  cssBlocks.push(cssLines.join("\n"));

  const rawBrandCell = isFallback ? `\`${t.raw.brandRawHex}\` (fallback)` : `\`${t.raw.brandRawHex}\` (${t.raw.brandSourceKey})`;
  researchRows.push(`| ${slug} | \`${id}\` | ${displayName} | ${family} | \`${tk.brand.toUpperCase()}\` | ${rawBrandCell} | ${t.isLight ? "Light" : "Dark"} |`);
}

fs.writeFileSync("/tmp/gen_ts_blocks.txt", tsBlocks.join("\n"));
fs.writeFileSync("/tmp/gen_css_blocks.txt", cssBlocks.join("\n\n"));
fs.writeFileSync("/tmp/gen_research_table.txt", researchRows.join("\n"));
console.log("Generated", tsBlocks.length, "theme entries");
