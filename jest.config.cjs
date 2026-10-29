process.env.EXPO_PUBLIC_API_URL = "https://opsflow.test";

module.exports = {
  preset: "jest-expo",
  transform: {
    "\\.[jt]sx?$": ["babel-jest", {
      presets: ["babel-preset-expo"],
      // Avoid caching public environment values in transformed test modules.
      caller: { name: "metro", bundler: "metro", platform: "ios", preserveEnvVars: true },
    }],
  },
  testMatch: ["<rootDir>/tests/**/*.test.ts", "<rootDir>/tests/**/*.test.tsx"],
  testPathIgnorePatterns: ["/node_modules/", "/.pnpm-store/", "/.agents/"],
  clearMocks: true,
  cacheDirectory: "<rootDir>/node_modules/.cache/jest",
};
