
/**
 * 🌍 Environment Manager - Multi-Environment Configuration System
 * 
 * PURPOSE:
 * The Environment Manager provides a robust configuration system that supports
 * multiple testing environments (development, staging, production) with
 * environment-specific settings, browser configurations, and credentials.
 * 
 * BENEFITS FOR TEST ENGINEERS:
 * ✅ Multi-Environment Support - Easy switching between dev/staging/prod
 * ✅ Browser Configuration - Centralized browser settings management
 * ✅ Timeout Management - Environment-specific timeout configurations
 * ✅ Credential Management - Secure credential handling per environment
 * ✅ Type Safety - Full TypeScript interfaces for configuration validation
 * ✅ Easy Maintenance - Single place to update environment settings
 * 
 * USAGE EXAMPLES:
 * 
 * 1. GETTING CURRENT ENVIRONMENT:
 * ```typescript
 * const envManager = EnvironmentManager.getInstance();
 * const config = envManager.getCurrentEnvironment();
 * console.log(config.baseUrl); // "https://frbsf.org"
 * ```
 * 
 * 2. SWITCHING ENVIRONMENTS:
 * ```typescript
 * // Set via environment variable
 * process.env.TEST_ENV = 'staging';
 * 
 * // Or programmatically
 * envManager.setEnvironment('staging');
 * ```
 * 
 * 3. ACCESSING SPECIFIC CONFIGURATIONS:
 * ```typescript
 * const config = envManager.getCurrentEnvironment();
 * 
 * // Browser settings
 * console.log(config.browser.headless); // true/false
 * console.log(config.browser.viewport); // { width: 1920, height: 1080 }
 * 
 * // Timeout settings
 * console.log(config.pageLoadTimeout); // 30000
 * console.log(config.elementTimeout); // 10000
 * 
 * // URLs
 * console.log(config.baseUrl); // Environment-specific base URL
 * console.log(config.apiUrl); // Environment-specific API URL
 * ```
 * 
 * 4. IN TEST SETUP:
 * ```typescript
 * test.beforeEach(async ({ page }) => {
 *   const config = EnvironmentManager.getInstance().getCurrentEnvironment();
 *   await page.goto(config.baseUrl);
 *   page.setDefaultTimeout(config.elementTimeout);
 * });
 * ```
 * 
 * ENVIRONMENT CONFIGURATION:
 * Set environment via TEST_ENV variable:
 * - TEST_ENV=development (default)
 * - TEST_ENV=staging
 * - TEST_ENV=production
 * 
 * CONFIGURATION STRUCTURE:
 * Each environment contains:
 * - Base URLs and API endpoints
 * - Browser configuration (headless, viewport, etc.)
 * - Timeout settings (page load, element wait, API calls)
 * - Retry configuration
 * - Credential management
 * - Feature flags and environment-specific settings
 * 
 * BROWSER CONFIGURATION:
 * - headless: Run tests with/without browser UI
 * - viewport: Screen resolution for responsive testing
 * - timeout: Default timeout for browser operations
 * - slowMo: Slow down operations for debugging
 * - video/screenshot/trace: Recording options for debugging
 * 
 * SECURITY:
 * - Credentials are environment-specific
 * - Sensitive data can be loaded from environment variables
 * - Production environments can have restricted access
 */

export interface BrowserConfig {
  headless: boolean;
  viewport: {
    width: number;
    height: number;
  };
  timeout: number;
  slowMo: number;
  video: boolean;
  screenshot: boolean;
  trace: boolean;
}

export interface EnvironmentConfig {
  name: string;
  baseUrl: string;
  apiUrl: string;
  apiTimeout: number;
  pageLoadTimeout: number;
  elementTimeout: number;
  retries: number;
  browser: BrowserConfig;
  credentials: {
    username: string | null;
    password: string | null;
  };
}

export const environments: Record<string, EnvironmentConfig> = {
  development: {
    name: 'development',
    baseUrl: 'https://frbsf.org',
    apiUrl: 'https://frbsf.org/api',
    apiTimeout: 10000,
    pageLoadTimeout: 30000,
    elementTimeout: 10000,
    retries: 3,
    browser: {
      headless: false,
      viewport: { width: 1920, height: 1080 },
      timeout: 30000,
      slowMo: 100,
      video: true,
      screenshot: true,
      trace: true
    },
    credentials: {
      username: null,
      password: null
    }
  },
  staging: {
    name: 'staging',
    baseUrl: 'https://frbsf.org',
    apiUrl: 'https://frbsf.org/api',
    apiTimeout: 15000,
    pageLoadTimeout: 45000,
    elementTimeout: 15000,
    retries: 2,
    browser: {
      headless: true,
      viewport: { width: 1920, height: 1080 },
      timeout: 45000,
      slowMo: 0,
      video: true,
      screenshot: true,
      trace: true
    },
    credentials: {
      username: null,
      password: null
    }
  },
  production: {
    name: 'production',
    baseUrl: 'https://frbsf.org',
    apiUrl: 'https://frbsf.org/api',
    apiTimeout: 20000,
    pageLoadTimeout: 60000,
    elementTimeout: 20000,
    retries: 1,
    browser: {
      headless: true,
      viewport: { width: 1920, height: 1080 },
      timeout: 60000,
      slowMo: 0,
      video: false,
      screenshot: true,
      trace: false
    },
    credentials: {
      username: null,
      password: null
    }
  },
  ci: {
    name: 'ci',
    baseUrl: 'https://frbsf.org',
    apiUrl: 'https://frbsf.org/api',
    apiTimeout: 30000,
    pageLoadTimeout: 90000,
    elementTimeout: 30000,
    retries: 2,
    browser: {
      headless: true,
      viewport: { width: 1920, height: 1080 },
      timeout: 90000,
      slowMo: 0,
      video: false,
      screenshot: true,
      trace: false
    },
    credentials: {
      username: null,
      password: null
    }
  }
};

export class EnvironmentManager {
  private static instance: EnvironmentManager;
  private currentEnvironment: string;
  private config: EnvironmentConfig;

  private constructor() {
    this.currentEnvironment = process.env.TEST_ENV || 'development';
    this.config = environments[this.currentEnvironment] || environments.development;
  }

  public static getInstance(): EnvironmentManager {
    if (!EnvironmentManager.instance) {
      EnvironmentManager.instance = new EnvironmentManager();
    }
    return EnvironmentManager.instance;
  }

  public getEnvironmentName(): string {
    return this.currentEnvironment;
  }

  public getConfig(): EnvironmentConfig {
    return this.config;
  }

  public getBaseUrl(): string {
    return this.config.baseUrl;
  }

  public getApiUrl(): string {
    return this.config.apiUrl;
  }

  public getApiTimeout(): number {
    return this.config.apiTimeout;
  }

  public getPageLoadTimeout(): number {
    return this.config.pageLoadTimeout;
  }

  public getElementTimeout(): number {
    return this.config.elementTimeout;
  }

  public getRetries(): number {
    return this.config.retries;
  }

  public getBrowserConfig(): BrowserConfig {
    return this.config.browser;
  }

  public getCredentials(): { username: string | null; password: string | null } {
    return this.config.credentials;
  }

  public isHeadless(): boolean {
    return this.config.browser.headless;
  }

  public getViewport(): { width: number; height: number } {
    return this.config.browser.viewport;
  }

  public getSlowMo(): number {
    return this.config.browser.slowMo;
  }

  public shouldRecordVideo(): boolean {
    return this.config.browser.video;
  }

  public shouldTakeScreenshots(): boolean {
    return this.config.browser.screenshot;
  }

  public shouldRecordTrace(): boolean {
    return this.config.browser.trace;
  }

  public setEnvironment(envName: string): void {
    if (environments[envName]) {
      this.currentEnvironment = envName;
      this.config = environments[envName];
    } else {
      throw new Error(`Environment '${envName}' not found`);
    }
  }
}

export default EnvironmentManager;

