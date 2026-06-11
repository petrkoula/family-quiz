#!/usr/bin/env node
/**
 * Acceptance Test Generator for Quiz Customization Feature
 *
 * Reads the fixed spec.json IR and generates executable Taiko tests.
 * Generated tests have deep knowledge of the system through stepHandlers.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate a Taiko test file from a scenario
 */
function generateScenarioTest(scenario, featureName, scenarioIndex) {
  const testName = sanitizeTestName(scenario.name);
  const steps = scenario.steps || [];

  // Generate step execution code
  const stepExecutions = steps
    .map((step, idx) => {
      return `
    // Step ${idx + 1}: ${step.keyword} ${step.text}
    console.log('  ${step.keyword} ${step.text}');
    await executeStep(${JSON.stringify(step)});`;
    })
    .join('\n');

  // Generate test file content
  return `/**
 * Generated Acceptance Test - Scenario ${scenarioIndex + 1}
 * Feature: ${featureName}
 * Scenario: ${scenario.name}
 *
 * DO NOT EDIT - Generated from spec.json IR
 */

import { openBrowser, closeBrowser, screenshot, waitFor } from 'taiko';
import { executeStep, testState } from '../../../../acceptance/stepHandlers.js';

const ENABLE_SCREENSHOTS = process.env.SCREENSHOTS === 'true' || process.env.CI === 'true';
const TEST_NAME = '${testName}';

(async () => {
  try {
    console.log('🚀 Starting test: ${scenario.name}');

    // Open browser
    await openBrowser({
      headless: process.env.HEADLESS !== 'false',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-extensions',
      ],
    });

    // Execute scenario steps
    console.log('\\n📋 Executing scenario: ${scenario.name}');
    ${stepExecutions}

    console.log('\\n✅ Test passed: ${scenario.name}');

    // Take success screenshot
    if (ENABLE_SCREENSHOTS) {
      await screenshot({
        path: 'vue-app/tests/screenshots/acceptance-${testName}-success.png'
      });
    }

  } catch (error) {
    console.error('\\n❌ Test failed: ${scenario.name}');
    console.error('Error:', error.message);

    // Take failure screenshot
    await screenshot({
      path: 'vue-app/tests/screenshots/acceptance-${testName}-failure.png'
    });

    process.exit(1);
  } finally {
    await closeBrowser();
    console.log('👋 Browser closed\\n');
  }
})();
`;
}

/**
 * Sanitize scenario name for use as filename
 */
function sanitizeTestName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Generate all test files from IR
 */
function generateTests(irPath, outputDir) {
  // Read IR
  const irContent = fs.readFileSync(irPath, 'utf-8');
  const ir = JSON.parse(irContent);

  const featureName = ir.feature.name;
  const scenarios = ir.scenarios || [];

  console.log(`📖 Generating tests for feature: ${featureName}`);
  console.log(`📊 Found ${scenarios.length} scenarios`);

  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate test file for each scenario
  const generatedFiles = [];
  scenarios.forEach((scenario, index) => {
    const testName = sanitizeTestName(scenario.name);
    const testFileName = `${String(index + 1).padStart(2, '0')}-${testName}.test.js`;
    const testFilePath = path.join(outputDir, testFileName);

    const testContent = generateScenarioTest(scenario, featureName, index);
    fs.writeFileSync(testFilePath, testContent, 'utf-8');

    generatedFiles.push(testFileName);
    console.log(`  ✓ Generated: ${testFileName}`);
  });

  // Generate test suite runner
  generateTestSuiteRunner(outputDir, generatedFiles, featureName);

  console.log(`\n✅ Generated ${generatedFiles.length} test files in ${outputDir}`);
}

/**
 * Generate a test suite runner that executes all tests
 */
function generateTestSuiteRunner(outputDir, testFiles, featureName) {
  const testImports = testFiles
    .map((file, idx) => `import test${idx + 1} from './${file}';`)
    .join('\n');

  const runnerContent = `/**
 * Generated Test Suite Runner
 * Feature: ${featureName}
 *
 * Executes all generated acceptance tests in sequence.
 * DO NOT EDIT - Generated from spec.json IR
 */

// This file is a placeholder for suite orchestration
// Individual tests are run separately via the test runner script

console.log('🎯 Acceptance Test Suite: ${featureName}');
console.log('📋 Run tests individually using the generated test files:');

const tests = ${JSON.stringify(testFiles, null, 2)};

tests.forEach((test, idx) => {
  console.log(\`  \${idx + 1}. node specs/001-quiz-customization/.build/generated/\${test}\`);
});

console.log('\\nOr use: npm run test:acceptance\\n');
`;

  const runnerPath = path.join(outputDir, '_suite.js');
  fs.writeFileSync(runnerPath, runnerContent, 'utf-8');
  console.log(`  ✓ Generated suite runner: _suite.js`);
}

/**
 * Main entry point
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error('Usage: node generator.js <spec.json> [output-dir]');
    process.exit(1);
  }

  const irPath = args[0];
  const outputDir = args[1] || path.join(path.dirname(irPath), 'generated');

  if (!fs.existsSync(irPath)) {
    console.error(`Error: IR file not found: ${irPath}`);
    process.exit(1);
  }

  generateTests(irPath, outputDir);
}

main();
