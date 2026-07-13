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

function buildThemeCard(theme) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "theme-card";
  card.dataset.testid = `theme-card-${theme.id}`;
  card.dataset.themeId = theme.id;
  card.setAttribute(
    "aria-pressed",
    document.documentElement.dataset.theme === theme.id ? "true" : "false",
  );

  const swatches = document.createElement("span");
  swatches.className = "theme-card-swatches";
  swatches.setAttribute("aria-hidden", "true");

  // A small, representative swatch strip (brand, a mid neutral, and the
  // three status colors) — enough to distinguish themes at a glance
  // without switching the live preview for all of them (research.md R4).
  const swatchTokens = ["brand", "neutral-500", "success", "warning", "error"];
  for (const tokenName of swatchTokens) {
    const swatch = document.createElement("span");
    swatch.className = "theme-card-swatch";
    // Values in ThemeTokens are already RGB-triplet strings (e.g.
    // "0 102 255"), the same source themes.css's custom properties are
    // hand-derived from — not re-parsed from CSS at runtime.
    swatch.style.backgroundColor = rgbTripletToCss(
      themeTokenTripletFor(theme, tokenName),
    );
    swatches.appendChild(swatch);
  }

  const name = document.createElement("span");
  name.className = "theme-card-name";
  name.textContent = theme.displayName;

  card.append(swatches, name);
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

  for (const theme of THEMES) {
    const grid = sectionsByFamily.get(theme.moodFamily);
    if (!grid) continue; // a theme referencing an unknown mood family is a data bug, not a render-time concern here
    grid.appendChild(buildThemeCard(theme));
  }
}

renderGallery();
