#!/usr/bin/env node
// Feature 025 — sitewide theme selector & persistence rollout.
// Mechanically inserts the 3 already-shipped snippets (research.md R1)
// into every src/components/**/*.html page still missing them. Idempotent
// — skips any file that already has theme-switcher.js.

import { readFileSync, writeFileSync } from "node:fs";
import { globSync } from "node:fs";

const ACTIVATION_SCRIPT = `  <script type="module" src="/src/scripts/theme-switcher.js"></script>\n`;

const SELECTOR_BLOCK = `
    <div class="mt-4 max-w-xs">
      <label for="gallery-theme-select" class="text-sm font-medium text-neutral-900">
        Preview theme
      </label>
      <select id="gallery-theme-select" data-testid="gallery-theme-select" class="form-select">
        <!-- <optgroup>/<option>s populated by gallery-theme-selector.js -->
      </select>
    </div>
`;

const SELECTOR_SCRIPT = `  <script type="module" src="/src/scripts/gallery-theme-selector.js"></script>\n`;

function applyRollout(filePath) {
  let content = readFileSync(filePath, "utf8");

  if (content.includes("theme-switcher.js")) {
    return { filePath, skipped: true };
  }

  // 1. Activation script — immediately after the tailwind.css stylesheet link.
  const stylesheetRe = /(<link rel="stylesheet" href="\/src\/styles\/tailwind\.css" \/>\n)/;
  if (!stylesheetRe.test(content)) {
    return { filePath, error: "stylesheet link not found" };
  }
  content = content.replace(stylesheetRe, `$1${ACTIVATION_SCRIPT}`);

  // 2. Selector markup — after </h1>, and after a directly-following </p> if present.
  const h1Re = /(<h1[^>]*>.*?<\/h1>\n)(\s*<p[^>]*>[\s\S]*?<\/p>\n)?/;
  const h1Match = content.match(h1Re);
  if (!h1Match) {
    return { filePath, error: "<h1> not found" };
  }
  const insertAfter = h1Match[0];
  content = content.replace(insertAfter, `${insertAfter}${SELECTOR_BLOCK}`);

  // 3. Selector wiring script — immediately before </body>.
  if (!content.includes("</body>")) {
    return { filePath, error: "</body> not found" };
  }
  content = content.replace("</body>", `${SELECTOR_SCRIPT}</body>`);

  writeFileSync(filePath, content, "utf8");
  return { filePath, updated: true };
}

const files = globSync("src/components/**/*.html");
const results = files.map(applyRollout);

const updated = results.filter((r) => r.updated);
const skipped = results.filter((r) => r.skipped);
const errors = results.filter((r) => r.error);

console.log(`Updated: ${updated.length}`);
console.log(`Skipped (already had theme-switcher.js): ${skipped.length}`);
if (errors.length > 0) {
  console.log(`Errors: ${errors.length}`);
  for (const e of errors) console.log(`  ${e.filePath}: ${e.error}`);
  process.exitCode = 1;
}
