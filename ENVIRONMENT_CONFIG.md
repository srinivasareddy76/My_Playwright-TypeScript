
# 🌍 Environment Configuration Guide

## 📋 Overview

The framework uses a **single TypeScript-based environment configuration** approach located in `src/config/environment.ts`. This provides type safety, better IDE support, and eliminates the confusion of having multiple configuration files.

---

## 🏗️ Architecture

### Single Source of Truth
- **File**: `src/config/environment.ts`
- **Purpose**: Centralized environment configuration with TypeScript interfaces
- **Benefits**: Type safety, IntelliSense support, compile-time validation

### Key Components

#### 1. **EnvironmentConfig Interface**
```typescript
interface EnvironmentConfig {
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
```

#### 2. **BrowserConfig Interface**
```typescript
interface BrowserConfig {
  headless: boolean;
  viewport: { width: number; height: number };
  timeout: number;
  slowMo: number;
  video: boolean;
  screenshot: boolean;
  trace: boolean;
}
```

#### 3. **EnvironmentManager Class**
- Singleton pattern for global access
- Environment switching capabilities
- Type-safe configuration access

---

## 🎯 Available Environments

### 1. **Development** (Default)
- **URL**: https://frbsf.org
- **Headless**: false (visible browser)
- **SlowMo**: 100ms (for debugging)
- **Video/Screenshots**: enabled
- **Retries**: 3

### 2. **Staging**
- **URL**: https://frbsf.org
- **Headless**: true
- **SlowMo**: 0ms (faster execution)
- **Video/Screenshots**: enabled
- **Retries**: 2

### 3. **Production**
- **URL**: https://frbsf.org
- **Headless**: true
- **Video**: disabled (performance)
- **Screenshots**: enabled (for failures)
- **Retries**: 1

### 4. **CI** (Continuous Integration)
- **URL**: https://frbsf.org
- **Headless**: true
- **Extended timeouts**: 90s page load
- **Video/Trace**: disabled (CI performance)
- **Retries**: 2

---

## 🚀 Usage Examples

### Basic Usage
```typescript
import { EnvironmentManager } from '../src/config/environment';

// Get current environment configuration
const envManager = EnvironmentManager.getInstance();
const baseUrl = envManager.getBaseUrl();
const timeout = envManager.getPageLoadTimeout();
```

### Environment Switching
```typescript
// Switch to staging environment
envManager.setEnvironment('staging');

// Get staging-specific configuration
const stagingConfig = envManager.getConfig();
```

### In Test Files
```typescript
import { test, expect } from '@playwright/test';
import { EnvironmentManager } from '../../src/config/environment';

test('should load homepage', async ({ page }) => {
  const envManager = EnvironmentManager.getInstance();
  await page.goto(envManager.getBaseUrl());
  
  // Use environment-specific timeouts
  await page.waitForLoadState('domcontentloaded', {
    timeout: envManager.getPageLoadTimeout()
  });
});
```

### In DataManager
```typescript
// DataManager automatically uses EnvironmentManager
const dataManager = new DataManager('frbsf');
const envData = dataManager.getEnvironmentTestData('production');

console.log(envData.config.baseUrl); // https://frbsf.org
console.log(envData.config.retries);  // 1 (production setting)
```

---

## ⚙️ Environment Selection

### 1. **Environment Variable**
```bash
# Set environment via environment variable
export TEST_ENV=staging
npm run test:frbsf

# Or inline
TEST_ENV=production npm run test:frbsf
```

### 2. **Programmatic Selection**
```typescript
// In test setup or configuration
const envManager = EnvironmentManager.getInstance();
envManager.setEnvironment('ci');
```

### 3. **Default Behavior**
- If no `TEST_ENV` is set, defaults to `development`
- Framework automatically loads the appropriate configuration

---

## 🔧 Configuration Methods

### Environment Information
```typescript
envManager.getEnvironmentName()     // 'development'
envManager.getBaseUrl()            // 'https://frbsf.org'
envManager.getApiUrl()             // 'https://frbsf.org/api'
```

### Timeout Settings
```typescript
envManager.getPageLoadTimeout()    // 30000 (development)
envManager.getElementTimeout()     // 10000
envManager.getApiTimeout()         // 10000
```

### Browser Configuration
```typescript
envManager.isHeadless()           // false (development)
envManager.getViewport()          // { width: 1920, height: 1080 }
envManager.getSlowMo()            // 100 (development)
envManager.shouldRecordVideo()    // true
envManager.shouldTakeScreenshots() // true
envManager.shouldRecordTrace()    // true
```

### Test Configuration
```typescript
envManager.getRetries()           // 3 (development)
envManager.getCredentials()       // { username: null, password: null }
```

---

## 🎯 Benefits of This Approach

### ✅ Advantages
1. **Type Safety**: Compile-time validation of configuration
2. **IntelliSense**: Full IDE support with autocomplete
3. **Single Source**: No confusion between multiple config files
4. **Extensible**: Easy to add new environments or properties
5. **Testable**: Configuration logic can be unit tested
6. **Maintainable**: Changes in one place affect entire framework

### 🚫 Eliminated Issues
- ❌ No more JSON parsing errors
- ❌ No more missing property runtime errors
- ❌ No more confusion about which config file to use
- ❌ No more environment-specific JSON files to maintain

---

## 📝 Adding New Environments

### Step 1: Add to environments object
```typescript
export const environments: Record<string, EnvironmentConfig> = {
  // ... existing environments
  
  newEnvironment: {
    name: 'newEnvironment',
    baseUrl: 'https://new-env.frbsf.org',
    apiUrl: 'https://new-env.frbsf.org/api',
    // ... other properties
  }
};
```

### Step 2: Use the new environment
```bash
TEST_ENV=newEnvironment npm run test:frbsf
```

---

## 🔍 Troubleshooting

### Common Issues

#### Environment Not Found
```typescript
// Error: Environment 'invalid' not found
envManager.setEnvironment('invalid');

// Solution: Check available environments
console.log(Object.keys(environments)); // ['development', 'staging', 'production', 'ci']
```

#### Missing Configuration
```typescript
// All properties are required in EnvironmentConfig interface
// TypeScript will catch missing properties at compile time
```

#### Runtime Environment Issues
```bash
# Check current environment
echo $TEST_ENV

# Clear environment variable
unset TEST_ENV

# Verify default behavior
npm run test:frbsf -- --list
```

---

## 🎉 Summary

The **TypeScript-based environment configuration** provides:

- ✅ **Single source of truth** in `src/config/environment.ts`
- ✅ **Type-safe configuration** with compile-time validation
- ✅ **Four pre-configured environments** (development, staging, production, ci)
- ✅ **Easy environment switching** via `TEST_ENV` variable
- ✅ **Comprehensive configuration options** for all testing needs
- ✅ **Singleton pattern** for consistent access across the framework

This approach eliminates the confusion of multiple configuration files while providing a robust, maintainable, and type-safe environment management system.

