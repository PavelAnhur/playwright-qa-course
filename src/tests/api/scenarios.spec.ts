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

  test("limit caps the page and the filtered count is exact", async ({ makeArticle, api }) => {
    const tag = `pg-${Date.now()}`;
    await makeArticle({ tagList: [tag] });
    await makeArticle({ tagList: [tag] });
    await makeArticle({ tagList: [tag] });

    const body = await (await api.get("articles", { params: { tag, limit: 2 } })).json();
    expect(body.articlesCount).toBe(3);     // exact filtered total
    expect(body.articles.length).toBe(2);   // capped by limit
  });
});
