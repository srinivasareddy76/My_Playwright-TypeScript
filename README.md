
# My Playwright-TypeScript Framework

A comprehensive end-to-end testing framework built with Playwright and TypeScript for testing the Federal Reserve Bank of San Francisco (FRBSF) website.

## 🚀 Features

- **Cross-browser Testing**: Support for Chromium, Firefox, and WebKit
- **Mobile & Desktop Testing**: Responsive design testing across multiple viewports
- **Performance Testing**: Page load time and interaction performance validation
- **Accessibility Testing**: WCAG compliance and keyboard navigation testing
- **TypeScript Support**: Full type safety and IntelliSense support
- **Page Object Model**: Maintainable and reusable test architecture
- **Comprehensive Reporting**: HTML, JSON, and JUnit reports
- **Parallel Execution**: Fast test execution with parallel test runs
- **CI/CD Ready**: Configured for continuous integration environments

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager

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

## 🏃‍♂️ Running Tests

### Basic Test Execution

```bash
# Run all tests
npm test

# Run tests in headed mode (visible browser)
npm run test:headed

# Run tests with UI mode (interactive)
npm run test:ui

# Run tests in debug mode
npm run test:debug
```

### Specific Test Suites

```bash
# Homepage functionality tests
npm run test:homepage

# Responsive design tests
npm run test:responsive

# Performance tests
npm run test:performance

# Accessibility tests
npm run test:accessibility
```

### Browser-Specific Testing

```bash
# Run tests on Chromium only
npm run test:chromium

# Run tests on Firefox only
npm run test:firefox

# Run tests on WebKit only
npm run test:webkit

# Run tests on Mobile Chrome
npm run test:mobile
```

### View Test Reports

```bash
# Open HTML test report
npm run test:report
```

## 📁 Project Structure

```
My_PlayWright-TypeScript/
├── src/
│   ├── config/
│   │   ├── environment.ts          # Environment configuration
│   │   ├── global-setup.ts         # Global test setup
│   │   └── global-teardown.ts      # Global test teardown
│   └── utils/
│       └── logger.ts               # Logging utility
├── tests/
│   ├── pages/
│   │   ├── base-page.ts           # Base page object class
│   │   └── home-page.ts           # Homepage page object
│   └── specs/
│       ├── homepage.spec.ts       # Homepage functionality tests
│       ├── responsive.spec.ts     # Responsive design tests
│       ├── performance.spec.ts    # Performance tests
│       └── accessibility.spec.ts  # Accessibility tests
├── reports/                       # Test reports directory
├── test-results/                  # Test artifacts directory
├── playwright.config.ts           # Playwright configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Project dependencies and scripts
```

## 🧪 Test Categories

### 1. Homepage Functionality Tests
- Basic page loading and element visibility
- Navigation menu functionality
- Search functionality
- Content section verification
- Social media links testing
- District information validation
- Quick links and navigation testing

### 2. Responsive Design Tests
- Mobile viewport testing (375x667)
- Tablet viewport testing (768x1024)
- Desktop viewport testing (1920x1080)
- Cross-viewport consistency validation
- Responsive element behavior verification

### 3. Performance Tests
- Page load time measurement
- Navigation performance testing
- Search operation performance
- Interactive element response times
- Content loading efficiency
- Cross-viewport performance validation

### 4. Accessibility Tests
- WCAG compliance validation
- Keyboard navigation testing
- Screen reader compatibility
- ARIA labels and roles verification
- Color contrast and visual indicators
- Form accessibility testing
- Mobile accessibility validation
- Focus management testing

## ⚙️ Configuration

### Environment Configuration

The framework supports multiple environments configured in `src/config/environment.ts`:

- **Development**: Local testing with full debugging
- **Staging**: Pre-production testing environment
- **Production**: Production environment testing

### Browser Configuration

Configure browsers and viewports in `playwright.config.ts`:

- Desktop browsers: Chrome, Firefox, Safari, Edge
- Mobile devices: iPhone, Android devices
- Custom viewport sizes and configurations

### Test Configuration

Key configuration options:

- **Timeout Settings**: Global and action-specific timeouts
- **Retry Logic**: Automatic retry on failure
- **Parallel Execution**: Worker configuration
- **Reporting**: Multiple report formats
- **Screenshots & Videos**: Failure capture settings

## 🔧 Environment Variables

```bash
# Test environment (development, staging, production)
TEST_ENV=development

# Browser mode (true for headed, false for headless)
HEADED=false

# Base URL override
BASE_URL=https://frbsf.org

# Log level (ERROR, WARN, INFO, DEBUG)
LOG_LEVEL=INFO
```

## 📊 Reporting

The framework generates multiple report formats:

1. **HTML Report**: Interactive web-based report with screenshots and videos
2. **JSON Report**: Machine-readable test results for CI/CD integration
3. **JUnit Report**: XML format for Jenkins and other CI tools
4. **Console Output**: Real-time test execution feedback

Reports are generated in the `reports/` directory.

## 🚀 CI/CD Integration

The framework is configured for continuous integration:

- **GitHub Actions**: Ready-to-use workflow files
- **Jenkins**: JUnit XML report support
- **Docker**: Containerized test execution
- **Parallel Execution**: Optimized for CI environments

## 🛡️ Best Practices

### Page Object Model
- Encapsulate page interactions in page objects
- Use descriptive method names
- Implement proper error handling
- Maintain element selectors in centralized locations

### Test Organization
- Group related tests in describe blocks
- Use descriptive test names
- Implement proper setup and teardown
- Keep tests independent and atomic

### Maintenance
- Regular selector updates
- Performance baseline monitoring
- Accessibility compliance validation
- Cross-browser compatibility testing

## 🔍 Debugging

### Debug Mode
```bash
# Run specific test in debug mode
npx playwright test tests/specs/homepage.spec.ts --debug
```

### UI Mode
```bash
# Interactive test development and debugging
npm run test:ui
```

### Screenshots and Videos
- Automatic screenshot capture on test failure
- Video recording for failed tests
- Custom screenshot capture in tests

## 📈 Performance Monitoring

The framework includes performance testing capabilities:

- Page load time measurement
- Interactive element response times
- Network request monitoring
- Resource loading analysis
- Performance regression detection

## ♿ Accessibility Testing

Comprehensive accessibility validation:

- WCAG 2.1 compliance checking
- Keyboard navigation validation
- Screen reader compatibility
- Color contrast verification
- Focus management testing
- Mobile accessibility validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For questions and support:

1. Check the documentation
2. Review existing issues
3. Create a new issue with detailed information
4. Contact the test automation team

## 🔄 Version History

- **v1.0.0**: Initial release with core functionality
  - Homepage testing suite
  - Responsive design validation
  - Performance monitoring
  - Accessibility compliance testing
  - Cross-browser support
  - Comprehensive reporting

---

**Happy Testing! 🎉**

