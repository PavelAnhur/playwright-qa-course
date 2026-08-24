import { defineConfig, devices } from "@playwright/test";
import { env } from "./src/utils/env";


const isCI = !!process.env['CI'];        // true when running on CI

// Remote environments are flakier (real network), so allow a retry; local stays
// at 0 so a flaky test is visible immediately.
const retries = isCI ? 2 : env.name === "staging" ? 1 : 0;


export default defineConfig({
  testDir: "./src/tests",
  fullyParallel: true,
  forbidOnly: isCI,
  retries,
  workers: isCI ? 4 : 2,
  timeout: env.name === "local" ? 30_000 : 60_000,
  expect: { timeout: env.name === "local" ? 5_000 : 10_000 },
  metadata: { environment: env.name, webURL: env.webURL, apiURL: env.apiURL },
  reporter: [["list"], ["html", { open: "never" }]],
  globalSetup: "./src/setup/global.setup.ts",

  use: {
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "api",
      testDir: "./src/tests/api",
      use: { baseURL: env.apiURL },
    },
    {
      name: "setup",
      testDir: "./src/setup",
      testMatch: /auth\.setup\.ts/,
      use: { baseURL: env.webURL },
    },
    {
      name: "ui",
      testDir: "./src/tests/ui",
      dependencies: ["api", "setup"],
      use: { baseURL: env.webURL, ...devices["Desktop Chrome"] },
    },
  ],
});
