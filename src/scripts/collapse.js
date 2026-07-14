// Collapse + Spoiler wiring (contracts/023-component-catalog-expansion/
// nav-utility.contract.md).
//
// Collapse needs NO JavaScript: it is a single native <details>/<summary>
// disclosure and the browser handles open/close and accessibility for
// free (same mechanism Accordion/TreeView already rely on). This module
// exists only for Spoiler's ONE piece of real interactivity: a pre-open
// truncation measurement.
//
// A closed <details> renders only its <summary>, so Spoiler's truncated
// preview lives INSIDE the summary, line-clamped while closed and
// unclamped (group-open) while open — the label toggle is pure CSS. The
// only thing CSS cannot do is decide whether the content is long enough to
// warrant a "Show more" control at all: per spec.md's US4 edge case, a
// Spoiler whose content already fits the clamp must show NO control. That
// requires measuring the rendered content, which is what this does.
export function initSpoilers(root = document) {
  root.querySelectorAll("[data-spoiler]").forEach((details) => {
    const content = details.querySelector("[data-spoiler-content]");
    if (!content) return;

    // Measured while the <details> is closed and the content is clamped:
    // clientHeight is the clamped (visible) height, scrollHeight the full
    // natural height. The +1 guards against sub-pixel rounding producing a
    // false positive on content that actually fits.
    const isTruncated = content.scrollHeight > content.clientHeight + 1;

    // Default (attribute absent) is treated as truncatable, so the control
    // stays visible if this script never runs (progressive enhancement).
    // Only an explicit "false" hides the control and drops the clamp.
    details.dataset.truncatable = isTruncated ? "true" : "false";
  });
}
