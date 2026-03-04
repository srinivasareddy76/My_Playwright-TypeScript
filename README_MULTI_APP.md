

# Multi-Application Playwright TypeScript Test Framework

A comprehensive test automation framework built with Playwright and TypeScript for testing multiple financial applications including Federal Reserve Bank of San Francisco (FRBSF), Bank of America, and Chase Bank.

## 🚀 Features

- **Multi-Application Support**: Organized structure for testing multiple applications
- **Cross-browser Testing**: Chrome, Firefox, Safari, Edge support
- **Responsive Design Testing**: Mobile, Tablet, Desktop viewports
- **Performance Testing**: Page load times and Core Web Vitals
- **Accessibility Testing**: WCAG compliance validation
- **Page Object Model**: Maintainable and scalable test architecture
- **Comprehensive Reporting**: HTML, JSON, and JUnit reports
- **CI/CD Ready**: GitHub Actions integration
- **TypeScript**: Full type safety and IntelliSense support
- **Industry Best Practices**: Scalable folder structure for enterprise projects

## 📁 Project Structure

```
My_PlayWright-TypeScript/
├── src/                             # Framework source code
│   ├── config/                      # Configuration files
│   │   ├── environment.ts           # Environment management
│   │   ├── global-setup.ts          # Global test setup
│   │   └── global-teardown.ts       # Global test cleanup
│   ├── common/                      # Common utilities
│   │   ├── base-page.ts             # Base page class for all applications
│   │   ├── world.ts                 # Test context
│   │   └── hooks.ts                 # Test lifecycle hooks
│   └── utils/                       # Utility functions
│       └── logger.ts                # Logging utility
├── tests/                           # All test-related files
│   ├── e2e/                         # End-to-end tests (by application)
│   │   ├── frbsf/                   # Federal Reserve Bank of San Francisco
│   │   │   ├── pages/               # FRBSF page objects
│   │   │   │   └── home-page.ts     # FRBSF homepage page object
│   │   │   └── specs/               # FRBSF test specifications
│   │   │       └── homepage.spec.ts # FRBSF homepage tests
│   │   ├── bankofamerica/           # Bank of America application
│   │   │   ├── pages/               # BOA page objects
│   │   │   │   └── home-page.ts     # BOA homepage page object
│   │   │   └── specs/               # BOA test specifications
│   │   └── chase/                   # Chase Bank application
│   │       ├── pages/               # Chase page objects
│   │       │   └── home-page.ts     # Chase homepage page object
│   │       └── specs/               # Chase test specifications
│   ├── integration/                 # Integration tests (by application)
│   │   ├── frbsf/                   # FRBSF integration tests
│   │   ├── bankofamerica/           # BOA integration tests
│   │   └── chase/                   # Chase integration tests
│   ├── fixtures/                    # Test data and mocks (by application)
│   │   ├── frbsf/                   # FRBSF test data
│   │   │   ├── data/                # FRBSF static test data
│   │   │   │   ├── test-data.json   # Main test data
│   │   │   │   └── environments.json # Environment configs
│   │   │   └── mocks/               # FRBSF mock data
│   │   ├── bankofamerica/           # BOA test data
│   │   │   └── data/                # BOA static test data
│   │   └── chase/                   # Chase test data
│   │       └── data/                # Chase static test data
│   ├── helpers/                     # Test helper functions (shared)
│   │   ├── auth/                    # Authentication helpers
│   │   ├── navigation/              # Navigation helpers
│   │   └── assertions/              # Custom assertion helpers
│   └── utils/                       # Test utilities (shared)
│       └── test-data/               # Test data management
├── reports/                         # Generated test reports
├── screenshots/                     # Test failure screenshots
├── videos/                          # Test execution videos
├── playwright.config.ts             # Playwright configuration
├── tsconfig.json                    # TypeScript configuration
└── package.json                     # Dependencies and scripts
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd My_PlayWright-TypeScript
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npm run test:install
   ```

## 🧪 Running Tests

### Application-Specific Tests

```bash
# FRBSF Tests
npm run test:frbsf              # Run FRBSF tests (Chrome only)
npm run test:frbsf:all          # Run FRBSF tests (all browsers)
npm run test:frbsf:mobile       # Run FRBSF mobile tests
npm run test:frbsf:desktop      # Run FRBSF desktop tests

# Bank of America Tests
npm run test:boa                # Run BOA tests (Chrome only)
npm run test:boa:all            # Run BOA tests (all browsers)
npm run test:boa:mobile         # Run BOA mobile tests

# Chase Bank Tests
npm run test:chase              # Run Chase tests (Chrome only)
npm run test:chase:all          # Run Chase tests (all browsers)
npm run test:chase:mobile       # Run Chase mobile tests
```

### Cross-Application Tests

```bash
# Run tests for all applications (Chrome only)
npm run test:all-apps

# Run cross-browser compatibility tests
npm run test:cross-browser
```

### Browser-Specific Tests

```bash
# Run all applications on specific browsers
npm run test:chromium           # All apps on Chrome
npm run test:firefox            # All apps on Firefox
npm run test:webkit             # All apps on Safari
npm run test:mobile             # All apps on mobile devices
```

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in headed mode (visible browser)
npm run test:headed

# Run tests with UI mode
npm run test:ui

# Debug tests
npm run test:debug

# View HTML report
npm run test:report
```

## 🎯 Applications Under Test

### 1. Federal Reserve Bank of San Francisco (FRBSF)
- **URL**: https://frbsf.org
- **Focus**: Economic research, monetary policy, banking supervision
- **Test Coverage**: Homepage functionality, search, responsive design

### 2. Bank of America
- **URL**: https://bankofamerica.com
- **Focus**: Personal and business banking services
- **Test Coverage**: Homepage, product information, accessibility

### 3. Chase Bank
- **URL**: https://chase.com
- **Focus**: Banking, credit cards, investment services
- **Test Coverage**: Homepage, offers, mobile responsiveness

## 📊 Test Categories

### End-to-End Tests
- **Homepage functionality**: Navigation, content verification, search
- **Responsive design**: Mobile, tablet, desktop viewports
- **Performance**: Page load times, Core Web Vitals
- **Accessibility**: WCAG 2.1 AA compliance

### Integration Tests
- **API integration**: Service connectivity and data validation
- **Database integration**: Data persistence and retrieval

### Unit Tests
- **Utility functions**: Helper methods and data managers
- **Page object methods**: Individual component testing

## 📈 Test Data Management

Each application has its own test data structure:

```typescript
// Application-specific test data
const testData = dataManager.loadTestData(); // Loads from fixtures/{app}/data/

// Environment-specific configuration
const envConfig = dataManager.loadEnvironmentConfig('staging');

// User personas for testing
const personas = dataManager.loadUserPersonas();
```

## 🔧 Configuration

### Multi-Application Projects

The `playwright.config.ts` defines separate projects for each application:

```typescript
projects: [
  // FRBSF Application Tests
  {
    name: 'frbsf-chromium',
    testDir: './tests/e2e/frbsf',
    use: { baseURL: 'https://frbsf.org' }
  },
  // Bank of America Tests
  {
    name: 'boa-chromium',
    testDir: './tests/e2e/bankofamerica',
    use: { baseURL: 'https://bankofamerica.com' }
  },
  // Chase Bank Tests
  {
    name: 'chase-chromium',
    testDir: './tests/e2e/chase',
    use: { baseURL: 'https://chase.com' }
  }
]
```

### Environment Variables

```bash
# Application-specific base URLs
FRBSF_BASE_URL=https://frbsf.org
BOA_BASE_URL=https://bankofamerica.com
CHASE_BASE_URL=https://chase.com

# Environment selection
NODE_ENV=development|staging|production

# Logging
LOG_LEVEL=INFO|DEBUG|WARN|ERROR
```

## 📝 Writing Tests for New Applications

### 1. Create Application Structure

```bash
mkdir -p tests/e2e/newapp/{pages,specs}
mkdir -p tests/fixtures/newapp/{data,mocks}
mkdir -p tests/integration/newapp/{api,database}
```

### 2. Create Page Objects

```typescript
// tests/e2e/newapp/pages/home-page.ts
import { BasePage } from '../../../../src/common/base-page';

export class NewAppHomePage extends BasePage {
  constructor(page: Page) {
    super(page, 'https://newapp.com');
  }
  
  async navigateToHomePage(): Promise<void> {
    await this.navigateTo('/');
    await this.verifyPageLoaded();
  }
}
```

### 3. Create Test Data

```json
// tests/fixtures/newapp/data/test-data.json
{
  "homepage": {
    "url": "https://newapp.com",
    "title": "New Application",
    "navigationItems": ["Home", "Products", "Services"]
  }
}
```

### 4. Add to Playwright Config

```typescript
// Add to projects array in playwright.config.ts
{
  name: 'newapp-chromium',
  testDir: './tests/e2e/newapp',
  use: { baseURL: 'https://newapp.com' }
}
```

## 🚀 CI/CD Integration

The framework supports:
- **Parallel execution** across applications
- **Application-specific pipelines**
- **Cross-browser testing**
- **Environment-specific deployments**

## 📊 Test Metrics

Current framework capabilities:
- **3 applications** under test
- **Multiple browsers** supported per application
- **Responsive design** testing across devices
- **Performance benchmarks** for each application
- **Accessibility compliance** validation

## 🤝 Contributing

1. Fork the repository
2. Create application-specific feature branches
3. Follow the established folder structure
4. Write tests for new functionality
5. Ensure all applications pass tests
6. Submit a pull request

## 📚 Documentation

- [Folder Structure Guide](FOLDER_STRUCTURE.md)
- [Getting Started Guide](GETTING_STARTED.md)
- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using Playwright and TypeScript for Multi-Application Testing**

