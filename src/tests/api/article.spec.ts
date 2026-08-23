import { expect, test } from '@fixtures';

function uniqueTitle(prefix: string): string {
  // a timestamp + a random number makes it unique even across parallel workers
  return `${prefix} ${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

test("create returns the new article with a generated slug", async ({ authedApi }) => {
  const title = uniqueTitle("CRUD create");
  const res = await authedApi.post("articles", {
    data: {
      article: { title, description: "made by a test", body: "body", tagList: ["api", "crud"] },
    },
  });
  expect(res.ok()).toBeTruthy();

  const { article } = await res.json();
  expect(article.title).toBe(title);
  expect(article.slug).toContain("crud-create-");   // the server slugified the title
  expect(article.tagList).toEqual(["api", "crud"]);
  expect(article.author.username).toBe("playwright");

  await authedApi.delete(`articles/${article.slug}`); // clean up what we made
});

test("update changes fields without changing the slug", async ({ authedApi }) => {
  const create = await authedApi.post("articles", {
    data: { article: { title: uniqueTitle("CRUD update"), description: "old", body: "b", tagList: [] } },
  });
  const { article } = await create.json();

  const res = await authedApi.put(`articles/${article.slug}`, {
    data: { article: { description: "new description" } },
  });
  expect(res.ok()).toBeTruthy();

  const updated = (await res.json()).article;
  expect(updated.slug).toBe(article.slug);             // slug stayed the same
  expect(updated.description).toBe("new description");

  await authedApi.delete(`articles/${article.slug}`);
});

test("delete removes the article (404 afterward)", async ({ authedApi }) => {
  const create = await authedApi.post("articles", {
    data: { article: { title: uniqueTitle("CRUD delete"), description: "d", body: "b", tagList: [] } },
  });
  const { article } = await create.json();

  const del = await authedApi.delete(`articles/${article.slug}`);
  expect(del.status()).toBe(200);

  const after = await authedApi.get(`articles/${article.slug}`);
  expect(after.status()).toBe(404);
});

test("create without a token is rejected", async ({ api }) => {
  const res = await api.post("articles", {
    data: { article: { title: "no auth", description: "d", body: "b" } },
  });
  expect(res.status()).toBe(401);                      // unauthorized
});
