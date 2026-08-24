import { test as base, request, type APIRequestContext } from "@playwright/test";
import { env } from "@utils/env";


export interface ApiFixtures {
  api: APIRequestContext;
}

export const test = base.extend<object, ApiFixtures>({
  api: [
    async ({ }, use) => {
      const context = await request.newContext({ baseURL: `${env.apiURL}/` });
      await use(context);
      await context.dispose();
    },
    { scope: 'worker' },
  ]
});
