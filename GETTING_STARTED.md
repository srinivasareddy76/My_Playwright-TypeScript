

# Getting Started with My Playwright-TypeScript Framework

This guide will help you get up and running with the Playwright-TypeScript automation framework for testing the Federal Reserve Bank of San Francisco website.

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18.0.0 or higher
- npm or yarn package manager

### 2. Installation
```bash
# Install dependencies
npm install

# Install Playwright browsers
npm run test:install
```

### 3. Run Your First Test
```bash
# Run basic homepage tests
npm run test -- tests/specs/basic-homepage.spec.ts

# Run comprehensive tests
npm run test -- tests/specs/homepage-comprehensive.spec.ts
```

## 📋 Available Test Suites

### Basic Tests (`basic-homepage.spec.ts`)
- ✅ Homepage loading verification
- ✅ Logo visibility check
- ✅ Navigation menu presence
- ✅ Main content area validation
- ✅ Responsive design testing

### Comprehensive Tests (`homepage-comprehensive.spec.ts`)
- ✅ Core page elements validation
- ✅ Navigation menu functionality
- ✅ Content sections verification
- ✅ Search functionality testing
- ✅ Responsive design across viewports
- ✅ Performance testing
- ✅ Accessibility compliance

### Original Test Suites
- `homepage.spec.ts` - Detailed homepage functionality
- `responsive.spec.ts` - Cross-device testing
- `performance.spec.ts` - Load time and interaction performance
- `accessibility.spec.ts` - WCAG compliance testing

## 🎯 Test Execution Options

### Run All Tests
```bash
npm test
```

### Run Specific Test Files
```bash
# Basic tests only
npx playwright test tests/specs/basic-homepage.spec.ts

# Comprehensive tests only
npx playwright test tests/specs/homepage-comprehensive.spec.ts

# Performance tests
npm run test:performance

# Accessibility tests
npm run test:accessibility
```

### Browser-Specific Testing
```bash
# Chrome only
npm run test:chromium

# Firefox only
npm run test:firefox

# Safari only
npm run test:webkit

# Mobile Chrome
npm run test:mobile
```

### Debug Mode
```bash
# Run with visible browser
npm run test:headed

# Interactive debugging
npm run test:debug

# UI mode for test development
npm run test:ui
```

## 📊 View Test Reports

```bash
# Open HTML report
npm run test:report
```

Reports are generated in the `reports/` directory:
- `reports/html-report/` - Interactive HTML report
- `reports/test-results.json` - JSON format results
- `reports/junit-results.xml` - JUnit XML for CI/CD

## 🔧 Configuration

### Environment Variables
```bash
# Set test environment
export TEST_ENV=development  # or staging, production

# Run in headed mode
export HEADED=true

# Set custom base URL
export BASE_URL=https://frbsf.org

# Set log level
export LOG_LEVEL=INFO  # ERROR, WARN, INFO, DEBUG
```

### Playwright Configuration
Edit `playwright.config.ts` to customize:
- Browser settings
- Timeout values
- Retry logic
- Report formats
- Viewport sizes

## 🏗️ Project Structure

```
My_PlayWright-TypeScript/
├── src/
│   ├── config/           # Environment and setup configuration
│   └── utils/            # Utility classes (Logger, etc.)
├── tests/
│   ├── pages/            # Page Object Model classes
│   └── specs/            # Test specification files
├── reports/              # Generated test reports
├── test-results/         # Test artifacts (screenshots, videos)
└── playwright.config.ts  # Main Playwright configuration
```

## 🧪 Writing New Tests

### 1. Create a New Test File
```typescript
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home-page';

test.describe('My New Test Suite', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigateToHomePage();
  });

  test('should do something', async ({ page }) => {
    // Your test logic here
    const isLoaded = await homePage.isPageLoaded();
    expect(isLoaded).toBe(true);
  });
});
```

### 2. Add New Page Objects
Create new page classes in `tests/pages/` extending `BasePage`:

```typescript
import { Page } from '@playwright/test';
import { BasePage } from './base-page';

export class MyNewPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Add your page-specific methods here
}
```

## 🚀 CI/CD Integration

### GitHub Actions
```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
    - run: npm ci
    - run: npx playwright install --with-deps
    - run: npm test
```

### Jenkins
```groovy
pipeline {
    agent any
    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
                sh 'npx playwright install --with-deps'
            }
        }
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
    }
    post {
        always {
            publishTestResults testResultsPattern: 'reports/junit-results.xml'
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'reports/html-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Test Report'
            ])
        }
    }
}
```

## 🔍 Debugging Tips

### 1. Visual Debugging
```bash
# Run with browser visible
npm run test:headed

# Slow down execution
SLOW_MO=1000 npm run test:headed
```

### 2. Screenshots and Videos
- Screenshots are automatically taken on test failure
- Videos are recorded for failed tests
- Find them in `test-results/` directory

### 3. Console Logs
```bash
# Enable debug logging
LOG_LEVEL=DEBUG npm test
```

### 4. Interactive Mode
```bash
# Use Playwright UI for test development
npm run test:ui
```

## 📈 Performance Monitoring

The framework includes built-in performance testing:
- Page load time measurement
- Interactive element response times
- Network request monitoring
- Performance regression detection

View performance metrics in test reports and console output.

## ♿ Accessibility Testing

Comprehensive accessibility validation includes:
- WCAG 2.1 compliance checking
- Keyboard navigation validation
- Screen reader compatibility
- Color contrast verification
- Focus management testing

## 🤝 Best Practices

### 1. Test Organization
- Keep tests focused and atomic
- Use descriptive test names
- Group related tests in describe blocks
- Implement proper setup and teardown

### 2. Page Object Model
- Encapsulate page interactions in page objects
- Use meaningful method names
- Implement proper error handling
- Maintain selectors in centralized locations

### 3. Maintenance
- Regular selector updates
- Performance baseline monitoring
- Cross-browser compatibility testing
- Accessibility compliance validation

## 🆘 Troubleshooting

### Common Issues

1. **Tests failing due to timeouts**
   - Increase timeout values in `playwright.config.ts`
   - Check network connectivity
   - Verify website accessibility

2. **Element not found errors**
   - Update selectors in page objects
   - Check if website structure changed
   - Use more robust selector strategies

3. **Browser installation issues**
   - Run `npx playwright install --with-deps`
   - Check system requirements
   - Verify Node.js version compatibility

### Getting Help
1. Check the documentation
2. Review existing test examples
3. Use Playwright's built-in debugging tools
4. Check browser developer tools for element inspection

---

**Happy Testing! 🎉**


