import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const ROOT = __dirname;
const RESULTS_DIR = path.join(ROOT, 'allure-results');
const REPORT_DIR = path.join(ROOT, 'allure-report');

const BASE_URL = process.env.BASE_URL || 'https://playwright.dev';
const HEADLESS = process.env.HEADLESS !== 'false';
const TZ = process.env.TZ || 'Europe/Riga';

for (const dir of [RESULTS_DIR, REPORT_DIR]) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
}

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },

  fullyParallel: true,
  retries: process.env.CI ? 2 : 2,
  workers: process.env.CI ? 2 : 4,
  forbidOnly: !!process.env.CI,

  reporter: [
    ['line'],
    ['html', { open: 'never' }],
    ['allure-playwright']
  ],

  use: {
    baseURL: BASE_URL,
    headless: HEADLESS,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    timezoneId: TZ,
    locale: 'en-US',
    viewport: { width: 1440, height: 900 },
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

  outputDir: 'test-results',
});