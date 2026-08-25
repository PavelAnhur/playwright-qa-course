import { expect, test } from '@fixtures';

// API smoke — proves the dockerized Inkwell API is up, the test endpoints work,
// and seeding is deterministic. Paths are built from env.apiURL explicitly so
// there's no baseURL/relative-path ambiguity (a relative "/test" would drop the
// "/api" prefix). A dedicated api fixture replaces this boilerplate in Part 3.
//
// Serial mode: every test here shares one database, and /test/reset drops &
// recreates every table. Running them in parallel would let one test wipe the
// schema mid-request for another. We reset ONCE up front, then run in order.
// test.describe.configure({ mode: "serial" });

test.describe("Inkwell API smoke", () => {
  test("tags endpoint responds", async ({ api }) => {
    const res = await api.get(`tags`);
    expect(res.ok()).toBeTruthy();
    expect(await res.json()).toHaveProperty("tags");
  });

  test("seeded user can log in and gets a token", async ({ api }) => {
    const res = await api.post(`users/login`, {
      data: { user: { email: "playwright@test.io", password: "Password123!" } },
    });
    expect(res.ok()).toBeTruthy();

    const { user } = await res.json();
    expect(user.username).toBe("playwright");
    expect(user.token).toBeTruthy();
  });

  test("GET /articles list the seeded arcticle", async ({ api }) => {
    const res = await api.get("articles");

    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("application/json");

    const body = await res.json();
    expect(typeof body.articlesCount).toBe("number");
    expect(Array.isArray(body.articles)).toBe(true);

    const slugs = body.articles.map((a: { slug: string }) => a.slug);
    slugs.forEach((s: String) => expect(s).toContain('test-article-id'))
  });

  test("GET /articles respects the limit query param", async ({ api }) => {
    const res = await api.get("articles", { params: { limit: 1 } });
    expect(res.ok()).toBeTruthy();

    const body = await res.json();
    expect(body.articles.length).toBeLessThanOrEqual(1);
  });

  test("GET /articles/:slug returns 404 for an unknown slug", async ({ api }) => {
    const res = await api.get("articles/does-not-exist-xyz");

    expect(res.status()).toBe(404);
    const body = await res.json();
    expect(body.errors.body[0]).toContain("not found");
  });

  test("GET /user returns the current user", async ({ authedApi, testUser }) => {
    const res = await authedApi.get("user");      // token attached automatically
    expect(res.ok()).toBeTruthy();

    const { user } = await res.json();
    expect(user.username).toBe(testUser.username);
    expect(user.email).toBe(testUser.email);
  });

  test("GET /user without a token is rejected", async ({ api }) => {
    const res = await api.get("user");
    // the ANONYMOUS client (no token)
    expect(res.status()).toBe(401);               // 401 = unauthorized
    const body = await res.json();
    expect(body.errors.body[0]).toContain("login");
  });
});
