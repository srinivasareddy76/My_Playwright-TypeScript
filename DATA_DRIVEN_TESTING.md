

# 📊 Data-Driven Testing Guide

## 📋 Overview

The framework implements a **comprehensive data-driven testing approach** that separates test logic from test data, making tests more maintainable, reusable, and easier to update.

---

## 🏗️ Architecture

### Data Structure
```
tests/fixtures/frbsf/data/
├── test-data.json          # Static test data (URLs, selectors, thresholds)
└── test-scenarios.json     # Dynamic test scenarios (test cases, steps, assertions)
```

### Key Components

#### 1. **Static Test Data** (`test-data.json`)
- **Purpose**: Configuration data that rarely changes
- **Contains**: URLs, performance thresholds, element selectors, expected content
- **Usage**: Shared across multiple test scenarios

#### 2. **Test Scenarios** (`test-scenarios.json`)
- **Purpose**: Dynamic test case definitions
- **Contains**: Test steps, assertions, expected behaviors, test-specific data
- **Usage**: Defines individual test cases with their specific requirements

#### 3. **DataManager Class**
- **Purpose**: Centralized data access and management
- **Features**: Type-safe data loading, scenario management, environment integration
- **Methods**: Load scenarios, get test data, combine environment configs

---

## 📁 Data File Structure

### test-data.json Structure
```json
{
  "homepage": {
    "url": "https://frbsf.org",
    "title": "Federal Reserve Bank of San Francisco",
    "searchTerms": ["monetary policy", "economic research"],
    "navigationItems": ["About", "Research", "Banking"],
    "socialMediaLinks": { "twitter": "...", "linkedin": "..." },
    "contentSections": ["hero", "news", "research", "footer"]
  },
  "performance": {
    "maxLoadTime": 5000,
    "maxInteractionTime": 2000,
    "maxSearchTime": 3000
  },
  "accessibility": {
    "wcagLevel": "AA",
    "colorContrastRatio": 4.5,
    "keyboardNavigationRequired": true
  },
  "contact": {
    "headquarters": { "address": "...", "phone": "...", "email": "..." },
    "branches": [...]
  }
}
```

### test-scenarios.json Structure
```json
{
  "homepage": {
    "loadTest": {
      "description": "Verify homepage loads successfully",
      "steps": [
        { "action": "navigate", "target": "homepage", "expected": "page loads" },
        { "action": "verifyTitle", "expected": "contains title" },
        { "action": "verifyUrl", "expected": "contains domain" }
      ],
      "assertions": {
        "titleContains": "Federal Reserve Bank of San Francisco",
        "urlContains": "frbsf.org",
        "maxLoadTime": 5000
      }
    },
    "searchTest": {
      "description": "Verify search functionality",
      "testData": {
        "searchTerms": ["monetary policy", "economic research"],
        "expectedBehavior": {
          "maxSearchTime": 3000,
          "resultsPageIndicator": "search"
        }
      },
      "steps": [...]
    }
  }
}
```

---

## 🚀 Usage Examples

### Basic Data Loading
```typescript
import { DataManager } from '../../../utils/test-data/data-manager';

const dataManager = new DataManager('frbsf');

// Load static test data
const testData = dataManager.loadTestData();
console.log(testData.homepage.url); // https://frbsf.org

// Load test scenarios
const scenarios = dataManager.loadTestScenarios();
console.log(scenarios.homepage.loadTest.description);
```

### Scenario-Based Testing
```typescript
test('should load homepage successfully', async () => {
  // Load complete scenario data
  const { scenario, testData, config } = dataManager.getScenarioTestData('homepage', 'loadTest');
  
  // Use scenario-specific assertions
  const title = await homePage.getTitle();
  expect(title).toContain(scenario.assertions?.titleContains || testData.homepage.title);
  
  // Use scenario-specific test data
  const loadTime = await homePage.getPageLoadTime();
  expect(loadTime).toBeLessThan(scenario.assertions?.maxLoadTime || testData.performance.maxLoadTime);
});
```

### Dynamic Test Data Access
```typescript
test('should have search capability', async () => {
  const { scenario, testData } = dataManager.getScenarioTestData('homepage', 'searchTest');
  
  // Use scenario-specific search terms or fallback to static data
  const searchTerms = scenario.testData?.searchTerms || testData.homepage.searchTerms;
  const searchTerm = searchTerms[0];
  
  await homePage.performSearch(searchTerm);
  
  // Use scenario-specific expectations
  const maxSearchTime = scenario.testData?.expectedBehavior?.maxSearchTime || testData.performance.maxSearchTime;
  expect(searchTime).toBeLessThan(maxSearchTime);
});
```

---

## 🎯 Benefits of This Approach

### ✅ Advantages

#### 1. **Separation of Concerns**
- Test logic separated from test data
- Easy to update data without changing code
- Clear distinction between static config and dynamic scenarios

#### 2. **Maintainability**
- Single source of truth for test data
- Easy to add new test scenarios
- Centralized data management

#### 3. **Reusability**
- Scenarios can be reused across different test suites
- Common test data shared between tests
- Environment-specific overrides

#### 4. **Flexibility**
- Easy to create data variations for different environments
- Support for fallback values
- Dynamic test data generation

#### 5. **Type Safety**
- TypeScript interfaces ensure data structure consistency
- Compile-time validation of data access
- IntelliSense support for data properties

---

## 📝 Adding New Test Scenarios

### Step 1: Define the Scenario
Add to `test-scenarios.json`:
```json
{
  "homepage": {
    "newFeatureTest": {
      "description": "Test new feature functionality",
      "testData": {
        "featureSettings": {
          "enabled": true,
          "timeout": 5000
        }
      },
      "steps": [
        { "action": "navigate", "target": "homepage" },
        { "action": "enableFeature", "expected": "feature is active" },
        { "action": "testFeature", "expected": "feature works correctly" }
      ],
      "assertions": {
        "featureVisible": true,
        "maxResponseTime": 2000
      }
    }
  }
}
```

### Step 2: Create the Test
```typescript
test('should test new feature', async () => {
  const { scenario, testData } = dataManager.getScenarioTestData('homepage', 'newFeatureTest');
  
  await homePage.navigateToHomePage();
  
  // Use scenario-specific test data
  const featureSettings = scenario.testData?.featureSettings;
  if (featureSettings?.enabled) {
    await homePage.enableFeature();
    
    const responseTime = await homePage.testFeature();
    expect(responseTime).toBeLessThan(scenario.assertions?.maxResponseTime || 3000);
  }
});
```

---

## 🔧 DataManager API

### Core Methods

#### Data Loading
```typescript
// Load static test data
loadTestData(): TestData

// Load all test scenarios
loadTestScenarios(): TestScenarios

// Load environment configuration
loadEnvironmentConfig(environment?: string): EnvironmentConfig
```

#### Scenario Management
```typescript
// Get specific test scenario
getTestScenario(page: string, scenarioName: string): TestScenario

// Get all scenarios for a page
getPageScenarios(page: string): Record<string, TestScenario>

// Get complete scenario data with environment config
getScenarioTestData(page: string, scenarioName: string): {
  scenario: TestScenario;
  testData: TestData;
  config: EnvironmentConfig;
}
```

#### Environment Integration
```typescript
// Get environment-specific test data
getEnvironmentTestData(environment?: string): {
  config: EnvironmentConfig;
  testData: TestData;
}
```

---

## 🎨 Test Scenario Patterns

### Pattern 1: Simple Validation
```json
{
  "basicTest": {
    "description": "Simple element validation",
    "steps": [
      { "action": "navigate", "target": "homepage" },
      { "action": "verifyElement", "expected": "element is visible" }
    ],
    "assertions": {
      "elementVisible": true
    }
  }
}
```

### Pattern 2: Data-Driven Testing
```json
{
  "multiDataTest": {
    "description": "Test with multiple data sets",
    "testData": {
      "inputValues": ["value1", "value2", "value3"],
      "expectedResults": ["result1", "result2", "result3"]
    },
    "steps": [
      { "action": "iterate", "input": "inputValues", "expected": "all values processed" }
    ]
  }
}
```

### Pattern 3: Performance Testing
```json
{
  "performanceTest": {
    "description": "Performance validation",
    "testData": {
      "performanceMetrics": {
        "maxLoadTime": 3000,
        "maxInteractionTime": 1000
      }
    },
    "steps": [
      { "action": "measurePerformance", "expected": "meets thresholds" }
    ]
  }
}
```

### Pattern 4: Responsive Testing
```json
{
  "responsiveTest": {
    "description": "Multi-device testing",
    "testData": {
      "deviceBreakpoints": [
        { "name": "mobile", "width": 375, "height": 667 },
        { "name": "desktop", "width": 1920, "height": 1080 }
      ]
    },
    "steps": [
      { "action": "testAllDevices", "expected": "responsive on all devices" }
    ]
  }
}
```

---

## 🔍 Best Practices

### 1. **Data Organization**
- Keep static data in `test-data.json`
- Keep dynamic scenarios in `test-scenarios.json`
- Use meaningful scenario names
- Group related scenarios together

### 2. **Scenario Design**
- Write clear, descriptive scenario descriptions
- Include all necessary test data in the scenario
- Provide fallback values for optional data
- Use consistent naming conventions

### 3. **Test Implementation**
- Always load scenario data at the beginning of tests
- Use scenario-specific assertions when available
- Provide fallbacks to static test data
- Handle missing data gracefully

### 4. **Maintenance**
- Regularly review and update test data
- Remove obsolete scenarios
- Keep data structure consistent
- Document data changes

---

## 🎉 Summary

The **data-driven testing approach** provides:

- ✅ **Clean separation** between test logic and test data
- ✅ **Flexible scenario management** with JSON-based configuration
- ✅ **Type-safe data access** through TypeScript interfaces
- ✅ **Environment integration** with centralized configuration
- ✅ **Maintainable test structure** with reusable components
- ✅ **Easy test data updates** without code changes
- ✅ **Comprehensive scenario support** for various testing patterns

This approach makes the test framework more maintainable, scalable, and easier to extend with new test scenarios and data variations.


