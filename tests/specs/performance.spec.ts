





import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home-page';

test.describe('FRBSF Performance Tests', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
  });

  test.describe('Page Load Performance', () => {
    test('should load homepage within acceptable time limits', async ({ page }) => {
      // Measure and verify page load time
      const loadTime = await homePage.measurePageLoadTime();
      
      // Verify load time is under 10 seconds (generous for test environment)
      expect(loadTime).toBeLessThan(10000);
      
      // Verify page has loaded completely
      const isLoaded = await homePage.isPageLoaded();
      expect(isLoaded).toBe(true);
    });

    test('should load key elements quickly', async ({ page }) => {
      const startTime = Date.now();
      
      // Navigate to homepage
      await homePage.navigateToHomePage();
      
      // Verify key elements are loaded
      await homePage.verifyLogoVisibility();
      await homePage.verifyMainNavigationVisibility();
      
      const endTime = Date.now();
      const elementLoadTime = endTime - startTime;
      
      // Key elements should load within 5 seconds
      expect(elementLoadTime).toBeLessThan(5000);
    });
  });

  test.describe('Navigation Performance', () => {
    test('should navigate between pages efficiently', async ({ page }) => {
      // Start at homepage
      await homePage.navigateToHomePage();
      
      const startTime = Date.now();
      
      // Click on Research link
      await homePage.clickResearchLink();
      
      // Verify navigation completed
      await homePage.verifyPageNavigation();
      
      const endTime = Date.now();
      const navigationTime = endTime - startTime;
      
      // Navigation should complete within 8 seconds
      expect(navigationTime).toBeLessThan(8000);
    });
  });

  test.describe('Search Performance', () => {
    test('should perform search operations efficiently', async ({ page }) => {
      // Navigate to homepage
      await homePage.navigateToHomePage();
      
      const startTime = Date.now();
      
      // Perform search
      await homePage.performSearch('monetary policy');
      
      // Verify search results
      await homePage.verifySearchResults();
      
      const endTime = Date.now();
      const searchTime = endTime - startTime;
      
      // Search should complete within 10 seconds
      expect(searchTime).toBeLessThan(10000);
    });
  });

  test.describe('Responsive Performance', () => {
    test('should maintain performance across different viewport sizes', async ({ page }) => {
      const viewports = [
        { name: 'Mobile', width: 375, height: 667 },
        { name: 'Tablet', width: 768, height: 1024 },
        { name: 'Desktop', width: 1920, height: 1080 }
      ];

      for (const viewport of viewports) {
        const startTime = Date.now();
        
        // Set viewport
        await homePage.setViewportSize(viewport.width, viewport.height);
        
        // Navigate to homepage
        await homePage.navigateToHomePage();
        
        // Verify core elements load
        await homePage.verifyLogoVisibility();
        await homePage.verifyMainNavigationVisibility();
        
        const endTime = Date.now();
        const loadTime = endTime - startTime;
        
        // Each viewport should load within 8 seconds
        expect(loadTime).toBeLessThan(8000);
      }
    });
  });

  test.describe('Interactive Element Performance', () => {
    test('should respond to user interactions quickly', async ({ page }) => {
      // Navigate to homepage
      await homePage.navigateToHomePage();
      
      // Test hover interaction performance
      const hoverStartTime = Date.now();
      await homePage.hoverOverAboutLink();
      await homePage.verifyDropdownVisibility();
      const hoverEndTime = Date.now();
      
      const hoverTime = hoverEndTime - hoverStartTime;
      expect(hoverTime).toBeLessThan(3000);
      
      // Test click interaction performance
      const clickStartTime = Date.now();
      await homePage.verifyLogoVisibility();
      const clickEndTime = Date.now();
      
      const clickTime = clickEndTime - clickStartTime;
      expect(clickTime).toBeLessThan(2000);
    });
  });

  test.describe('Content Loading Performance', () => {
    test('should load content sections efficiently', async ({ page }) => {
      // Navigate to homepage
      await homePage.navigateToHomePage();
      
      const startTime = Date.now();
      
      // Verify all content sections load
      await homePage.verifyResearchInsightsSection();
      await homePage.verifyNewsMediaSection();
      await homePage.verifyEconomicDataSection();
      
      const endTime = Date.now();
      const contentLoadTime = endTime - startTime;
      
      // Content sections should load within 5 seconds
      expect(contentLoadTime).toBeLessThan(5000);
    });

    test('should load footer content efficiently', async ({ page }) => {
      // Navigate to homepage
      await homePage.navigateToHomePage();
      
      const startTime = Date.now();
      
      // Scroll to footer and verify social media links
      await homePage.scrollToFooter();
      await homePage.verifyLinkedInLinkVisibility();
      await homePage.verifyFacebookLinkVisibility();
      await homePage.verifyTwitterLinkVisibility();
      
      const endTime = Date.now();
      const footerLoadTime = endTime - startTime;
      
      // Footer content should load within 4 seconds
      expect(footerLoadTime).toBeLessThan(4000);
    });
  });
});





