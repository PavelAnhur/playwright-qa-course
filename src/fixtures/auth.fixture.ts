import { mergeTests, request, type APIRequestContext } from "@playwright/test";
import { env } from "@utils/env";
import { test as apiTest } from "./api.fixture";
import { test as dataTest } from "./data.fixture";

export interface AuthFixtures {
  authedApi: APIRequestContext;
}

export const test = mergeTests(apiTest, dataTest).extend<AuthFixtures>({
  authedApi: async ({ api, testUser }, use) => {
    const res = await api.post("users/login", {
      data: {
        user: {
          email: testUser.email,
          password: testUser.password
        }
      }
    });
    const { user } = await res.json();

    const context = await request.newContext({
      baseURL: `${env.apiURL}/`,
      extraHTTPHeaders: { Authorization: `Token ${user.token}` },
    });
    await use(context);
    await context.dispose();
  },
});
