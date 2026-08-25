import { expect, test } from "@fixtures";
import { registerUser } from "@utils/scenarios";


test.describe("Settings (UI)", () => {
  test("update bio and see it on the profile", async ({
    api,
    loginPage,
    settingsPage,
    page,
  }) => {
    const user = await registerUser(api);
    await loginPage.loginAs({ email: user.email, password: user.password });

    const bio = `Bio set by a test ${Date.now()}`;
    await settingsPage.goto();
    await settingsPage.setBio(bio);

    // Verify it persisted by reading the user's public profile.
    await page.goto(`/#/profile/${user.username}`);
    await expect(page.getByText(bio)).toBeVisible();
  });
});
