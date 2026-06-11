#!/usr/bin/env node
/**
 * Acceptance Test Runner for Quick Start Quiz Feature (Node.js)
 *
 * Cross-platform runner that executes the acceptance pipeline:
 * 1. Parse spec.md to IR
 * 2. Generate tests
 * 3. Run tests
 */

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const FEATURE_DIR = __dirname;
const PROJECT_ROOT = join(FEATURE_DIR, '..', '..');
const BUILD_DIR = join(FEATURE_DIR, '.build');
const GENERATED_DIR = join(BUILD_DIR, 'generated');
const SPEC_FILE = join(FEATURE_DIR, 'spec.md');
const IR_FILE = join(BUILD_DIR, 'spec.json');

const colors = {
  blue: '\x1b[34m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function exec(command, description) {
  try {
    log(`\n${description}...`, 'green');
    execSync(command, { stdio: 'inherit', cwd: PROJECT_ROOT });
    return true;
  } catch (error) {
    log(`Error: ${description} failed`, 'red');
    return false;
  }
}

async function main() {
  log('🎯 Quick Start Quiz Acceptance Test Pipeline', 'blue');
  log(`Feature: ${FEATURE_DIR}\n`);

  // Step 1: Parse spec.md to IR
  if (!exec(
    `node "${join(PROJECT_ROOT, 'dae_gherkin.js')}" "${SPEC_FILE}" "${IR_FILE}"`,
    'Step 1: Parsing spec.md to IR'
  )) {
    process.exit(1);
  }

  if (!fs.existsSync(IR_FILE)) {
    log(`Error: Failed to generate IR at ${IR_FILE}`, 'red');
    process.exit(1);
  }

  // Step 2: Generate tests from IR
  if (!exec(
    `node "${join(PROJECT_ROOT, 'acceptance', 'generator.js')}" "${IR_FILE}" "${GENERATED_DIR}"`,
    'Step 2: Generating Taiko tests from IR'
  )) {
    process.exit(1);
  }

  if (!fs.existsSync(GENERATED_DIR)) {
    log(`Error: Failed to generate tests in ${GENERATED_DIR}`, 'red');
    process.exit(1);
  }

  // Step 3: Run generated tests
  log('\nStep 3: Running generated acceptance tests...', 'green');

  const headless = process.argv.includes('--headed') || process.argv.includes('--interactive')
    ? 'false'
    : 'true';

  log(`Running in ${headless === 'true' ? 'HEADLESS' : 'HEADED'} mode`);

  const testFiles = fs
    .readdirSync(GENERATED_DIR)
    .filter((file) => file.endsWith('.test.js'))
    .map((file) => join(GENERATED_DIR, file));

  log(`Found ${testFiles.length} test files\n`);

  let passed = 0;
  let failed = 0;

  for (const testFile of testFiles) {
    const testName = testFile.split(/[\\/]/).pop();
    log(`Running: ${testName}`, 'blue');

    try {
      execSync(`node "${testFile}"`, {
        stdio: 'inherit',
        env: { ...process.env, HEADLESS: headless },
      });
      passed++;
      log('✓ PASSED', 'green');
    } catch (error) {
      failed++;
      log('✗ FAILED', 'red');
    }
    console.log('');
  }

  // Summary
  console.log('========================================');
  log('Test Summary', 'blue');
  console.log('========================================');
  console.log(`Total:  ${testFiles.length} tests`);
  log(`Passed: ${passed}`, 'green');

  if (failed > 0) {
    log(`Failed: ${failed}`, 'red');
    console.log('\nScreenshots saved to: vue-app/tests/screenshots/');
    process.exit(1);
  } else {
    log(`Failed: ${failed}`, 'red');
    log('\n🎉 All acceptance tests passed!', 'green');
    process.exit(0);
  }
}

main();
