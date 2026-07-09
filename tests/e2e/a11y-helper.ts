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

/**
 * Runs `action` while capturing browser console errors and uncaught page
 * errors, then asserts none occurred. Feature 003 introduced this
 * project's first <script> tags under a real CSP (script-src 'self' etc.)
 * — a future inline-script/CSP-incompatible edit would currently only
 * surface as "the button doesn't work" in manual testing, with no CI
 * signal (code review). This turns that class of regression into an
 * explicit, named test failure instead.
 */
export async function expectNoConsoleErrors(page: Page, action: () => Promise<void>) {
  const messages: string[] = [];
  const onConsole = (msg: { type: () => string; text: () => string }) => {
    if (msg.type() === "error") messages.push(msg.text());
  };
  const onPageError = (error: Error) => messages.push(error.message);
  page.on("console", onConsole);
  page.on("pageerror", onPageError);
  try {
    await action();
  } finally {
    page.off("console", onConsole);
    page.off("pageerror", onPageError);
  }
  expect(messages, messages.join("\n")).toEqual([]);
}
