import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  workers: 1,
  reporter: "html",
  timeout: 60000,
  expect: {
    timeout: 30000,
  },
  use: {
    trace: "on-first-retry",
    navigationTimeout: 60000,
    actionTimeout: 30000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // firefox removed due to stability issues
  ],
});
