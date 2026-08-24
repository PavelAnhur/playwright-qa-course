export type EnvName = "local" | "ci" | "staging";

const ENVIRONMENTS: Record<EnvName, { webURL: string; apiURL: string }> = {
  local: { webURL: "http://localhost:3000", apiURL: "http://localhost:3001/api" },
  ci: { webURL: "http://localhost:3000", apiURL: "http://localhost:3001/api" },
  staging: { webURL: "https://inkwell-staging.example.com", apiURL: "https://inkwell-staging.example.com/api" },
};

const name = (process.env['TEST_ENV'] as EnvName) || "local";
const base = ENVIRONMENTS[name] ?? ENVIRONMENTS.local;

export const env = {
  name,
  webURL: process.env['WEB_URL'] ?? base.webURL,
  apiURL: process.env['API_URL'] ?? base.apiURL,
} as const;
