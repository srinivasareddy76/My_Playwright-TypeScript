




/**
 * Base Page Class
 * 
 * Common functionality shared across all page objects for all applications
 */

import { Page, expect, Locator } from '@playwright/test';
import { Logger } from '../utils/logger';

export abstract class BasePage {
  protected page: Page;
  protected logger: Logger;
  protected baseUrl: string;

  constructor(page: Page, baseUrl: string = '') {
    this.page = page;
    this.baseUrl = baseUrl;
    this.logger = Logger.getInstance();
  }

  /**
   * Navigate to a specific URL
   */
  async navigateTo(url: string): Promise<void> {
    const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;
    this.logger.info(`Navigating to: ${fullUrl}`);
    
    await this.page.goto(fullUrl, { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    await this.waitForPageLoad();
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get current URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(selector: string, timeout: number = 10000): Promise<Locator> {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible', timeout });
    return element;
  }

  /**
   * Click element with retry logic
   */
  async clickElement(selector: string, elementName?: string): Promise<void> {
    const name = elementName || selector;
    this.logger.info(`Clicking element: ${name}`);
    
    const element = await this.waitForElement(selector);
    await element.click();
    
    this.logger.info(`Successfully clicked: ${name}`);
  }

  /**
   * Fill input field
   */
  async fillField(selector: string, value: string, fieldName?: string): Promise<void> {
    const name = fieldName || selector;
    this.logger.info(`Filling field: ${name} with value: ${value}`);
    
    const element = await this.waitForElement(selector);
    await element.clear();
    await element.fill(value);
    
    this.logger.info(`Successfully filled field: ${name}`);
  }

  /**
   * Get text content of element
   */
  async getElementText(selector: string): Promise<string> {
    const element = await this.waitForElement(selector);
    const text = await element.textContent();
    return text?.trim() || '';
  }

  /**
   * Check if element is visible
   */
  async isElementVisible(selector: string): Promise<boolean> {
    try {
      const element = this.page.locator(selector);
      await element.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if element exists in DOM
   */
  async isElementPresent(selector: string): Promise<boolean> {
    const count = await this.page.locator(selector).count();
    return count > 0;
  }

  /**
   * Scroll to element
   */
  async scrollToElement(selector: string): Promise<void> {
    const element = this.page.locator(selector);
    await element.scrollIntoViewIfNeeded();
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${name}-${timestamp}.png`;
    
    await this.page.screenshot({ 
      path: `screenshots/${filename}`,
      fullPage: true 
    });
    
    this.logger.info(`Screenshot saved: ${filename}`);
  }

  /**
   * Wait for navigation to complete
   */
  async waitForNavigation(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Hover over element
   */
  async hoverElement(selector: string, elementName?: string): Promise<void> {
    const name = elementName || selector;
    this.logger.info(`Hovering over element: ${name}`);
    
    const element = await this.waitForElement(selector);
    await element.hover();
    
    this.logger.info(`Successfully hovered over: ${name}`);
  }

  /**
   * Select option from dropdown
   */
  async selectOption(selector: string, value: string, dropdownName?: string): Promise<void> {
    const name = dropdownName || selector;
    this.logger.info(`Selecting option: ${value} from dropdown: ${name}`);
    
    const element = await this.waitForElement(selector);
    await element.selectOption(value);
    
    this.logger.info(`Successfully selected option: ${value}`);
  }

  /**
   * Press key
   */
  async pressKey(key: string): Promise<void> {
    this.logger.info(`Pressing key: ${key}`);
    await this.page.keyboard.press(key);
  }

  /**
   * Get element attribute
   */
  async getElementAttribute(selector: string, attribute: string): Promise<string | null> {
    const element = await this.waitForElement(selector);
    return await element.getAttribute(attribute);
  }

  /**
   * Verify element text
   */
  async verifyElementText(selector: string, expectedText: string, elementName?: string): Promise<void> {
    const name = elementName || selector;
    this.logger.info(`Verifying element text: ${name} contains "${expectedText}"`);
    
    const element = await this.waitForElement(selector);
    await expect(element).toContainText(expectedText);
    
    this.logger.info(`Text verification passed: ${name}`);
  }

  /**
   * Verify element is visible
   */
  async verifyElementVisible(selector: string, elementName?: string): Promise<void> {
    const name = elementName || selector;
    this.logger.info(`Verifying element is visible: ${name}`);
    
    const element = this.page.locator(selector);
    await expect(element).toBeVisible();
    
    this.logger.info(`Visibility verification passed: ${name}`);
  }

  /**
   * Wait for element to disappear
   */
  async waitForElementToDisappear(selector: string, timeout: number = 10000): Promise<void> {
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Get page performance metrics
   */
  async getPerformanceMetrics(): Promise<any> {
    return await this.page.evaluate(() => {
      const timing = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        loadTime: timing.loadEventEnd - timing.navigationStart,
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
      };
    });
  }
}




