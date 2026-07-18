import { test, expect } from "@playwright/test";
import { expectNoA11yViolations } from "./a11y-helper";

// Feature 039 — Advanced Form Inputs batch. Covers all 4 user stories
// (US1 TagsInput/Autocomplete/Mentions, US2 Cascader/TreeSelect, US3
// InputMask/JsonInput/RangeSlider, US4 FloatLabel/Interactive Rating).
// Closes feature 018's inventory candidates #10-27.

test.describe("TagsInput", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/tags-input/tags-input.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("Enter commits the typed value as a removable tag and clears the field", async ({ page }) => {
    const field = page.getByTestId("tags-input-demo").locator("[data-tags-input-field]");
    await field.fill("React");
    await field.press("Enter");
    await expect(page.getByTestId("tags-input-tag-0")).toHaveText("React×");
    await expect(field).toHaveValue("");
  });

  test("comma also commits, and duplicate values are not added twice", async ({ page }) => {
    const field = page.getByTestId("tags-input-demo").locator("[data-tags-input-field]");
    await field.fill("Vue");
    await field.press(",");
    await field.fill("Vue");
    await field.press("Enter");
    await expect(page.getByTestId("tags-input-demo").locator(".tags-input-tag")).toHaveCount(1);
  });

  test("pasting a comma-separated value splits into multiple tags (Edge Case)", async ({ page, browserName }) => {
    // Firefox does not honor a script-constructed ClipboardEvent's
    // clipboardData init property (matching pin-input.spec.ts's own
    // documented precedent) — a test-simulation limitation, not a
    // tags-input.js defect.
    test.skip(browserName === "firefox", "Firefox does not support synthetic ClipboardEvent.clipboardData");
    const field = page.getByTestId("tags-input-demo").locator("[data-tags-input-field]");
    await field.evaluate((el: HTMLInputElement) => {
      const dt = new DataTransfer();
      dt.setData("text", "a,b,c");
      el.dispatchEvent(new ClipboardEvent("paste", { clipboardData: dt, bubbles: true, cancelable: true }));
    });
    await expect(page.getByTestId("tags-input-demo").locator(".tags-input-tag")).toHaveCount(3);
  });

  test("Backspace on an empty field removes the last tag", async ({ page }) => {
    const field = page.getByTestId("tags-input-demo").locator("[data-tags-input-field]");
    await field.fill("one");
    await field.press("Enter");
    await field.press("Backspace");
    await expect(page.getByTestId("tags-input-demo").locator(".tags-input-tag")).toHaveCount(0);
  });

  test("clicking a tag's remove button removes only that tag", async ({ page }) => {
    const field = page.getByTestId("tags-input-demo").locator("[data-tags-input-field]");
    await field.fill("one");
    await field.press("Enter");
    await field.fill("two");
    await field.press("Enter");
    await page.getByTestId("tags-input-tag-0").getByRole("button").click();
    await expect(page.getByTestId("tags-input-demo").locator(".tags-input-tag")).toHaveCount(1);
    await expect(page.getByTestId("tags-input-demo").locator(".tags-input-tag")).toHaveText("two×");
  });
});

test.describe("Autocomplete", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/autocomplete/autocomplete.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("typing a partial match narrows the list; selecting one commits the value", async ({ page }) => {
    const field = page.getByTestId("autocomplete-demo").locator("[data-autocomplete-field]");
    await field.fill("Braz");
    await expect(page.getByTestId("autocomplete-option-br")).toBeVisible();
    await expect(page.locator(".autocomplete-option")).toHaveCount(1);
    await page.getByTestId("autocomplete-option-br").click();
    await expect(field).toHaveValue("Brazil");
  });

  test("no matches shows an explicit 'No results' state, never a silently empty panel (Edge Case)", async ({ page }) => {
    const field = page.getByTestId("autocomplete-demo").locator("[data-autocomplete-field]");
    await field.fill("zzzzz");
    await expect(page.locator(".autocomplete-empty")).toHaveText("No results");
  });

  test("Escape closes the panel", async ({ page }) => {
    const field = page.getByTestId("autocomplete-demo").locator("[data-autocomplete-field]");
    await field.click();
    await expect(page.locator("[data-autocomplete-listbox]")).toBeVisible();
    await field.press("Escape");
    await expect(page.locator("[data-autocomplete-listbox]")).toBeHidden();
  });
});

test.describe("Mentions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/mentions/mentions.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("typing @ followed by characters opens a filtered popover anchored at the cursor", async ({ page }) => {
    const field = page.getByTestId("mentions-demo").locator("[data-mentions-field]");
    await field.fill("hi @ja");
    await expect(page.getByTestId("mentions-option-jane")).toBeVisible();
  });

  test("selecting a suggestion inserts a mention token in place of the typed characters", async ({ page }) => {
    const field = page.getByTestId("mentions-demo").locator("[data-mentions-field]");
    await field.fill("hi @ja");
    await page.getByTestId("mentions-option-jane").click();
    await expect(field).toHaveValue("hi @jane ");
  });
});

test.describe("Cascader", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/cascader/cascader.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("selecting a first-level option opens a second-level panel; a leaf commits the full path", async ({ page }) => {
    const trigger = page.locator("[data-cascader-trigger]");
    await trigger.click();
    await page.getByTestId("cascader-option-eu").click();
    await expect(page.getByTestId("cascader-option-pt")).toBeVisible();
    await page.getByTestId("cascader-option-pt").click();
    await expect(trigger).toHaveText("Europe / Portugal");
  });

  test("Escape closes the panel without changing a previously committed value", async ({ page }) => {
    const trigger = page.locator("[data-cascader-trigger]");
    await trigger.click();
    await page.getByTestId("cascader-option-eu").click();
    await page.getByTestId("cascader-option-pt").click();
    await expect(trigger).toHaveText("Europe / Portugal");
    await trigger.click();
    await trigger.press("Escape");
    await expect(trigger).toHaveText("Europe / Portugal");
  });
});

test.describe("TreeSelect", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/tree-select/tree-select.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("opening the trigger shows TreeView's expand/collapse affordance; selecting a node commits and closes", async ({ page }) => {
    const trigger = page.locator("[data-tree-select-trigger]");
    await trigger.click();
    await expect(page.locator("[data-tree-select-panel] details")).toHaveCount(2);
    await page.locator('[data-node-id="src-components-form"]').click();
    await expect(trigger).toHaveText("form");
    await expect(page.locator("[data-tree-select-panel]")).toBeHidden();
  });

  test("node is selectable via keyboard (Enter)", async ({ page }) => {
    const trigger = page.locator("[data-tree-select-trigger]");
    await trigger.click();
    await page.locator('[data-node-id="tests"]').focus();
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveText("tests");
  });
});

test.describe("InputMask", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/input-mask/input-mask.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("typing digits auto-inserts literal mask characters", async ({ page }) => {
    const field = page.getByTestId("input-mask-phone-demo");
    await field.pressSequentially("5551234567");
    await expect(field).toHaveValue("(555) 123-4567");
  });

  test("non-digit characters are ignored", async ({ page }) => {
    const field = page.getByTestId("input-mask-phone-demo");
    await field.pressSequentially("abc555");
    await expect(field).toHaveValue("(555");
  });
});

test.describe("JsonInput", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/json-input/json-input.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("invalid JSON shows a visible, non-blocking inline error", async ({ page }) => {
    const field = page.getByTestId("json-input-demo");
    await field.fill("{ not valid json");
    await expect(field).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator(".json-input-error")).not.toHaveText("");
    // still editable — typing is never blocked by the invalid state
    await field.pressSequentially("!");
    await expect(field).toHaveValue("{ not valid json!");
  });

  test("fixing the JSON clears the error", async ({ page }) => {
    const field = page.getByTestId("json-input-demo");
    await field.fill("{ not valid json");
    await expect(field).toHaveAttribute("aria-invalid", "true");
    await field.fill('{"ok": true}');
    await expect(field).not.toHaveAttribute("aria-invalid", "true");
  });
});

test.describe("RangeSlider", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/range-slider/range-slider.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("the low handle can never be dragged past the high handle's current value", async ({ page }) => {
    const low = page.locator("[data-range-slider-low]");
    const high = page.locator("[data-range-slider-high]");
    await low.fill("95"); // attempt to move low past high (80)
    await expect(low).toHaveValue("80");
    await expect(high).toHaveValue("80");
  });

  test("the high handle can never be dragged below the low handle's current value", async ({ page }) => {
    const low = page.locator("[data-range-slider-low]");
    const high = page.locator("[data-range-slider-high]");
    await high.fill("5"); // attempt to move high below low (20)
    await expect(high).toHaveValue("20");
    await expect(low).toHaveValue("20");
  });

  test("each handle is independently keyboard-operable via native range input Arrow keys", async ({ page }) => {
    const low = page.locator("[data-range-slider-low]");
    await low.focus();
    await low.press("ArrowRight");
    await expect(low).toHaveValue("21");
  });
});

test.describe("FloatLabel", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/float-label/float-label.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("an empty field's label floats on focus and returns to rest on blur while still empty", async ({ page }) => {
    const wrapper = page.getByTestId("float-label-empty-demo");
    const field = wrapper.locator("input");
    const label = wrapper.locator("label");
    const restTop = await label.evaluate((el) => getComputedStyle(el).top);
    await field.focus();
    await expect(async () => {
      const focusedTop = await label.evaluate((el) => getComputedStyle(el).top);
      expect(focusedTop).not.toBe(restTop);
    }).toPass();
    await field.blur();
    await expect(async () => {
      const blurredTop = await label.evaluate((el) => getComputedStyle(el).top);
      expect(blurredTop).toBe(restTop);
    }).toPass();
  });

  test("a pre-filled field's label starts floated with no focus event needed", async ({ page }) => {
    const wrapper = page.getByTestId("float-label-filled-demo");
    const emptyWrapper = page.getByTestId("float-label-empty-demo");
    const filledLabelTop = await wrapper.locator("label").evaluate((el) => getComputedStyle(el).top);
    const restTop = await emptyWrapper.locator("label").evaluate((el) => getComputedStyle(el).top);
    expect(filledLabelTop).not.toBe(restTop);
  });
});

test.describe("Interactive Rating", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/src/components/rating/rating.html");
  });

  test("has no accessibility violations", async ({ page }, testInfo) => {
    await expectNoA11yViolations(page, testInfo);
  });

  test("pre-existing read-only rating demos are unchanged", async ({ page }) => {
    await expect(page.getByTestId("rating-fractional").locator(".rating-value")).toHaveText("4.2 out of 5");
    await expect(page.getByTestId("rating-fractional").locator(".rating-stars")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  test("clicking a star sets the value", async ({ page }) => {
    const group = page.locator("[data-rating-interactive]");
    await group.getByLabel("3 stars").check({ force: true });
    await expect(group.getByLabel("3 stars")).toBeChecked();
  });

  test("the interactive group is a real radiogroup, not a decorative aria-hidden overlay", async ({ page }) => {
    const group = page.locator("[data-rating-interactive]");
    await expect(group).toHaveAttribute("role", "radiogroup");
    await expect(group).not.toHaveAttribute("aria-hidden", "true");
  });

  test("Arrow key navigation changes the value while focused", async ({ page }) => {
    const group = page.locator("[data-rating-interactive]");
    const threeStars = group.getByLabel("3 stars");
    await threeStars.check({ force: true });
    await threeStars.focus();
    await page.keyboard.press("ArrowLeft");
    await expect(group.getByLabel("4 stars")).toBeChecked();
  });
});
