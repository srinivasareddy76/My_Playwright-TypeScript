






/**
 * Custom Assertions Helper
 * 
 * Provides custom assertion methods for common test scenarios
 */

import { Page, expect, Locator } from '@playwright/test';
import { Logger } from '../../../src/utils/logger';

export class CustomAssertions {
  private page: Page;
  private logger: Logger;

  constructor(page: Page) {
    this.page = page;
    this.logger = new Logger('CustomAssertions');
  }

  /**
   * Assert element is visible and enabled
   */
  async assertElementIsInteractable(selector: string, elementName?: string): Promise<void> {
    const name = elementName || selector;
    this.logger.info(`Asserting element is interactable: ${name}`);
    
    const element = this.page.locator(selector);
    await expect(element).toBeVisible();
    await expect(element).toBeEnabled();
    
    this.logger.info(`Element is interactable: ${name}`);
  }

  /**
   * Assert element contains specific text
   */
  async assertElementContainsText(selector: string, expectedText: string, elementName?: string): Promise<void> {
    const name = elementName || selector;
    this.logger.info(`Asserting element contains text: ${name} -> "${expectedText}"`);
    
    const element = this.page.locator(selector);
    await expect(element).toContainText(expectedText);
    
    this.logger.info(`Text assertion passed: ${name}`);
  }

  /**
   * Assert element has specific attribute value
   */
  async assertElementHasAttribute(selector: string, attribute: string, expectedValue: string, elementName?: string): Promise<void> {
    const name = elementName || selector;
    this.logger.info(`Asserting element has attribute: ${name} -> ${attribute}="${expectedValue}"`);
    
    const element = this.page.locator(selector);
    await expect(element).toHaveAttribute(attribute, expectedValue);
    
    this.logger.info(`Attribute assertion passed: ${name}`);
  }

  /**
   * Assert element has specific CSS class
   */
  async assertElementHasClass(selector: string, className: string, elementName?: string): Promise<void> {
    const name = elementName || selector;
    this.logger.info(`Asserting element has class: ${name} -> ${className}`);
    
    const element = this.page.locator(selector);
    await expect(element).toHaveClass(new RegExp(className));
    
    this.logger.info(`Class assertion passed: ${name}`);
  }

  /**
   * Assert page has specific title
   */
  async assertPageTitle(expectedTitle: string | RegExp): Promise<void> {
    this.logger.info(`Asserting page title: ${expectedTitle}`);
    
    if (typeof expectedTitle === 'string') {
      await expect(this.page).toHaveTitle(expectedTitle);
    } else {
      await expect(this.page).toHaveTitle(expectedTitle);
    }
    
    this.logger.info('Page title assertion passed');
  }

  /**
   * Assert page URL matches pattern
   */
  async assertPageUrl(expectedUrl: string | RegExp): Promise<void> {
    this.logger.info(`Asserting page URL: ${expectedUrl}`);
    
    if (typeof expectedUrl === 'string') {
      await expect(this.page).toHaveURL(expectedUrl);
    } else {
      await expect(this.page).toHaveURL(expectedUrl);
    }
    
    this.logger.info('Page URL assertion passed');
  }

  /**
   * Assert element count matches expected number
   */
  async assertElementCount(selector: string, expectedCount: number, elementName?: string): Promise<void> {
    const name = elementName || selector;
    this.logger.info(`Asserting element count: ${name} -> ${expectedCount}`);
    
    const elements = this.page.locator(selector);
    await expect(elements).toHaveCount(expectedCount);
    
    this.logger.info(`Element count assertion passed: ${name}`);
  }

  /**
   * Assert element is not visible
   */
  async assertElementNotVisible(selector: string, elementName?: string): Promise<void> {
    const name = elementName || selector;
    this.logger.info(`Asserting element is not visible: ${name}`);
    
    const element = this.page.locator(selector);
    await expect(element).not.toBeVisible();
    
    this.logger.info(`Element not visible assertion passed: ${name}`);
  }

  /**
   * Assert element is disabled
   */
  async assertElementIsDisabled(selector: string, elementName?: string): Promise<void> {
    const name = elementName || selector;
    this.logger.info(`Asserting element is disabled: ${name}`);
    
    const element = this.page.locator(selector);
    await expect(element).toBeDisabled();
    
    this.logger.info(`Element disabled assertion passed: ${name}`);
  }

  /**
   * Assert form field has specific value
   */
  async assertFieldValue(selector: string, expectedValue: string, fieldName?: string): Promise<void> {
    const name = fieldName || selector;
    this.logger.info(`Asserting field value: ${name} -> "${expectedValue}"`);
    
    const field = this.page.locator(selector);
    await expect(field).toHaveValue(expectedValue);
    
    this.logger.info(`Field value assertion passed: ${name}`);
  }

  /**
   * Assert checkbox is checked
   */
  async assertCheckboxIsChecked(selector: string, checkboxName?: string): Promise<void> {
    const name = checkboxName || selector;
    this.logger.info(`Asserting checkbox is checked: ${name}`);
    
    const checkbox = this.page.locator(selector);
    await expect(checkbox).toBeChecked();
    
    this.logger.info(`Checkbox checked assertion passed: ${name}`);
  }

  /**
   * Assert dropdown has selected option
   */
  async assertDropdownSelection(selector: string, expectedValue: string, dropdownName?: string): Promise<void> {
    const name = dropdownName || selector;
    this.logger.info(`Asserting dropdown selection: ${name} -> "${expectedValue}"`);
    
    const dropdown = this.page.locator(selector);
    await expect(dropdown).toHaveValue(expectedValue);
    
    this.logger.info(`Dropdown selection assertion passed: ${name}`);
  }

  /**
   * Assert element is within viewport
   */
  async assertElementInViewport(selector: string, elementName?: string): Promise<void> {
    const name = elementName || selector;
    this.logger.info(`Asserting element is in viewport: ${name}`);
    
    const element = this.page.locator(selector);
    await expect(element).toBeInViewport();
    
    this.logger.info(`Element in viewport assertion passed: ${name}`);
  }

  /**
   * Assert page load time is within acceptable range
   */
  async assertPageLoadTime(maxLoadTime: number): Promise<void> {
    this.logger.info(`Asserting page load time is under ${maxLoadTime}ms`);
    
    const navigationTiming = await this.page.evaluate(() => {
      const timing = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return timing.loadEventEnd - timing.navigationStart;
    });
    
    expect(navigationTiming).toBeLessThan(maxLoadTime);
    
    this.logger.info(`Page load time assertion passed: ${navigationTiming}ms`);
  }

  /**
   * Assert element has focus
   */
  async assertElementHasFocus(selector: string, elementName?: string): Promise<void> {
    const name = elementName || selector;
    this.logger.info(`Asserting element has focus: ${name}`);
    
    const element = this.page.locator(selector);
    await expect(element).toBeFocused();
    
    this.logger.info(`Element focus assertion passed: ${name}`);
  }
}






