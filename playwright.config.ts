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
  reporter: [
    ["list"],
    ["html", { open: "never" }],
    ["junit", { outputFile: "test-results/junit.xml" }],
    ["./reporters/summary-reporter.ts"],
    ['phantom-report', {
      outputFolder: 'phantom-report',
      history: {
        enabled: true,
        retention: 10, // Keep 10 days of history
        filePath: 'phantom-report/history.json'
      },
      open: 'never'
    }]
  ],
  globalSetup: "./src/setup/global.setup.ts",

  use: {
    video: 'on-first-retry',
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "api",
      testDir: "./src/tests/api",
      use: {
        baseURL: env.apiURL,
        screenshot: 'off',
        video: 'off',
      },
    },
    {
      name: "setup",
      testDir: "./src/setup",
      testMatch: /auth\.setup\.ts/,
      use: { baseURL: env.webURL },
    },
    {
      name: "ui chrome",
      testDir: "./src/tests/ui",
      dependencies: ["setup"],
      use: { baseURL: env.webURL, ...devices["Desktop Chrome"] },
    },
    {
      name: "ui firefox",
      testDir: "./src/tests/ui",
      dependencies: ["setup"],
      use: { baseURL: env.webURL, ...devices["Desktop Firefox"] },
    },
    {
      name: "ui webkit",
      testDir: "./src/tests/ui",
      dependencies: ["setup"],
      use: {
        baseURL: env.webURL,
        ...devices["Desktop Safari"]
      },
    },
    {
      name: "ui mobile-custom",
      testDir: "./src/tests/ui",
      dependencies: ["setup"],
      use: {
        baseURL: env.webURL,
        viewport: { width: 375, height: 812 }, // Custom size
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)...',
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 2,
      },
    },
    {
      name: "ui mobile-pixel",
      testDir: "./src/tests/ui",
      dependencies: ["setup"],
      use: {
        baseURL: env.webURL,
        ...devices["Pixel 7a"]
      },
    },
    {
      name: "ui mobile-iphone",
      testDir: "./src/tests/ui",
      dependencies: ["setup"],
      use: {
        baseURL: env.webURL,
        ...devices["iPhone 12"]
      },
    },
  ],
});
