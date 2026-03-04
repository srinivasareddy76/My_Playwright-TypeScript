






/**
 * FRBSF Homepage Page Object
 * 
 * Page object for Federal Reserve Bank of San Francisco homepage
 */

import { Page, expect } from '@playwright/test';
import { BasePage } from '../../../../src/common/base-page';

export class FRBSFHomePage extends BasePage {
  // Page elements
  private readonly selectors = {
    logo: '[data-testid="frbsf-logo"], .logo, header img',
    mainNavigation: 'nav[role="navigation"], .main-nav, .primary-nav',
    searchButton: '[data-testid="search-button"], .search-btn, button[aria-label*="search"]',
    searchInput: '[data-testid="search-input"], input[type="search"], .search-input',
    heroSection: '[data-testid="hero-section"], .hero, .banner',
    newsSection: '[data-testid="news-section"], .news, .latest-news',
    researchSection: '[data-testid="research-section"], .research, .publications',
    footer: 'footer, [role="contentinfo"]',
    socialMediaLinks: '.social-media a, .social-links a',
    contactInfo: '.contact-info, .contact-details'
  };

  constructor(page: Page) {
    super(page, 'https://frbsf.org');
  }

  /**
   * Navigate to FRBSF homepage
   */
  async navigateToHomePage(): Promise<void> {
    this.logger.pageAction('FRBSFHomePage', 'navigateToHomePage');
    await this.navigateTo('/');
    await this.verifyPageLoaded();
  }

  /**
   * Verify homepage is loaded correctly
   */
  async verifyPageLoaded(): Promise<void> {
    this.logger.pageAction('FRBSFHomePage', 'verifyPageLoaded');
    
    await this.verifyElementVisible(this.selectors.logo, 'FRBSF Logo');
    await this.verifyElementVisible(this.selectors.mainNavigation, 'Main Navigation');
    
    const title = await this.getTitle();
    expect(title).toContain('Federal Reserve Bank of San Francisco');
  }

  /**
   * Perform search operation
   */
  async performSearch(searchTerm: string): Promise<void> {
    this.logger.pageAction('FRBSFHomePage', 'performSearch', { searchTerm });
    
    await this.clickElement(this.selectors.searchButton, 'Search Button');
    await this.fillField(this.selectors.searchInput, searchTerm, 'Search Input');
    await this.pressKey('Enter');
    await this.waitForNavigation();
  }

  /**
   * Get navigation menu items
   */
  async getNavigationItems(): Promise<string[]> {
    this.logger.pageAction('FRBSFHomePage', 'getNavigationItems');
    
    const navItems = await this.page.locator(`${this.selectors.mainNavigation} a`).allTextContents();
    return navItems.map(item => item.trim()).filter(item => item.length > 0);
  }

  /**
   * Click on navigation menu item
   */
  async clickNavigationItem(itemText: string): Promise<void> {
    this.logger.pageAction('FRBSFHomePage', 'clickNavigationItem', { itemText });
    
    const navLink = this.page.locator(`${this.selectors.mainNavigation} a:has-text("${itemText}")`);
    await navLink.click();
    await this.waitForNavigation();
  }

  /**
   * Get hero section content
   */
  async getHeroContent(): Promise<{ title: string; description: string }> {
    this.logger.pageAction('FRBSFHomePage', 'getHeroContent');
    
    const heroTitle = await this.getElementText(`${this.selectors.heroSection} h1, ${this.selectors.heroSection} .title`);
    const heroDescription = await this.getElementText(`${this.selectors.heroSection} p, ${this.selectors.heroSection} .description`);
    
    return {
      title: heroTitle,
      description: heroDescription
    };
  }

  /**
   * Get latest news items
   */
  async getLatestNews(): Promise<Array<{ title: string; date: string; link: string }>> {
    this.logger.pageAction('FRBSFHomePage', 'getLatestNews');
    
    const newsItems = await this.page.locator(`${this.selectors.newsSection} .news-item, ${this.selectors.newsSection} article`).all();
    const news = [];
    
    for (const item of newsItems) {
      const title = await item.locator('h2, h3, .title').textContent() || '';
      const date = await item.locator('.date, time').textContent() || '';
      const link = await item.locator('a').getAttribute('href') || '';
      
      news.push({
        title: title.trim(),
        date: date.trim(),
        link: link
      });
    }
    
    return news;
  }

  /**
   * Get research publications
   */
  async getResearchPublications(): Promise<Array<{ title: string; author: string; link: string }>> {
    this.logger.pageAction('FRBSFHomePage', 'getResearchPublications');
    
    const researchItems = await this.page.locator(`${this.selectors.researchSection} .research-item, ${this.selectors.researchSection} article`).all();
    const publications = [];
    
    for (const item of researchItems) {
      const title = await item.locator('h2, h3, .title').textContent() || '';
      const author = await item.locator('.author, .by').textContent() || '';
      const link = await item.locator('a').getAttribute('href') || '';
      
      publications.push({
        title: title.trim(),
        author: author.trim(),
        link: link
      });
    }
    
    return publications;
  }

  /**
   * Get social media links
   */
  async getSocialMediaLinks(): Promise<Record<string, string>> {
    this.logger.pageAction('FRBSFHomePage', 'getSocialMediaLinks');
    
    const socialLinks = await this.page.locator(this.selectors.socialMediaLinks).all();
    const links: Record<string, string> = {};
    
    for (const link of socialLinks) {
      const href = await link.getAttribute('href') || '';
      const text = await link.textContent() || '';
      const ariaLabel = await link.getAttribute('aria-label') || '';
      
      const platform = ariaLabel || text || 'Unknown';
      links[platform.toLowerCase()] = href;
    }
    
    return links;
  }

  /**
   * Verify footer content
   */
  async verifyFooterContent(): Promise<void> {
    this.logger.pageAction('FRBSFHomePage', 'verifyFooterContent');
    
    await this.verifyElementVisible(this.selectors.footer, 'Footer');
    
    // Check for common footer elements
    const footerText = await this.getElementText(this.selectors.footer);
    expect(footerText).toContain('Federal Reserve Bank of San Francisco');
  }

  /**
   * Get contact information
   */
  async getContactInfo(): Promise<{ address: string; phone: string; email: string }> {
    this.logger.pageAction('FRBSFHomePage', 'getContactInfo');
    
    const address = await this.getElementText(`${this.selectors.contactInfo} .address, ${this.selectors.footer} .address`);
    const phone = await this.getElementText(`${this.selectors.contactInfo} .phone, ${this.selectors.footer} .phone`);
    const email = await this.getElementText(`${this.selectors.contactInfo} .email, ${this.selectors.footer} .email`);
    
    return {
      address: address.trim(),
      phone: phone.trim(),
      email: email.trim()
    };
  }

  /**
   * Check if page is responsive
   */
  async checkResponsiveDesign(): Promise<{ mobile: boolean; tablet: boolean; desktop: boolean }> {
    this.logger.pageAction('FRBSFHomePage', 'checkResponsiveDesign');
    
    const results = { mobile: false, tablet: false, desktop: false };
    
    // Test mobile viewport
    await this.page.setViewportSize({ width: 375, height: 667 });
    await this.waitForPageLoad();
    results.mobile = await this.isElementVisible(this.selectors.mainNavigation);
    
    // Test tablet viewport
    await this.page.setViewportSize({ width: 768, height: 1024 });
    await this.waitForPageLoad();
    results.tablet = await this.isElementVisible(this.selectors.mainNavigation);
    
    // Test desktop viewport
    await this.page.setViewportSize({ width: 1920, height: 1080 });
    await this.waitForPageLoad();
    results.desktop = await this.isElementVisible(this.selectors.mainNavigation);
    
    return results;
  }
}






