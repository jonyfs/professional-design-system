#!/usr/bin/env node
// Principle IV gate (Design Token Discipline, NON-NEGOTIABLE): fails the
// build if any shipped component markup uses a Tailwind color or
// border-radius utility that isn't one of this project's ratified semantic
// tokens (.specify/memory/constitution.md's Base Semantic Palette).
//
// The allowlist is derived from shared/design-tokens.ts (feature 004 —
// both tailwind.config.ts and packages/react/tailwind.config.ts import
// their theme.extend.colors/borderRadius from this one file), not
// hand-duplicated, so the two configs and this audit can't silently drift
// apart. Parsed as source text (regex over `export const colors = {...}`),
// not executed — same approach this script has always used, just pointed
// at the new single-source file instead of tailwind.config.ts directly.

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL("..", import.meta.url));

// --- Extract the allowed color/radius suffixes from tailwind.config.ts ---

function extractBalancedBlock(source, startIndex) {
  let depth = 0;
  let started = false;
  for (let i = startIndex; i < source.length; i++) {
    if (source[i] === "{") {
      depth++;
      started = true;
    } else if (source[i] === "}") {
      depth--;
      if (started && depth === 0) {
        return source.slice(startIndex, i + 1);
      }
    }
  }
  throw new Error("Unbalanced braces while parsing tailwind.config.ts");
}

function parseColorAllowlist(configSource) {
  const colorsKeyIndex = configSource.indexOf("colors = {");
  if (colorsKeyIndex === -1) return new Set();
  const openBraceIndex = configSource.indexOf("{", colorsKeyIndex);
  const block = extractBalancedBlock(configSource, openBraceIndex);

  // Top-level entries look like `name: "hex"` or `name: { ... }`.
  const allowed = new Set(["white", "black", "transparent", "current", "inherit"]);
  const topLevelPattern = /(\w[\w-]*):\s*(\{[^{}]*\}|"[^"]*")/g;
  let match;
  while ((match = topLevelPattern.exec(block)) !== null) {
    const [, name, value] = match;
    if (value.startsWith("{")) {
      allowed.add(name); // DEFAULT (if present) resolves to the bare name
      const subPattern = /(\w[\w-]*):\s*"[^"]*"/g;
      let sub;
      while ((sub = subPattern.exec(value)) !== null) {
        const subKey = sub[1];
        allowed.add(subKey === "DEFAULT" ? name : `${name}-${subKey}`);
      }
    } else {
      allowed.add(name);
    }
  }
  return allowed;
}

function parseRadiusAllowlist(configSource) {
  const radiusKeyIndex = configSource.indexOf("borderRadius = {");
  if (radiusKeyIndex === -1) return new Set();
  const openBraceIndex = configSource.indexOf("{", radiusKeyIndex);
  const block = extractBalancedBlock(configSource, openBraceIndex);
  const allowed = new Set();
  const pattern = /(\w[\w-]*):\s*"[^"]*"/g;
  let match;
  while ((match = pattern.exec(block)) !== null) {
    allowed.add(match[1] === "DEFAULT" ? "rounded" : `rounded-${match[1]}`);
  }
  return allowed;
}

const configSource = readFileSync(join(rootDir, "shared", "design-tokens.ts"), "utf8");
const allowedColorNames = parseColorAllowlist(configSource);
const allowedRadiusClasses = parseRadiusAllowlist(configSource);

// --- Collect markup files to scan ---

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

const targets = [
  join(rootDir, "index.html"),
  ...collectHtmlFiles(join(rootDir, "src", "components")),
];

// --- Extract `@apply ...;` blocks from tailwind.css (found by /speckit-analyze
// on feature 003: every @layer components class — .btn-primary, .form-select,
// .toggle-track, etc., since feature 001 — was invisible to this audit, since
// it only ever scanned HTML class="..." attributes. A color/radius token used
// only inside an @apply rule shipped with zero token-discipline verification. ---

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
const tailwindCssSource = readFileSync(tailwindCssPath, "utf8");
const applyBlocks = [{ file: tailwindCssPath, blocks: extractApplyBlocks(tailwindCssSource) }];

// Same @apply scan, extended to packages/react/src/styles.css (feature 004
// — research.md's duplication decision: the React package compiles its own
// stylesheet, so its @layer components block needs the same verification
// as the static site's, not a free pass because it's a second file).
const reactStylesPath = join(rootDir, "packages", "react", "src", "styles.css");
if (existsSync(reactStylesPath)) {
  const reactStylesSource = readFileSync(reactStylesPath, "utf8");
  applyBlocks.push({ file: reactStylesPath, blocks: extractApplyBlocks(reactStylesSource) });
}

// --- Collect .tsx files (feature 004) — same className="..." scan as HTML's
// class="...", extended to packages/react's React component source. Dynamic/
// templated classNames (e.g. `` className={`btn ${variant}`} ``) are out of
// scope — every component in this feature uses static, literal className
// strings per variant, matching the existing HTML contracts' own pattern. ---

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
const tsxTargets = existsSync(reactSrcDir) ? collectTsxFiles(reactSrcDir) : [];

// --- Scan each file's class="..." attributes ---

// Prefixes that carry a color value in Tailwind (as opposed to a size/side/
// style keyword sharing the same prefix, e.g. `text-sm` vs `text-error`).
const COLOR_PREFIXES = [
  "bg",
  "text",
  "ring",
  "border",
  "outline",
  "decoration",
  "fill",
  "stroke",
  "divide",
  "from",
  "via",
  "to",
  "accent",
  "caret",
  "shadow",
];

// Suffixes that are structural/sizing keywords, not color names, for the
// prefixes above — these exist in Tailwind's own utility grammar and must
// not be misread as an unratified color token.
const NON_COLOR_SUFFIXES = new Set([
  // font-size scale (text-*)
  "xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl", "8xl", "9xl",
  // text alignment / decoration / transform / whitespace / wrap keywords
  "left", "center", "right", "justify", "start", "end",
  "nowrap", "ellipsis", "clip", "underline", "overline", "line-through",
  "no-underline", "uppercase", "lowercase", "capitalize", "normal-case",
  "italic", "not-italic", "wavy", "balance", "wrap", "pretty",
  // border/divide/ring sides, styles, and structural keywords
  "t", "r", "b", "l", "x", "y", "tl", "tr", "bl", "br", "s", "e",
  "x-reverse", "y-reverse",
  "solid", "dashed", "dotted", "double", "hidden", "none",
  "collapse", "separate", "inset", "reverse",
  // background positioning/repeat/attachment/blend keywords (bg-*)
  "top", "bottom", "auto", "cover", "contain", "repeat", "no-repeat",
  "fixed", "local", "scroll",
  // shadow size scale (shadow-*) — Tailwind 3 has no default colored-shadow
  // utility, so every shadow-* suffix is a size keyword, not a color.
  // "md" is shadow-only (the text-size scale above has no "md" step) — a
  // real gap this comment used to leave uncovered: `hover:shadow-md` shipped
  // inside tailwind.css's @apply since feature 001 with zero verification,
  // because this audit never scanned tailwind.css until feature 003 added
  // that capability and immediately surfaced the missing suffix.
  "inner", "md",
]);

function isStructuralSuffix(suffix) {
  if (NON_COLOR_SUFFIXES.has(suffix)) return true;
  if (/^\d+$/.test(suffix)) return true; // widths/thickness: ring-2, border-4, decoration-8
  if (/^\d+%$/.test(suffix)) return true; // gradient stop position: from-50%
  if (/^offset-\d+$/.test(suffix)) return true; // outline-offset-2, ring-offset-2 (numeric only —
  // does NOT match ring-offset-<color>, which is a real color utility)
  if (/^(t|r|b|l|x|y|tl|tr|bl|br|s|e)-\d+$/.test(suffix)) return true; // border-t-2
  if (/^(origin|clip|blend)-/.test(suffix)) return true; // bg-origin-*, bg-clip-*, bg-blend-*
  return false;
}

function stripVariants(className) {
  // Strip leading `hover:`, `focus-visible:`, `sm:`, `disabled:`, etc.
  const parts = className.split(":");
  return parts[parts.length - 1];
}

function checkClass(rawClass) {
  const className = stripVariants(rawClass);

  // Border-radius utilities: `rounded`, `rounded-sm`, `rounded-t-lg`, etc.
  if (className === "rounded" || className.startsWith("rounded-")) {
    if (!allowedRadiusClasses.has(className)) {
      return `radius utility "${rawClass}" is not in tailwind.config.ts's borderRadius allowlist`;
    }
    return null;
  }

  for (const prefix of COLOR_PREFIXES) {
    if (className === prefix || className.startsWith(`${prefix}-`)) {
      const rest = className === prefix ? "" : className.slice(prefix.length + 1);
      if (rest === "") return null; // bare utility with no color (e.g. plain "border"), not our concern
      const [colorPart] = rest.split("/"); // strip opacity modifier, e.g. "success/20"
      if (isStructuralSuffix(colorPart)) return null;
      if (!allowedColorNames.has(colorPart)) {
        return `color utility "${rawClass}" uses "${colorPart}", which is not a ratified token in tailwind.config.ts`;
      }
      return null;
    }
  }
  return null;
}

let violations = [];

for (const file of targets) {
  const html = readFileSync(file, "utf8");
  const classAttrPattern = /class="([^"]*)"/g;
  let match;
  while ((match = classAttrPattern.exec(html)) !== null) {
    const classes = match[1].split(/\s+/).filter(Boolean);
    for (const cls of classes) {
      const violation = checkClass(cls);
      if (violation) {
        violations.push({ file, violation });
      }
    }
  }
}

for (const { file, blocks } of applyBlocks) {
  for (const block of blocks) {
    const classes = block.split(/\s+/).filter(Boolean);
    for (const cls of classes) {
      const violation = checkClass(cls);
      if (violation) {
        violations.push({ file, violation: `@apply ${violation}` });
      }
    }
  }
}

// Matches literal className="..." strings. Arbitrary template-interpolated
// classNames (`` `badge-${variant}` ``) are still out of scope — Tailwind's
// own content scanner can't see those either, which is why this project's
// components use static per-variant lookup objects (VARIANT_CLASSES,
// VARIANT_ICON_CLASSES) instead; those tables are covered by
// lookupTablePattern below, not by this one.
const classNamePattern = /className="([^"]*)"/g;

// Matches `const X_CLASSES: Record<..., string> = { key: "a b c", ... }`
// lookup tables (Badge's VARIANT_CLASSES, Toast's VARIANT_ICON_CLASSES):
// a fixed, enumerable set of static strings — not arbitrary interpolation —
// so they can and must be audited the same as a literal className.
const lookupTablePattern = /:\s*Record<[^>]*,\s*string>\s*=\s*\{([^}]*)\}/g;
const lookupEntryPattern = /"([^"]*)"/g;

for (const file of tsxTargets) {
  const source = readFileSync(file, "utf8");
  let match;

  classNamePattern.lastIndex = 0;
  while ((match = classNamePattern.exec(source)) !== null) {
    const classes = match[1].split(/\s+/).filter(Boolean);
    for (const cls of classes) {
      const violation = checkClass(cls);
      if (violation) {
        violations.push({ file, violation });
      }
    }
  }

  lookupTablePattern.lastIndex = 0;
  let tableMatch;
  while ((tableMatch = lookupTablePattern.exec(source)) !== null) {
    lookupEntryPattern.lastIndex = 0;
    let entryMatch;
    while ((entryMatch = lookupEntryPattern.exec(tableMatch[1])) !== null) {
      const classes = entryMatch[1].split(/\s+/).filter(Boolean);
      for (const cls of classes) {
        const violation = checkClass(cls);
        if (violation) {
          violations.push({ file, violation: `lookup table ${violation}` });
        }
      }
    }
  }
}

if (violations.length > 0) {
  console.error(`\nToken discipline audit FAILED (Principle IV) — ${violations.length} violation(s):\n`);
  for (const { file, violation } of violations) {
    console.error(`  ${file.replace(rootDir, "")}: ${violation}`);
  }
  console.error("");
  process.exit(1);
}

const totalApplyBlocks = applyBlocks.reduce((sum, { blocks }) => sum + blocks.length, 0);
console.log(
  `Token discipline audit passed — ${targets.length} HTML file(s), ` +
    `${totalApplyBlocks} @apply block(s) across ${applyBlocks.length} CSS file(s), ` +
    `and ${tsxTargets.length} .tsx file(s) scanned, 0 violations.`,
);
