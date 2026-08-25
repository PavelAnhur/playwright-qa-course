import { expect, test } from "@fixtures";
import { validateSchema } from 'playwright-schema-validator';
// Import your OpenAPI spec (as JSON)
import realworldSpec from './test-data/schemas/openapi.json' with { type: 'json' };


test.describe("Articles API (read)", () => {
  test("GET /articles returns a well-formed article list", async ({ api }) => {
    const res = await api.get("articles");

    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("application/json");

    const body = await res.json();
    expect(typeof body.articlesCount).toBe("number");
    expect(Array.isArray(body.articles)).toBe(true);

    expect(body.articles[0]).toHaveProperty("slug");
    expect(body.articles[0].author).toHaveProperty("username");
  });

  test("GET /articles respects the limit query param", async ({ api }) => {
    const res = await api.get("articles", { params: { limit: 1 } });

    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.articles.length).toBeLessThanOrEqual(1);
  });

  test("GET /articles/:slug returns a single article", async ({ api }) => {
    const res = await api.get("articles/welcome-to-inkwell");

    expect(res.ok()).toBeTruthy();
    const { article } = await res.json();
    expect(article.title).toBe("Welcome to Inkwell");
    expect(article.author.username).toBe("alice");
    expect(article.tagList).toEqual([]);
  });

  test("GET /articles/:slug returns 404 for an unknown slug", async ({ api }) => {
    const res = await api.get("articles/does-not-exist-xyz");

    expect(res.status()).toBe(404);
    const body = await res.json();
    expect(body.errors.body[0]).toContain("not found");
  });

  test('GET /articles matches the RealWorld spec', async ({ api }) => {
    const response = await api.get('articles');
    expect(response.ok()).toBeTruthy();

    const data = await response.json();

    // The plugin automatically asserts validity, so no extra assertion is needed.
    await validateSchema(
      data,              // The API response data
      realworldSpec,     // The OpenAPI spec document
      {
        endpoint: '/articles', // The endpoint you're testing
        method: 'GET',         // The HTTP method
        status: 200,           // The expected response status
      }
    );
  });
});