#!/usr/bin/env node
// Feature 026 — completeness gate for the demo-page polish rollout
// (research.md R5), mirroring feature 025's check-theme-rollout.mjs.

import { readFileSync } from "node:fs";
import { globSync } from "node:fs";

const files = globSync("src/components/**/*.html");
let failures = 0;

for (const file of files) {
  const content = readFileSync(file, "utf8");
  if (!content.includes('class="demo-page-header')) {
    console.log(`FAIL: ${file} — missing demo-page-header wrapper`);
    failures++;
  }
}

console.log(`\n${files.length - failures}/${files.length} files pass the demo-page-polish completeness check.`);
if (failures > 0) process.exitCode = 1;
