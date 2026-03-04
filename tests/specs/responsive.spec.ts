




import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home-page';

test.describe('FRBSF Responsive Design Tests', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigateToHomePage();
  });

  test.describe('Mobile Viewport Tests', () => {
    test('should display correctly on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await homePage.setMobileViewport();

      // Verify page has loaded completely
      const isLoaded = await homePage.isPageLoaded();
      expect(isLoaded).toBe(true);

      // Verify responsive elements are visible
      await homePage.verifyResponsiveElements();

      // Verify main navigation is accessible (might be hamburger menu)
      await homePage.verifyMainNavigationVisibility();

      // Verify key content sections are accessible
      await homePage.verifyResearchInsightsSection();
      await homePage.verifyNewsMediaSection();
    });

    test('should have functional navigation on mobile', async ({ page }) => {
      // Set mobile viewport
      await homePage.setMobileViewport();

      // Verify page has loaded completely
      const isLoaded = await homePage.isPageLoaded();
      expect(isLoaded).toBe(true);

      // Verify logo is clickable
      await homePage.verifyLogoVisibility();

      // Verify main navigation works
      await homePage.verifyMainNavigationVisibility();
    });
  });

  test.describe('Tablet Viewport Tests', () => {
    test('should display correctly on tablet devices', async ({ page }) => {
      // Set tablet viewport
      await homePage.setTabletViewport();

      // Verify page has loaded completely
      const isLoaded = await homePage.isPageLoaded();
      expect(isLoaded).toBe(true);

      // Verify responsive elements are visible
      await homePage.verifyResponsiveElements();

      // Verify navigation menu functionality
      await homePage.verifyMainNavigationVisibility();
      await homePage.verifyAboutLinkVisibility();
      await homePage.verifyResearchLinkVisibility();

      // Verify content sections are properly displayed
      await homePage.verifyResearchInsightsSection();
      await homePage.verifyNewsMediaSection();
      await homePage.verifyEconomicDataSection();
    });

    test('should have functional search on tablet', async ({ page }) => {
      // Set tablet viewport
      await homePage.setTabletViewport();

      // Verify page has loaded completely
      const isLoaded = await homePage.isPageLoaded();
      expect(isLoaded).toBe(true);

      // Test search functionality
      await homePage.performSearch('economic research');
      await homePage.verifySearchResults();
    });
  });

  test.describe('Desktop Viewport Tests', () => {
    test('should display correctly on desktop devices', async ({ page }) => {
      // Set desktop viewport
      await homePage.setDesktopViewport();

      // Verify page has loaded completely
      const isLoaded = await homePage.isPageLoaded();
      expect(isLoaded).toBe(true);

      // Verify all elements are visible
      await homePage.verifyLogoVisibility();
      await homePage.verifyMainNavigationVisibility();
      await homePage.verifyAboutLinkVisibility();
      await homePage.verifyResearchLinkVisibility();
      await homePage.verifyHeroSectionVisibility();

      // Verify dropdown functionality
      await homePage.hoverOverAboutLink();
      await homePage.verifyDropdownVisibility();

      // Verify all content sections
      await homePage.verifyResearchInsightsSection();
      await homePage.verifyNewsMediaSection();
      await homePage.verifyEconomicDataSection();
    });

    test('should have full functionality on desktop', async ({ page }) => {
      // Set desktop viewport
      await homePage.setDesktopViewport();

      // Verify page has loaded completely
      const isLoaded = await homePage.isPageLoaded();
      expect(isLoaded).toBe(true);

      // Test search functionality
      await homePage.performSearch('federal reserve');
      await homePage.verifySearchResults();
    });
  });

  test.describe('Cross-Viewport Consistency', () => {
    test('should maintain core functionality across all viewports', async ({ page }) => {
      const viewports = [
        { name: 'Mobile', width: 375, height: 667 },
        { name: 'Tablet', width: 768, height: 1024 },
        { name: 'Desktop', width: 1920, height: 1080 }
      ];

      for (const viewport of viewports) {
        // Set viewport
        await homePage.setViewportSize(viewport.width, viewport.height);
        
        // Navigate to homepage
        await homePage.navigateToHomePage();

        // Verify core elements are present
        const isLoaded = await homePage.isPageLoaded();
        expect(isLoaded).toBe(true);

        // Verify logo is always visible
        await homePage.verifyLogoVisibility();

        // Verify navigation is accessible
        await homePage.verifyMainNavigationVisibility();
      }
    });
  });
});




