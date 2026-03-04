
# 🎭 Playwright TypeScript Framework - Complete Guide for Test Engineers

## 📋 Table of Contents
1. [Framework Overview](#framework-overview)
2. [Core Components](#core-components)
3. [Getting Started](#getting-started)
4. [Writing Your First Test](#writing-your-first-test)
5. [Data-Driven Testing](#data-driven-testing)
6. [Page Object Model](#page-object-model)
7. [Custom Assertions](#custom-assertions)
8. [Environment Management](#environment-management)
9. [Logging and Debugging](#logging-and-debugging)
10. [Best Practices](#best-practices)
11. [Troubleshooting](#troubleshooting)

## 🎯 Framework Overview

This Playwright TypeScript framework is designed to provide test engineers with a robust, scalable, and maintainable testing solution. It follows industry best practices and provides powerful features for modern web application testing.

### Key Benefits
- **🔷 Type Safety**: Full TypeScript support with compile-time validation
- **📊 Data-Driven**: Smart reference system eliminates data duplication
- **🏗️ Scalable Architecture**: Page Object Model with reusable components
- **🌍 Multi-Environment**: Easy switching between dev/staging/prod
- **📈 Performance Monitoring**: Built-in performance testing capabilities
- **♿ Accessibility**: Integrated accessibility validation
- **🔍 Comprehensive Logging**: Detailed logging for debugging and monitoring

## 🧩 Core Components

### 1. BasePage (`src/common/base-page.ts`)
**Purpose**: Foundation class for all page objects
```typescript
// Provides common functionality like:
- Element interactions (click, fill, select)
- Navigation methods (goto, back, refresh)
- Verification methods (visibility, text, attributes)
- Performance monitoring
- Accessibility testing
- Error handling and logging
```

### 2. DataManager (`tests/utils/test-data/data-manager.ts`)
**Purpose**: Smart test data management with reference resolution
```typescript
// Features:
- Load static test data from JSON files
- Resolve dot notation references (e.g., "homepage.title")
- Environment-specific data overrides
- Scenario-based test data management
- Type-safe data access
```

### 3. Logger (`src/utils/logger.ts`)
**Purpose**: Centralized logging system
```typescript
// Capabilities:
- Multiple log levels (ERROR, WARN, INFO, DEBUG)
- File and console output
- Timestamp support
- Performance logging
- Structured logging format
```

### 4. EnvironmentManager (`src/config/environment.ts`)
**Purpose**: Multi-environment configuration management
```typescript
// Manages:
- Environment-specific URLs and settings
- Browser configuration per environment
- Timeout and retry settings
- Credential management
- Feature flags
```

### 5. CustomAssertions (`tests/helpers/assertions/custom-assertions.ts`)
**Purpose**: Enhanced assertion library
```typescript
// Provides:
- Domain-specific assertions
- Performance assertions
- Accessibility assertions
- Visual comparison assertions
- Enhanced error messages
```

## 🚀 Getting Started

### 1. Installation
```bash
# Clone and setup
git clone https://github.com/srinivasareddy76/My_Playwright-TypeScript.git
cd My_Playwright-TypeScript
npm install
npx playwright install

# Build and verify
npm run build
npm run lint
```

### 2. Environment Setup
```bash
# Set environment (optional, defaults to 'development')
export TEST_ENV=development  # or staging, production

# Set log level (optional, defaults to 'INFO')
export LOG_LEVEL=INFO  # or ERROR, WARN, DEBUG
```

### 3. Run Tests
```bash
# Run all FRBSF tests
npm run test:frbsf

# Run specific test
npm run test:frbsf -- --grep "homepage loads"

# Run in headed mode (see browser)
npm run test:frbsf:headed

# Run with UI mode (interactive)
npm run test:frbsf:ui
```

## ✍️ Writing Your First Test

### Step 1: Create a Page Object
```typescript
// tests/e2e/myapp/pages/login-page.ts
import { BasePage } from '../../../../src/common/base-page';

export class LoginPage extends BasePage {
  private selectors = {
    usernameField: '[data-testid="username"]',
    passwordField: '[data-testid="password"]',
    loginButton: '[data-testid="login-btn"]',
    errorMessage: '.error-message'
  };

  async login(username: string, password: string): Promise<void> {
    this.logger.info('PAGE ACTION: LoginPage - login');
    await this.fillField(this.selectors.usernameField, username);
    await this.fillField(this.selectors.passwordField, password);
    await this.clickElement(this.selectors.loginButton);
  }

  async verifyLoginError(expectedMessage: string): Promise<void> {
    await this.verifyElementContainsText(this.selectors.errorMessage, expectedMessage);
  }
}
```

### Step 2: Add Test Data
```json
// tests/fixtures/myapp/data/test-data.json
{
  "login": {
    "validUser": {
      "username": "testuser@example.com",
      "password": "SecurePass123"
    },
    "invalidUser": {
      "username": "invalid@example.com",
      "password": "wrongpass"
    }
  },
  "urls": {
    "loginPage": "/login",
    "dashboard": "/dashboard"
  }
}
```

### Step 3: Create Test Scenarios
```json
// tests/fixtures/myapp/data/test-scenarios.json
{
  "login": {
    "validLoginTest": {
      "description": "Verify successful login with valid credentials",
      "testData": {
        "useStaticData": {
          "username": "login.validUser.username",
          "password": "login.validUser.password",
          "expectedUrl": "urls.dashboard"
        }
      }
    },
    "invalidLoginTest": {
      "description": "Verify error message with invalid credentials",
      "testData": {
        "useStaticData": {
          "username": "login.invalidUser.username",
          "password": "login.invalidUser.password"
        }
      },
      "expectedError": "Invalid username or password"
    }
  }
}
```

### Step 4: Write the Test
```typescript
// tests/e2e/myapp/specs/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { DataManager } from '../../../utils/test-data/data-manager';

const dataManager = DataManager.getInstance();

test.describe('Login Tests', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    const { scenario, testData, config } = dataManager.getScenarioTestData('login', 'validLoginTest');
    const loginPage = new LoginPage(page, config.baseUrl);

    // Navigate to login page
    await loginPage.navigateToUrl(testData.urls.loginPage);

    // Perform login
    await loginPage.login(scenario.testData.username, scenario.testData.password);

    // Verify successful login
    await expect(page).toHaveURL(new RegExp(scenario.testData.expectedUrl));
  });

  test('should show error with invalid credentials', async ({ page }) => {
    const { scenario, testData, config } = dataManager.getScenarioTestData('login', 'invalidLoginTest');
    const loginPage = new LoginPage(page, config.baseUrl);

    // Navigate to login page
    await loginPage.navigateToUrl(testData.urls.loginPage);

    // Attempt login with invalid credentials
    await loginPage.login(scenario.testData.username, scenario.testData.password);

    // Verify error message
    await loginPage.verifyLoginError(scenario.expectedError);
  });
});
```

## 📊 Data-Driven Testing

### Smart Reference System
The framework uses a dot notation reference system to eliminate data duplication:

```json
// Static Data (test-data.json)
{
  "homepage": {
    "title": "My Application",
    "url": "https://myapp.com"
  },
  "performance": {
    "maxLoadTime": 5000
  }
}

// Scenarios (test-scenarios.json)
{
  "homepage": {
    "loadTest": {
      "assertions": {
        "useStaticData": {
          "titleContains": "homepage.title",
          "maxLoadTime": "performance.maxLoadTime"
        }
      }
    }
  }
}
```

### Using DataManager
```typescript
const dataManager = DataManager.getInstance();

// Get resolved scenario data
const { scenario, testData, config } = dataManager.getScenarioTestData('homepage', 'loadTest');

// References are automatically resolved:
console.log(scenario.assertions.titleContains); // "My Application"
console.log(scenario.assertions.maxLoadTime);   // 5000
```

## 🏗️ Page Object Model

### Best Practices for Page Objects

#### 1. Selector Strategy
```typescript
export class MyPage extends BasePage {
  private selectors = {
    // Primary: data-testid (most reliable)
    loginButton: '[data-testid="login-btn"]',
    
    // Secondary: CSS classes (fallback)
    loginButton: '[data-testid="login-btn"], .login-button, .btn-login',
    
    // Tertiary: ARIA labels (accessibility)
    loginButton: '[data-testid="login-btn"], .login-button, button[aria-label="Login"]'
  };
}
```

#### 2. Method Organization
```typescript
export class MyPage extends BasePage {
  // Navigation methods
  async navigateToPage(): Promise<void> { }
  async goToSection(section: string): Promise<void> { }

  // Interaction methods
  async fillForm(data: FormData): Promise<void> { }
  async submitForm(): Promise<void> { }

  // Verification methods
  async verifyPageLoaded(): Promise<void> { }
  async verifyFormSubmitted(): Promise<void> { }

  // Utility methods
  async getFormData(): Promise<FormData> { }
  async clearForm(): Promise<void> { }
}
```

#### 3. Error Handling
```typescript
export class MyPage extends BasePage {
  async performAction(): Promise<void> {
    try {
      this.logger.info('PAGE ACTION: MyPage - performAction');
      await this.clickElement(this.selectors.button);
      this.logger.info('Action completed successfully');
    } catch (error) {
      this.logger.error(`Action failed: ${error.message}`);
      throw error;
    }
  }
}
```

## 🎯 Custom Assertions

### Using Custom Assertions
```typescript
import { CustomAssertions } from '../../../helpers/assertions/custom-assertions';

test('example test', async ({ page }) => {
  const assertions = new CustomAssertions(page);

  // Element assertions
  await assertions.assertElementIsInteractable('.button', 'Submit Button');
  await assertions.assertElementContainsText('.title', 'Welcome');

  // Performance assertions
  await assertions.assertPageLoadTime(3000);

  // Accessibility assertions
  await assertions.assertAriaLabel('.search', 'Search input');
});
```

### Creating Custom Assertions
```typescript
// In custom-assertions.ts
async assertCustomBusinessRule(selector: string): Promise<void> {
  this.logger.info(`Verifying custom business rule for: ${selector}`);
  
  const element = this.page.locator(selector);
  await expect(element).toBeVisible();
  
  const text = await element.textContent();
  expect(text).toMatch(/^[A-Z]{2,3}-\d{4}$/); // Custom format validation
  
  this.logger.info('Custom business rule validation passed');
}
```

## 🌍 Environment Management

### Environment Configuration
```typescript
// src/config/environment.ts
export const environments = {
  development: {
    baseUrl: 'https://dev.myapp.com',
    apiUrl: 'https://api-dev.myapp.com',
    timeout: 30000,
    retries: 2,
    browser: {
      headless: false,
      viewport: { width: 1920, height: 1080 }
    }
  },
  staging: {
    baseUrl: 'https://staging.myapp.com',
    apiUrl: 'https://api-staging.myapp.com',
    timeout: 20000,
    retries: 1,
    browser: {
      headless: true,
      viewport: { width: 1920, height: 1080 }
    }
  }
};
```

### Using Environment Manager
```typescript
const envManager = EnvironmentManager.getInstance();
const config = envManager.getCurrentEnvironment();

// Use environment-specific settings
await page.goto(config.baseUrl);
page.setDefaultTimeout(config.elementTimeout);
```

## 📝 Logging and Debugging

### Log Levels
```typescript
const logger = Logger.getInstance();

logger.error('Critical failure occurred');     // Always shown
logger.warn('Retrying failed operation');      // WARN level and above
logger.info('Test step completed');            // INFO level and above
logger.debug('Detailed debugging info');       // DEBUG level only
```

### Performance Logging
```typescript
const startTime = Date.now();
await performAction();
const duration = Date.now() - startTime;
logger.info(`Action completed in ${duration}ms`);
```

### Debug Mode
```bash
# Run with debug logging
LOG_LEVEL=DEBUG npm run test:frbsf

# Run single test in debug mode
npm run test:frbsf -- --grep "specific test" --debug
```

## 📋 Best Practices

### 1. Test Organization
```
tests/
├── e2e/
│   └── myapp/
│       ├── pages/          # Page objects
│       ├── specs/          # Test specifications
│       └── fixtures/       # Test data
├── helpers/                # Reusable helpers
└── utils/                  # Utility classes
```

### 2. Naming Conventions
```typescript
// Page Objects: PascalCase with "Page" suffix
export class LoginPage extends BasePage { }

// Test Files: kebab-case with ".spec.ts" suffix
// login.spec.ts, user-profile.spec.ts

// Methods: camelCase with descriptive names
async navigateToHomepage(): Promise<void> { }
async verifyUserLoggedIn(): Promise<void> { }

// Selectors: camelCase describing the element
private selectors = {
  loginButton: '[data-testid="login-btn"]',
  usernameField: '[data-testid="username"]'
};
```

### 3. Data Management
```typescript
// Keep static data in test-data.json
// Keep dynamic scenarios in test-scenarios.json
// Use references to eliminate duplication
// Validate data structure with TypeScript interfaces
```

### 4. Error Handling
```typescript
// Always use try-catch for critical operations
// Provide descriptive error messages
// Log errors with context
// Use custom assertions for better error reporting
```

### 5. Performance
```typescript
// Include performance assertions in critical tests
// Monitor page load times
// Track element interaction performance
// Set appropriate timeouts per environment
```

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. Element Not Found
```typescript
// Problem: Element selector not working
// Solution: Use multiple fallback selectors
private selectors = {
  button: '[data-testid="submit"], .submit-btn, button[type="submit"]'
};
```

#### 2. Timeout Issues
```typescript
// Problem: Tests timing out
// Solution: Adjust timeouts per environment
await page.waitForSelector(selector, { timeout: config.elementTimeout });
```

#### 3. Data Reference Not Resolving
```typescript
// Problem: Reference like "homepage.title" not working
// Solution: Check data structure and reference path
const resolved = dataManager.resolveReferences(scenario);
console.log('Resolved data:', resolved);
```

#### 4. Test Flakiness
```typescript
// Problem: Tests failing intermittently
// Solution: Add proper waits and retries
await page.waitForLoadState('networkidle');
await expect(element).toBeVisible({ timeout: 10000 });
```

### Debug Commands
```bash
# Check test discovery
npm run test:frbsf -- --list

# Run with verbose logging
LOG_LEVEL=DEBUG npm run test:frbsf

# Run single test with debug
npm run test:frbsf -- --grep "test name" --debug

# Check TypeScript compilation
npm run build

# Check linting
npm run lint
```

## 🎓 Advanced Usage

### Custom Test Fixtures
```typescript
// tests/fixtures/custom-fixture.ts
import { test as base } from '@playwright/test';
import { DataManager } from '../utils/test-data/data-manager';

export const test = base.extend<{
  dataManager: DataManager;
}>({
  dataManager: async ({}, use) => {
    const dm = DataManager.getInstance();
    await use(dm);
  }
});
```

### Page Object Inheritance
```typescript
// Base application page
export class BaseAppPage extends BasePage {
  async verifyCommonHeader(): Promise<void> {
    // Common header verification
  }
}

// Specific pages inherit common functionality
export class DashboardPage extends BaseAppPage {
  async verifyDashboardSpecificContent(): Promise<void> {
    await this.verifyCommonHeader(); // Inherited method
    // Dashboard-specific verification
  }
}
```

### API Integration
```typescript
export class ApiHelper {
  static async createTestData(page: Page): Promise<TestData> {
    const response = await page.request.post('/api/test-data', {
      data: { type: 'user', scenario: 'login' }
    });
    return response.json();
  }
}
```

---

## 📞 Support and Contribution

For questions, issues, or contributions:
- **Repository**: https://github.com/srinivasareddy76/My_Playwright-TypeScript
- **Documentation**: This guide and inline code documentation
- **Best Practices**: Follow the patterns established in this framework

**Happy Testing! 🎭✨**

