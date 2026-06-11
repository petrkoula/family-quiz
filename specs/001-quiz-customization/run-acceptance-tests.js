#!/usr/bin/env node
/**
 * Acceptance Test Runner for Quiz Customization Feature (Node.js)
 *
 * Cross-platform runner that:
 * 1. Parses spec.md into spec.json IR (using dae_gherkin.js)
 * 2. Generates Taiko tests from IR (using generator.js)
 * 3. Executes generated tests
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directories
const FEATURE_DIR = __dirname;
const PROJECT_ROOT = path.resolve(FEATURE_DIR, '../..');
const BUILD_DIR = path.join(FEATURE_DIR, '.build');
const GENERATED_DIR = path.join(BUILD_DIR, 'generated');
const SPEC_FILE = path.join(FEATURE_DIR, 'spec.md');
const IR_FILE = path.join(BUILD_DIR, 'spec.json');

// Configuration
const HEADLESS = process.argv.includes('--headed') || process.argv.includes('--interactive') ? 'false' : 'true';

console.log('========================================');
console.log('Quiz Customization Acceptance Pipeline');
console.log('========================================');
console.log();

/**
 * Execute a command and return a promise
 */
function exec(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options,
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Main pipeline
 */
async function main() {
  try {
    // Step 1: Parse spec.md to IR
    console.log('Step 1: Parsing spec.md to IR...');
    await exec('node', [
      path.join(PROJECT_ROOT, 'dae_gherkin.js'),
      SPEC_FILE,
      IR_FILE,
    ]);

    if (!fs.existsSync(IR_FILE)) {
      throw new Error(`Failed to generate IR at ${IR_FILE}`);
    }
    console.log();

    // Step 2: Generate tests from IR
    console.log('Step 2: Generating Taiko tests from IR...');
    await exec('node', [
      path.join(PROJECT_ROOT, 'acceptance/generator.js'),
      IR_FILE,
      GENERATED_DIR,
    ]);

    if (!fs.existsSync(GENERATED_DIR)) {
      throw new Error(`Failed to generate tests in ${GENERATED_DIR}`);
    }
    console.log();

    // Step 3: Run generated tests
    console.log('Step 3: Running generated acceptance tests...');
    console.log(`Mode: ${HEADLESS === 'true' ? 'HEADLESS' : 'HEADED (browser visible)'}`);

    // Find all test files
    const testFiles = fs
      .readdirSync(GENERATED_DIR)
      .filter((f) => f.endsWith('.test.js'))
      .map((f) => path.join(GENERATED_DIR, f));

    console.log(`Found ${testFiles.length} test files`);
    console.log();

    // Run each test
    let passed = 0;
    let failed = 0;

    for (const testFile of testFiles) {
      const testName = path.basename(testFile);
      console.log(`Running: ${testName}`);

      try {
        await exec('node', [testFile], {
          env: { ...process.env, HEADLESS },
        });
        passed++;
        console.log('✓ PASSED');
      } catch (error) {
        failed++;
        console.log('✗ FAILED');
      }
      console.log();
    }

    // Summary
    console.log();
    console.log('========================================');
    console.log('Test Summary');
    console.log('========================================');
    console.log(`Total:  ${testFiles.length} tests`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log();

    if (failed > 0) {
      console.log('Screenshots saved to: vue-app/tests/screenshots/');
      process.exit(1);
    } else {
      console.log('🎉 All acceptance tests passed!');
      process.exit(0);
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
