import { expect, test } from '@fixtures';

test.describe("Article scenarios", () => {
  test("a provisioned article is retrievable by slug", async ({ makeArticle, api }) => {
    const article = await makeArticle(
      {
        title: "Findable Article",
        tagList: ["scenario"],
      }
    );
    const res = await api.get(`articles/${article.slug}`);
    const found = (await res.json()).article;
    expect(found.title).toBe(article.title);
    expect(found.tagList).toEqual(["scenario"]);
  });
});
