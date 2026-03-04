








/**
 * Test Data Manager
 * 
 * Manages test data loading, generation, and manipulation
 */

import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '../../../src/utils/logger';

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
}

export interface UserPersona {
  name: string;
  goals: string[];
  devices: string[];
  searchTerms: string[];
}

export interface Environment {
  baseUrl: string;
  timeout: number;
  retries: number;
  headless: boolean;
}

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
  loadEnvironmentConfig(environment: string): Environment {
    try {
      const filePath = path.join(this.dataPath, 'environments.json');
      const rawData = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(rawData);
      
      if (!data[environment]) {
        throw new Error(`Environment '${environment}' not found`);
      }
      
      this.logger.info(`Environment config loaded for: ${environment}`);
      return data[environment];
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
   * Get environment-specific test data
   */
  getEnvironmentTestData(environment: string): {
    config: Environment;
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








