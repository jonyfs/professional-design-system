// ColorSwatch (feature 023 US3) — applies each swatch's caller-supplied
// color to its background. The color value is set via a `data-swatch-color`
// attribute and applied here through the CSSOM (element.style), rather than
// an inline `style="..."` attribute, so this page keeps the catalog's strict
// `style-src 'self'` CSP (inline style attributes would require
// 'unsafe-inline', which no page in this catalog uses). This is the
// caller-supplied/unbounded-value case the data-display contract calls out.
const swatches = document.querySelectorAll("[data-swatch-color]");
for (const swatch of swatches) {
  const color = swatch.getAttribute("data-swatch-color");
  if (color) {
    swatch.style.backgroundColor = color;
  }
}
