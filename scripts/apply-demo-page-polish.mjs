#!/usr/bin/env node
// Feature 026 — individual demo page polish (contracts/demo-page-polish
// .contract.md, research.md R5). Wraps each page's existing <h1> + intro
// <p> + theme-selector block (feature 025) in a slightly more considered
// header treatment (background tint + bottom border + consistent
// padding/rhythm) — presentation chrome only, zero change to any
// data-testid, component markup, or script reference. Idempotent —
// skips any file that already has the wrapper.

import { readFileSync, writeFileSync } from "node:fs";
import { globSync } from "node:fs";

const WRAPPER_MARKER = "demo-page-header";

function applyPolish(filePath) {
  let content = readFileSync(filePath, "utf8");

  if (content.includes(WRAPPER_MARKER)) {
    return { filePath, skipped: true };
  }

  // Capture from <body ...> up to (and including) the theme-selector's
  // closing </div> (feature 025's block) or, if that block is absent,
  // up to the end of the intro <p> (or the <h1> itself if no intro <p>).
  const headerRe =
    /(<body[^>]*>\n)([\s\S]*?<h1[^>]*>.*?<\/h1>\n(?:\s*<p[^>]*>[\s\S]*?<\/p>\n)?(?:\s*<div class="mt-4 max-w-xs">[\s\S]*?<\/div>\n)?)/;
  const match = content.match(headerRe);
  if (!match) {
    return { filePath, error: "header region not found" };
  }

  const [, bodyOpen, headerContent] = match;
  // No background tint: page-shell's own background IS bg-neutral-50
  // (confirmed against src/styles/tailwind.css, not assumed), so a
  // same-color tint here would be invisible. A bottom border alone
  // provides real, visible separation without needing to fight
  // page-shell's own p-8 padding with a negative-margin bleed trick.
  const wrapped = `${bodyOpen}  <div class="${WRAPPER_MARKER} border-b border-neutral-200 pb-6 mb-6">
${headerContent}  </div>\n`;

  content = content.replace(match[0], wrapped);
  writeFileSync(filePath, content, "utf8");
  return { filePath, updated: true };
}

const files = globSync("src/components/**/*.html");
const results = files.map(applyPolish);

const updated = results.filter((r) => r.updated);
const skipped = results.filter((r) => r.skipped);
const errors = results.filter((r) => r.error);

console.log(`Updated: ${updated.length}`);
console.log(`Skipped (already polished): ${skipped.length}`);
if (errors.length > 0) {
  console.log(`Errors: ${errors.length}`);
  for (const e of errors) console.log(`  ${e.filePath}: ${e.error}`);
  process.exitCode = 1;
}
