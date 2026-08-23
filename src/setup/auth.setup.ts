import { expect, test as setup } from "@playwright/test";
import { env } from "@utils/env";
import { SEED_USERS } from "../fixtures/data.fixture";


const authFile = ".auth/playwright.json";

setup("authenticate", async ({ page, request }) => {
  const { email, password } = SEED_USERS.playwright;

  // 1. Log in via the API (no clicking) and get the token.
  const res = await request.post(`${env.apiURL}/users/login`, {
    data: { user: { email, password } },
  });
  expect(res.ok()).toBeTruthy();
  const { user } = await res.json();

  // 2. Write the exact session shape Inkwell reads on load, into localStorage.
  const session = { headers: { Authorization: `Token ${user.token}` }, isAuth: true, loggedUser: user };
  await page.goto("/");
  await page.evaluate((v) => localStorage.setItem("loggedUser", JSON.stringify(v)), session);

  // 3. Save cookies + localStorage to a file.
  await page.context().storageState({ path: authFile });
});
