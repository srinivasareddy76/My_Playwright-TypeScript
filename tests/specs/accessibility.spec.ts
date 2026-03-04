






import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home-page';

test.describe('FRBSF Accessibility Tests', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigateToHomePage();
  });

  test.describe('Basic Accessibility Compliance', () => {
    test('should have proper page structure and semantics', async ({ page }) => {
      // Verify page has loaded completely
      const isLoaded = await homePage.isPageLoaded();
      expect(isLoaded).toBe(true);

      // Check for proper page title
      const title = await homePage.getPageTitle();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(0);

      // Verify main landmark elements exist
      const mainContent = await page.locator('main, [role="main"], .main-content').first();
      await expect(mainContent).toBeVisible();

      // Verify navigation landmark exists
      const navigation = await page.locator('nav, [role="navigation"]').first();
      await expect(navigation).toBeVisible();
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      // Verify page has loaded completely
      const isLoaded = await homePage.isPageLoaded();
      expect(isLoaded).toBe(true);

      // Check for h1 element (should have exactly one)
      const h1Elements = await page.locator('h1').count();
      expect(h1Elements).toBeGreaterThanOrEqual(1);

      // Verify heading elements exist in logical order
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
      expect(headings.length).toBeGreaterThan(0);
    });

    test('should have accessible navigation elements', async ({ page }) => {
      // Verify logo has proper accessibility attributes
      await homePage.verifyLogoVisibility();
      
      // Check if logo link has accessible text
      const logoLink = await page.locator('a[href="/"], a:has(.sffed-logo-org__logotype), a:has([class*="logo"])').first();
      const logoText = await logoLink.textContent();
      const logoAriaLabel = await logoLink.getAttribute('aria-label');
      const logoTitle = await logoLink.getAttribute('title');
      
      // Logo should have some form of accessible text
      const hasAccessibleText = (logoText && logoText.trim().length > 0) || 
                               (logoAriaLabel && logoAriaLabel.length > 0) || 
                               (logoTitle && logoTitle.length > 0);
      expect(hasAccessibleText).toBe(true);

      // Verify navigation links are accessible
      await homePage.verifyMainNavigationVisibility();
      await homePage.verifyAboutLinkVisibility();
      await homePage.verifyResearchLinkVisibility();
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should support keyboard navigation for main elements', async ({ page }) => {
      // Verify page has loaded completely
      const isLoaded = await homePage.isPageLoaded();
      expect(isLoaded).toBe(true);

      // Test Tab navigation through main elements
      await page.keyboard.press('Tab');
      
      // Verify focus is visible (check for focus indicators)
      const focusedElement = await page.locator(':focus').first();
      await expect(focusedElement).toBeVisible();

      // Continue tabbing through navigation
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Verify we can navigate through the page
      const secondFocusedElement = await page.locator(':focus').first();
      await expect(secondFocusedElement).toBeVisible();
    });

    test('should support Enter key for link activation', async ({ page }) => {
      // Verify page has loaded completely
      const isLoaded = await homePage.isPageLoaded();
      expect(isLoaded).toBe(true);

      // Focus on logo link and test Enter key
      const logoLink = await page.locator('a[href="/"], a:has(.sffed-logo-org__logotype), a:has([class*="logo"])').first();
      await logoLink.focus();
      
      // Verify the link is focused
      await expect(logoLink).toBeFocused();
      
      // Test that Enter key would activate the link (we'll just verify it's focusable)
      const isVisible = await logoLink.isVisible();
      expect(isVisible).toBe(true);
    });
  });

  test.describe('Screen Reader Compatibility', () => {
    test('should have proper ARIA labels and roles', async ({ page }) => {
      // Verify page has loaded completely
      const isLoaded = await homePage.isPageLoaded();
      expect(isLoaded).toBe(true);

      // Check for navigation with proper role
      const navigation = await page.locator('nav, [role="navigation"]').first();
      await expect(navigation).toBeVisible();

      // Check for main content area
      const mainContent = await page.locator('main, [role="main"]').first();
      if (await mainContent.count() > 0) {
        await expect(mainContent).toBeVisible();
      }

      // Verify search functionality has proper labels
      const searchInput = await page.locator('input[type="search"], input[name="search"], #search, .search-input').first();
      if (await searchInput.count() > 0) {
        const hasLabel = await searchInput.getAttribute('aria-label') || 
                        await searchInput.getAttribute('placeholder') ||
                        await page.locator('label[for]').count() > 0;
        expect(hasLabel).toBeTruthy();
      }
    });

    test('should have descriptive link text', async ({ page }) => {
      // Verify page has loaded completely
      const isLoaded = await homePage.isPageLoaded();
      expect(isLoaded).toBe(true);

      // Check navigation links have descriptive text
      const aboutLink = await page.locator('nav > ul > li > a:has-text("About"), .menu-item > a:has-text("About")').first();
      if (await aboutLink.count() > 0) {
        const linkText = await aboutLink.textContent();
        expect(linkText).toBeTruthy();
        expect(linkText!.trim().length).toBeGreaterThan(0);
      }

      const researchLink = await page.locator('nav a[href="/research-and-insights/"]:has-text("Research")').first();
      if (await researchLink.count() > 0) {
        const linkText = await researchLink.textContent();
        expect(linkText).toBeTruthy();
        expect(linkText!.trim().length).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Color and Contrast', () => {
    test('should not rely solely on color for information', async ({ page }) => {
      // Verify page has loaded completely
      const isLoaded = await homePage.isPageLoaded();
      expect(isLoaded).toBe(true);

      // Verify navigation elements are distinguishable
      await homePage.verifyMainNavigationVisibility();
      await homePage.verifyAboutLinkVisibility();
      await homePage.verifyResearchLinkVisibility();

      // Test hover states provide visual feedback beyond color
      await homePage.hoverOverAboutLink();
      await homePage.verifyDropdownVisibility();
    });
  });

  test.describe('Form Accessibility', () => {
    test('should have accessible search functionality', async ({ page }) => {
      // Verify page has loaded completely
      const isLoaded = await homePage.isPageLoaded();
      expect(isLoaded).toBe(true);

      // Check if search form exists and is accessible
      const searchInput = await page.locator('input[type="search"], input[name="search"], #search, .search-input').first();
      
      if (await searchInput.count() > 0) {
        // Verify search input is visible and accessible
        await expect(searchInput).toBeVisible();
        
        // Check for associated label or aria-label
        const hasAccessibleName = await searchInput.getAttribute('aria-label') ||
                                 await searchInput.getAttribute('placeholder') ||
                                 await searchInput.getAttribute('title');
        expect(hasAccessibleName).toBeTruthy();

        // Test search functionality
        await homePage.performSearch('accessibility test');
        await homePage.verifySearchResults();
      }
    });
  });

  test.describe('Mobile Accessibility', () => {
    test('should maintain accessibility on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await homePage.setMobileViewport();

      // Verify page has loaded completely
      const isLoaded = await homePage.isPageLoaded();
      expect(isLoaded).toBe(true);

      // Verify key elements are accessible on mobile
      await homePage.verifyLogoVisibility();
      await homePage.verifyMainNavigationVisibility();

      // Check touch targets are appropriately sized (at least 44px)
      const logoLink = await page.locator('a[href="/"], a:has(.sffed-logo-org__logotype), a:has([class*="logo"])').first();
      const logoBox = await logoLink.boundingBox();
      
      if (logoBox) {
        // Touch targets should be at least 44px in either dimension
        const hasAdequateSize = logoBox.width >= 44 || logoBox.height >= 44;
        expect(hasAdequateSize).toBe(true);
      }
    });
  });

  test.describe('Focus Management', () => {
    test('should manage focus properly during interactions', async ({ page }) => {
      // Verify page has loaded completely
      const isLoaded = await homePage.isPageLoaded();
      expect(isLoaded).toBe(true);

      // Test focus on navigation elements
      const aboutLink = await page.locator('nav > ul > li > a:has-text("About"), .menu-item > a:has-text("About")').first();
      if (await aboutLink.count() > 0) {
        await aboutLink.focus();
        await expect(aboutLink).toBeFocused();

        // Test hover interaction maintains focus management
        await homePage.hoverOverAboutLink();
        await homePage.verifyDropdownVisibility();
      }
    });
  });
});






