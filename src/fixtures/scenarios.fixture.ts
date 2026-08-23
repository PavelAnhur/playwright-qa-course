import { createArticle, type Article, type ArticleInput } from "@utils/scenarios";
import { test as authTest } from './auth.fixture';



export interface ScenarioFixtures {
  makeArticle: (overrides?: ArticleInput) => Promise<Article>;
}

export const test = authTest.extend<ScenarioFixtures>({
  makeArticle: async ({ authedApi }, use) => {
    const created: string[] = [];

    const make = async (overrides: ArticleInput = {}) => {
      const article = await createArticle(authedApi, overrides);
      created.push(article.slug);
      return article;
    };

    await use(make);

    for (const slug of created) {
      await authedApi.delete(`articles/${slug}`).catch(() => { });
    }
  },
});
