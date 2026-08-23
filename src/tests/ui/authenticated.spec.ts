import { test, expect } from "@playwright/test";

test.use({ storageState: ".auth/playwright.json" });

test("starts already logged in", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "New Article" })).toBeVisible();
  await expect(page.getByRole("navigation").getByText("playwright")).toBeVisible();
  await expect(page.getByRole("link", { name: "Sign up" })).toBeHidden();
});
