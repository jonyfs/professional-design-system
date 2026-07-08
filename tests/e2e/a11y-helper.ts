import type { Page, TestInfo } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { expect } from "@playwright/test";

/**
 * Runs an axe-core scan against the current page and asserts zero
 * violations. Shared across all component specs so every page is held to
 * the same WCAG 2.2 AA+AAA ruleset (Principle II).
 */
export async function expectNoA11yViolations(page: Page, testInfo: TestInfo) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag2aaa", "wcag22aa"])
    .analyze();

  if (results.violations.length > 0) {
    await testInfo.attach("axe-violations", {
      body: JSON.stringify(results.violations, null, 2),
      contentType: "application/json",
    });
  }

  expect(results.violations, formatViolations(results.violations)).toEqual([]);
}

function formatViolations(violations: { id: string; help: string; nodes: unknown[] }[]) {
  if (violations.length === 0) return "no violations";
  return violations
    .map((v) => `${v.id}: ${v.help} (${v.nodes.length} node(s))`)
    .join("\n");
}
