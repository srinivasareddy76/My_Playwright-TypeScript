


import { FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global teardown...');
  
  // Generate test summary
  const testResultsPath = path.join(process.cwd(), 'reports', 'test-results.json');
  
  if (fs.existsSync(testResultsPath)) {
    try {
      const testResults = JSON.parse(fs.readFileSync(testResultsPath, 'utf8'));
      
      const summary = {
        totalTests: testResults.suites?.reduce((acc: number, suite: any) => 
          acc + (suite.specs?.length || 0), 0) || 0,
        passed: 0,
        failed: 0,
        skipped: 0,
        duration: testResults.stats?.duration || 0,
        timestamp: new Date().toISOString()
      };
      
      // Count test results
      testResults.suites?.forEach((suite: any) => {
        suite.specs?.forEach((spec: any) => {
          spec.tests?.forEach((test: any) => {
            switch (test.status) {
              case 'passed':
                summary.passed++;
                break;
              case 'failed':
                summary.failed++;
                break;
              case 'skipped':
                summary.skipped++;
                break;
            }
          });
        });
      });
      
      // Write summary
      const summaryPath = path.join(process.cwd(), 'reports', 'test-summary.json');
      fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
      
      console.log('📊 Test Summary:');
      console.log(`   Total Tests: ${summary.totalTests}`);
      console.log(`   ✅ Passed: ${summary.passed}`);
      console.log(`   ❌ Failed: ${summary.failed}`);
      console.log(`   ⏭️  Skipped: ${summary.skipped}`);
      console.log(`   ⏱️  Duration: ${Math.round(summary.duration / 1000)}s`);
      console.log(`   📄 Summary saved to: ${summaryPath}`);
      
    } catch (error) {
      console.error('❌ Failed to generate test summary:', error);
    }
  }
  
  // Clean up temporary files if needed
  const tempDir = path.join(process.cwd(), 'temp');
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
    console.log('🗑️  Cleaned up temporary files');
  }
  
  console.log('✅ Global teardown completed successfully');
}

export default globalTeardown;



