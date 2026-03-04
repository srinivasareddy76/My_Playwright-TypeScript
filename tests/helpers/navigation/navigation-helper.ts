




/**
 * Navigation Helper
 * 
 * Provides common navigation operations for tests
 */

import { Page, expect } from '@playwright/test';
import { Logger } from '../../../src/utils/logger';

export class NavigationHelper {
  private page: Page;
  private logger: Logger;

  constructor(page: Page) {
    this.page = page;
    this.logger = Logger.getInstance();
  }

  /**
   * Navigate to a specific URL with error handling
   */
  async navigateTo(url: string, options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }): Promise<void> {
    this.logger.info(`Navigating to: ${url}`);
    
    try {
      await this.page.goto(url, {
        waitUntil: options?.waitUntil || 'domcontentloaded',
        timeout: 30000
      });
      
      this.logger.info(`Successfully navigated to: ${url}`);
    } catch (error) {
      this.logger.error(`Failed to navigate to: ${url}`, error);
      throw error;
    }
  }

  /**
   * Navigate using browser back button
   */
  async goBack(): Promise<void> {
    this.logger.info('Navigating back');
    await this.page.goBack();
  }

  /**
   * Navigate using browser forward button
   */
  async goForward(): Promise<void> {
    this.logger.info('Navigating forward');
    await this.page.goForward();
  }

  /**
   * Refresh the current page
   */
  async refresh(): Promise<void> {
    this.logger.info('Refreshing page');
    await this.page.reload();
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verify current URL matches expected pattern
   */
  async verifyUrl(expectedUrl: string | RegExp): Promise<void> {
    const currentUrl = this.page.url();
    
    if (typeof expectedUrl === 'string') {
      expect(currentUrl).toContain(expectedUrl);
    } else {
      expect(currentUrl).toMatch(expectedUrl);
    }
    
    this.logger.info(`URL verification passed: ${currentUrl}`);
  }

  /**
   * Verify page title
   */
  async verifyTitle(expectedTitle: string | RegExp): Promise<void> {
    const title = await this.page.title();
    
    if (typeof expectedTitle === 'string') {
      expect(title).toContain(expectedTitle);
    } else {
      expect(title).toMatch(expectedTitle);
    }
    
    this.logger.info(`Title verification passed: ${title}`);
  }

  /**
   * Navigate using main navigation menu
   */
  async navigateUsingMenu(menuItem: string): Promise<void> {
    this.logger.info(`Navigating using menu item: ${menuItem}`);
    
    // Look for menu item by text content
    const menuSelector = `nav a:has-text("${menuItem}"), .menu a:has-text("${menuItem}")`;
    
    await this.page.click(menuSelector);
    await this.waitForPageLoad();
    
    this.logger.info(`Successfully navigated using menu: ${menuItem}`);
  }

  /**
   * Open link in new tab and switch to it
   */
  async openInNewTab(selector: string): Promise<Page> {
    this.logger.info(`Opening link in new tab: ${selector}`);
    
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.page.click(selector, { modifiers: ['Meta'] }) // Cmd+Click on Mac, Ctrl+Click on Windows
    ]);
    
    await newPage.waitForLoadState();
    
    this.logger.info('New tab opened successfully');
    return newPage;
  }

  /**
   * Scroll to element
   */
  async scrollToElement(selector: string): Promise<void> {
    this.logger.info(`Scrolling to element: ${selector}`);
    
    await this.page.locator(selector).scrollIntoViewIfNeeded();
    
    this.logger.info('Scroll completed');
  }

  /**
   * Scroll to top of page
   */
  async scrollToTop(): Promise<void> {
    this.logger.info('Scrolling to top of page');
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  /**
   * Scroll to bottom of page
   */
  async scrollToBottom(): Promise<void> {
    this.logger.info('Scrolling to bottom of page');
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  /**
   * Get current page URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Get current page title
   */
  async getCurrentTitle(): Promise<string> {
    return await this.page.title();
  }
}




