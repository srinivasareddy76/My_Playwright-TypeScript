

/**
 * FRBSF Homepage Test Specification
 * 
 * End-to-end tests for Federal Reserve Bank of San Francisco homepage
 * Uses data-driven approach with test scenarios from JSON files
 */

import { test, expect, Page } from '@playwright/test';
import { FRBSFHomePage } from '../pages/home-page';
import { DataManager } from '../../../utils/test-data/data-manager';
import { Logger } from '../../../../src/utils/logger';

// Test data and configuration
const dataManager = new DataManager('frbsf');
const logger = Logger.getInstance();

let homePage: FRBSFHomePage;

test.describe('FRBSF Homepage Tests', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    homePage = new FRBSFHomePage(page);
    
    // Log test start
    logger.info(`Starting test: ${test.info().title}`);
    
    // Set longer timeout for page loads
    test.setTimeout(60000);
  });

  test.afterEach(async () => {
    // Log test completion
    logger.info(`Completed test: ${test.info().title}`);
    
    // Take screenshot on failure
    if (test.info().status === 'failed') {
      const screenshot = await homePage.takeScreenshotPublic({ 
        path: `screenshots/failed-${test.info().title.replace(/\s+/g, '-')}-${Date.now()}.png`,
        fullPage: true 
      });
      await test.info().attach('screenshot', { 
        body: screenshot, 
        contentType: 'image/png' 
      });
    }
  });

  test('should load homepage successfully', async () => {
    // Load test scenario data
    const { scenario, testData } = dataManager.getScenarioTestData('homepage', 'loadTest');
    
    await test.step('Navigate to homepage', async () => {
      await homePage.navigateToHomePage();
    });

    await test.step('Verify page title', async () => {
      const title = await homePage.getTitle();
      expect(title).toContain(scenario.assertions?.titleContains || testData.homepage.title);
    });

    await test.step('Verify page URL', async () => {
      const currentUrl = homePage.getCurrentUrl();
      expect(currentUrl).toContain(scenario.assertions?.urlContains || 'frbsf.org');
    });

    await test.step('Verify load time performance', async () => {
      const loadTime = await homePage.getPageLoadTime();
      expect(loadTime).toBeLessThan(scenario.assertions?.maxLoadTime || testData.performance.maxLoadTime);
    });
  });

  test('should have proper page structure', async () => {
    // Load test scenario data
    const { scenario, testData } = dataManager.getScenarioTestData('homepage', 'structureTest');
    
    await homePage.navigateToHomePage();

    await test.step('Verify main navigation is present', async () => {
      const navItems = await homePage.getNavigationItems();
      expect(navItems.length).toBeGreaterThanOrEqual(scenario.assertions?.minNavigationItems || 5);
      
      // Check for required navigation items from scenario
      const requiredItems = scenario.assertions?.requiredNavigationItems || testData.homepage.navigationItems;
      for (const expectedItem of requiredItems) {
        const hasItem = navItems.some(item => 
          item.toLowerCase().includes(expectedItem.toLowerCase())
        );
        expect(hasItem).toBeTruthy();
      }
    });

    await test.step('Verify content sections are present', async () => {
      const requiredSections = scenario.assertions?.requiredContentSections || testData.homepage.contentSections;
      
      for (const section of requiredSections) {
        const sectionExists = await homePage.hasContentSection(section);
        expect(sectionExists).toBeTruthy();
      }
    });
  });

  test('should have working navigation menu', async () => {
    // Load test scenario data
    const { scenario } = dataManager.getScenarioTestData('homepage', 'navigationTest');
    
    await homePage.navigateToHomePage();

    await test.step('Test navigation functionality', async () => {
      const navigationItems = scenario.assertions?.navigationItemsToTest || ['About', 'Research'];
      
      for (const navItem of navigationItems) {
        const startTime = Date.now();
        
        // Click navigation item
        await homePage.clickNavigationItem(navItem);
        
        const navigationTime = Date.now() - startTime;
        
        // Verify navigation time is acceptable
        expect(navigationTime).toBeLessThan(scenario.assertions?.maxNavigationTime || 2500);
        
        // Verify navigation occurred
        const currentUrl = homePage.getCurrentUrl();
        expect(currentUrl).not.toBe(await homePage.getBaseUrl());
        
        // Navigate back to homepage for next iteration
        await homePage.navigateToHomePage();
      }
    });
  });

  test('should have search capability', async () => {
    // Load test scenario data
    const { scenario, testData } = dataManager.getScenarioTestData('homepage', 'searchTest');
    
    await homePage.navigateToHomePage();

    await test.step('Perform search operation', async () => {
      const searchTerms = scenario.testData?.searchTerms || testData.homepage.searchTerms;
      const searchTerm = searchTerms[0];
      
      const startTime = Date.now();
      await homePage.performSearch(searchTerm);
      const searchTime = Date.now() - startTime;
      
      // Verify search completed within acceptable time
      const maxSearchTime = scenario.testData?.expectedBehavior?.maxSearchTime || testData.performance.maxSearchTime;
      expect(searchTime).toBeLessThan(maxSearchTime);
    });

    await test.step('Verify search results page loaded', async () => {
      const currentUrl = homePage.getCurrentUrl();
      const expectedIndicator = scenario.testData?.expectedBehavior?.resultsPageIndicator || 'search';
      expect(currentUrl).toContain(expectedIndicator);
    });
  });

  test('should display latest news', async () => {
    // Load test scenario data
    const { scenario } = dataManager.getScenarioTestData('homepage', 'newsTest');
    
    await homePage.navigateToHomePage();

    await test.step('Get and verify news items', async () => {
      const newsItems = await homePage.getLatestNews();
      
      const expectedCount = scenario.testData?.expectedNewsCount || 3;
      const maxItems = scenario.testData?.maxNewsItems || 10;
      
      expect(newsItems.length).toBeGreaterThanOrEqual(expectedCount);
      expect(newsItems.length).toBeLessThanOrEqual(maxItems);
      
      // Verify news items have required fields
      const requiredFields = scenario.testData?.requiredFields || ['title'];
      
      for (const newsItem of newsItems.slice(0, expectedCount)) {
        for (const field of requiredFields) {
          const fieldValue = (newsItem as any)[field];
          expect(fieldValue).toBeTruthy();
          expect(fieldValue.length).toBeGreaterThan(0);
        }
      }
    });
  });

  test('should display research publications', async () => {
    // Load test scenario data
    const { scenario } = dataManager.getScenarioTestData('homepage', 'researchTest');
    
    await homePage.navigateToHomePage();

    await test.step('Get and verify research items', async () => {
      const researchItems = await homePage.getResearchPublications();
      
      const expectedCount = scenario.testData?.expectedResearchCount || 3;
      const maxItems = scenario.testData?.maxResearchItems || 8;
      
      expect(researchItems.length).toBeGreaterThanOrEqual(expectedCount);
      expect(researchItems.length).toBeLessThanOrEqual(maxItems);
      
      // Verify research items have required fields
      const requiredFields = scenario.testData?.requiredFields || ['title'];
      
      for (const researchItem of researchItems.slice(0, expectedCount)) {
        for (const field of requiredFields) {
          const fieldValue = (researchItem as any)[field];
          expect(fieldValue).toBeTruthy();
          expect(fieldValue.length).toBeGreaterThan(0);
        }
      }
    });
  });

  test('should have social media links', async () => {
    // Load test scenario data
    const { scenario, testData } = dataManager.getScenarioTestData('homepage', 'socialMediaTest');
    
    await homePage.navigateToHomePage();

    await test.step('Verify social media links', async () => {
      const socialLinks = await homePage.getSocialMediaLinks();
      
      const expectedLinks = scenario.testData?.expectedSocialLinks || Object.keys(testData.homepage.socialMediaLinks);
      
      for (const platform of expectedLinks) {
        expect(socialLinks).toHaveProperty(platform);
        expect(socialLinks[platform]).toBeTruthy();
        
        // Verify link accessibility if configured
        if (scenario.testData?.linkValidation?.checkAccessibility) {
          const linkElement = await homePage.getSocialMediaLinkElement(platform);
          expect(linkElement).toBeTruthy();
        }
      }
    });
  });

  test('should be responsive across different devices', async () => {
    // Load test scenario data
    const { scenario } = dataManager.getScenarioTestData('homepage', 'responsiveTest');
    
    const deviceBreakpoints = scenario.testData?.deviceBreakpoints || [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'desktop', width: 1920, height: 1080 }
    ];

    for (const device of deviceBreakpoints) {
      await test.step(`Test responsiveness on ${device.name}`, async () => {
        // Set viewport to device dimensions
        await homePage.setViewportSize({ 
          width: device.width, 
          height: device.height 
        });
        
        await homePage.navigateToHomePage();
        
        // Verify required elements are visible on all devices
        const requiredElements = scenario.testData?.requiredElementsOnAllDevices || ['logo', 'mainNavigation'];
        
        for (const element of requiredElements) {
          const isVisible = await homePage.isElementVisible(element);
          expect(isVisible).toBeTruthy();
        }
      });
    }
  });

  test('should meet performance requirements', async () => {
    // Load test scenario data
    const { scenario, testData } = dataManager.getScenarioTestData('homepage', 'performanceTest');
    
    await test.step('Measure and verify performance metrics', async () => {
      const performanceMetrics = await homePage.getPerformanceMetrics();
      
      const thresholds = scenario.testData?.performanceMetrics || {
        maxLoadTime: testData.performance.maxLoadTime,
        targetLoadTime: 3000,
        maxInteractionTime: testData.performance.maxInteractionTime
      };
      
      expect(performanceMetrics.loadTime).toBeLessThan(thresholds.maxLoadTime);
      expect(performanceMetrics.domContentLoaded).toBeLessThan(thresholds.targetLoadTime);
      
      if (performanceMetrics.firstContentfulPaint) {
        expect(performanceMetrics.firstContentfulPaint).toBeLessThan(thresholds.targetLoadTime);
      }
    });
  });

  test('should have contact information', async () => {
    // Load test scenario data
    const { scenario, testData } = dataManager.getScenarioTestData('homepage', 'contactTest');
    
    await homePage.navigateToHomePage();

    await test.step('Verify contact information display', async () => {
      const contactInfo = await homePage.getContactInformation();
      
      const expectedContact = scenario.testData?.expectedContactInfo || testData.contact;
      
      // Verify headquarters information
      if (expectedContact.headquarters) {
        expect(contactInfo.headquarters).toBeTruthy();
        expect(contactInfo.headquarters.address).toContain('San Francisco');
        expect(contactInfo.headquarters.phone).toMatch(/\(\d{3}\)\s\d{3}-\d{4}/);
      }
      
      // Verify branch information
      if (expectedContact.requiredBranches) {
        for (const branchName of expectedContact.requiredBranches) {
          const hasBranch = contactInfo.branches?.some((branch: any) => 
            branch.name.includes(branchName)
          );
          expect(hasBranch).toBeTruthy();
        }
      }
    });
  });
});


