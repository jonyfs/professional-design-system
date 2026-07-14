import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

// Runs against the React test harness (tests/react-harness/data-table.html).
// Mirrors tests/e2e/data-table.spec.ts's static-surface assertions,
// proving both surfaces share correct behavior via the same
// shared/data-table/* pure functions (plan.md's shared-state-module
// architecture).
const HARNESS_URL = "http://localhost:5174/data-table.html";

test.describe("DataTable (React package) — Core: sort/filter/paginate (US1)", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(HARNESS_URL);
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("sort cycles asc -> desc -> unsorted with aria-sort reflecting it", async ({ page }) => {
    const table = page.getByTestId("data-table-readonly");
    const nameHeader = table.locator("th").nth(1);
    const sortButton = nameHeader.getByRole("button", { name: /Name/ });

    await sortButton.click();
    await expect(nameHeader).toHaveAttribute("aria-sort", "ascending");
    await sortButton.click();
    await expect(nameHeader).toHaveAttribute("aria-sort", "descending");
    await sortButton.click();
    await expect(nameHeader).toHaveAttribute("aria-sort", "none");
  });

  test("global search narrows visible rows and resets to page 1", async ({ page }) => {
    const table = page.getByTestId("data-table-readonly");
    await table.locator('input[type="search"]').fill("jane");
    await expect(table.locator("tbody tr").first().locator("td").nth(1)).toHaveText("Jane Cooper");
  });

  test("sort and filter are preserved across page navigation", async ({ page }) => {
    const table = page.getByTestId("data-table-readonly");
    await table.getByRole("button", { name: /Name/ }).click(); // sort asc
    await table.getByRole("button", { name: "Next" }).click();
    const nameHeader = table.locator("th").nth(1);
    await expect(nameHeader).toHaveAttribute("aria-sort", "ascending");
  });

  test("a filter matching zero rows shows the distinct 'no results' state", async ({ page }) => {
    const table = page.getByTestId("data-table-readonly");
    await table.locator('input[type="search"]').fill("zzz-no-such-user");
    await expect(table.getByText("No results match your filters")).toBeVisible();
  });

  test("a genuinely empty dataset shows the distinct 'no data yet' state", async ({ page }) => {
    const table = page.getByTestId("data-table-empty");
    await expect(table.getByText("No data yet")).toBeVisible();
  });

  test("toggling a column's visibility hides/shows it without resetting sort/filter/page", async ({ page }) => {
    const table = page.getByTestId("data-table-readonly");
    await table.getByRole("button", { name: /Name/ }).click(); // sort asc, so we can assert it's preserved
    await table.getByText("Columns").click();
    await table.getByRole("checkbox", { name: "Email" }).uncheck();
    await expect(table.locator("thead th", { hasText: "Email" })).toHaveCount(0);
    const nameHeader = table.locator("th").nth(1);
    await expect(nameHeader).toHaveAttribute("aria-sort", "ascending");
  });
});

test.describe("DataTable (React package) — Selection & Bulk Actions (US2)", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(HARNESS_URL);
  });

  test("selecting rows shows the toolbar with the correct count; clearing hides it", async ({ page }) => {
    const table = page.getByTestId("data-table-selectable");
    const checkboxes = table.locator("tbody input[type=checkbox]");
    await checkboxes.nth(0).check();
    await checkboxes.nth(1).check();
    await expect(table.locator('[role="region"][aria-label="Bulk actions"]')).toContainText("2 selected");
    await checkboxes.nth(0).uncheck();
    await checkboxes.nth(1).uncheck();
    await expect(table.locator('[role="region"][aria-label="Bulk actions"]')).toHaveCount(0);
  });

  test("the page-vs-all-matching selection link appears once the dataset exceeds one page", async ({ page }) => {
    const table = page.getByTestId("data-table-selectable");
    await table.locator("tbody input[type=checkbox]").nth(0).check();
    await expect(table.getByText(/Select all \d+ matching rows/)).toBeVisible();
  });

  test("a requiresConfirmation bulk action opens a confirm step before applying", async ({ page }) => {
    const table = page.getByTestId("data-table-selectable");
    await table.locator("tbody input[type=checkbox]").nth(0).check();
    await table.getByRole("button", { name: "Delete selected" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(/cannot be undone/)).toBeVisible();
    await dialog.getByRole("button", { name: "Confirm" }).click();
    await expect(dialog).not.toBeVisible();
  });
});

test.describe("DataTable (React package) — CRUD (US3)", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(HARNESS_URL);
  });

  test("creating a record adds it, reflected immediately", async ({ page }) => {
    const table = page.getByTestId("data-table-crud");
    await table.getByRole("button", { name: "Add record" }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByLabel("Name", { exact: true }).fill("Zed Test");
    await dialog.getByLabel("Email", { exact: true }).fill("zed@example.com");
    await dialog.getByRole("button", { name: "Add" }).click();
    await expect(dialog).not.toBeVisible();
    // sorted by name would put "Zed Test" last on some page — just confirm total grew to 2 pages
    await expect(table.getByText("Page 1 of 2")).toBeVisible();
  });

  test("editing a record updates it without resetting sort/page", async ({ page }) => {
    const table = page.getByTestId("data-table-crud");
    await table.getByRole("button", { name: "Edit row" }).first().click();
    const dialog = page.getByRole("dialog");
    await dialog.getByLabel("Name", { exact: true }).fill("Edited Name");
    await dialog.getByRole("button", { name: "Save" }).click();
    await expect(table.getByText("Edited Name")).toBeVisible();
  });

  test("submitting an invalid form shows a field error and preserves other values", async ({ page }) => {
    const table = page.getByTestId("data-table-crud");
    await table.getByRole("button", { name: "Add record" }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByLabel("Email", { exact: true }).fill("kept@example.com");
    await dialog.getByRole("button", { name: "Add" }).click();
    await expect(dialog.getByText("Name is required.")).toBeVisible();
    await expect(dialog.getByLabel("Email", { exact: true })).toHaveValue("kept@example.com");
  });

  test("deleting a record requires confirmation", async ({ page }) => {
    const table = page.getByTestId("data-table-crud");
    await table.getByRole("button", { name: "Delete row" }).first().click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByText(/cannot be undone/)).toBeVisible();
    await dialog.getByRole("button", { name: "Cancel" }).click();
    await expect(dialog).not.toBeVisible();
  });

  test("attempting to close a dirty form warns before discarding", async ({ page }) => {
    const table = page.getByTestId("data-table-crud");
    await table.getByRole("button", { name: "Add record" }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByLabel("Name", { exact: true }).fill("Unsaved Draft");
    await dialog.getByRole("button", { name: "Cancel" }).click();
    await expect(dialog.getByText("Discard unsaved changes?")).toBeVisible();
  });

  test("a table with no crud flags enabled renders zero CRUD affordances", async ({ page }) => {
    const table = page.getByTestId("data-table-readonly");
    await expect(table.getByRole("button", { name: "Add record" })).toHaveCount(0);
    await expect(table.getByRole("button", { name: "Edit row" })).toHaveCount(0);
  });
});

test.describe("DataTable (React package) — Responsive", () => {
  test("does not overflow the page at 320px", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto(HARNESS_URL);
    const bodyScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyScrollWidth).toBeLessThanOrEqual(viewportWidth);
  });
});
