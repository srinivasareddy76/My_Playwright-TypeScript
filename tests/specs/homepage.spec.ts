




import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home-page';

test.describe('FRBSF Homepage Functionality', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigateToHomePage();
  });

  test.describe('Basic Homepage Loading', () => {
    test('should load successfully with all key elements', async ({ page }) => {
      // Verify page has loaded completely
      const isLoaded = await homePage.isPageLoaded();
      expect(isLoaded).toBe(true);

      // Verify logo is visible and clickable
      await homePage.verifyLogoVisibility();

      // Verify main navigation is present
      await homePage.verifyMainNavigationVisibility();

      // Verify About link is visible
      await homePage.verifyAboutLinkVisibility();

      // Verify Research link is visible
      await homePage.verifyResearchLinkVisibility();

      // Verify hero section is visible
      await homePage.verifyHeroSectionVisibility();

      // Verify page load time is acceptable
      await homePage.verifyPageLoadTime();
    });
  });

  test.describe('Navigation Menu', () => {
    test('should display correctly with dropdown functionality', async ({ page }) => {
      // Verify page has loaded completely
      const isLoaded = await homePage.isPageLoaded();
      expect(isLoaded).toBe(true);

      // Hover over About link to trigger dropdown
      await homePage.hoverOverAboutLink();

      // Verify dropdown menu appears (or menu items are accessible)
      await homePage.verifyDropdownVisibility();
    });
  });

  test.describe('Search Functionality', () => {
    test('should work correctly and display results', async ({ page }) => {
      // Verify page has loaded completely
      const isLoaded = await homePage.isPageLoaded();
      expect(isLoaded).toBe(true);

      // Perform search
      await homePage.performSearch('monetary policy');

      // Verify search results are displayed
      await homePage.verifySearchResults();
    });
  });

  test.describe('Content Sections', () => {
    test('should be visible and accessible', async ({ page }) => {
      // Verify Research & Insights section
      await homePage.verifyResearchInsightsSection();

      // Verify News & Media section
      await homePage.verifyNewsMediaSection();

      // Verify Economic Data section
      await homePage.verifyEconomicDataSection();
    });
  });

  test.describe('Social Media Links', () => {
    test('should be present and functional', async ({ page }) => {
      // Scroll to footer to find social media links
      await homePage.scrollToFooter();

      // Verify LinkedIn link is visible
      await homePage.verifyLinkedInLinkVisibility();

      // Verify Facebook link is visible
      await homePage.verifyFacebookLinkVisibility();

      // Verify Twitter link is visible
      await homePage.verifyTwitterLinkVisibility();

      // Click on LinkedIn link
      await homePage.clickLinkedInLink();

      // Verify it should open in a new tab or window
      await homePage.verifyNewTabOpened();
    });
  });

  test.describe('District Information', () => {
    test('should be displayed correctly', async ({ page }) => {
      // Verify district information section
      await homePage.verifyDistrictInfoSection();

      // Verify district links are present
      await homePage.verifyDistrictLinks();

      // Verify contact information is available
      await homePage.verifyContactInformation();
    });
  });

  test.describe('Quick Links and Navigation', () => {
    test('should work properly', async ({ page }) => {
      // Verify main navigation is visible
      await homePage.verifyMainNavigationVisibility();

      // Click on Research link
      await homePage.clickResearchLink();

      // Verify navigation worked
      await homePage.verifyPageNavigation();
    });
  });
});




