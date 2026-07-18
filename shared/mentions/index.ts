// Shared, surface-agnostic Mentions logic (spec.md FR-003,
// contracts/mentions.contract.md). Trigger-character detection and
// token insertion, reused verbatim by BOTH src/scripts/mentions.js
// and packages/react/src/Mentions/Mentions.tsx, parallel to
// shared/multi-select/index.ts's existing extraction pattern. Pure
// functions — no DOM/React dependency, always return a fresh value.

/** Returns the in-progress @query text ending at `cursorIndex`, or null if none is active. */
export function findActiveTrigger(text: string, cursorIndex: number, trigger = "@"): string | null {
  const beforeCursor = text.slice(0, cursorIndex);
  const triggerIndex = beforeCursor.lastIndexOf(trigger);
  if (triggerIndex === -1) return null;
  const between = beforeCursor.slice(triggerIndex + 1);
  if (/\s/.test(between)) return null; // whitespace ends the trigger
  return between;
}

/** Replaces the active trigger span with a committed mention token's label. */
export function insertMention(
  text: string,
  cursorIndex: number,
  label: string,
  trigger = "@",
): { text: string; cursorIndex: number } {
  const beforeCursor = text.slice(0, cursorIndex);
  const triggerIndex = beforeCursor.lastIndexOf(trigger);
  const token = `${trigger}${label} `;
  const next = text.slice(0, triggerIndex) + token + text.slice(cursorIndex);
  return { text: next, cursorIndex: triggerIndex + token.length };
}
