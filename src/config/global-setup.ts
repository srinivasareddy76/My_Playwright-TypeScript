

import { chromium, FullConfig } from '@playwright/test';
import { EnvironmentManager } from './environment';
import * as fs from 'fs';
import * as path from 'path';

async function globalSetup(_config: FullConfig) {
  console.log('🚀 Starting global setup...');
  
  // Initialize environment manager
  const environmentManager = EnvironmentManager.getInstance();
  console.log(`📋 Environment: ${environmentManager.getEnvironmentName()}`);
  console.log(`🌐 Base URL: ${environmentManager.getBaseUrl()}`);
  
  // Create necessary directories
  const directories = [
    'reports',
    'reports/html-report',
    'test-results',
    'screenshots',
    'videos'
  ];
  
  for (const dir of directories) {
    const dirPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  }
  
  // Verify base URL is accessible
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    console.log(`🔍 Verifying base URL accessibility: ${environmentManager.getBaseUrl()}`);
    await page.goto(environmentManager.getBaseUrl(), { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    const title = await page.title();
    console.log(`✅ Base URL accessible. Page title: ${title}`);
    
    await browser.close();
  } catch (error) {
    console.error(`❌ Failed to access base URL: ${error}`);
    // Don't fail setup, just warn
  }
  
  console.log('✅ Global setup completed successfully');
}

export default globalSetup;


