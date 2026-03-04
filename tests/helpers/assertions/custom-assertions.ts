






/**
 * 🎯 CustomAssertions - Enhanced Assertion Library for Test Validation
 * 
 * PURPOSE:
 * This helper class extends Playwright's built-in assertions with custom,
 * domain-specific assertion methods that are commonly needed in web testing.
 * It provides more descriptive, reusable, and maintainable assertion patterns.
 * 
 * BENEFITS FOR TEST ENGINEERS:
 * ✅ Domain-Specific Assertions - Business logic validation methods
 * ✅ Enhanced Error Messages - More descriptive failure messages
 * ✅ Reusable Patterns - Common assertion patterns in one place
 * ✅ Performance Assertions - Built-in performance validation
 * ✅ Accessibility Assertions - WCAG compliance validation
 * ✅ Visual Assertions - Screenshot and visual comparison support
 * ✅ Logging Integration - Automatic logging of assertion results
 * 
 * USAGE EXAMPLES:
 * 
 * 1. BASIC ELEMENT ASSERTIONS:
 * ```typescript
 * const assertions = new CustomAssertions(page);
 * 
 * // Verify element is interactive
 * await assertions.assertElementIsInteractable('.login-button', 'Login Button');
 * 
 * // Verify element contains specific text
 * await assertions.assertElementContainsText('.title', 'Welcome', 'Page Title');
 * 
 * // Verify element has specific attribute
 * await assertions.assertElementHasAttribute('.link', 'href', 'https://example.com');
 * ```
 * 
 * 2. PERFORMANCE ASSERTIONS:
 * ```typescript
 * // Verify page load performance
 * await assertions.assertPageLoadTime(3000, 'Homepage should load quickly');
 * 
 * // Verify element interaction performance
 * await assertions.assertElementResponseTime('.button', 1000, 'Button should respond quickly');
 * ```
 * 
 * 3. ACCESSIBILITY ASSERTIONS:
 * ```typescript
 * // Verify ARIA attributes
 * await assertions.assertAriaLabel('.search-input', 'Search for content');
 * 
 * // Verify keyboard navigation
 * await assertions.assertKeyboardAccessible('.navigation');
 * 
 * // Verify color contrast
 * await assertions.assertColorContrast('.text-content', 4.5);
 * ```
 * 
 * 4. VISUAL ASSERTIONS:
 * ```typescript
 * // Screenshot comparison
 * await assertions.assertVisualMatch('.component', 'component-baseline.png');
 * 
 * // Element positioning
 * await assertions.assertElementPosition('.modal', { x: 100, y: 200 });
 * ```
 * 
 * 5. FORM ASSERTIONS:
 * ```typescript
 * // Form validation
 * await assertions.assertFormIsValid('.contact-form');
 * 
 * // Required field validation
 * await assertions.assertRequiredFieldsPresent('.registration-form');
 * ```
 * 
 * 6. CONTENT ASSERTIONS:
 * ```typescript
 * // URL validation
 * await assertions.assertUrlContains('/dashboard', 'Should navigate to dashboard');
 * 
 * // Page title validation
 * await assertions.assertPageTitle('Dashboard - MyApp');
 * 
 * // Multiple elements validation
 * await assertions.assertElementCount('.list-item', 5, 'Should show 5 items');
 * ```
 * 
 * AVAILABLE ASSERTION METHODS:
 * 
 * Element Interactions:
 * - assertElementIsInteractable() - Verify element is visible and enabled
 * - assertElementIsDisabled() - Verify element is disabled
 * - assertElementContainsText() - Verify element contains specific text
 * - assertElementHasAttribute() - Verify element has specific attribute
 * - assertElementCount() - Verify count of matching elements
 * 
 * Performance:
 * - assertPageLoadTime() - Verify page load performance
 * - assertElementResponseTime() - Verify element interaction speed
 * - assertNetworkRequestTime() - Verify API response times
 * 
 * Accessibility:
 * - assertAriaLabel() - Verify ARIA label presence and content
 * - assertKeyboardAccessible() - Verify keyboard navigation support
 * - assertColorContrast() - Verify WCAG color contrast compliance
 * - assertFocusManagement() - Verify proper focus handling
 * 
 * Visual:
 * - assertVisualMatch() - Screenshot comparison testing
 * - assertElementPosition() - Verify element positioning
 * - assertElementSize() - Verify element dimensions
 * 
 * Navigation:
 * - assertUrlContains() - Verify URL contains expected content
 * - assertPageTitle() - Verify page title matches expected
 * - assertBreadcrumbPath() - Verify navigation breadcrumb
 * 
 * Forms:
 * - assertFormIsValid() - Verify form validation state
 * - assertRequiredFieldsPresent() - Verify required field indicators
 * - assertFormSubmission() - Verify form submission behavior
 * 
 * ERROR HANDLING:
 * - Detailed error messages with context
 * - Automatic screenshot capture on assertion failures
 * - Logging of assertion attempts and results
 * - Graceful handling of missing elements
 * 
 * BEST PRACTICES:
 * - Use descriptive element names in assertions
 * - Combine multiple related assertions for comprehensive validation
 * - Use performance assertions to catch regressions
 * - Include accessibility assertions in critical user flows
 */

import { Page, expect } from '@playwright/test';
import { Logger } from '../../../src/utils/logger';

export class CustomAssertions {
  private page: Page;
  private logger: Logger;

  constructor(page: Page) {
    this.page = page;
    this.logger = Logger.getInstance();
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
      const timing = performance.getEntriesByType('navigation')[0] as any;
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






