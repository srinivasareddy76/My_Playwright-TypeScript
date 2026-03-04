








/**
 * Test Data Manager
 * 
 * Manages test data loading, generation, and manipulation
 */

import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '../../../src/utils/logger';
import { EnvironmentManager, EnvironmentConfig } from '../../../src/config/environment';

export interface TestData {
  homepage: {
    url: string;
    title: string;
    searchTerms: string[];
    navigationItems: string[];
    socialMediaLinks: Record<string, string>;
    contentSections: string[];
  };
  performance: {
    maxLoadTime: number;
    maxInteractionTime: number;
    maxSearchTime: number;
  };
  accessibility: {
    wcagLevel: string;
    colorContrastRatio: number;
    keyboardNavigationRequired: boolean;
  };
  contact: {
    headquarters: {
      address: string;
      phone: string;
      email: string;
    };
    branches: Array<{
      name: string;
      address: string;
      phone: string;
    }>;
  };
}

export interface TestScenario {
  description: string;
  steps: Array<{
    action: string;
    target?: string;
    input?: string;
    expected: string;
  }>;
  assertions?: Record<string, any>;
  testData?: Record<string, any>;
}

export interface TestScenarios {
  homepage: Record<string, TestScenario>;
}

export interface UserPersona {
  name: string;
  goals: string[];
  devices: string[];
  searchTerms: string[];
}

// Using EnvironmentConfig from src/config/environment.ts instead of local interface

export class DataManager {
  private logger: Logger;
  private dataPath: string;

  constructor(appName: string = 'frbsf') {
    this.logger = Logger.getInstance();
    this.dataPath = path.join(__dirname, `../../fixtures/${appName}/data`);
  }

  /**
   * Load test data from JSON file
   */
  loadTestData(): TestData {
    try {
      const filePath = path.join(this.dataPath, 'test-data.json');
      const rawData = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(rawData) as TestData;
      
      this.logger.info('Test data loaded successfully');
      return data;
    } catch (error) {
      this.logger.error('Failed to load test data', error);
      throw new Error('Could not load test data');
    }
  }

  /**
   * Load user personas from JSON file
   */
  loadUserPersonas(): Record<string, UserPersona> {
    try {
      const filePath = path.join(this.dataPath, 'user-personas.json');
      const rawData = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(rawData);
      
      this.logger.info('User personas loaded successfully');
      return data.personas;
    } catch (error) {
      this.logger.error('Failed to load user personas', error);
      throw new Error('Could not load user personas');
    }
  }

  /**
   * Load environment configuration
   */
  loadEnvironmentConfig(environment?: string): EnvironmentConfig {
    try {
      const environmentManager = EnvironmentManager.getInstance();
      
      if (environment && environment !== environmentManager.getEnvironmentName()) {
        environmentManager.setEnvironment(environment);
      }
      
      const config = environmentManager.getConfig();
      this.logger.info(`Environment config loaded for: ${environmentManager.getEnvironmentName()}`);
      return config;
    } catch (error) {
      this.logger.error(`Failed to load environment config for: ${environment}`, error);
      throw new Error(`Could not load environment config for: ${environment}`);
    }
  }

  /**
   * Generate random test data
   */
  generateRandomData(): {
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  } {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    
    return {
      email: `test.user.${timestamp}.${random}@example.com`,
      username: `testuser${timestamp}${random}`,
      password: `TestPass${timestamp}!`,
      firstName: `TestFirst${random}`,
      lastName: `TestLast${random}`,
      phoneNumber: `555-${String(random).padStart(3, '0')}-${String(timestamp).slice(-4)}`
    };
  }

  /**
   * Generate random search terms
   */
  generateRandomSearchTerms(count: number = 5): string[] {
    const baseTerms = [
      'monetary policy',
      'economic research',
      'banking supervision',
      'financial stability',
      'inflation data',
      'employment statistics',
      'interest rates',
      'federal reserve',
      'economic indicators',
      'market analysis'
    ];
    
    const shuffled = baseTerms.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  /**
   * Get test data for specific persona
   */
  getPersonaTestData(personaName: string): {
    persona: UserPersona;
    testData: TestData;
    searchTerms: string[];
  } {
    const personas = this.loadUserPersonas();
    const testData = this.loadTestData();
    
    if (!personas[personaName]) {
      throw new Error(`Persona '${personaName}' not found`);
    }
    
    const persona = personas[personaName];
    
    return {
      persona,
      testData,
      searchTerms: persona.searchTerms
    };
  }

  /**
   * Save test results data
   */
  saveTestResults(results: any, filename: string): void {
    try {
      const resultsPath = path.join(__dirname, '../../../reports');
      
      // Ensure directory exists
      if (!fs.existsSync(resultsPath)) {
        fs.mkdirSync(resultsPath, { recursive: true });
      }
      
      const filePath = path.join(resultsPath, filename);
      fs.writeFileSync(filePath, JSON.stringify(results, null, 2));
      
      this.logger.info(`Test results saved to: ${filePath}`);
    } catch (error) {
      this.logger.error('Failed to save test results', error);
    }
  }

  /**
   * Load mock data for API responses
   */
  loadMockData(mockName: string): any {
    try {
      const filePath = path.join(this.dataPath, '../mocks', `${mockName}.json`);
      const rawData = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(rawData);
      
      this.logger.info(`Mock data loaded: ${mockName}`);
      return data;
    } catch (error) {
      this.logger.error(`Failed to load mock data: ${mockName}`, error);
      throw new Error(`Could not load mock data: ${mockName}`);
    }
  }

  /**
   * Validate test data structure
   */
  validateTestData(data: any): boolean {
    try {
      // Basic validation - check required properties
      const required = ['homepage', 'performance', 'accessibility'];
      
      for (const prop of required) {
        if (!data[prop]) {
          this.logger.error(`Missing required property: ${prop}`);
          return false;
        }
      }
      
      // Validate homepage data
      if (!data.homepage.url || !data.homepage.title) {
        this.logger.error('Invalid homepage data structure');
        return false;
      }
      
      this.logger.info('Test data validation passed');
      return true;
    } catch (error) {
      this.logger.error('Test data validation failed', error);
      return false;
    }
  }

  /**
   * Load test scenarios from JSON file
   */
  loadTestScenarios(): TestScenarios {
    try {
      const filePath = path.join(this.dataPath, 'test-scenarios.json');
      const rawData = fs.readFileSync(filePath, 'utf8');
      const scenarios = JSON.parse(rawData);
      
      this.logger.info('Test scenarios loaded successfully');
      return scenarios;
    } catch (error) {
      this.logger.error('Failed to load test scenarios', error);
      throw new Error('Could not load test scenarios');
    }
  }

  /**
   * Get specific test scenario
   */
  getTestScenario(page: string, scenarioName: string): TestScenario {
    try {
      const scenarios = this.loadTestScenarios();
      
      if (!scenarios[page as keyof TestScenarios]) {
        throw new Error(`Page '${page}' not found in test scenarios`);
      }
      
      const pageScenarios = scenarios[page as keyof TestScenarios];
      if (!pageScenarios[scenarioName]) {
        throw new Error(`Scenario '${scenarioName}' not found for page '${page}'`);
      }
      
      this.logger.info(`Test scenario loaded: ${page}.${scenarioName}`);
      return pageScenarios[scenarioName];
    } catch (error) {
      this.logger.error(`Failed to get test scenario: ${page}.${scenarioName}`, error);
      throw error;
    }
  }

  /**
   * Get all scenarios for a specific page
   */
  getPageScenarios(page: string): Record<string, TestScenario> {
    try {
      const scenarios = this.loadTestScenarios();
      
      if (!scenarios[page as keyof TestScenarios]) {
        throw new Error(`Page '${page}' not found in test scenarios`);
      }
      
      this.logger.info(`Page scenarios loaded for: ${page}`);
      return scenarios[page as keyof TestScenarios];
    } catch (error) {
      this.logger.error(`Failed to get page scenarios for: ${page}`, error);
      throw error;
    }
  }

  /**
   * Get test data for a specific scenario
   */
  getScenarioTestData(page: string, scenarioName: string): {
    scenario: TestScenario;
    testData: TestData;
    config: EnvironmentConfig;
  } {
    const scenario = this.getTestScenario(page, scenarioName);
    const testData = this.loadTestData();
    const config = this.loadEnvironmentConfig();
    
    // Override base URL with environment-specific URL
    testData.homepage.url = config.baseUrl;
    
    // Resolve static data references in scenario
    const resolvedScenario = this.resolveStaticDataReferences(scenario, testData);
    
    return {
      scenario: resolvedScenario,
      testData,
      config
    };
  }

  /**
   * Resolve static data references in scenario data
   */
  private resolveStaticDataReferences(scenario: TestScenario, testData: TestData): TestScenario {
    const resolvedScenario = JSON.parse(JSON.stringify(scenario)); // Deep clone

    // Recursively resolve references
    this.resolveReferences(resolvedScenario, testData);

    return resolvedScenario;
  }

  /**
   * Recursively resolve useStaticData references
   */
  private resolveReferences(obj: any, testData: TestData): void {
    if (typeof obj !== 'object' || obj === null) {
      return;
    }

    if (Array.isArray(obj)) {
      obj.forEach(item => this.resolveReferences(item, testData));
      return;
    }

    // Handle useStaticData object
    if (obj.useStaticData && typeof obj.useStaticData === 'object') {
      for (const [key, path] of Object.entries(obj.useStaticData)) {
        if (typeof path === 'string') {
          const resolvedValue = this.getNestedValue(testData, path);
          if (resolvedValue !== undefined) {
            obj[key] = resolvedValue;
          }
        }
      }
      // Remove the useStaticData object after resolving
      delete obj.useStaticData;
    }

    // Recursively process nested objects
    for (const value of Object.values(obj)) {
      this.resolveReferences(value, testData);
    }
  }

  /**
   * Get nested value from object using dot notation path
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  /**
   * Get environment-specific test data
   */
  getEnvironmentTestData(environment?: string): {
    config: EnvironmentConfig;
    testData: TestData;
  } {
    const config = this.loadEnvironmentConfig(environment);
    const testData = this.loadTestData();
    
    // Override base URL with environment-specific URL
    testData.homepage.url = config.baseUrl;
    
    return {
      config,
      testData
    };
  }
}








