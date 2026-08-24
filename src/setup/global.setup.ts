import { request } from "@playwright/test";
import { env } from "../utils/env";

export default async function globalSetup(): Promise<void> {
  const ctx = await request.newContext({ baseURL: `${env.apiURL}/` });
  try {
    const res = await ctx.post("test/reset");
    if (!res.ok()) throw new Error(`reset failed: HTTP ${res.status()}`);
  } finally {
    await ctx.dispose();
  }
}
