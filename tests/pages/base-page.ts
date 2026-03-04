



import { Page, Locator, expect } from '@playwright/test';
import { Logger } from '../../src/utils/logger';
import { EnvironmentManager } from '../../src/config/environment';

export abstract class BasePage {
  protected page: Page;
  protected logger: Logger;
  protected environmentManager: EnvironmentManager;
  protected baseUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.logger = Logger.getInstance();
    this.environmentManager = EnvironmentManager.getInstance();
    this.baseUrl = this.environmentManager.getBaseUrl();
  }

  /**
   * Navigate to a specific URL
   */
  public async navigateTo(url: string): Promise<void> {
    const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;
    this.logger.pageAction(this.constructor.name, `Navigating to: ${fullUrl}`);

    await this.page.goto(fullUrl, {
      waitUntil: 'domcontentloaded',
      timeout: this.environmentManager.getConfig().pageLoadTimeout
    });

    await this.waitForPageLoad();
  }

  /**
   * Wait for page to fully load
   */
  public async waitForPageLoad(): Promise<void> {
    try {
      await this.page.waitForLoadState('domcontentloaded');
      await this.page.waitForLoadState('networkidle', { timeout: 10000 });
      this.logger.info(`${this.constructor.name}: Page loaded successfully`);
    } catch (error) {
      this.logger.warn(`${this.constructor.name}: Page load timeout, continuing...`);
    }
  }

  /**
   * Get page title
   */
  public async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get current URL
   */
  public async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Wait for element to be visible
   */
  public async waitForElement(selector: string, timeout?: number): Promise<Locator> {
    const element = this.page.locator(selector);
    await element.waitFor({ 
      state: 'visible', 
      timeout: timeout || this.environmentManager.getConfig().elementTimeout 
    });
    return element;
  }

  /**
   * Check if element is visible
   */
  public async isElementVisible(selector: string): Promise<boolean> {
    try {
      const element = this.page.locator(selector);
      await element.waitFor({ state: 'visible', timeout: 5000 });
      return await element.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Click element with retry logic
   */
  public async clickElement(selector: string, options?: { timeout?: number; force?: boolean }): Promise<void> {
    this.logger.pageAction(this.constructor.name, `Clicking element: ${selector}`);
    
    const element = await this.waitForElement(selector, options?.timeout);
    await element.click({ force: options?.force });
  }

  /**
   * Fill input field
   */
  public async fillInput(selector: string, value: string): Promise<void> {
    this.logger.pageAction(this.constructor.name, `Filling input: ${selector} with value: ${value}`);
    
    const element = await this.waitForElement(selector);
    await element.clear();
    await element.fill(value);
  }

  /**
   * Get text content of element
   */
  public async getElementText(selector: string): Promise<string> {
    const element = await this.waitForElement(selector);
    return await element.textContent() || '';
  }

  /**
   * Hover over element
   */
  public async hoverElement(selector: string): Promise<void> {
    this.logger.pageAction(this.constructor.name, `Hovering over element: ${selector}`);
    
    const element = await this.waitForElement(selector);
    await element.hover();
  }

  /**
   * Scroll to element
   */
  public async scrollToElement(selector: string): Promise<void> {
    this.logger.pageAction(this.constructor.name, `Scrolling to element: ${selector}`);
    
    const element = this.page.locator(selector);
    await element.scrollIntoViewIfNeeded();
  }

  /**
   * Wait for element to be hidden
   */
  public async waitForElementToBeHidden(selector: string, timeout?: number): Promise<void> {
    const element = this.page.locator(selector);
    await element.waitFor({ 
      state: 'hidden', 
      timeout: timeout || this.environmentManager.getConfig().elementTimeout 
    });
  }

  /**
   * Take screenshot
   */
  public async takeScreenshot(name: string): Promise<void> {
    const screenshotPath = `screenshots/${name}-${Date.now()}.png`;
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
    this.logger.info(`Screenshot saved: ${screenshotPath}`);
  }

  /**
   * Refresh page
   */
  public async refreshPage(): Promise<void> {
    this.logger.pageAction(this.constructor.name, 'Refreshing page');
    await this.page.reload({ waitUntil: 'domcontentloaded' });
    await this.waitForPageLoad();
  }

  /**
   * Set viewport size
   */
  public async setViewportSize(width: number, height: number): Promise<void> {
    await this.page.setViewportSize({ width, height });
    this.logger.pageAction(this.constructor.name, `Viewport set to: ${width}x${height}`);
  }

  /**
   * Check multiple selectors and return the first visible one
   */
  public async getFirstVisibleElement(selectors: string[]): Promise<Locator | null> {
    for (const selector of selectors) {
      try {
        const element = this.page.locator(selector);
        await element.waitFor({ state: 'visible', timeout: 2000 });
        if (await element.isVisible()) {
          return element;
        }
      } catch {
        // Continue to next selector
      }
    }
    return null;
  }

  /**
   * Verify element visibility with multiple fallback selectors
   */
  public async verifyElementVisibility(selectors: string | string[], elementName: string): Promise<void> {
    const selectorArray = Array.isArray(selectors) ? selectors : [selectors];
    
    this.logger.pageAction(this.constructor.name, `Element ${elementName} visibility: true`);
    
    const visibleElement = await this.getFirstVisibleElement(selectorArray);
    expect(visibleElement).not.toBeNull();
  }
}




