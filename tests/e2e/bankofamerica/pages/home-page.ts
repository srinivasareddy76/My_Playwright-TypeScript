







/**
 * Bank of America Homepage Page Object
 * 
 * Page object for Bank of America homepage
 */

import { Page, expect } from '@playwright/test';
import { BasePage } from '../../../../src/common/base-page';

export class BOAHomePage extends BasePage {
  // Page elements
  private readonly selectors = {
    logo: '[data-testid="boa-logo"], .bofa-logo, header .logo',
    mainNavigation: 'nav[role="navigation"], .primary-nav, .main-navigation',
    signInButton: '[data-testid="sign-in"], .sign-in-btn, button:has-text("Sign In")',
    locatorButton: '[data-testid="locator"], .locator-btn, button:has-text("Locations")',
    heroSection: '[data-testid="hero"], .hero-banner, .main-banner',
    productsSection: '[data-testid="products"], .products-section, .banking-products',
    servicesSection: '[data-testid="services"], .services-section, .financial-services',
    footer: 'footer, [role="contentinfo"]',
    searchInput: '[data-testid="search"], input[type="search"], .search-input',
    mobileMenu: '[data-testid="mobile-menu"], .mobile-nav, .hamburger-menu'
  };

  constructor(page: Page) {
    super(page, 'https://bankofamerica.com');
  }

  /**
   * Navigate to BOA homepage
   */
  async navigateToHomePage(): Promise<void> {
    this.logger.pageAction('BOAHomePage', 'navigateToHomePage');
    await this.navigateTo('/');
    await this.verifyPageLoaded();
  }

  /**
   * Verify homepage is loaded correctly
   */
  async verifyPageLoaded(): Promise<void> {
    this.logger.pageAction('BOAHomePage', 'verifyPageLoaded');
    
    await this.verifyElementVisible(this.selectors.logo, 'BOA Logo');
    await this.verifyElementVisible(this.selectors.mainNavigation, 'Main Navigation');
    
    const title = await this.getTitle();
    expect(title).toContain('Bank of America');
  }

  /**
   * Click Sign In button
   */
  async clickSignIn(): Promise<void> {
    this.logger.pageAction('BOAHomePage', 'clickSignIn');
    await this.clickElement(this.selectors.signInButton, 'Sign In Button');
    await this.waitForNavigation();
  }

  /**
   * Click Locations button
   */
  async clickLocations(): Promise<void> {
    this.logger.pageAction('BOAHomePage', 'clickLocations');
    await this.clickElement(this.selectors.locatorButton, 'Locations Button');
    await this.waitForNavigation();
  }

  /**
   * Get navigation menu items
   */
  async getNavigationItems(): Promise<string[]> {
    this.logger.pageAction('BOAHomePage', 'getNavigationItems');
    
    const navItems = await this.page.locator(`${this.selectors.mainNavigation} a`).allTextContents();
    return navItems.map(item => item.trim()).filter(item => item.length > 0);
  }

  /**
   * Click on navigation menu item
   */
  async clickNavigationItem(itemText: string): Promise<void> {
    this.logger.pageAction('BOAHomePage', 'clickNavigationItem', { itemText });
    
    const navLink = this.page.locator(`${this.selectors.mainNavigation} a:has-text("${itemText}")`);
    await navLink.click();
    await this.waitForNavigation();
  }

  /**
   * Get hero section content
   */
  async getHeroContent(): Promise<{ title: string; description: string }> {
    this.logger.pageAction('BOAHomePage', 'getHeroContent');
    
    const heroTitle = await this.getElementText(`${this.selectors.heroSection} h1, ${this.selectors.heroSection} .title`);
    const heroDescription = await this.getElementText(`${this.selectors.heroSection} p, ${this.selectors.heroSection} .description`);
    
    return {
      title: heroTitle,
      description: heroDescription
    };
  }

  /**
   * Get banking products
   */
  async getBankingProducts(): Promise<Array<{ name: string; description: string; link: string }>> {
    this.logger.pageAction('BOAHomePage', 'getBankingProducts');
    
    const productItems = await this.page.locator(`${this.selectors.productsSection} .product-item, ${this.selectors.productsSection} .product-card`).all();
    const products = [];
    
    for (const item of productItems) {
      const name = await item.locator('h2, h3, .product-name').textContent() || '';
      const description = await item.locator('p, .description').textContent() || '';
      const link = await item.locator('a').getAttribute('href') || '';
      
      products.push({
        name: name.trim(),
        description: description.trim(),
        link: link
      });
    }
    
    return products;
  }

  /**
   * Get financial services
   */
  async getFinancialServices(): Promise<Array<{ name: string; description: string; link: string }>> {
    this.logger.pageAction('BOAHomePage', 'getFinancialServices');
    
    const serviceItems = await this.page.locator(`${this.selectors.servicesSection} .service-item, ${this.selectors.servicesSection} .service-card`).all();
    const services = [];
    
    for (const item of serviceItems) {
      const name = await item.locator('h2, h3, .service-name').textContent() || '';
      const description = await item.locator('p, .description').textContent() || '';
      const link = await item.locator('a').getAttribute('href') || '';
      
      services.push({
        name: name.trim(),
        description: description.trim(),
        link: link
      });
    }
    
    return services;
  }

  /**
   * Perform search operation
   */
  async performSearch(searchTerm: string): Promise<void> {
    this.logger.pageAction('BOAHomePage', 'performSearch', { searchTerm });
    
    await this.fillField(this.selectors.searchInput, searchTerm, 'Search Input');
    await this.pressKey('Enter');
    await this.waitForNavigation();
  }

  /**
   * Check mobile menu functionality
   */
  async testMobileMenu(): Promise<boolean> {
    this.logger.pageAction('BOAHomePage', 'testMobileMenu');
    
    // Set mobile viewport
    await this.page.setViewportSize({ width: 375, height: 667 });
    await this.waitForPageLoad();
    
    // Check if mobile menu is present
    const mobileMenuVisible = await this.isElementVisible(this.selectors.mobileMenu);
    
    if (mobileMenuVisible) {
      await this.clickElement(this.selectors.mobileMenu, 'Mobile Menu');
      // Wait for menu to expand
      await this.page.waitForTimeout(500);
    }
    
    return mobileMenuVisible;
  }

  /**
   * Verify footer content
   */
  async verifyFooterContent(): Promise<void> {
    this.logger.pageAction('BOAHomePage', 'verifyFooterContent');
    
    await this.verifyElementVisible(this.selectors.footer, 'Footer');
    
    const footerText = await this.getElementText(this.selectors.footer);
    expect(footerText).toContain('Bank of America');
  }

  /**
   * Check accessibility features
   */
  async checkAccessibilityFeatures(): Promise<{ skipLinks: boolean; altText: boolean; ariaLabels: boolean }> {
    this.logger.pageAction('BOAHomePage', 'checkAccessibilityFeatures');
    
    const results = {
      skipLinks: false,
      altText: false,
      ariaLabels: false
    };
    
    // Check for skip links
    results.skipLinks = await this.isElementPresent('a[href="#main"], .skip-link');
    
    // Check for alt text on images
    const images = await this.page.locator('img').all();
    let imagesWithAlt = 0;
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      if (alt !== null) imagesWithAlt++;
    }
    results.altText = images.length > 0 ? (imagesWithAlt / images.length) > 0.8 : true;
    
    // Check for aria labels on interactive elements
    const interactiveElements = await this.page.locator('button, a, input').all();
    let elementsWithAria = 0;
    for (const element of interactiveElements) {
      const ariaLabel = await element.getAttribute('aria-label');
      const ariaLabelledBy = await element.getAttribute('aria-labelledby');
      if (ariaLabel || ariaLabelledBy) elementsWithAria++;
    }
    results.ariaLabels = interactiveElements.length > 0 ? (elementsWithAria / interactiveElements.length) > 0.5 : true;
    
    return results;
  }

  /**
   * Check responsive design
   */
  async checkResponsiveDesign(): Promise<{ mobile: boolean; tablet: boolean; desktop: boolean }> {
    this.logger.pageAction('BOAHomePage', 'checkResponsiveDesign');
    
    const results = { mobile: false, tablet: false, desktop: false };
    
    // Test mobile viewport
    await this.page.setViewportSize({ width: 375, height: 667 });
    await this.waitForPageLoad();
    results.mobile = await this.isElementVisible(this.selectors.logo);
    
    // Test tablet viewport
    await this.page.setViewportSize({ width: 768, height: 1024 });
    await this.waitForPageLoad();
    results.tablet = await this.isElementVisible(this.selectors.logo);
    
    // Test desktop viewport
    await this.page.setViewportSize({ width: 1920, height: 1080 });
    await this.waitForPageLoad();
    results.desktop = await this.isElementVisible(this.selectors.logo);
    
    return results;
  }
}







