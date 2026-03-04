
import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: 'reports/html-report' }],
    ['json', { outputFile: 'reports/test-results.json' }],
    ['junit', { outputFile: 'reports/junit-results.xml' }],
    ['list']
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL || 'https://frbsf.org',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Record video on failure */
    video: 'retain-on-failure',
    
    /* Global timeout for each test */
    actionTimeout: 30000,
    navigationTimeout: 30000,
  },

  /* Configure projects for major browsers and applications */
  projects: [
    // FRBSF Application Tests
    {
      name: 'frbsf-chromium',
      testDir: './tests/e2e/frbsf',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'https://frbsf.org',
      },
    },
    {
      name: 'frbsf-firefox',
      testDir: './tests/e2e/frbsf',
      use: { 
        ...devices['Desktop Firefox'],
        baseURL: 'https://frbsf.org',
      },
    },
    {
      name: 'frbsf-webkit',
      testDir: './tests/e2e/frbsf',
      use: { 
        ...devices['Desktop Safari'],
        baseURL: 'https://frbsf.org',
      },
    },
    {
      name: 'frbsf-mobile-chrome',
      testDir: './tests/e2e/frbsf',
      use: { 
        ...devices['Pixel 5'],
        baseURL: 'https://frbsf.org',
      },
    },
    {
      name: 'frbsf-mobile-safari',
      testDir: './tests/e2e/frbsf',
      use: { 
        ...devices['iPhone 12'],
        baseURL: 'https://frbsf.org',
      },
    },

    // Cross-application compatibility tests
    {
      name: 'cross-browser-edge',
      testDir: './tests/e2e',
      use: { 
        ...devices['Desktop Edge'], 
        channel: 'msedge',
      },
    },
    {
      name: 'cross-browser-chrome',
      testDir: './tests/e2e',
      use: { 
        ...devices['Desktop Chrome'], 
        channel: 'chrome',
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },

  /* Global setup and teardown */
  globalSetup: require.resolve('./src/config/global-setup.ts'),
  globalTeardown: require.resolve('./src/config/global-teardown.ts'),

  /* Output directory for test artifacts */
  outputDir: 'test-results/',
  
  /* Maximum time one test can run for. */
  timeout: 60000,
  
  /* Maximum time expect() should wait for the condition to be met. */
  expect: {
    timeout: 10000
  },
});

