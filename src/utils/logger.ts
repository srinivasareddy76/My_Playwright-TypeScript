

/**
 * 📝 Logger - Centralized Logging System
 * 
 * PURPOSE:
 * The Logger provides a centralized, configurable logging system for the entire
 * test framework. It supports multiple log levels, file output, console output,
 * and structured logging for better debugging and monitoring.
 * 
 * FEATURES FOR TEST ENGINEERS:
 * ✅ Multiple Log Levels - ERROR, WARN, INFO, DEBUG
 * ✅ File & Console Output - Logs to both file and console simultaneously
 * ✅ Timestamp Support - All logs include precise timestamps
 * ✅ Singleton Pattern - Single instance across the entire framework
 * ✅ Environment Configuration - Log level configurable via environment variables
 * ✅ Structured Logging - Consistent format for easy parsing
 * ✅ Performance Tracking - Built-in performance logging capabilities
 * 
 * USAGE EXAMPLES:
 * 
 * 1. BASIC LOGGING:
 * ```typescript
 * const logger = Logger.getInstance();
 * 
 * logger.info('Test started successfully');
 * logger.warn('Element not found, retrying...');
 * logger.error('Test failed with validation error');
 * logger.debug('Detailed debugging information');
 * ```
 * 
 * 2. IN PAGE OBJECTS:
 * ```typescript
 * export class HomePage extends BasePage {
 *   async clickLoginButton(): Promise<void> {
 *     this.logger.info('PAGE ACTION: HomePage - clickLoginButton');
 *     await this.clickElement(this.selectors.loginButton);
 *     this.logger.info('Login button clicked successfully');
 *   }
 * }
 * ```
 * 
 * 3. IN TEST SPECIFICATIONS:
 * ```typescript
 * test('user login flow', async ({ page }) => {
 *   const logger = Logger.getInstance();
 *   logger.info('Starting user login test');
 *   
 *   // Test implementation
 *   
 *   logger.info('User login test completed successfully');
 * });
 * ```
 * 
 * 4. PERFORMANCE LOGGING:
 * ```typescript
 * const startTime = Date.now();
 * // ... perform action
 * const duration = Date.now() - startTime;
 * logger.info(`Action completed in ${duration}ms`);
 * ```
 * 
 * LOG LEVELS EXPLAINED:
 * - ERROR (0): Critical failures, test failures, system errors
 * - WARN (1): Warnings, retries, fallback actions
 * - INFO (2): General information, test progress, major actions
 * - DEBUG (3): Detailed debugging, element interactions, data dumps
 * 
 * CONFIGURATION:
 * Set log level via environment variable:
 * - LOG_LEVEL=ERROR (only errors)
 * - LOG_LEVEL=WARN (warnings and errors)
 * - LOG_LEVEL=INFO (info, warnings, errors) - DEFAULT
 * - LOG_LEVEL=DEBUG (all logs)
 * 
 * OUTPUT LOCATIONS:
 * - Console: Real-time logging during test execution
 * - File: reports/test.log (persistent logging for analysis)
 * 
 * LOG FORMAT:
 * [TIMESTAMP] [LEVEL] MESSAGE
 * Example: 2024-03-04T10:30:45.123Z [INFO] Test started successfully
 * 
 * BENEFITS:
 * 🔍 Easy Debugging - Detailed logs help identify issues quickly
 * 📊 Test Monitoring - Track test execution progress and performance
 * 🛡️ Error Tracking - Comprehensive error logging with context
 * 📈 Performance Analysis - Built-in timing and performance metrics
 * 🔧 Maintenance - Easier troubleshooting and framework maintenance
 */

import * as fs from 'fs';
import * as path from 'path';

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

export class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;
  private logFile: string;

  private constructor() {
    this.logLevel = this.getLogLevelFromEnv();
    this.logFile = path.join(process.cwd(), 'reports', 'test.log');
    this.ensureLogDirectory();
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private getLogLevelFromEnv(): LogLevel {
    const level = process.env.LOG_LEVEL?.toUpperCase();
    switch (level) {
      case 'ERROR': return LogLevel.ERROR;
      case 'WARN': return LogLevel.WARN;
      case 'INFO': return LogLevel.INFO;
      case 'DEBUG': return LogLevel.DEBUG;
      default: return LogLevel.INFO;
    }
  }

  private ensureLogDirectory(): void {
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  private formatMessage(level: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const dataStr = data ? ` ${JSON.stringify(data)}` : '';
    return `${timestamp} [${level}] ${message}${dataStr}`;
  }

  private writeLog(level: string, message: string, data?: any): void {
    const formattedMessage = this.formatMessage(level, message, data);
    
    // Write to console
    console.log(formattedMessage);
    
    // Write to file
    try {
      fs.appendFileSync(this.logFile, formattedMessage + '\n');
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  public error(message: string, data?: any): void {
    if (this.logLevel >= LogLevel.ERROR) {
      this.writeLog('ERROR', message, data);
    }
  }

  public warn(message: string, data?: any): void {
    if (this.logLevel >= LogLevel.WARN) {
      this.writeLog('WARN', message, data);
    }
  }

  public info(message: string, data?: any): void {
    if (this.logLevel >= LogLevel.INFO) {
      this.writeLog('INFO', message, data);
    }
  }

  public debug(message: string, data?: any): void {
    if (this.logLevel >= LogLevel.DEBUG) {
      this.writeLog('DEBUG', message, data);
    }
  }

  public pageAction(pageName: string, action: string, data?: any): void {
    this.info(`PAGE ACTION: ${pageName} - ${action}`, data);
  }

  public testStart(testName: string): void {
    this.info(`TEST START: ${testName}`);
  }

  public testEnd(testName: string, status: 'PASSED' | 'FAILED' | 'SKIPPED'): void {
    this.info(`TEST END: ${testName} - ${status}`);
  }

  public performance(action: string, duration: number): void {
    this.info(`PERFORMANCE: ${action} took ${duration}ms`);
  }

  public setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  public clearLog(): void {
    try {
      if (fs.existsSync(this.logFile)) {
        fs.unlinkSync(this.logFile);
      }
    } catch (error) {
      console.error('Failed to clear log file:', error);
    }
  }
}



