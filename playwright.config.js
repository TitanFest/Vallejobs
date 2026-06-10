const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "html",
  use: {
    baseURL: "http://localhost:5000",
    extraHTTPHeaders: { "Content-Type": "application/json" },
  },
  webServer: {
    command: "node server.js",
    url: "http://localhost:5000",
    reuseExistingServer: true,
    cwd: ".",
    timeout: 30000,
  },
});
