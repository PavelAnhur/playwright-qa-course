import { expect, test } from "@fixtures";

test("an article created through the API renders on its page", async ({
  makeArticle,
  page,
}) => {
  // 1. Set up the data through the API — one fast request.
  const article = await makeArticle({
    title: `Seeded via API ${Date.now()}`,
    body: "This article was created through the API and rendered by the UI.",
    tagList: ["integration"],
  });

  // 2. Point the browser straight at it.
  await page.goto(`/#/article/${article.slug}`);

  // 3. Verify what the UI actually renders.
  await expect(page.getByRole("heading", { name: article.title })).toBeVisible();
  await expect(page.getByText(article.body)).toBeVisible();
  await expect(page.getByRole("link", { name: "playwright" }).first()).toBeVisible();
});
