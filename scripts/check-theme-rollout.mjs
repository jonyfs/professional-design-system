#!/usr/bin/env node
// Feature 025 — completeness gate (research.md R3): confirms every
// src/components/**/*.html file carries all 3 required rollout snippets.
// Not a browser test — a content-presence check, since the risk here is
// a missed/malformed file, not per-page interaction logic.

import { readFileSync } from "node:fs";
import { globSync } from "node:fs";

const REQUIRED = [
  { name: "activation script", pattern: /<script type="module" src="\/src\/scripts\/theme-switcher\.js"><\/script>/ },
  { name: "selector markup", pattern: /<select id="gallery-theme-select"/ },
  {
    name: "selector wiring script",
    pattern: /<script type="module" src="\/src\/scripts\/gallery-theme-selector\.js"><\/script>/,
  },
];

// theme-gallery.html already has an equivalent, dedicated theme-picker UI
// (theme-gallery.js — feature 017's own card-based selector), not the
// generic gallery-theme-select dropdown — exempt, not a gap.
const EXEMPT = new Set(["src/components/theme-gallery/theme-gallery.html"]);

const files = globSync("src/components/**/*.html").filter((f) => !EXEMPT.has(f));
let failures = 0;

for (const file of files) {
  const content = readFileSync(file, "utf8");
  const missing = REQUIRED.filter((r) => !r.pattern.test(content)).map((r) => r.name);
  if (missing.length > 0) {
    console.log(`FAIL: ${file} — missing: ${missing.join(", ")}`);
    failures++;
  }
}

console.log(`\n${files.length - failures}/${files.length} files pass the theme-rollout completeness check.`);
if (failures > 0) process.exitCode = 1;
