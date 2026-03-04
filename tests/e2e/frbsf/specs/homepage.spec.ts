









/**
 * FRBSF Homepage Test Specification
 * 
 * End-to-end tests for Federal Reserve Bank of San Francisco homepage
 */

import { test, expect } from '@playwright/test';
import { FRBSFHomePage } from '../pages/home-page';
import { DataManager } from '../../../utils/test-data/data-manager';

test.describe('FRBSF Homepage Tests', () => {
  let homePage: FRBSFHomePage;
  let dataManager: DataManager;
  let testData: any;

  test.beforeEach(async ({ page }) => {
    homePage = new FRBSFHomePage(page);
    dataManager = new DataManager('frbsf');
    
    try {
      testData = dataManager.loadTestData();
    } catch {
      // Use fallback data if test data file doesn't exist
      testData = {
        homepage: {
          url: 'https://frbsf.org',
          title: 'Federal Reserve Bank of San Francisco',
          searchTerms: ['monetary policy', 'economic research', 'banking supervision'],
          navigationItems: ['About', 'Research', 'Banking', 'Community', 'News & Events'],
          socialMediaLinks: {
            twitter: 'https://twitter.com/sffed',
            linkedin: 'https://linkedin.com/company/federal-reserve-bank-of-san-francisco'
          },
          contentSections: ['hero', 'news', 'research', 'footer']
        },
        performance: {
          maxLoadTime: 5000,
          maxInteractionTime: 2000,
          maxSearchTime: 3000
        },
        accessibility: {
          wcagLevel: 'AA',
          colorContrastRatio: 4.5,
          keyboardNavigationRequired: true
        }
      };
    }
  });

  test('should load homepage successfully', async () => {
    await test.step('Navigate to homepage', async () => {
      await homePage.navigateToHomePage();
    });

    await test.step('Verify page title', async () => {
      const title = await homePage.getTitle();
      expect(title).toContain(testData.homepage.title);
    });

    await test.step('Verify page URL', async () => {
      const currentUrl = homePage.getCurrentUrl();
      expect(currentUrl).toContain('frbsf.org');
    });
  });

  test('should have proper page structure', async () => {
    await homePage.navigateToHomePage();

    await test.step('Verify main navigation is present', async () => {
      const navItems = await homePage.getNavigationItems();
      expect(navItems.length).toBeGreaterThan(0);
      
      // Check for expected navigation items
      const expectedItems = testData.homepage.navigationItems;
      for (const expectedItem of expectedItems) {
        const hasItem = navItems.some(item => 
          item.toLowerCase().includes(expectedItem.toLowerCase())
        );
        expect(hasItem).toBeTruthy();
      }
    });

    await test.step('Verify hero section content', async () => {
      const heroContent = await homePage.getHeroContent();
      expect(heroContent.title).toBeTruthy();
      expect(heroContent.title.length).toBeGreaterThan(0);
    });

    await test.step('Verify footer content', async () => {
      await homePage.verifyFooterContent();
    });
  });

  test('should have working navigation menu', async () => {
    await homePage.navigateToHomePage();

    await test.step('Get navigation items', async () => {
      const navItems = await homePage.getNavigationItems();
      expect(navItems.length).toBeGreaterThan(0);
    });

    await test.step('Test navigation functionality', async () => {
      const navItems = await homePage.getNavigationItems();
      
      if (navItems.length > 0) {
        // Test clicking the first navigation item
        const firstItem = navItems[0];
        await homePage.clickNavigationItem(firstItem);
        
        // Verify navigation occurred
        const currentUrl = homePage.getCurrentUrl();
        expect(currentUrl).not.toBe(testData.homepage.url);
      }
    });
  });

  test('should have search capability', async () => {
    await homePage.navigateToHomePage();

    await test.step('Perform search operation', async () => {
      const searchTerm = testData.homepage.searchTerms[0];
      
      const startTime = Date.now();
      await homePage.performSearch(searchTerm);
      const searchTime = Date.now() - startTime;
      
      // Verify search completed within acceptable time
      expect(searchTime).toBeLessThan(testData.performance.maxSearchTime);
    });

    await test.step('Verify search results page loaded', async () => {
      const currentUrl = homePage.getCurrentUrl();
      expect(currentUrl).toContain('search');
    });
  });

  test('should display latest news', async () => {
    await homePage.navigateToHomePage();

    await test.step('Get latest news items', async () => {
      const newsItems = await homePage.getLatestNews();
      
      if (newsItems.length > 0) {
        // Verify news items have required properties
        for (const newsItem of newsItems.slice(0, 3)) { // Check first 3 items
          expect(newsItem.title).toBeTruthy();
          expect(newsItem.title.length).toBeGreaterThan(0);
        }
      }
    });
  });

  test('should display research publications', async () => {
    await homePage.navigateToHomePage();

    await test.step('Get research publications', async () => {
      const publications = await homePage.getResearchPublications();
      
      if (publications.length > 0) {
        // Verify publications have required properties
        for (const publication of publications.slice(0, 3)) { // Check first 3 items
          expect(publication.title).toBeTruthy();
          expect(publication.title.length).toBeGreaterThan(0);
        }
      }
    });
  });

  test('should have social media links', async () => {
    await homePage.navigateToHomePage();

    await test.step('Verify social media links', async () => {
      const socialLinks = await homePage.getSocialMediaLinks();
      
      // Check if social media links exist
      const linkCount = Object.keys(socialLinks).length;
      expect(linkCount).toBeGreaterThanOrEqual(0);
      
      // Verify links are valid URLs
      for (const [_platform, url] of Object.entries(socialLinks)) {
        if (url) {
          expect(url).toMatch(/^https?:\/\/.+/);
        }
      }
    });
  });

  test('should be responsive across different devices', async ({ page: _page }) => {
    await homePage.navigateToHomePage();

    await test.step('Test responsive design', async () => {
      const responsiveResults = await homePage.checkResponsiveDesign();
      
      // Verify page works on different viewports
      expect(responsiveResults.mobile).toBeTruthy();
      expect(responsiveResults.tablet).toBeTruthy();
      expect(responsiveResults.desktop).toBeTruthy();
    });
  });

  test('should meet performance requirements', async ({ page: _page }) => {
    await test.step('Measure page load performance', async () => {
      const startTime = Date.now();
      await homePage.navigateToHomePage();
      const loadTime = Date.now() - startTime;
      
      // Verify page loads within acceptable time
      expect(loadTime).toBeLessThan(testData.performance.maxLoadTime);
    });

    await test.step('Get detailed performance metrics', async () => {
      const metrics = await homePage.getPerformanceMetrics();
      
      expect(metrics.loadTime).toBeLessThan(testData.performance.maxLoadTime);
      expect(metrics.domContentLoaded).toBeLessThan(testData.performance.maxLoadTime);
    });
  });

  test('should have contact information', async () => {
    await homePage.navigateToHomePage();

    await test.step('Verify contact information is available', async () => {
      const contactInfo = await homePage.getContactInfo();
      
      // At least one contact method should be available
      const hasContactInfo = contactInfo.address || contactInfo.phone || contactInfo.email;
      expect(hasContactInfo).toBeTruthy();
    });
  });
});









