import { test, expect } from "@fixtures";


test("author can publish an article and delete it", async ({
  page,
  loginPage,
  articleEditorPage,
  articlePage,
  testUser, }) => {
  const title = `Testing Forms in Inkwell ${Date.now()}`;
  const draft = {
    title,
    description: "A walkthrough of the article editor",
    body: "Written by a Playwright test to prove the editor form works end to end.",
    tags: "playwright testing",
  };
  await loginPage.loginAs(testUser);
  // Publish via the editor form.
  await articleEditorPage.publishArticle(draft);
  // We land on the new article's page.
  await articlePage.expectTitle(title);
  await expect(page).toHaveURL(/#\/article\/testing-forms-in-inkwell-\d+/);
  // Delete it — answering the window.confirm() dialog — and land back home.
  await articlePage.deleteAndConfirm();
  await expect(page).toHaveURL(/\/#?\/?$/);
  await expect(page.getByRole("button", { name: "Global Feed" })).toBeVisible();
});
