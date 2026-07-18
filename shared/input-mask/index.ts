// Shared, surface-agnostic InputMask logic (spec.md FR-006,
// contracts/input-mask.contract.md), reused verbatim by BOTH
// src/scripts/input-mask.js and packages/react/src/InputMask/
// InputMask.tsx, parallel to shared/multi-select/index.ts's/
// shared/mentions/index.ts's existing extraction pattern. `9` = digit
// placeholder; any other pattern character is literal and
// auto-inserted. Pure function — always returns a fresh string.

export const MASK_PRESETS: Record<string, string> = {
  phone: "(999) 999-9999",
  date: "99/99/9999",
  currency: "$999,999,999.99",
};

export function applyMask(pattern: string, rawDigits: string): string {
  let result = "";
  let digitIndex = 0;
  for (const patternChar of pattern) {
    if (digitIndex >= rawDigits.length) break;
    if (patternChar === "9") {
      result += rawDigits[digitIndex];
      digitIndex++;
    } else {
      result += patternChar;
    }
  }
  return result;
}
