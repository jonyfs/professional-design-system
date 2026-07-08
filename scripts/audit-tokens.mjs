#!/usr/bin/env node
// Principle IV gate (Design Token Discipline, NON-NEGOTIABLE): fails the
// build if any shipped component markup uses a Tailwind color or
// border-radius utility that isn't one of this project's ratified semantic
// tokens (.specify/memory/constitution.md's Base Semantic Palette).
//
// The allowlist is derived from tailwind.config.ts's theme.extend, not
// hand-duplicated, so the two can't silently drift apart.

import { readFileSync, readdirSync, statSync } from "node:fs";
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
  const colorsKeyIndex = configSource.indexOf("colors:");
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
  const radiusKeyIndex = configSource.indexOf("borderRadius:");
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

const configSource = readFileSync(join(rootDir, "tailwind.config.ts"), "utf8");
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
];

// Suffixes that are structural/sizing keywords, not color names, for the
// prefixes above — these exist in Tailwind's own utility grammar and must
// not be misread as an unratified color token.
const NON_COLOR_SUFFIXES = new Set([
  // font-size scale (text-*)
  "xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl", "8xl", "9xl",
  // text alignment / decoration / transform / whitespace keywords
  "left", "center", "right", "justify", "start", "end",
  "nowrap", "ellipsis", "clip", "underline", "overline", "line-through",
  "no-underline", "uppercase", "lowercase", "capitalize", "normal-case",
  "italic", "not-italic", "wavy",
  // border/divide/ring sides, styles, and structural keywords
  "t", "r", "b", "l", "x", "y", "tl", "tr", "bl", "br", "s", "e",
  "x-reverse", "y-reverse",
  "solid", "dashed", "dotted", "double", "hidden", "none",
  "collapse", "separate", "inset", "reverse",
  // background positioning/repeat/attachment/blend keywords (bg-*)
  "top", "bottom", "auto", "cover", "contain", "repeat", "no-repeat",
  "fixed", "local", "scroll",
]);

function isStructuralSuffix(suffix) {
  if (NON_COLOR_SUFFIXES.has(suffix)) return true;
  if (/^\d+$/.test(suffix)) return true; // widths/thickness: ring-2, border-4, decoration-8
  if (/^\d+%$/.test(suffix)) return true; // gradient stop position: from-50%
  if (/^offset-/.test(suffix)) return true; // outline-offset-2, ring-offset-2
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

if (violations.length > 0) {
  console.error(`\nToken discipline audit FAILED (Principle IV) — ${violations.length} violation(s):\n`);
  for (const { file, violation } of violations) {
    console.error(`  ${file.replace(rootDir, "")}: ${violation}`);
  }
  console.error("");
  process.exit(1);
}

console.log(`Token discipline audit passed — ${targets.length} file(s) scanned, 0 violations.`);
