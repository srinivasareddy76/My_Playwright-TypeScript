


/**
 * Authentication Helper
 * 
 * Provides common authentication operations for tests
 */

import { Page } from '@playwright/test';
import { Logger } from '../../../src/utils/logger';

export class AuthHelper {
  private page: Page;
  private logger: Logger;

  constructor(page: Page) {
    this.page = page;
    this.logger = Logger.getInstance();
  }

  /**
   * Login with username and password
   */
  async login(username: string, password: string): Promise<void> {
    this.logger.info(`Attempting login for user: ${username}`);
    
    // Implementation would depend on the specific login mechanism
    // This is a placeholder for common login operations
    
    await this.page.fill('[data-testid="username"]', username);
    await this.page.fill('[data-testid="password"]', password);
    await this.page.click('[data-testid="login-button"]');
    
    // Wait for login to complete
    await this.page.waitForURL('**/dashboard');
    
    this.logger.info('Login completed successfully');
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    this.logger.info('Logging out current user');
    
    await this.page.click('[data-testid="logout-button"]');
    await this.page.waitForURL('**/login');
    
    this.logger.info('Logout completed successfully');
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      // Check for presence of authenticated user elements
      const userMenu = await this.page.locator('[data-testid="user-menu"]').count();
      return userMenu > 0;
    } catch (error) {
      this.logger.error('Error checking authentication status', error);
      return false;
    }
  }

  /**
   * Get current user information
   */
  async getCurrentUser(): Promise<{ username: string; role: string } | null> {
    try {
      if (!(await this.isAuthenticated())) {
        return null;
      }

      const username = await this.page.textContent('[data-testid="current-username"]');
      const role = await this.page.textContent('[data-testid="current-user-role"]');

      return {
        username: username || 'Unknown',
        role: role || 'User'
      };
    } catch (error) {
      this.logger.error('Error getting current user information', error);
      return null;
    }
  }
}


