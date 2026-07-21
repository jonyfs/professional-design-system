// Theme Gallery rendering (contracts/theme-gallery.contract.md). Cards are
// generated from shared/design-tokens.ts's THEMES map, not hand-authored
// per theme — a new theme added to that map (T009/T015's shared source of
// truth) appears here automatically, with zero markup edits required.
import { THEMES, MOOD_FAMILIES } from "../../shared/design-tokens.ts";
import { selectTheme, KNOWN_THEME_IDS } from "./theme-switcher.js";

function slugifyMoodFamily(moodFamily) {
  return `mood-${moodFamily.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
}

// Swatch colors are read from the theme's own RGB-triplet token strings
// (identical values themes.css's [data-theme="..."] block declares) and
// set via CSSOM (`element.style.backgroundColor = ...`), never an inline
// `style="..."` HTML attribute — this project's CSP (`style-src 'self'`)
// silently blocks the latter (feature 014 R12's lesson, reused here since
// each card's swatch colors are inherently per-instance dynamic values).
function rgbTripletToCss(triplet) {
  const [r, g, b] = triplet.split(" ");
  return `rgb(${r} ${g} ${b})`;
}

// A small, representative palette (brand as the hero, a mid neutral, and
// the three status colors) — enough to distinguish themes at a glance
// without switching the live preview for all of them (research.md R4).
const SWATCH_TOKENS = ["brand", "neutral-500", "success", "warning", "error"];

function buildThemeCard(theme, { featured = false } = {}) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = featured ? "theme-card theme-card-featured" : "theme-card";
  card.dataset.testid = `theme-card-${theme.id}`;
  card.dataset.themeId = theme.id;
  if (featured) card.dataset.featured = "true";
  card.setAttribute(
    "aria-pressed",
    document.documentElement.dataset.theme === theme.id ? "true" : "false",
  );

  // Header row: the swatch strip on the left, status badges on the right.
  const header = document.createElement("span");
  header.className = "theme-card-header";

  const swatches = document.createElement("span");
  swatches.className = "theme-card-swatches";
  swatches.setAttribute("aria-hidden", "true");

  for (const tokenName of SWATCH_TOKENS) {
    const swatch = document.createElement("span");
    swatch.className =
      tokenName === "brand"
        ? "theme-card-swatch theme-card-swatch-primary"
        : "theme-card-swatch";
    // Values in ThemeTokens are already RGB-triplet strings (e.g.
    // "0 102 255"), the same source themes.css's custom properties are
    // hand-derived from — not re-parsed from CSS at runtime.
    swatch.style.backgroundColor = rgbTripletToCss(
      themeTokenTripletFor(theme, tokenName),
    );
    swatches.appendChild(swatch);
  }

  const badges = document.createElement("span");
  badges.className = "theme-card-badges";
  if (featured) {
    const featuredBadge = document.createElement("span");
    featuredBadge.className = "theme-card-badge theme-card-badge-featured";
    featuredBadge.textContent = "Featured";
    badges.appendChild(featuredBadge);
  }
  // Rendered for every card but only made visible (via CSS) on the active
  // one — so the DOM never has to be rebuilt when the selection changes.
  const activeBadge = document.createElement("span");
  activeBadge.className = "theme-card-badge theme-card-badge-active";
  activeBadge.textContent = "✓ Active";
  badges.appendChild(activeBadge);

  header.append(swatches, badges);

  const name = document.createElement("span");
  name.className = "theme-card-name";
  name.textContent = theme.displayName;

  // Fuller preview: a full-width band of the theme's colors, CSS-revealed
  // on hover / focus / when active (see .theme-card-preview).
  const preview = document.createElement("span");
  preview.className = "theme-card-preview";
  const previewInner = document.createElement("span");
  previewInner.className = "theme-card-preview-inner";
  const band = document.createElement("span");
  band.className = "theme-card-preview-band";
  band.setAttribute("aria-hidden", "true");
  for (const tokenName of SWATCH_TOKENS) {
    const bar = document.createElement("span");
    bar.className = "theme-card-preview-bar";
    bar.style.backgroundColor = rgbTripletToCss(
      themeTokenTripletFor(theme, tokenName),
    );
    band.appendChild(bar);
  }
  const hint = document.createElement("span");
  hint.className = "theme-card-preview-hint";
  hint.textContent = "Apply this theme";
  previewInner.append(band, hint);
  preview.appendChild(previewInner);

  card.append(header, name, preview);
  card.addEventListener("click", () => {
    selectTheme(theme.id, KNOWN_THEME_IDS);
    for (const otherCard of document.querySelectorAll(".theme-card")) {
      otherCard.setAttribute(
        "aria-pressed",
        otherCard.dataset.themeId === theme.id ? "true" : "false",
      );
    }
  });

  return card;
}

// ThemeTokens' hex-vs-RGB-triplet split (research.md R1/R2): THEMES'
// `tokens` object stores hex strings (what check-contrast.mjs audits
// directly), while themes.css's shipped custom properties are hand-
// derived RGB triplets. The gallery reads the same hex source and
// converts once here, so a swatch never silently drifts from the audited
// value.
function themeTokenTripletFor(theme, tokenName) {
  const hex = theme.tokens[tokenName];
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

function renderGallery() {
  const gallery = document.querySelector('[data-testid="theme-gallery"]');
  if (!gallery) return;

  const sectionsByFamily = new Map();
  for (const moodFamily of MOOD_FAMILIES) {
    const slug = slugifyMoodFamily(moodFamily);
    const section = document.createElement("section");
    section.setAttribute("aria-labelledby", slug);

    const heading = document.createElement("h2");
    heading.id = slug;
    heading.className = "text-lg font-semibold text-neutral-900";
    heading.textContent = moodFamily;

    const grid = document.createElement("div");
    grid.className = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4";

    section.append(heading, grid);
    gallery.appendChild(section);
    sectionsByFamily.set(moodFamily, grid);
  }

  // The first theme encountered in each mood family becomes that family's
  // featured anchor — a wider, accented card that breaks the otherwise
  // uniform 119-item grid into a clear visual rhythm (audit-findings.md).
  const featuredSeen = new Set();
  for (const theme of THEMES) {
    const grid = sectionsByFamily.get(theme.moodFamily);
    if (!grid) continue; // a theme referencing an unknown mood family is a data bug, not a render-time concern here
    const featured = !featuredSeen.has(theme.moodFamily);
    featuredSeen.add(theme.moodFamily);
    grid.appendChild(buildThemeCard(theme, { featured }));
  }
}

renderGallery();
