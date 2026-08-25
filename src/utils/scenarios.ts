import { articleData } from '@data/article';
import { APIRequestContext } from '@playwright/test';
import { uniqueId } from '@utils/unique';


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

export interface RegisteredUser {
  username: string;
  email: string;
  password: string;
  token: string;
}

export async function registerUser(
  api: APIRequestContext,
  overrides: Partial<Pick<RegisteredUser, "username" | "email" | "password">> = {},
): Promise<RegisteredUser> {
  const username = overrides.username ?? `user${uniqueId()}`;
  const email = overrides.email ?? `${username}@test.io`;
  const password = overrides.password ?? "Password123!";

  const res = await api.post("users", {
    data: { user: { username, email, password } },
  });
  if (!res.ok()) {
    throw new Error(`registerUser failed: HTTP ${res.status()}`);
  }
  const { user } = await res.json();
  return { username, email, password, token: user.token };
}
