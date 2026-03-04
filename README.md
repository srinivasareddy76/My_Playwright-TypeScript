# 🎭 My Playwright TypeScript Framework

A comprehensive, production-ready end-to-end testing framework built with Playwright and TypeScript, featuring data-driven testing, smart data management, and industry best practices.

## 🚀 Key Features

- **🔷 TypeScript Support**: Full TypeScript integration with compile-time type safety
- **🌐 Multi-Browser Testing**: Chrome, Firefox, Safari, and Edge support
- **📊 Data-Driven Testing**: Smart reference system eliminates data duplication
- **🏗️ Page Object Model**: Clean, maintainable test architecture
- **🎯 Custom Assertions**: Extended assertion library for comprehensive validation
- **🌍 Environment Management**: Multi-environment support (dev, staging, prod)
- **📈 Advanced Reporting**: HTML reports with screenshots, videos, and metrics
- **🔧 Helper Classes**: Authentication, navigation, and utility helpers
- **⚡ Performance Testing**: Built-in performance monitoring and thresholds
- **♿ Accessibility Testing**: Integrated accessibility validation

## 📁 Project Architecture

```
My_Playwright-TypeScript/
├── src/
│   ├── common/              # Shared base classes and utilities
│   │   └── base-page.ts     # Base page with common functionality
│   ├── config/              # Configuration and environment setup
│   │   ├── environment.ts   # Environment-specific configurations
│   │   ├── global-setup.ts  # Global test setup
│   │   └── global-teardown.ts # Global test cleanup
│   └── utils/               # Framework utilities
│       └── logger.ts        # Centralized logging system
├── tests/
│   ├── e2e/frbsf/          # FRBSF application tests
│   │   ├── pages/          # Page Object Model classes
│   │   │   └── home-page.ts # Homepage page object
│   │   └── specs/          # Test specifications
│   │       └── homepage.spec.ts # Homepage test scenarios
│   ├── fixtures/frbsf/data/ # Test data and configuration
│   │   ├── test-data.json   # Static configuration data
│   │   └── test-scenarios.json # Dynamic test scenarios
│   ├── helpers/            # Test helper classes
│   │   ├── auth/           # Authentication helpers
│   │   ├── navigation/     # Navigation utilities
│   │   └── assertions/     # Custom assertion helpers
│   └── utils/              # Test utilities
│       └── test-data/      # Data management utilities
│           └── data-manager.ts # Smart data resolution system
├── reports/                # Test execution reports
└── playwright.config.ts    # Playwright configuration
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Quick Setup
```bash
# 1. Clone the repository
git clone https://github.com/srinivasareddy76/My_Playwright-TypeScript.git
cd My_Playwright-TypeScript

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install

# 4. Build TypeScript
npm run build

# 5. Run tests
npm run test:frbsf
```

## 🎯 Running Tests

### Basic Commands
```bash
# Run all FRBSF tests
npm run test:frbsf

# Run specific test
npm run test:frbsf -- --grep "homepage loads"

# Run in headed mode (see browser)
npm run test:frbsf:headed

# Run with UI mode (interactive)
npm run test:frbsf:ui

# Run tests and show report
npm run test:frbsf && npx playwright show-report
```

### Advanced Options
```bash
# Run on specific browser
npm run test:frbsf -- --project=frbsf-firefox

# Run with custom timeout
npm run test:frbsf -- --timeout=60000

# Run and update snapshots
npm run test:frbsf -- --update-snapshots

# Debug mode
npm run test:frbsf -- --debug
```

## 📊 Data-Driven Testing Architecture

### Smart Reference System
Our framework eliminates data duplication through an intelligent reference system:

#### Static Data (test-data.json)
```json
{
  "homepage": {
    "url": "https://frbsf.org",
    "title": "Federal Reserve Bank of San Francisco",
    "navigationItems": ["About", "Research", "Banking"]
  },
  "performance": {
    "maxLoadTime": 5000,
    "targetLoadTime": 3000
  }
}
```

#### Dynamic Scenarios (test-scenarios.json)
```json
{
  "homepage": {
    "loadTest": {
      "description": "Verify homepage loads successfully",
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

#### Automatic Resolution
The DataManager automatically resolves references:
```typescript
// Input: "homepage.title"
// Output: "Federal Reserve Bank of San Francisco"

const { scenario, testData, config } = dataManager.getScenarioTestData('homepage', 'loadTest');
// scenario.assertions.titleContains = "Federal Reserve Bank of San Francisco"
```

## 🏗️ Writing Tests

### Page Object Example
```typescript
// tests/e2e/frbsf/pages/home-page.ts
export class FRBSFHomePage extends BasePage {
  private readonly selectors = {
    logo: '[data-testid="frbsf-logo"], .logo, header img',
    navigation: 'nav, .navigation, .main-nav',
    searchBox: '[data-testid="search"], input[type="search"]'
  };

  async navigateToHomePage(): Promise<void> {
    await this.navigateToUrl('/');
    await this.verifyPageLoaded();
  }

  async verifyPageLoaded(): Promise<void> {
    await this.verifyElementVisible(this.selectors.logo, 'FRBSF Logo');
  }
}
```

### Test Specification Example
```typescript
// tests/e2e/frbsf/specs/homepage.spec.ts
test.describe('FRBSF Homepage Tests', () => {
  test('should load homepage successfully', async ({ page }) => {
    const homePage = new FRBSFHomePage(page);
    const { scenario, testData, config } = dataManager.getScenarioTestData('homepage', 'loadTest');
    
    await homePage.navigateToHomePage();
    await expect(page).toHaveTitle(new RegExp(scenario.assertions.titleContains));
    
    const loadTime = await homePage.getPageLoadTime();
    expect(loadTime).toBeLessThan(scenario.assertions.maxLoadTime);
  });
});
```

## 🔧 Configuration

### Environment Configuration
```typescript
// src/config/environment.ts
export const environments = {
  development: {
    baseUrl: 'https://frbsf.org',
    timeout: 30000,
    retries: 2,
    browser: {
      headless: true,
      viewport: { width: 1920, height: 1080 }
    },
    performance: {
      maxLoadTime: 5000,
      maxInteractionTime: 2000
    }
  }
};
```

### Playwright Configuration
```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    {
      name: 'frbsf-chromium',
      use: { ...devices['Desktop Chrome'] },
      testDir: './tests/e2e/frbsf'
    }
  ],
  reporter: [
    ['html', { outputFolder: 'reports/html' }],
    ['json', { outputFile: 'reports/results.json' }]
  ]
});
```

## 📈 Reports & Monitoring

### HTML Reports
```bash
# Generate and view HTML report
npm run test:frbsf
npx playwright show-report
```

### Performance Monitoring
```typescript
// Built-in performance tracking
const loadTime = await homePage.getPageLoadTime();
const metrics = await homePage.getPerformanceMetrics();

expect(loadTime).toBeLessThan(config.performance.maxLoadTime);
expect(metrics.firstContentfulPaint).toBeLessThan(2000);
```

### Test Summary
```bash
# View test summary
cat reports/test-summary.json
```

## 🧪 Development Workflow

### Code Quality
```bash
# TypeScript compilation
npm run build

# Linting
npm run lint
npm run lint:fix

# Test discovery
npm run test:frbsf -- --list
```

### Adding New Tests
1. **Create page object** in `tests/e2e/frbsf/pages/`
2. **Add test data** to `tests/fixtures/frbsf/data/test-data.json`
3. **Define scenarios** in `tests/fixtures/frbsf/data/test-scenarios.json`
4. **Write test spec** in `tests/e2e/frbsf/specs/`
5. **Run and validate** tests

### Best Practices
- ✅ Use Page Object Model for all interactions
- ✅ Leverage data-driven testing with references
- ✅ Include performance assertions
- ✅ Add accessibility checks where applicable
- ✅ Use descriptive test names and comments
- ✅ Follow TypeScript best practices

## 🔍 Troubleshooting

### Common Issues
```bash
# TypeScript compilation errors
npm run build

# Test discovery issues
npm run test:frbsf -- --list

# Browser installation
npx playwright install

# Clear test cache
npx playwright test --clear-cache
```

### Debug Mode
```bash
# Run single test in debug mode
npm run test:frbsf -- --grep "homepage loads" --debug

# Headed mode for visual debugging
npm run test:frbsf:headed
```

## 📊 Framework Statistics

- **✅ Single Test File**: Consolidated from duplicate files
- **✅ Zero Data Duplication**: Smart reference system
- **✅ 10 Test Scenarios**: Comprehensive homepage coverage
- **✅ Type Safety**: 100% TypeScript with strict mode
- **✅ Code Quality**: ESLint passing (0 errors)
- **✅ Performance**: Built-in monitoring and thresholds

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes and add tests
4. Run quality checks: `npm run build && npm run lint`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Resources

- **Repository**: https://github.com/srinivasareddy76/My_Playwright-TypeScript
- **Playwright Docs**: https://playwright.dev/
- **TypeScript Docs**: https://www.typescriptlang.org/
- **Testing Best Practices**: https://playwright.dev/docs/best-practices

---

**Built with ❤️ using Playwright + TypeScript**
