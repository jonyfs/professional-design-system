// GitHub Pages deploy step only (deploy-pages.yml). Vite's own asset
// pipeline already prefixes <script src>/<link href> it recognizes as part
// of the module graph with `base` (verified directly against a real build,
// not assumed) — but every plain `<a href="/...">` cross-page navigation
// link in this catalog's 122+ static HTML source files is a literal,
// root-absolute string Vite never touches. Left alone, every "back to
// gallery" link and every component card link would 404 under a GitHub
// Pages project subpath (https://<owner>.github.io/<repo>/...) instead of
// the domain root this catalog assumes for local dev/preview. Rewriting the
// BUILT dist/ output only (never the source files, which stay root-absolute
// for local dev) keeps this a one-step, reversible deploy-time concern
// rather than a 122-file source refactor.
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, extname } from "node:path";

const distDir = process.argv[2] ?? "dist";
const rawBase = process.argv[3] ?? process.env.GITHUB_PAGES_BASE ?? "/";
// Normalize to always start and end with exactly one slash, e.g. "/repo/".
const base = `/${rawBase.replace(/^\/+|\/+$/g, "")}/`;
const basePrefix = base.slice(1); // "repo/" — used to detect already-correct hrefs

if (base === "/") {
  console.log("rewrite-base-path: base is \"/\", nothing to rewrite.");
  process.exit(0);
}

async function* walkHtmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkHtmlFiles(fullPath);
    } else if (extname(entry.name) === ".html") {
      yield fullPath;
    }
  }
}

function rewriteAttr(html, attr) {
  const pattern = new RegExp(`${attr}="/(?!/)([^"]*)"`, "g");
  return html.replace(pattern, (match, rest) => {
    if (rest.startsWith(basePrefix)) return match; // already correct (Vite-processed asset)
    return `${attr}="${base}${rest}"`;
  });
}

let filesChanged = 0;
for await (const file of walkHtmlFiles(distDir)) {
  const original = await readFile(file, "utf8");
  const rewritten = rewriteAttr(rewriteAttr(original, "href"), "src");
  if (rewritten !== original) {
    await writeFile(file, rewritten);
    filesChanged++;
  }
}

console.log(`rewrite-base-path: rewrote root-absolute href/src to "${base}" in ${filesChanged} file(s).`);
