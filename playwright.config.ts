import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 60000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    browserName: "chromium",
  },
  projects: [
    {
      name: "Desktop Chrome (1440x900)",
      use: {
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "Tablet (1024x768)",
      use: {
        viewport: { width: 1024, height: 768 },
      },
    },
    {
      name: "Mobile iPhone 14 (390x844)",
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
      },
    },
    {
      name: "Mobile Compact Android (360x780)",
      use: {
        viewport: { width: 360, height: 780 },
        isMobile: true,
      },
    },
  ],
  webServer: {
    command: "npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
