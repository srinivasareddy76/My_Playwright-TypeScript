









/**
 * Chase Bank Homepage Page Object
 * 
 * Page object for Chase Bank homepage
 */

import { Page, expect } from '@playwright/test';
import { BasePage } from '../../../../src/common/base-page';

export class ChaseHomePage extends BasePage {
  // Page elements
  private readonly selectors = {
    logo: '[data-testid="chase-logo"], .chase-logo, header .logo',
    mainNavigation: 'nav[role="navigation"], .primary-nav, .main-navigation',
    signInButton: '[data-testid="sign-in"], .signin-btn, button:has-text("Sign in")',
    openAccountButton: '[data-testid="open-account"], .open-account-btn, button:has-text("Open an account")',
    heroSection: '[data-testid="hero"], .hero-section, .main-hero',
    productsSection: '[data-testid="products"], .products-grid, .banking-products',
    offersSection: '[data-testid="offers"], .offers-section, .current-offers',
    footer: 'footer, [role="contentinfo"]',
    searchInput: '[data-testid="search"], input[type="search"], .search-field',
    mobileMenu: '[data-testid="mobile-menu"], .mobile-nav-toggle, .hamburger',
    locatorLink: '[data-testid="locator"], a:has-text("Find a branch or ATM")'
  };

  constructor(page: Page) {
    super(page, 'https://chase.com');
  }

  /**
   * Navigate to Chase homepage
   */
  async navigateToHomePage(): Promise<void> {
    this.logger.pageAction('ChaseHomePage', 'navigateToHomePage');
    await this.navigateTo('/');
    await this.verifyPageLoaded();
  }

  /**
   * Verify homepage is loaded correctly
   */
  async verifyPageLoaded(): Promise<void> {
    this.logger.pageAction('ChaseHomePage', 'verifyPageLoaded');
    
    await this.verifyElementVisible(this.selectors.logo, 'Chase Logo');
    await this.verifyElementVisible(this.selectors.mainNavigation, 'Main Navigation');
    
    const title = await this.getTitle();
    expect(title).toContain('Chase');
  }

  /**
   * Click Sign In button
   */
  async clickSignIn(): Promise<void> {
    this.logger.pageAction('ChaseHomePage', 'clickSignIn');
    await this.clickElement(this.selectors.signInButton, 'Sign In Button');
    await this.waitForNavigation();
  }

  /**
   * Click Open Account button
   */
  async clickOpenAccount(): Promise<void> {
    this.logger.pageAction('ChaseHomePage', 'clickOpenAccount');
    await this.clickElement(this.selectors.openAccountButton, 'Open Account Button');
    await this.waitForNavigation();
  }

  /**
   * Click Find Branch/ATM link
   */
  async clickFindLocations(): Promise<void> {
    this.logger.pageAction('ChaseHomePage', 'clickFindLocations');
    await this.clickElement(this.selectors.locatorLink, 'Find Locations Link');
    await this.waitForNavigation();
  }

  /**
   * Get navigation menu items
   */
  async getNavigationItems(): Promise<string[]> {
    this.logger.pageAction('ChaseHomePage', 'getNavigationItems');
    
    const navItems = await this.page.locator(`${this.selectors.mainNavigation} a`).allTextContents();
    return navItems.map(item => item.trim()).filter(item => item.length > 0);
  }

  /**
   * Click on navigation menu item
   */
  async clickNavigationItem(itemText: string): Promise<void> {
    this.logger.pageAction('ChaseHomePage', 'clickNavigationItem', { itemText });
    
    const navLink = this.page.locator(`${this.selectors.mainNavigation} a:has-text("${itemText}")`);
    await navLink.click();
    await this.waitForNavigation();
  }

  /**
   * Get hero section content
   */
  async getHeroContent(): Promise<{ title: string; description: string; ctaText: string }> {
    this.logger.pageAction('ChaseHomePage', 'getHeroContent');
    
    const heroTitle = await this.getElementText(`${this.selectors.heroSection} h1, ${this.selectors.heroSection} .hero-title`);
    const heroDescription = await this.getElementText(`${this.selectors.heroSection} p, ${this.selectors.heroSection} .hero-description`);
    const ctaText = await this.getElementText(`${this.selectors.heroSection} button, ${this.selectors.heroSection} .cta-button`);
    
    return {
      title: heroTitle,
      description: heroDescription,
      ctaText: ctaText
    };
  }

  /**
   * Get banking products
   */
  async getBankingProducts(): Promise<Array<{ name: string; description: string; features: string[]; link: string }>> {
    this.logger.pageAction('ChaseHomePage', 'getBankingProducts');
    
    const productItems = await this.page.locator(`${this.selectors.productsSection} .product-card, ${this.selectors.productsSection} .product-item`).all();
    const products = [];
    
    for (const item of productItems) {
      const name = await item.locator('h2, h3, .product-name').textContent() || '';
      const description = await item.locator('p, .product-description').textContent() || '';
      const link = await item.locator('a').getAttribute('href') || '';
      
      // Get features if available
      const featureElements = await item.locator('.features li, .benefits li').allTextContents();
      const features = featureElements.map(f => f.trim()).filter(f => f.length > 0);
      
      products.push({
        name: name.trim(),
        description: description.trim(),
        features: features,
        link: link
      });
    }
    
    return products;
  }

  /**
   * Get current offers
   */
  async getCurrentOffers(): Promise<Array<{ title: string; description: string; terms: string; link: string }>> {
    this.logger.pageAction('ChaseHomePage', 'getCurrentOffers');
    
    const offerItems = await this.page.locator(`${this.selectors.offersSection} .offer-card, ${this.selectors.offersSection} .promo-card`).all();
    const offers = [];
    
    for (const item of offerItems) {
      const title = await item.locator('h2, h3, .offer-title').textContent() || '';
      const description = await item.locator('p, .offer-description').textContent() || '';
      const terms = await item.locator('.terms, .fine-print').textContent() || '';
      const link = await item.locator('a').getAttribute('href') || '';
      
      offers.push({
        title: title.trim(),
        description: description.trim(),
        terms: terms.trim(),
        link: link
      });
    }
    
    return offers;
  }

  /**
   * Perform search operation
   */
  async performSearch(searchTerm: string): Promise<void> {
    this.logger.pageAction('ChaseHomePage', 'performSearch', { searchTerm });
    
    await this.fillField(this.selectors.searchInput, searchTerm, 'Search Input');
    await this.pressKey('Enter');
    await this.waitForNavigation();
  }

  /**
   * Test mobile menu functionality
   */
  async testMobileMenu(): Promise<boolean> {
    this.logger.pageAction('ChaseHomePage', 'testMobileMenu');
    
    // Set mobile viewport
    await this.page.setViewportSize({ width: 375, height: 667 });
    await this.waitForPageLoad();
    
    // Check if mobile menu is present
    const mobileMenuVisible = await this.isElementVisible(this.selectors.mobileMenu);
    
    if (mobileMenuVisible) {
      await this.clickElement(this.selectors.mobileMenu, 'Mobile Menu Toggle');
      // Wait for menu animation
      await this.page.waitForTimeout(500);
      
      // Check if navigation items are now visible
      const navVisible = await this.isElementVisible(this.selectors.mainNavigation);
      return navVisible;
    }
    
    return mobileMenuVisible;
  }

  /**
   * Verify footer content
   */
  async verifyFooterContent(): Promise<void> {
    this.logger.pageAction('ChaseHomePage', 'verifyFooterContent');
    
    await this.verifyElementVisible(this.selectors.footer, 'Footer');
    
    const footerText = await this.getElementText(this.selectors.footer);
    expect(footerText).toContain('Chase');
  }

  /**
   * Get footer links by category
   */
  async getFooterLinks(): Promise<Record<string, string[]>> {
    this.logger.pageAction('ChaseHomePage', 'getFooterLinks');
    
    const footerSections = await this.page.locator(`${this.selectors.footer} .footer-section, ${this.selectors.footer} .footer-column`).all();
    const linksByCategory: Record<string, string[]> = {};
    
    for (const section of footerSections) {
      const categoryTitle = await section.locator('h3, h4, .section-title').textContent();
      const links = await section.locator('a').allTextContents();
      
      if (categoryTitle) {
        linksByCategory[categoryTitle.trim()] = links.map(link => link.trim()).filter(link => link.length > 0);
      }
    }
    
    return linksByCategory;
  }

  /**
   * Check security indicators
   */
  async checkSecurityIndicators(): Promise<{ sslCertificate: boolean; securityBadges: boolean; privacyPolicy: boolean }> {
    this.logger.pageAction('ChaseHomePage', 'checkSecurityIndicators');
    
    const results = {
      sslCertificate: false,
      securityBadges: false,
      privacyPolicy: false
    };
    
    // Check SSL certificate (HTTPS)
    results.sslCertificate = this.getCurrentUrl().startsWith('https://');
    
    // Check for security badges or indicators
    results.securityBadges = await this.isElementPresent('.security-badge, .ssl-badge, .norton-badge, .mcafee-badge');
    
    // Check for privacy policy link
    results.privacyPolicy = await this.isElementPresent('a[href*="privacy"], a:has-text("Privacy Policy")');
    
    return results;
  }

  /**
   * Check responsive design
   */
  async checkResponsiveDesign(): Promise<{ mobile: boolean; tablet: boolean; desktop: boolean }> {
    this.logger.pageAction('ChaseHomePage', 'checkResponsiveDesign');
    
    const results = { mobile: false, tablet: false, desktop: false };
    
    // Test mobile viewport (375x667)
    await this.page.setViewportSize({ width: 375, height: 667 });
    await this.waitForPageLoad();
    results.mobile = await this.isElementVisible(this.selectors.logo) && 
                     await this.isElementVisible(this.selectors.mobileMenu);
    
    // Test tablet viewport (768x1024)
    await this.page.setViewportSize({ width: 768, height: 1024 });
    await this.waitForPageLoad();
    results.tablet = await this.isElementVisible(this.selectors.logo) && 
                     await this.isElementVisible(this.selectors.mainNavigation);
    
    // Test desktop viewport (1920x1080)
    await this.page.setViewportSize({ width: 1920, height: 1080 });
    await this.waitForPageLoad();
    results.desktop = await this.isElementVisible(this.selectors.logo) && 
                      await this.isElementVisible(this.selectors.mainNavigation);
    
    return results;
  }

  /**
   * Measure page performance
   */
  async measurePagePerformance(): Promise<{ loadTime: number; interactiveTime: number; firstContentfulPaint: number }> {
    this.logger.pageAction('ChaseHomePage', 'measurePagePerformance');
    
    const metrics = await this.getPerformanceMetrics();
    
    return {
      loadTime: metrics.loadTime,
      interactiveTime: metrics.domContentLoaded,
      firstContentfulPaint: metrics.firstContentfulPaint
    };
  }
}









