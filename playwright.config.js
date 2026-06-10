const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: [
    {
      command: "node ../Backend/server.js",
      url: "http://localhost:5000",
      reuseExistingServer: true,
      cwd: "../Backend",
      timeout: 30000,
    },
    {
      command: "npx react-scripts start",
      url: "http://localhost:3000",
      reuseExistingServer: true,
      cwd: ".",
      timeout: 120000,
    },
  ],
});
