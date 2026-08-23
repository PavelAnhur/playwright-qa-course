import { test, expect } from "@playwright/test";


test.describe("Inkwell home page", () => {
  test("renders the brand and auth links", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle("Inkwell");
    await expect(
      page.getByRole("heading", { name: "inkwell", exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign up" })).toBeVisible();
  });

  test("navigates to the login page", async ({ page }) => {
    await page.goto("/#/login");

    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
  });
});
