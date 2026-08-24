import { articleData } from '@data/article';
import { APIRequestContext } from '@playwright/test';


export interface ArticleInput {
  title?: string;
  description?: string;
  body?: string;
  tagList?: string[];
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  author: { username: string };
  [key: string]: unknown;
}

export async function createArticle(
  api: APIRequestContext,
  overrides: Partial<ArticleInput> = {},
): Promise<Article> {
  const res = await api.post("articles", {
    data: {
      article: articleData(overrides)
    }
  });
  if (!res.ok()) throw new Error(`createArticle failed: HTTP ${res.status()}`);
  return (await res.json())?.article as Article;
}
