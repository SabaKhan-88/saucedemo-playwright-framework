// Chapter 7: ONE place that controls how the framework behaves.
const { defineConfig, devices } = require('@playwright/test');
const path = require('path');
const { AUTH_FILE } = require('./utils/constants');

// Chapter 6: pick the environment file -> ENV=qa npx playwright test  (default: qa)
require('dotenv').config({
  path: path.resolve(__dirname, `.env.${process.env.ENV || 'qa'}`),
});

module.exports = defineConfig({
  testDir: './tests',

  timeout: 30_000, // max time per test
  expect: { timeout: 5_000 }, // max time per assertion

  fullyParallel: true,
  forbidOnly: !!process.env.CI, // fail CI if someone leaves test.only

  // Chapter 15: retries are a SAFETY NET, not a fix
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,

  // Chapter 14: reports
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'reports/junit.xml' }],
  ],
  outputDir: 'test-results',

  use: {
    baseURL: process.env.BASE_URL,
    headless: true,
    testIdAttribute: 'data-test', // SauceDemo uses data-test, so getByTestId('username') works

    // Chapter 14: debugging evidence
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    // Chapter 10: logs in ONCE and saves the session
    {
      name: 'setup',
      testMatch: /.*\.setup\.js/,
    },

    // UI tests: start already logged in thanks to storageState
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: AUTH_FILE },
      dependencies: ['setup'],
      testIgnore: ['**/api/**'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], storageState: AUTH_FILE },
      dependencies: ['setup'],
      testIgnore: ['**/api/**'],
    },

    // Chapter 11: pure API tests, no browser needed
    {
      name: 'api',
      testMatch: '**/api/**/*.spec.js',
      use: { baseURL: process.env.API_BASE_URL },
    },
  ],
});
