import {
  test as base,
  expect,
  request,
  type APIRequestContext,
} from "@playwright/test";
import { env } from "@utils/env";

export interface TestUser {
  username: string;
  email: string;
  password: string;
}

// The deterministic users that the database seed creates.
export const SEED_USERS = {
  playwright: { username: "playwright", email: "playwright@test.io", password: "Password123!" },
  alice: { username: "alice", email: "alice@test.io", password: "Password123!" },
  bob: { username: "bob", email: "bob@test.io", password: "Password123!" },
} as const satisfies Record<string, TestUser>;

export interface Fixtures {
  api: APIRequestContext;
  testUser: TestUser;
}

export const test = base.extend<Fixtures>({
  api: async ({}, use) => {
    const context = await request.newContext({ baseURL: `${env.apiURL}/` });
    await use(context);        // give the test an HTTP client pointed at the API
    await context.dispose();   // teardown: close it (always runs)
  },

  testUser: async ({}, use) => {
    await use(SEED_USERS.playwright);   // just hand over a known user
  },
});

export { expect };
