import { ArticleEditorPage } from "@pages/ArticleEditorPage";
import { ArticlePage } from "@pages/ArticlePage";
import { LoginPage } from '@pages/LoginPage';
import {
  test as base,
} from "@playwright/test";


export interface PageFixtures {
  loginPage: LoginPage;
  articleEditorPage: ArticleEditorPage;
  articlePage: ArticlePage
}

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  articleEditorPage: async ({ page }, use) => {
    await use(new ArticleEditorPage(page));
  },

  articlePage: async ({ page }, use) => {
    await use(new ArticlePage(page));
  }
});
