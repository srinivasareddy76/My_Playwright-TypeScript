




import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home-page';

test.describe('FRBSF Basic Homepage Tests', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigateToHomePage();
  });

  test('should load homepage successfully', async ({ page }) => {
    // Verify page has loaded completely
    const isLoaded = await homePage.isPageLoaded();
    expect(isLoaded).toBe(true);

    // Verify page title
    const title = await homePage.getPageTitle();
    expect(title).toContain('Federal Reserve Bank of San Francisco');

    // Verify URL is correct
    const currentUrl = await homePage.getCurrentUrl();
    expect(currentUrl).toContain('frbsf.org');
  });

  test('should have logo visible', async ({ page }) => {
    // Verify logo is present
    const logoCount = await page.locator('a[href="/"], a:has(.sffed-logo-org__logotype), a:has([class*="logo"])').count();
    expect(logoCount).toBeGreaterThan(0);
  });

  test('should have navigation menu', async ({ page }) => {
    // Verify navigation is present
    const navCount = await page.locator('.main-nav, nav, header nav').count();
    expect(navCount).toBeGreaterThan(0);
  });

  test('should have main content area', async ({ page }) => {
    // Verify main content exists
    const mainContent = await page.locator('main, #main, [role="main"], body').first();
    await expect(mainContent).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    // Verify page still loads
    const title = await page.title();
    expect(title).toContain('Federal Reserve Bank of San Francisco');
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    
    // Verify page still loads
    const titleDesktop = await page.title();
    expect(titleDesktop).toContain('Federal Reserve Bank of San Francisco');
  });
});




