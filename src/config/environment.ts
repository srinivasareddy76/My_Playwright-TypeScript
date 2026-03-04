

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
}

export interface EnvironmentConfig {
  name: string;
  baseUrl: string;
  apiTimeout: number;
  pageLoadTimeout: number;
  elementTimeout: number;
  browser: BrowserConfig;
}

export const environments: Record<string, EnvironmentConfig> = {
  development: {
    name: 'development',
    baseUrl: 'https://frbsf.org',
    apiTimeout: 10000,
    pageLoadTimeout: 30000,
    elementTimeout: 10000,
    browser: {
      headless: process.env.HEADED !== 'true',
      viewport: {
        width: 1920,
        height: 1080
      },
      timeout: 30000,
      slowMo: 0,
      video: true,
      screenshot: true
    }
  },
  staging: {
    name: 'staging',
    baseUrl: 'https://frbsf.org',
    apiTimeout: 15000,
    pageLoadTimeout: 45000,
    elementTimeout: 15000,
    browser: {
      headless: process.env.HEADED !== 'true',
      viewport: {
        width: 1920,
        height: 1080
      },
      timeout: 45000,
      slowMo: 0,
      video: true,
      screenshot: true
    }
  },
  production: {
    name: 'production',
    baseUrl: 'https://frbsf.org',
    apiTimeout: 20000,
    pageLoadTimeout: 60000,
    elementTimeout: 20000,
    browser: {
      headless: true,
      viewport: {
        width: 1920,
        height: 1080
      },
      timeout: 60000,
      slowMo: 0,
      video: false,
      screenshot: true
    }
  }
};

export class EnvironmentManager {
  private static instance: EnvironmentManager;
  private currentEnvironment: string;

  private constructor() {
    this.currentEnvironment = process.env.TEST_ENV || 'development';
  }

  public static getInstance(): EnvironmentManager {
    if (!EnvironmentManager.instance) {
      EnvironmentManager.instance = new EnvironmentManager();
    }
    return EnvironmentManager.instance;
  }

  public getConfig(): EnvironmentConfig {
    return environments[this.currentEnvironment] || environments.development;
  }

  public getEnvironmentName(): string {
    return this.currentEnvironment;
  }

  public getBaseUrl(): string {
    return this.getConfig().baseUrl;
  }

  public getBrowserConfig(): BrowserConfig {
    return this.getConfig().browser;
  }

  public setEnvironment(env: string): void {
    if (environments[env]) {
      this.currentEnvironment = env;
    } else {
      throw new Error(`Environment '${env}' not found`);
    }
  }
}


